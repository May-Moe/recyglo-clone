import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

interface HeroProps {
  backgroundImage?: string;
  title: string;
  subtitle: string;
  ctaButtons?: Array<{
    label: string;
    href: string;
    variant?: 'default' | 'secondary';
  }>;
}

export default function Hero({
  backgroundImage,
  title,
  subtitle,
  ctaButtons,
}: HeroProps) {
  return (
    <section
      className="relative py-24 md:py-32 overflow-hidden"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Content */}
      <div className="container relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
            {subtitle}
          </p>

          {/* CTA Buttons */}
          {ctaButtons && ctaButtons.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-4">
              {ctaButtons.map((btn, idx) => (
                <Button
                  key={idx}
                  className={`group ${
                    btn.variant === 'secondary'
                      ? 'bg-accent hover:bg-accent/90 text-primary'
                      : 'bg-white hover:bg-white/90 text-primary'
                  }`}
                  onClick={() => (window.location.href = btn.href)}
                >
                  {btn.label}
                  <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
