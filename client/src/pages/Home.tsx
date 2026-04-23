import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import Services from '@/components/Services';
import Testimonials from '@/components/Testimonials';
import CompanyValues from '@/components/CompanyValues';
import BlogSection from '@/components/BlogSection';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <Hero
        backgroundImage="https://d2xsxph8kpxj0f.cloudfront.net/310519663457630341/K6tBx7feaJeR6NiJRmj9rs/hero-main-kQFyPvymqBdJhbe39ELcxR.webp"
        title="Welcome to RecyGlo"
        subtitle="Empowering businesses in Myanmar, Vietnam, Thailand, Malaysia, Singapore, and Korea with circular economy strategies and ISO-compliant reporting."
        ctaButtons={[
          { label: 'Calculate Carbon Footprint', href: '#' },
          { label: 'Our Solutions', href: '/solutions', variant: 'secondary' },
        ]}
      />

      {/* Trusted By Section */}
      <section className="py-16 md:py-20 bg-white border-b border-border">
        <div className="container">
          <h2 className="text-3xl font-bold text-foreground text-center mb-12">
            Trusted by Global Brands & International Organizations
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-24 bg-muted rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground text-sm">Partner Logo</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <Services />

      {/* Testimonials Section */}
      <Testimonials />

      {/* Company Values Section */}
      <CompanyValues />

      {/* Impact Section */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-12">
            Impact in Action
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="rounded-lg overflow-hidden h-96 bg-muted">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663457630341/K6tBx7feaJeR6NiJRmj9rs/impact-section-47WVwnNsxmSyCuSgFKH5z7.webp"
                alt="RecyGlo Team Thailand"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-center">
              <h3 className="text-3xl font-bold text-foreground mb-4">RecyGlo Team Thailand</h3>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Our dedicated team across Asia-Pacific works tirelessly to implement sustainable waste management solutions and drive positive environmental impact in every community we serve.
              </p>
              <Button className="w-fit bg-primary hover:bg-primary/90 text-white">
                See Gallery
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <BlogSection />

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-primary text-white">
        <div className="container text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Transform Your Waste Management?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join hundreds of businesses across Asia-Pacific that are achieving their sustainability goals with RecyGlo.
          </p>
          <Button
            className="bg-accent hover:bg-accent/90 text-primary font-semibold px-8 py-6 text-lg"
            onClick={() => (window.location.href = '/contact')}
          >
            Get Started Today
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
