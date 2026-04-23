import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Services from '@/components/Services';

export default function Solutions() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <Hero
        backgroundImage="https://d2xsxph8kpxj0f.cloudfront.net/310519663457630341/K6tBx7feaJeR6NiJRmj9rs/service-bg-a4TBoBLbxws7biQWxPfE9Q.webp"
        title="Our Solutions"
        subtitle="Comprehensive sustainability solutions designed to help your business achieve zero-waste and zero-carbon goals."
      />

      {/* Solutions Overview */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container max-w-4xl">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-6">Why Choose RecyGlo?</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">
              RecyGlo stands out as a trusted partner for businesses seeking comprehensive sustainability solutions. Our integrated approach combines waste management expertise with cutting-edge ESG analytics to deliver measurable results.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-primary/5 rounded-lg p-6">
                <h3 className="text-xl font-bold text-primary mb-3">ISO Compliant</h3>
                <p className="text-muted-foreground">All our services meet international standards and regulatory requirements.</p>
              </div>
              <div className="bg-primary/5 rounded-lg p-6">
                <h3 className="text-xl font-bold text-primary mb-3">Data-Driven</h3>
                <p className="text-muted-foreground">Real-time analytics and reporting for informed decision-making.</p>
              </div>
              <div className="bg-primary/5 rounded-lg p-6">
                <h3 className="text-xl font-bold text-primary mb-3">Scalable</h3>
                <p className="text-muted-foreground">Solutions that grow with your business across multiple markets.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <Services />

      {/* Implementation Process */}
      <section className="py-20 md:py-32 bg-secondary/5">
        <div className="container max-w-4xl">
          <h2 className="text-4xl font-bold text-foreground text-center mb-12">
            Our Implementation Process
          </h2>
          <div className="space-y-8">
            {[
              {
                step: '1',
                title: 'Assessment',
                description: 'We analyze your current waste management practices and sustainability goals.',
              },
              {
                step: '2',
                title: 'Strategy',
                description: 'Develop a customized roadmap aligned with your business objectives.',
              },
              {
                step: '3',
                title: 'Implementation',
                description: 'Deploy solutions with minimal disruption to your operations.',
              },
              {
                step: '4',
                title: 'Monitoring',
                description: 'Continuous tracking and optimization of your sustainability metrics.',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6">
                <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 font-bold text-lg">
                  {item.step}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
