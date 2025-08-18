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
    id: 'redesign',
    icon: Settings,
    title: 'Website Redesign',
    description: 'Transform your existing website with modern design, improved user experience, and enhanced functionality while maintaining your content and SEO.',
    price: '$850 - $1,200',
    baseAmount: 1025, // Mid-range for quick payment
    color: 'from-purple-50 to-pink-50',
    iconBg: 'bg-purple-600',
    priceColor: 'text-purple-600',
    features: [
      'Modern design refresh',
      'Mobile responsiveness',
      'Performance optimization',
      'SEO preservation'
    ]
  },
  {
    id: 'landing',
    icon: TrendingUp,
    title: 'Landing Pages',
    description: 'High-converting landing pages designed to showcase your product, capture leads, and drive conversions with modern design.',
    price: '$1,375 - $1,925',
    baseAmount: 1650, // Mid-range for quick payment
    color: 'from-orange-50 to-red-50',
    iconBg: 'bg-orange-600',
    priceColor: 'text-orange-600',
    features: [
      'Conversion optimization',
      'Responsive design',
      'SEO optimization',
      'Analytics integration'
    ]
  },
  {
    id: 'static',
    icon: Smartphone,
    title: 'Static Web Page Development',
    description: 'Professional static websites with modern design, fast loading times, and optimized performance for businesses and portfolios.',
    price: '$1,500 - $2,000',
    baseAmount: 1750, // Mid-range for quick payment
    color: 'from-indigo-50 to-blue-50',
    iconBg: 'bg-indigo-600',
    priceColor: 'text-indigo-600',
    features: [
      'Modern HTML/CSS/JS',
      'Responsive design',
      'Fast loading times',
      'SEO optimization'
    ]
  },
  {
    id: 'prototyping',
    icon: Rocket,
    title: 'Rapid Prototyping',
    description: 'Rapid development of functional prototypes and proof-of-concepts to validate your ideas quickly using modern frameworks.',
    price: '$2,450 - $3,150',
    baseAmount: 2800, // Mid-range for quick payment
    color: 'from-green-50 to-emerald-50',
    iconBg: 'bg-green-600',
    priceColor: 'text-green-600',
    features: [
      'Full-stack prototypes',
      'Modern tech stacks',
      'Database integration',
      'Real-time development'
    ]
  },
  {
    id: 'fullstack',
    icon: Code,
    title: 'Full-Stack Development',
    description: 'Complete web application development from frontend to backend, including database design, API integration, and deployment.',
    price: '$4,000 - $4,800',
    baseAmount: 4400, // Mid-range for quick payment
    color: 'from-blue-50 to-cyan-50',
    iconBg: 'bg-blue-600',
    priceColor: 'text-blue-600',
    features: [
      'React/TypeScript frontend',
      'Node.js/Express backend',
      'Database design & integration',
      'API integration & development',
      'Authentication & security'
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
    console.log('Payment completed successfully');
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
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    onClick={() => setCheckoutService({
                      id: service.id,
                      title: service.title,
                      baseAmount: service.baseAmount
                    })}
                    className={`flex-1 ${service.iconBg} hover:opacity-90 transition-opacity text-sm sm:text-base py-2 sm:py-3`}
                    data-testid={`button-pay-${service.id}`}
                  >
                    <span className="hidden sm:inline">Pay Now - </span>${service.baseAmount}
                  </Button>
                  <Button 
                    onClick={() => window.location.href = `mailto:projects@gavineanthony.com?subject=Request: ${service.title}&body=Hi Gavin,%0A%0AI'm interested in ${service.title} for $${service.baseAmount}.%0A%0AProject details:%0A%0A%0A%0ATimeline:%0A%0A%0A%0APlease contact me to discuss payment options and next steps.`}
                    variant="outline"
                    className="flex-1 sm:flex-none text-xs sm:text-sm py-2 sm:py-3 px-2 sm:px-4"
                    data-testid={`button-contact-${service.id}`}
                  >
                    Contact
                  </Button>
                </div>
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
