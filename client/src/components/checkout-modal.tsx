import { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

interface CheckoutFormProps {
  amount: number;
  service: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const CheckoutForm = ({ amount, service, onSuccess, onCancel }: CheckoutFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}?payment_success=true`,
        },
      });

      if (error) {
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Payment Successful",
          description: `Thank you for purchasing ${service}!`,
        });
        onSuccess();
      }
    } catch (err) {
      toast({
        title: "Payment Error", 
        description: "An unexpected error occurred during payment processing.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h3 className="font-semibold text-lg">{service}</h3>
        <p className="text-2xl font-bold text-blue-600">${amount}</p>
      </div>
      
      <PaymentElement />
      
      <div className="flex gap-3 justify-end">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isProcessing}
          data-testid="button-cancel-payment"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={!stripe || isProcessing}
          data-testid="button-confirm-payment"
        >
          {isProcessing ? 'Processing...' : `Pay $${amount}`}
        </Button>
      </div>
    </form>
  );
};

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  service: string;
  onSuccess?: () => void;
}

export default function CheckoutModal({ 
  isOpen, 
  onClose, 
  amount, 
  service, 
  onSuccess 
}: CheckoutModalProps) {
  const [clientSecret, setClientSecret] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && amount > 0) {
      // Create PaymentIntent when modal opens
      apiRequest("POST", "/api/create-payment-intent", { 
        amount: amount,
        service: service 
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          } else {
            throw new Error('No client secret received');
          }
        })
        .catch((error) => {
          console.error('Payment setup error:', error);
          toast({
            title: "Payment Setup Error",
            description: "Failed to initialize payment. Please try again.",
            variant: "destructive",
          });
        });
    }
  }, [isOpen, amount, service, toast]);

  const handleSuccess = () => {
    setClientSecret("");
    onSuccess?.();
    onClose();
  };

  const handleCancel = () => {
    setClientSecret("");
    onClose();
  };

  if (!clientSecret) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Setting up payment...</DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" aria-label="Loading"/>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // Make SURE to wrap the form in <Elements> which provides the stripe context.
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Complete Payment</DialogTitle>
        </DialogHeader>
        <Elements 
          stripe={stripePromise} 
          options={{ 
            clientSecret,
            appearance: {
              theme: 'stripe'
            }
          }}
        >
          <CheckoutForm 
            amount={amount}
            service={service}
            onSuccess={handleSuccess}
            onCancel={handleCancel}
          />
        </Elements>
      </DialogContent>
    </Dialog>
  );
}