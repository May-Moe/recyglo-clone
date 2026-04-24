import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ArrowRight, ChevronRight, Calculator,Play } from 'lucide-react';
import { useLocation } from 'wouter';

// --- ASSET IMPORTS ---
import aboutHero from '@/assets/images/about-hero.jpg'; 
import newsletterImg from '@/assets/images/newsletter-img.png'; 
import blog1 from '@/assets/images/blog1.png';
import blog2 from '@/assets/images/blog2.png';
import blog3 from '@/assets/images/blog3.png';

const articles = [
  {
    id: 1,
    title: "RecyGlo Publishes Report on Thailand's Battle With Climate Change",
    tags: ['Sustainability'],
    date: '11 October 2024',
    excerpt: "In July 2024, RecyGlo published a report on Thailand's battle with climate change that highlights about the significant challenges driven by the aftermath of climate change in Thailand. This report delves into how extreme levels of greenhouse gas emissions...",
    image: blog1,
  },
  {
    id: 2,
    title: "Thailand's Sustainable Future: The Significance of Renewable Energy",
    tags: ['Circular Economy', 'News', 'Sustainability'],
    date: '11 October 2024',
    excerpt: "Thailand's road to sustainability requires a robust strategy to reach its goal by 2030 and plan for a greener future ahead. The use of renewable energy hence is crucial in lowering carbon emissions, strengthing energy security, and ensuring a smooth transition...",
    image: blog2,
  },
  {
    id: 3,
    title: 'Understanding the importance of circular economy in Thailand',
    tags: ['Circular Economy'],
    date: '11 October 2024',
    excerpt: "The \"Take-Make-Waste\" system normally endorsed by Thailand's linear economy has been reprimanded recently due to its role in promoting climatic hazards. Under this production process, resources that are not utilized during the manufacturing period are discarded...",
    image: blog3,
  },
];

export default function Articles() {
  const [, setLocation] = useLocation();
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* 1. HERO SECTION */}
      <section className="relative py-12 md:py-24 overflow-hidden bg-[#1B5E20]">
        <div 
          className="absolute inset-0 z-0 opacity-90"
          style={{
            backgroundImage: `url(${aboutHero})`, 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="container px-4 sm:px-8 lg:px-12 relative z-10">
          <div className="max-w-xl bg-white/95 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-xl border border-white/20">
             <h2 className="text-lg md:text-xl font-bold mb-2 text-gray-800">
                Insights on Sustainability and ESG Reporting
             </h2>
             <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#1B5E20] leading-[1.1]">
                RecyGlo Blogs
             </h1>
             <p className="text-base text-gray-600 mb-8 leading-relaxed">
                Stay updated with the latest insights, trends, and tips on sustainability and ESG reporting from RecyGlo's experts. Read our latest blog posts.
             </p>

             <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => {
                    setLocation('/carbon-calculator');
                    window.scrollTo(0, 0);
                  }}
                  className="bg-white text-[#1B5E20] border border-gray-200 hover:bg-gray-50 font-bold px-6 py-6 rounded-md shadow-sm flex items-center gap-2 transition-all"
                >
                  <span className="bg-[#1B5E20] p-1 rounded-sm"><Play size={14} className="text-white fill-white" /></span>
                  Calculate Carbon Footprint
                </Button>
                <Button 
                                  className="bg-[#E2552B] text-white hover:bg-[#E2552B]/90 font-bold px-8 py-6 rounded-md shadow-md"
                                  onClick={() => setLocation('/solutions')}
                                >
                                  Our Solutions
                                </Button>
             </div>
          </div>
        </div>
      </section>

      {/* 2. BLOG LISTING SECTION */}
      <section className="py-12">
        <div className="container px-4 sm:px-8 lg:px-12">
          
          {/* Breadcrumb */}
          <div className="mb-10 text-sm font-medium text-gray-500 flex items-center gap-2">
            <Link href="/" className="hover:text-gray-900 cursor-pointer transition-colors">Home</Link>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-gray-900 font-bold">Articles</span>
          </div>

          <h2 className="text-4xl font-bold text-[#1B5E20] mb-8">Blogs</h2>

          {/* Category Filters */}
          <div className="flex flex-wrap gap-3 mb-10">
             <button className="bg-[#E2552B] text-white px-5 py-2.5 rounded-md text-sm font-semibold shadow-sm transition-all">
               All Articles
             </button>
             <button className="bg-white border border-[#E2552B] text-[#E2552B] hover:bg-[#E2552B]/5 px-5 py-2.5 rounded-md text-sm font-semibold transition-all">
               Sustainability
             </button>
             <button className="bg-white border border-[#E2552B] text-[#E2552B] hover:bg-[#E2552B]/5 px-5 py-2.5 rounded-md text-sm font-semibold transition-all">
               Circular Economy
             </button>
             <button className="bg-white border border-[#E2552B] text-[#E2552B] hover:bg-[#E2552B]/5 px-5 py-2.5 rounded-md text-sm font-semibold transition-all">
               News
             </button>
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/articles/${article.id}`}
                onClick={() => window.scrollTo(0, 0)} // <-- Added to scroll to the top!
                className="group cursor-pointer flex flex-col h-full bg-white rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden border border-gray-100"
              >
                {/* Image */}
                <div className="relative h-56 w-full overflow-hidden mb-5 shrink-0">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-6 pt-0 flex flex-col flex-grow">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-[#1B5E20] group-hover:text-[#2E7D32] transition-colors mb-4 line-clamp-2 leading-snug">
                    {article.title}
                  </h3>
                  
                  {/* Pill Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {article.tags.map(tag => (
                      <span 
                        key={tag} 
                        className="border border-gray-300 rounded-full px-3 py-1 text-[11px] font-medium text-gray-600 bg-white shadow-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Excerpt */}
                  <p className="text-gray-500 text-sm mb-4 line-clamp-3 leading-relaxed flex-grow">
                    {article.excerpt}
                  </p>

                  {/* Date */}
                  <div className="text-gray-400 text-xs mb-4 font-medium">
                    {article.date}
                  </div>

                  {/* Read More Link */}
                  <div className="flex items-center gap-1 text-[#E2552B] font-bold text-sm mt-auto group-hover:gap-2 transition-all">
                    Read More <ArrowRight size={16} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
        </div>
      </section>

      {/* 3. NEWSLETTER SECTION */}
      <section className="py-20 bg-[#F4F6F4]">
        <div className="container px-4 sm:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row items-stretch bg-white rounded-2xl overflow-hidden shadow-lg max-w-5xl mx-auto">
             
             {/* Image Side */}
             <div className="w-full md:w-1/3 relative min-h-[250px] bg-gray-100">
                <img 
                  src={newsletterImg} 
                  alt="Recycling and Sustainability" 
                  className="w-full h-full object-cover absolute inset-0"
                />
             </div>
             
             {/* Content Side */}
             <div className="w-full md:w-2/3 bg-[#1C3B2B] p-10 md:p-14 text-white flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-bold text-[#A3E635] mb-4">
                  Subscribe to Our Newsletter
                </h2>
                <p className="text-white/80 mb-8 text-sm md:text-base leading-relaxed">
                  Stay updated with the latest news, insights, and tips on sustainability and ESG reporting.
                </p>
                
                <form className="flex flex-col sm:flex-row gap-3">
                   <input 
                     type="email" 
                     placeholder="Your email address" 
                     required
                     className="flex-grow px-5 py-4 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#E2552B]" 
                   />
                   <Button 
                     type="submit"
                     className="bg-[#E2552B] hover:bg-[#E2552B]/90 text-white font-bold px-8 py-4 h-auto rounded-md shadow-md transition-all"
                   >
                     Subscribe
                   </Button>
                </form>
             </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}