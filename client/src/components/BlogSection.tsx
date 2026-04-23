import { Link } from 'wouter';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

const articles = [
  {
    id: 1,
    title: 'RecyGlo Publishes Report on Thailand\'s Battle With Climate Change',
    category: 'Sustainability',
    date: 'July 2024',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663457630341/K6tBx7feaJeR6NiJRmj9rs/impact-section-47WVwnNsxmSyCuSgFKH5z7.webp',
  },
  {
    id: 2,
    title: 'Thailand\'s Sustainable Future: The Significance of Renewable Energy',
    category: 'Circular Economy',
    date: 'June 2024',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663457630341/K6tBx7feaJeR6NiJRmj9rs/service-bg-a4TBoBLbxws7biQWxPfE9Q.webp',
  },
  {
    id: 3,
    title: 'Understanding the importance of circular economy in Thailand',
    category: 'Circular Economy',
    date: 'May 2024',
    image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663457630341/K6tBx7feaJeR6NiJRmj9rs/hero-main-kQFyPvymqBdJhbe39ELcxR.webp',
  },
];

const categoryColors: Record<string, string> = {
  Sustainability: 'bg-primary/10 text-primary',
  'Circular Economy': 'bg-accent/20 text-primary',
  News: 'bg-secondary/10 text-secondary',
};

export default function BlogSection() {
  return (
    <section className="py-20 md:py-32 bg-gradient-to-b from-white to-secondary/5">
      <div className="container">
        <div className="flex items-center justify-between mb-16">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Latest Articles & Resources
            </h2>
            <p className="text-lg text-muted-foreground">
              Stay updated with the latest insights on sustainability and circular economy.
            </p>
          </div>
          <Link href="/articles" className="hidden md:flex items-center gap-2 text-primary hover:text-primary/80 font-semibold">
            See All
            <ArrowRight size={20} />
          </Link>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.id}`}
              className="group cursor-pointer"
            >
              <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col">
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
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors mb-4 flex-grow">
                    {article.title}
                  </h3>
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                    Read More
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile See All Link */}
        <div className="md:hidden flex justify-center">
          <Link href="/articles" className="flex items-center gap-2 text-primary hover:text-primary/80 font-semibold">
            See All Articles
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}
