import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Trash2, BarChart3, BookOpen, Lightbulb, Recycle } from 'lucide-react';

const services = [
  {
    icon: Trash2,
    title: 'Waste Management Solutions',
    description: 'Comprehensive B2B waste management solutions, specializing in general, hazardous, and e-waste collection and disposal.',
  },
  {
    icon: BookOpen,
    title: 'Waste Auditing',
    description: 'Comprehensive waste auditing services to help B2B facilities optimize waste management practices.',
  },
  {
    icon: BarChart3,
    title: 'Reporting and Compliance',
    description: 'Comprehensive reporting and compliance services to help businesses navigate environmental regulations.',
  },
  {
    icon: Lightbulb,
    title: 'Consulting and Training',
    description: 'Expert sustainability consulting and training services to help B2B organizations build internal capacity.',
  },
  {
    icon: BarChart3,
    title: 'ESG Data Analytics',
    description: 'Advanced ESG data analytics services to help businesses track and analyze Scope 1, 2, and 3 emissions.',
  },
  {
    icon: Recycle,
    title: 'Circular Economy',
    description: 'Impactful Circular Economy projects to help businesses implement closed-loop systems.',
  },
];

export default function Services() {
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Comprehensive Waste & ESG Services
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl">
            RecyGlo offers a complete suite of sustainability solutions tailored to your business needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => {
            const Icon = service.icon;
            return (
              <Card
                key={idx}
                className="group hover:shadow-lg transition-all duration-300 border-border hover:border-primary/50 cursor-pointer"
              >
                <CardHeader>
                  <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/30 transition-colors">
                    <Icon className="text-primary" size={24} />
                  </div>
                  <CardTitle className="text-xl text-foreground">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base text-muted-foreground">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
