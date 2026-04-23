import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, BarChart3, BookOpen } from 'lucide-react';

const resources = [
  {
    icon: FileText,
    title: 'ESG Reporting Guide',
    description: 'Comprehensive guide to ESG reporting standards and best practices.',
    type: 'PDF Guide',
  },
  {
    icon: BarChart3,
    title: 'Carbon Footprint Calculator',
    description: 'Interactive tool to calculate your organization\'s carbon emissions.',
    type: 'Tool',
  },
  {
    icon: BookOpen,
    title: 'Circular Economy Playbook',
    description: 'Strategic framework for implementing circular economy principles.',
    type: 'eBook',
  },
  {
    icon: FileText,
    title: 'Waste Management Checklist',
    description: 'Essential checklist for optimizing your waste management practices.',
    type: 'Checklist',
  },
  {
    icon: BarChart3,
    title: 'Sustainability Metrics Dashboard',
    description: 'Track and visualize your sustainability KPIs in real-time.',
    type: 'Dashboard',
  },
  {
    icon: Download,
    title: 'Case Studies Collection',
    description: 'Success stories from businesses that transformed with RecyGlo.',
    type: 'Case Studies',
  },
];

export default function Resources() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero */}
      <section className="py-20 md:py-32 bg-primary text-white">
        <div className="container">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Resources & Tools</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Access our comprehensive library of tools, guides, and resources to help you achieve your sustainability goals.
          </p>
        </div>
      </section>

      {/* Resources Grid */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container">
          <div className="mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Available Resources</h2>
            <p className="text-lg text-muted-foreground">
              Download guides, access tools, and explore case studies to accelerate your sustainability journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, idx) => {
              const Icon = resource.icon;
              return (
                <Card key={idx} className="hover:shadow-lg transition-all duration-300 border-border hover:border-primary/50">
                  <CardHeader>
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="text-primary" size={24} />
                    </div>
                    <CardTitle className="text-xl text-foreground">{resource.title}</CardTitle>
                    <CardDescription className="text-sm text-accent font-semibold">
                      {resource.type}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">{resource.description}</p>
                    <Button
                      variant="outline"
                      className="w-full border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      <Download size={18} className="mr-2" />
                      Access Resource
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 md:py-32 bg-secondary/5">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold text-foreground text-center mb-12">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {[
              {
                q: 'How do I get started with RecyGlo?',
                a: 'Contact our team to schedule a consultation. We\'ll assess your current waste management practices and develop a customized solution.',
              },
              {
                q: 'What is ESG data analytics?',
                a: 'ESG (Environmental, Social, Governance) data analytics helps you measure, track, and report on your sustainability performance across all three dimensions.',
              },
              {
                q: 'Do you offer training services?',
                a: 'Yes, we provide comprehensive training programs to help your team understand and implement sustainable practices.',
              },
              {
                q: 'What regions do you serve?',
                a: 'We operate across Asia-Pacific including Thailand, Vietnam, Myanmar, Indonesia, South Korea, Singapore, and Malaysia.',
              },
            ].map((faq, idx) => (
              <div key={idx} className="bg-white rounded-lg p-6 border border-border">
                <h3 className="text-lg font-bold text-foreground mb-3">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
