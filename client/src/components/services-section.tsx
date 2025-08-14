import { Card, CardContent } from "@/components/ui/card";
import { Code, Smartphone, ShoppingCart, TrendingUp, Settings, Rocket, Check } from "lucide-react";

const services = [
  {
    id: 'fullstack',
    icon: Code,
    title: 'Full-Stack Development',
    description: 'Complete web application development from frontend to backend, including database design and deployment.',
    price: '$5,000 - $15,000',
    color: 'from-blue-50 to-cyan-50',
    iconBg: 'bg-blue-600',
    priceColor: 'text-blue-600',
    features: [
      'React/TypeScript frontend',
      'Node.js/Express backend',
      'Database design & integration',
      'Authentication & security'
    ]
  },
  {
    id: 'prototyping',
    icon: Rocket,
    title: 'Rapid Prototyping',
    description: 'Rapid development of functional prototypes and proof-of-concepts to validate your ideas quickly using modern frameworks.',
    price: '$1,500 - $3,000',
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
    id: 'pwa',
    icon: Settings,
    title: 'Progressive Web Applications',
    description: 'Modern PWAs with offline capabilities, push notifications, and app-like experiences that work seamlessly across all devices.',
    price: '$2,000 - $5,000',
    color: 'from-purple-50 to-pink-50',
    iconBg: 'bg-purple-600',
    priceColor: 'text-purple-600',
    features: [
      'Offline functionality',
      'Push notifications',
      'App-like experience',
      'Cross-platform compatibility'
    ]
  },
  {
    id: 'landing',
    icon: TrendingUp,
    title: 'Landing Pages',
    description: 'High-converting landing pages designed to showcase your product, capture leads, and drive conversions with modern design.',
    price: '$250 - $500',
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
    id: 'consulting',
    icon: Smartphone,
    title: 'Technical Consulting',
    description: 'Architecture planning, technology stack recommendations, and development strategy for your projects.',
    price: '$150/hour',
    color: 'from-indigo-50 to-blue-50',
    iconBg: 'bg-indigo-600',
    priceColor: 'text-indigo-600',
    features: [
      'Architecture design',
      'Tech stack selection',
      'Scalability planning',
      'Development roadmaps'
    ]
  },
  {
    id: 'integration',
    icon: ShoppingCart,
    title: 'API Integration',
    description: 'Seamless integration of third-party APIs, payment systems, and external services into your applications.',
    price: '$750 - $1,500',
    color: 'from-teal-50 to-cyan-50',
    iconBg: 'bg-teal-600',
    priceColor: 'text-teal-600',
    features: [
      'Payment gateways',
      'Social authentication',
      'External APIs',
      'Webhook handling'
    ]
  }
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="tech-title">Professional</span> Development Services
          </h2>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto">
            Expert code development, rapid prototyping, and comprehensive development services using modern technologies
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <div 
                key={service.id} 
                className="glass-card p-8"
                data-testid={`card-service-${service.id}`}
              >
                <div className={`w-12 h-12 ${service.iconBg} rounded-lg flex items-center justify-center mb-6 glass`}>
                  <IconComponent className="text-white text-xl" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-4" data-testid={`text-title-${service.id}`}>
                  {service.title}
                </h3>
                <p className="text-slate-700 mb-6" data-testid={`text-description-${service.id}`}>
                  {service.description}
                </p>
                <div className={`text-2xl font-bold ${service.priceColor} mb-4 gradient-text`} data-testid={`text-price-${service.id}`}>
                  {service.price}
                </div>
                <ul className="space-y-2 text-slate-700">
                  {service.features.map((feature, index) => (
                    <li 
                      key={index} 
                      className="flex items-center"
                      data-testid={`feature-${service.id}-${index}`}
                    >
                      <Check className="text-emerald-500 mr-2 h-4 w-4" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
