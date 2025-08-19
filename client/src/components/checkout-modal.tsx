import { useState, useEffect } from 'react';
import { useStripe, useElements, PaymentElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
const getStripePromise = () => {
  if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
    console.error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
    return null;
  }
  
  try {

    const promise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);
    
    // Add error handling for promise resolution
    promise?.catch((error) => {
      console.error('Stripe loading promise rejected:', error);
    });
    
    return promise;
  } catch (error) {
    console.error('Failed to load Stripe:', error);
    return null;
  }
};

const stripePromise = getStripePromise();

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
    <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
      <div className="text-center">
        <h3 className="font-semibold text-base sm:text-lg">{service}</h3>
        <p className="text-xl sm:text-2xl font-bold text-blue-600">${amount}</p>
      </div>
      
      <div className="min-h-[200px]">
        <PaymentElement 
          options={{
            layout: 'tabs'
          }}
        />
      </div>
      
      <div className="flex flex-col sm:flex-row gap-3 justify-end">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          disabled={isProcessing}
          className="w-full sm:w-auto"
          data-testid="button-cancel-payment"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={!stripe || isProcessing}
          className="w-full sm:w-auto"
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
  const [stripeError, setStripeError] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && amount > 0) {
      setStripeError("");
      setClientSecret("");
      
      // Check if Stripe can load
      if (!stripePromise) {
        setStripeError("Payment system unavailable. This may be due to browser security settings or ad blockers. Please try disabling browser extensions or using a different browser.");
        return;
      }
      
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
          setStripeError("Failed to initialize payment. Please contact support at support@gavineanthony.com");
          toast({
            title: "Payment Setup Error",
            description: "Failed to initialize payment. Please try again or contact support.",
            variant: "destructive",
          });
        });
    }
  }, [isOpen, amount, service, toast]);

  const handleSuccess = () => {
    setClientSecret("");
    setStripeError("");
    onSuccess?.();
    onClose();
  };

  const handleCancel = () => {
    setClientSecret("");
    setStripeError("");
    onClose();
  };

  // Show error state if Stripe failed to load
  if (stripeError) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[95vw] max-w-lg mx-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-center text-red-600">Payment Unavailable</DialogTitle>
          </DialogHeader>
          <div className="py-4 text-center">
            <p className="text-sm text-gray-600 mb-4">{stripeError}</p>
            <div className="space-y-2">
              <p className="text-xs text-gray-500">Alternative payment options:</p>
              <Button 
                onClick={() => window.location.href = 'mailto:projects@gavineanthony.com?subject=Payment for ' + service + '&body=I would like to purchase ' + service + ' for $' + amount + '. Please send me payment instructions.'}
                className="w-full"
                variant="outline"
              >
                Contact for Alternative Payment
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (!clientSecret) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="w-[95vw] max-w-lg mx-auto p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-center">Setting up payment...</DialogTitle>
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
      <DialogContent className="w-[95vw] max-w-lg mx-auto p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-center">Complete Payment</DialogTitle>
        </DialogHeader>
        <Elements 
          stripe={stripePromise} 
          options={{ 
            clientSecret,
            appearance: {
              theme: 'stripe',
              variables: {
                fontFamily: 'system-ui, sans-serif',
                fontSizeBase: '16px'
              }
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