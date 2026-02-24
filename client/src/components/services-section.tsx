import { Button } from "@/components/ui/button";
import { Smartphone, TrendingUp, Settings, Rocket, Check, ArrowRight } from "lucide-react";

const services = [
  {
    id: 'basic',
    icon: Smartphone,
    title: 'Basic',
    description: 'Perfect for single page sites. Clean, professional design that gets your message across effectively.',
    accent: 'cyan',
    features: [
      'Single page website',
      'Mobile-friendly design',
      'Contact form',
      'Fast loading',
      'SEO optimized'
    ]
  },
  {
    id: 'premium',
    icon: Settings,
    title: 'Premium Package',
    description: 'Perfect for small local businesses like hair salons, pet stores, and lawn care companies. Professional 3-5 page website with mobile design.',
    accent: 'purple',
    features: [
      'Professional 3-5 page website',
      'Mobile-friendly design',
      'Contact forms & business info',
      'Google My Business integration',
      '12 months hosting included'
    ]
  },
  {
    id: 'custom',
    icon: TrendingUp,
    title: 'Custom Package',
    description: 'Complete solution for growing local businesses. Full custom website with e-commerce, customer portals, and advanced integrations.',
    accent: 'amber',
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
    accent: 'green',
    features: [
      'Full-stack prototypes',
      'Modern tech stacks',
      'Database integration',
      'Real-time development'
    ]
  }
];

const accentColors: Record<string, { bg: string; text: string; border: string; glow: string }> = {
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', border: 'border-cyan-500/20', glow: 'hover:shadow-cyan-500/10' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/20', glow: 'hover:shadow-purple-500/10' },
  amber: { bg: 'bg-amber-500/10', text: 'text-amber-400', border: 'border-amber-500/20', glow: 'hover:shadow-amber-500/10' },
  green: { bg: 'bg-green-500/10', text: 'text-green-400', border: 'border-green-500/20', glow: 'hover:shadow-green-500/10' },
};

export default function ServicesSection() {
  const scrollToContact = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-16 sm:py-20 md:py-28 section-accent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
            <span className="tech-title">Professional</span> Services
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto px-2">
            Expert development services using modern technologies — from landing pages to full-scale applications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {services.map((service) => {
            const IconComponent = service.icon;
            const colors = accentColors[service.accent];
            return (
              <div 
                key={service.id} 
                className={`glass-card p-6 sm:p-8 ${colors.glow}`}
                data-testid={`card-service-${service.id}`}
              >
                <div className="flex items-start gap-4 mb-5">
                  <div className={`w-12 h-12 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0 border ${colors.border}`}>
                    <IconComponent className={`${colors.text} w-6 h-6`} />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white" data-testid={`text-title-${service.id}`}>
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1 leading-relaxed" data-testid={`text-description-${service.id}`}>
                      {service.description}
                    </p>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {service.features.map((feature, index) => (
                    <li 
                      key={index} 
                      className="flex items-center text-sm text-slate-400"
                      data-testid={`feature-${service.id}-${index}`}
                    >
                      <Check className={`${colors.text} mr-3 h-4 w-4 flex-shrink-0`} />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={scrollToContact}
                  variant="outline"
                  className={`w-full border ${colors.border} ${colors.text} hover:${colors.bg} text-sm`}
                  data-testid={`button-contact-${service.id}`}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
