import { Card, CardContent } from "@/components/ui/card";
import { Code, Smartphone, ShoppingCart, TrendingUp, Settings, Rocket, Check } from "lucide-react";

const services = [
  {
    id: 'prototyping',
    icon: Code,
    title: 'Rapid Prototyping',
    description: 'AI-powered rapid development of functional prototypes and proof-of-concepts to validate your ideas quickly.',
    price: 'Custom Quote',
    color: 'from-blue-50 to-cyan-50',
    iconBg: 'bg-blue-600',
    priceColor: 'text-blue-600',
    features: [
      'Full-stack prototypes',
      'Modern tech stacks',
      'Database integration',
      'Real-time development'
    ]
  },
  {
    id: 'codegeneration',
    icon: Rocket,
    title: 'Code Generation',
    description: 'Intelligent code generation for React, Node.js, and modern web applications with best practices built-in.',
    price: 'Per Project',
    color: 'from-green-50 to-emerald-50',
    iconBg: 'bg-green-600',
    priceColor: 'text-green-600',
    features: [
      'TypeScript support',
      'Component libraries',
      'API endpoints',
      'Database schemas'
    ]
  },
  {
    id: 'debugging',
    icon: Settings,
    title: 'Code Review & Debugging',
    description: 'AI-assisted code analysis, bug detection, and performance optimization suggestions for existing projects.',
    price: 'Hourly Rate',
    color: 'from-purple-50 to-pink-50',
    iconBg: 'bg-purple-600',
    priceColor: 'text-purple-600',
    features: [
      'Error analysis',
      'Performance insights',
      'Best practice recommendations',
      'Refactoring suggestions'
    ]
  },
  {
    id: 'consulting',
    icon: TrendingUp,
    title: 'Technical Consulting',
    description: 'Architecture planning, technology stack recommendations, and development strategy for your projects.',
    price: 'Consultation',
    color: 'from-orange-50 to-red-50',
    iconBg: 'bg-orange-600',
    priceColor: 'text-orange-600',
    features: [
      'Architecture design',
      'Tech stack selection',
      'Scalability planning',
      'Development roadmaps'
    ]
  },
  {
    id: 'learning',
    icon: Smartphone,
    title: 'Interactive Learning',
    description: 'Hands-on coding tutorials and guided development sessions to help you learn modern web technologies.',
    price: 'Educational',
    color: 'from-indigo-50 to-blue-50',
    iconBg: 'bg-indigo-600',
    priceColor: 'text-indigo-600',
    features: [
      'Live coding sessions',
      'Concept explanations',
      'Best practice guidance',
      'Project-based learning'
    ]
  },
  {
    id: 'integration',
    icon: ShoppingCart,
    title: 'API Integration',
    description: 'Seamless integration of third-party APIs, payment systems, and external services into your applications.',
    price: 'Per Integration',
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
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">AI-Powered Development Services</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Intelligent code generation, rapid prototyping, and development assistance powered by advanced AI technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => {
            const IconComponent = service.icon;
            return (
              <Card 
                key={service.id} 
                className={`bg-gradient-to-br ${service.color} hover:shadow-lg transition-shadow`}
                data-testid={`card-service-${service.id}`}
              >
                <CardContent className="p-8">
                  <div className={`w-12 h-12 ${service.iconBg} rounded-lg flex items-center justify-center mb-6`}>
                    <IconComponent className="text-white text-xl" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4" data-testid={`text-title-${service.id}`}>
                    {service.title}
                  </h3>
                  <p className="text-slate-600 mb-6" data-testid={`text-description-${service.id}`}>
                    {service.description}
                  </p>
                  <div className={`text-2xl font-bold ${service.priceColor} mb-4`} data-testid={`text-price-${service.id}`}>
                    {service.price}
                  </div>
                  <ul className="space-y-2 text-slate-600">
                    {service.features.map((feature, index) => (
                      <li 
                        key={index} 
                        className="flex items-center"
                        data-testid={`feature-${service.id}-${index}`}
                      >
                        <Check className="text-green-500 mr-2 h-4 w-4" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
