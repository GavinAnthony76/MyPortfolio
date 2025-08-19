import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Smartphone, MessageSquare, TrendingUp, Settings, Rocket, Check } from "lucide-react";
import CheckoutModal from "./checkout-modal";

const services = [
  {
    id: 'consulting',
    icon: MessageSquare,
    title: 'Technical Consulting',
    description: 'Expert technical guidance, code reviews, architecture planning, and project consultation on an hourly basis.',
    price: '$125/hour',
    baseAmount: 125, // Hourly rate for quick payment
    color: 'from-teal-50 to-cyan-50',
    iconBg: 'bg-teal-600',
    priceColor: 'text-teal-600',
    features: [
      'Architecture planning',
      'Code reviews & optimization',
      'Technical strategy',
      'Problem solving sessions'
    ]
  },
  {
    id: 'starter',
    icon: Smartphone,
    title: 'Starter Package',
    description: 'Perfect for small local businesses like hair salons, pet stores, and lawn care companies. Professional 3-5 page website with mobile design.',
    price: '$897',
    baseAmount: 897,
    color: 'from-emerald-50 to-green-50',
    iconBg: 'bg-emerald-600',
    priceColor: 'text-emerald-600',
    features: [
      'Professional 3-5 page website',
      'Mobile-friendly design',
      'Contact forms & business info',
      'Google My Business integration',
      '12 months hosting included'
    ]
  },
  {
    id: 'professional',
    icon: Settings,
    title: 'Professional Package',
    description: 'Ideal for established local businesses like restaurants and service companies. Custom website with booking/ordering systems.',
    price: '$1,797',
    baseAmount: 1797,
    color: 'from-blue-50 to-indigo-50',
    iconBg: 'bg-blue-600',
    priceColor: 'text-blue-600',
    features: [
      'Custom 5-8 page website',
      'Online ordering/booking system',
      'Photo galleries',
      'Advanced local SEO',
      '12 months hosting & updates'
    ]
  },
  {
    id: 'premium',
    icon: TrendingUp,
    title: 'Premium Package',
    description: 'Complete solution for growing local businesses. Full custom website with e-commerce, customer portals, and advanced integrations.',
    price: '$2,997',
    baseAmount: 2997,
    color: 'from-purple-50 to-pink-50',
    iconBg: 'bg-purple-600',
    priceColor: 'text-purple-600',
    features: [
      'Full custom website (10+ pages)',
      'E-commerce or advanced booking',
      'Customer portal/login areas',
      'Advanced integrations',
      '24 months hosting & support'
    ]
  },
  {
    id: 'prototyping',
    icon: Rocket,
    title: 'Rapid Prototyping',
    description: 'Rapid development of functional prototypes and proof-of-concepts to validate your ideas quickly using modern frameworks.',
    price: '$125/hour',
    baseAmount: 125, // Hourly rate for quick payment
    color: 'from-orange-50 to-red-50',
    iconBg: 'bg-orange-600',
    priceColor: 'text-orange-600',
    features: [
      'Full-stack prototypes',
      'Modern tech stacks',
      'Database integration',
      'Real-time development'
    ]
  }
];

export default function ServicesSection() {
  const [checkoutService, setCheckoutService] = useState<{
    id: string;
    title: string;
    baseAmount: number;
  } | null>(null);

  const handlePaymentSuccess = () => {
    // Could add analytics tracking here

  };

  return (
    <section id="services" className="py-12 sm:py-16 md:py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="tech-title">Professional</span> Development Services
          </h2>
          <p className="text-base sm:text-lg text-slate-700 max-w-2xl mx-auto px-2">
            Expert code development, rapid prototyping, and comprehensive development services using modern technologies
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <div 
                key={service.id} 
                className="glass-card p-6 sm:p-8"
                data-testid={`card-service-${service.id}`}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${service.iconBg} rounded-lg flex items-center justify-center mb-4 sm:mb-6 glass`}>
                  <IconComponent className="text-white text-lg sm:text-xl" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-slate-800 mb-3 sm:mb-4" data-testid={`text-title-${service.id}`}>
                  {service.title}
                </h3>
                <p className="text-sm sm:text-base text-slate-700 mb-4 sm:mb-6 leading-relaxed" data-testid={`text-description-${service.id}`}>
                  {service.description}
                </p>
                <div className={`text-xl sm:text-2xl font-bold ${service.priceColor} mb-4 gradient-text`} data-testid={`text-price-${service.id}`}>
                  {service.price}
                </div>
                <ul className="space-y-2 text-slate-700 mb-6">
                  {service.features.map((feature, index) => (
                    <li 
                      key={index} 
                      className="flex items-center text-xs sm:text-sm"
                      data-testid={`feature-${service.id}-${index}`}
                    >
                      <Check className="text-emerald-500 mr-2 h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button 
                  onClick={() => setCheckoutService({
                    id: service.id,
                    title: service.title,
                    baseAmount: service.baseAmount
                  })}
                  className={`w-full ${service.iconBg} hover:opacity-90 transition-opacity text-sm sm:text-base py-2 sm:py-3`}
                  data-testid={`button-pay-${service.id}`}
                >
                  <span className="hidden sm:inline">Get Started - </span>${service.baseAmount}
                </Button>
              </div>
            );
          })}
        </div>
      </div>

      <CheckoutModal
        isOpen={checkoutService !== null}
        onClose={() => setCheckoutService(null)}
        amount={checkoutService?.baseAmount || 0}
        service={checkoutService?.title || ''}
        onSuccess={handlePaymentSuccess}
      />
    </section>
  );
}
