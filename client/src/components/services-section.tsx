import { Card, CardContent } from "@/components/ui/card";
import { Code, Smartphone, ShoppingCart, TrendingUp, Settings, Rocket, Check } from "lucide-react";

const services = [
  {
    id: 'fullstack',
    icon: Code,
    title: 'Full Stack Development',
    description: 'Complete web application development from frontend to backend, including database design and API development.',
    price: 'Starting at $5,000',
    color: 'from-blue-50 to-cyan-50',
    iconBg: 'bg-blue-600',
    priceColor: 'text-blue-600',
    features: [
      'Custom web application',
      'Responsive design',
      'Database integration',
      'API development'
    ]
  },
  {
    id: 'mobile',
    icon: Smartphone,
    title: 'Mobile App Development',
    description: 'Cross-platform mobile applications using React Native for iOS and Android deployment.',
    price: 'Starting at $8,000',
    color: 'from-green-50 to-emerald-50',
    iconBg: 'bg-green-600',
    priceColor: 'text-green-600',
    features: [
      'iOS & Android apps',
      'Native performance',
      'App store deployment',
      'Backend integration'
    ]
  },
  {
    id: 'ecommerce',
    icon: ShoppingCart,
    title: 'E-commerce Solutions',
    description: 'Complete e-commerce platforms with payment processing, inventory management, and admin dashboards.',
    price: 'Starting at $7,000',
    color: 'from-purple-50 to-pink-50',
    iconBg: 'bg-purple-600',
    priceColor: 'text-purple-600',
    features: [
      'Payment integration',
      'Inventory management',
      'Admin dashboard',
      'Order tracking'
    ]
  },
  {
    id: 'consulting',
    icon: TrendingUp,
    title: 'Web Consulting',
    description: 'Technical consulting, code reviews, architecture planning, and performance optimization for existing projects.',
    price: '$150/hour',
    color: 'from-orange-50 to-red-50',
    iconBg: 'bg-orange-600',
    priceColor: 'text-orange-600',
    features: [
      'Technical audits',
      'Architecture planning',
      'Performance optimization',
      'Code reviews'
    ]
  },
  {
    id: 'maintenance',
    icon: Settings,
    title: 'Maintenance & Support',
    description: 'Ongoing maintenance, bug fixes, feature updates, and technical support for your applications.',
    price: '$500/month',
    color: 'from-indigo-50 to-blue-50',
    iconBg: 'bg-indigo-600',
    priceColor: 'text-indigo-600',
    features: [
      'Bug fixes',
      'Security updates',
      'Performance monitoring',
      '24/7 support'
    ]
  },
  {
    id: 'mvp',
    icon: Rocket,
    title: 'MVP Development',
    description: 'Rapid development of Minimum Viable Products to validate your idea and get to market quickly.',
    price: 'Starting at $3,000',
    color: 'from-teal-50 to-cyan-50',
    iconBg: 'bg-teal-600',
    priceColor: 'text-teal-600',
    features: [
      'Quick turnaround',
      'Core features only',
      'Scalable foundation',
      'User feedback integration'
    ]
  }
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-800 mb-4">Services</h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Comprehensive development solutions tailored to your business needs
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
