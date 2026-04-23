import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Badge } from '@/components/ui/badge';
import { Link } from 'wouter';
import { ArrowRight } from 'lucide-react';

const articles = [
  {
    id: 1,
    title: 'RecyGlo Publishes Report on Thailand\'s Battle With Climate Change',
    category: 'Sustainability',
    date: 'July 2024',
    excerpt: 'A comprehensive analysis of Thailand\'s climate challenges and opportunities for sustainable development.',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663457630341/K6tBx7feaJeR6NiJRmj9rs/impact-section-47WVwnNsxmSyCuSgFKH5z7.webp',
  },
  {
    id: 2,
    title: 'Thailand\'s Sustainable Future: The Significance of Renewable Energy',
    category: 'Circular Economy',
    date: 'June 2024',
    excerpt: 'Exploring the role of renewable energy in Thailand\'s transition to a sustainable economy.',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663457630341/K6tBx7feaJeR6NiJRmj9rs/service-bg-a4TBoBLbxws7biQWxPfE9Q.webp',
  },
  {
    id: 3,
    title: 'Understanding the importance of circular economy in Thailand',
    category: 'Circular Economy',
    date: 'May 2024',
    excerpt: 'How circular economy principles are reshaping business practices across Thailand.',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663457630341/K6tBx7feaJeR6NiJRmj9rs/hero-main-kQFyPvymqBdJhbe39ELcxR.webp',
  },
  {
    id: 4,
    title: 'ESG Reporting Best Practices for Asian Enterprises',
    category: 'Sustainability',
    date: 'April 2024',
    excerpt: 'A guide to implementing effective ESG reporting strategies for businesses in Asia.',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663457630341/K6tBx7feaJeR6NiJRmj9rs/impact-section-47WVwnNsxmSyCuSgFKH5z7.webp',
  },
  {
    id: 5,
    title: 'Waste Management Innovation: Technology Trends in 2024',
    category: 'News',
    date: 'March 2024',
    excerpt: 'Discover the latest technological innovations transforming waste management globally.',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663457630341/K6tBx7feaJeR6NiJRmj9rs/service-bg-a4TBoBLbxws7biQWxPfE9Q.webp',
  },
  {
    id: 6,
    title: 'Building a Culture of Sustainability in Your Organization',
    category: 'Sustainability',
    date: 'February 2024',
    excerpt: 'Practical strategies for embedding sustainability into your company\'s DNA.',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663457630341/K6tBx7feaJeR6NiJRmj9rs/hero-main-kQFyPvymqBdJhbe39ELcxR.webp',
  },
];

const categoryColors: Record<string, string> = {
  Sustainability: 'bg-primary/10 text-primary',
  'Circular Economy': 'bg-accent/20 text-primary',
  News: 'bg-secondary/10 text-secondary',
};

export default function Articles() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero */}
      <section className="py-20 md:py-32 bg-primary text-white">
        <div className="container">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">Articles & Resources</h1>
          <p className="text-xl text-white/90 max-w-2xl">
            Stay informed with the latest insights on sustainability, waste management, and circular economy trends across Asia-Pacific.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20 md:py-32 bg-white">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.id}`}
                className="group cursor-pointer"
              >
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col border border-border">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-muted">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge
                        className={categoryColors[article.category] || 'bg-muted text-foreground'}
                        variant="secondary"
                      >
                        {article.category}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{article.date}</span>
                    </div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-3 flex-grow">
                      {article.title}
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                      Read More
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
