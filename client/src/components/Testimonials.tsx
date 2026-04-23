import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { Button } from '@/components/ui/button';

const testimonials = [
  {
    quote:
      'The French Embassy commends RecyGlo for their on-time waste collection services and excellent communication with us. They\'re reliable and easy to work with, making our waste management hassle-free!',
    author: 'Mr. Mickeal Paolucci',
    organization: 'French Embassy',
  },
  {
    quote:
      'I\'ve learned more about recycling and waste sorting. In waste-heavy businesses, we must start reducing our own waste and make changes to help collectors.',
    author: 'Employee',
    organization: 'Trattoria Delina',
  },
  {
    quote:
      'Starting with little knowledge, I now have a better understanding of how to work effectively in the kitchen, which plays a crucial role in managing food waste.',
    author: 'Employee',
    organization: 'Trattoria Delina',
  },
  {
    quote:
      'This training was highly beneficial for all participants. We gained valuable knowledge and fresh perspectives from all keynote speakers. The information shared helped us identify new opportunities, strategies, and ways to move forward in the sustainable business landscape.',
    author: 'Mr. Nitiwat Bangsen (Pom)',
    organization: 'Corporate Client',
  },
  {
    quote:
      'I was really impressed by the team\'s passion and expertise. They weren\'t just sharing knowledge; they genuinely cared about helping businesses and individuals make real, impactful changes.',
    author: 'Ms. Janejira Anna Sugrivaka (Pangfoon)',
    organization: 'Corporate Client',
  },
];

export default function Testimonials() {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [autoPlay]);

  const next = () => {
    setCurrent((prev) => (prev + 1) % testimonials.length);
    setAutoPlay(false);
  };

  const prev = () => {
    setCurrent((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setAutoPlay(false);
  };

  return (
    <section
      className="py-20 md:py-32 bg-gradient-to-b from-white to-secondary/5"
      style={{
        backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663457630341/K6tBx7feaJeR6NiJRmj9rs/testimonial-bg-a4TBoBLbxws7biQWxPfE9Q.webp)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="container">
        <div className="mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-muted-foreground">
            Hear directly from industry leaders about how our solutions help them achieve sustainability goals.
          </p>
        </div>

        {/* Testimonial Carousel */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12 relative">
            <Quote className="absolute top-4 right-4 text-accent/20" size={48} />

            <p className="text-lg md:text-xl text-foreground mb-6 leading-relaxed">
              "{testimonials[current].quote}"
            </p>

            <div className="mb-8">
              <p className="font-bold text-foreground">{testimonials[current].author}</p>
              <p className="text-muted-foreground">{testimonials[current].organization}</p>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prev}
                  className="hover:bg-primary hover:text-white"
                >
                  <ChevronLeft size={20} />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={next}
                  className="hover:bg-primary hover:text-white"
                >
                  <ChevronRight size={20} />
                </Button>
              </div>

              {/* Indicators */}
              <div className="flex gap-2">
                {testimonials.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setCurrent(idx);
                      setAutoPlay(false);
                    }}
                    className={`w-2 h-2 rounded-full transition-all ${
                      idx === current ? 'bg-primary w-8' : 'bg-border'
                    }`}
                    aria-label={`Go to testimonial ${idx + 1}`}
                  />
                ))}
              </div>

              <div className="text-sm text-muted-foreground">
                {current + 1} / {testimonials.length}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
