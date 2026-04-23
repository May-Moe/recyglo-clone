import { Target, Eye, Zap } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description:
      'At RecyGlo, our mission is to foster a more sustainable future through innovative waste, energy, and carbon management and ESG data analytics solutions. We are dedicated to assisting businesses in minimizing their environmental footprint and reaching their sustainability objectives.',
  },
  {
    icon: Eye,
    title: 'Our Vision',
    description:
      'We aspire to be the leading provider of zero-waste and zero-carbon energy efficient management solutions, paired with a comprehensive ESG data analytics platform, across the Asia Pacific region. We are committed to supporting businesses in achieving their sustainability targets.',
  },
  {
    icon: Zap,
    title: 'Our Goal',
    description:
      'Our goal is to implement ESG-driven waste management systems throughout the Asia Pacific, cultivating a robust waste management and recycling culture. Our focus areas include Sustainability, Circular Economy, Waste and Energy Management, Green Financing, and Smart Agriculture.',
  },
];

export default function CompanyValues() {
  return (
    <section className="py-20 md:py-32 bg-white">
      <div className="container">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Our Strategic Vision for a Sustainable Asia-Pacific
          </h2>
        </div>

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((value, idx) => {
            const Icon = value.icon;
            return (
              <div key={idx} className="flex flex-col">
                <div className="w-16 h-16 bg-accent/20 rounded-lg flex items-center justify-center mb-6">
                  <Icon className="text-primary" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
