import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Hero from '@/components/Hero';
import CompanyValues from '@/components/CompanyValues';
import { Button } from '@/components/ui/button';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <Hero
        backgroundImage="https://d2xsxph8kpxj0f.cloudfront.net/310519663457630341/K6tBx7feaJeR6NiJRmj9rs/hero-main-kQFyPvymqBdJhbe39ELcxR.webp"
        title="About RecyGlo"
        subtitle="Leading the way in sustainable waste management and ESG data analytics across Asia-Pacific."
      />

      {/* Main Content */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container max-w-4xl">
          <div className="mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-6">Who We Are</h2>
            <p className="text-lg text-muted-foreground leading-relaxed mb-4">
              RecyGlo is a pioneering sustainability solutions provider dedicated to helping businesses across Asia-Pacific achieve their environmental and ESG goals. With a team of passionate experts and a commitment to innovation, we deliver comprehensive waste management, circular economy, and ESG data analytics solutions.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Our mission is to transform how businesses approach sustainability, making it easier, more transparent, and more impactful. We believe that every organization has the potential to become a leader in environmental responsibility.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-6">Our Expertise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-2xl font-bold text-primary mb-4">Waste Management</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Comprehensive waste collection, sorting, and disposal services tailored to your business needs. From hazardous waste to e-waste, we handle it all with precision and compliance.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary mb-4">ESG Analytics</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Advanced data analytics platforms that help you track, measure, and report on your environmental impact. Real-time insights for better decision-making.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary mb-4">Circular Economy</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Strategic consulting to help your business transition to circular economy models. Reduce waste, maximize resources, and create new value.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-primary mb-4">Training & Consulting</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Expert training programs and consulting services to build internal capacity and drive organizational change toward sustainability.
                </p>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <h2 className="text-4xl font-bold text-foreground mb-6">Our Coverage</h2>
            <p className="text-lg text-muted-foreground mb-6">
              We operate across key markets in Asia-Pacific, serving businesses of all sizes:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['Thailand', 'Vietnam', 'Myanmar', 'Indonesia', 'South Korea', 'Singapore', 'Malaysia'].map((country) => (
                <div key={country} className="bg-primary/5 rounded-lg p-4 text-center">
                  <p className="font-semibold text-foreground">{country}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center">
            <Button
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg"
              onClick={() => (window.location.href = '/contact')}
            >
              Let's Work Together
            </Button>
          </div>
        </div>
      </section>

      {/* Company Values */}
      <CompanyValues />

      {/* Team Section */}
      <section className="py-20 md:py-32 bg-white border-t border-border">
        <div className="container">
          <h2 className="text-4xl font-bold text-foreground text-center mb-12">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <div className="w-32 h-32 bg-muted rounded-full mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground mb-2">Team Member {i}</h3>
                <p className="text-muted-foreground">Sustainability Expert</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
