import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Link, useRoute } from 'wouter';
import { ChevronRight, ArrowRight } from 'lucide-react';

// --- ASSET IMPORTS ---
import blog1 from '@/assets/images/blog1.png'; 
import blog2 from '@/assets/images/blog2.png';
import blog3 from '@/assets/images/blog3.png';

// --- ALL ARTICLES DATA ---
const articlesData = [
  {
    id: 1,
    title: "RecyGlo Publishes Report on Thailand's Battle With Climate Change",
    image: blog1,
    tags: ["Sustainability"],
    date: "11 October 2024",
    excerpt: "In July 2024, RecyGlo published a report on Thailand's battle with climate change that highlights about the significant challenges driven by the aftermath...",
    content: () => (
      <>
        <p className="mb-6">
          In July 2024, RecyGlo published a report on Thailand's battle with climate change that highlights about the significant challenges driven by the aftermath of climate change in Thailand. This report delves into how extreme levels of greenhouse gas emissions in Thailand have been a result of the growing population in Thailand with its rapid economic expansion. The report further highlights the urgent need for comprehensive mitigation and adaptation strategies.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-10 mb-4">Climate Change Impacts on Thailand</h3>
        <p className="mb-6">
          Climate change presents significant challenges globally and Thailand is no exception as it faces escalating risks from climate hazards such as heavy rainfall, floods, droughts, and sea level rise. Given these challenges, it is essential to assess Thailand's environmental impact, and implement proper strategies for mitigation and adaptation to combat the effects of climate change.
        </p>
        <p className="mb-6">
          Thailand's tropical climate has seen an increasing temperature and fluctuating precipitation patterns over recent decades. The report highlights some of the factors Thailand has been facing:
        </p>

        <div className="space-y-4 mb-10">
          <p>
            <span className="font-bold text-gray-900">1. Rising Temperatures:</span> From 2011 to 2021, Thailand experienced significant temperature increases, with the highest temperature recorded in April 2016 at 44.6°C in Mae Hong Son. The heatwaves lead to serious health risks such as heat stress and respiratory diseases, impacting public health significantly in Thailand.
          </p>
          <p>
            <span className="font-bold text-gray-900">2. Sea Level Rise:</span> Rising sea level has posed a major threat to coastal areas, especially in the Bangkok region which is built on a low-lying plain and hence faces serious risks of being submerged by 2050 if proper action is not taken.
          </p>
          <p>
            <span className="font-bold text-gray-900">3. Air Quality Degradation:</span> The degradation of air quality is a result of climate change since rising temperatures increase the level of particulate matter and ground-level ozone. This deterioration in air quality has been exacerbating health problems and adding to the global warming challenge.
          </p>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mt-10 mb-4">Socioeconomic Impacts</h3>
        <p className="mb-6">
          The report covers the impacts of climate change in Thailand which is profound, affecting myriad sectors:
        </p>

        <div className="space-y-4 mb-8">
          <p>
            <span className="font-bold text-gray-900">1. Agriculture:</span> Altered precipitation and unstable temperature patterns have been threatening crop yields and food security, impacting the livelihoods of farmers and rural communities in Thailand.
          </p>
          <p>
            <span className="font-bold text-gray-900">2. Public Health:</span> Increased heatwaves and deteriorating air quality are leading to respiratory and heat-related illnesses, posing significant health risks.
          </p>
          <p>
            <span className="font-bold text-gray-900">3. Infrastructure:</span> Floods and rising sea levels have damaged infrastructure, leading to economic losses and displacement of communities in Thailand.
          </p>
        </div>

        <p className="mb-10 font-medium">
          To understand the impacts in more detail and learn about how we can take mitigation and adaptation strategies, read our new report <a href="#" className="text-[#1B5E20] hover:underline uppercase">THAILAND'S BATTLE WITH CLIMATE CHANGE.</a>
        </p>
      </>
    )
  },
  {
    id: 2,
    title: "Thailand's Sustainable Future: The Significance of Renewable Energy",
    image: blog2,
    tags: ["Circular Economy", "News", "Sustainability"],
    date: "11 October 2024",
    excerpt: "Thailand's road to sustainability requires a robust strategy to reach its goal by 2030 and plan for a greener future ahead...",
    content: () => (
      <>
        <p className="mb-6">
          Thailand's road to sustainability requires a robust strategy to reach its goal by 2030 and plan for a greener future ahead. The use of renewable energy hence is crucial in lowering carbon emissions, strengthing energy security, and ensuring a smooth transition to a circular economy with greener alternatives. The Thai government has a solid framework called the Power Development Plan (PDP) scheduled to be implemented for the period 2024 to 2037. According to this plan, the ideal target set covers that 30% of the total power generated in Thailand must be renewable energy by 2030. A swift adherence to this framework and target could guarantee better results for Thailand's ambitious goal of reaching carbon neutrality by 2050 and a net-zero target by 2065.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-10 mb-4">Making the Switch to Renewable Energy</h3>
        <p className="mb-6">
          The main renewable energy sources that are now under development include hydropower, biomass, solar, and wind. Thailand's abundant solar resources tradition it as a nation with significant potential for solar energy development, and the government has incentivized the use of solar power through tax incentives and financial support of projects. For example, the Electricity Generating Authority of Thailand (EGAT) is installing 16 floating solar farm projects that hold a capacity of 2,750MW, as reported by Bangkok Post.
        </p>
        <p className="mb-6">
          Thailand's geography is abundant with alternative resources for energy production, albeit at a lower capacity. Wind power projects are possible in coastal and highland regions and small and micro-hydropower system projects are possible at rural locations too. Besides this, as the majority of Thai people are employed in the agriculture sector, biomass and biogas are the most popular alternative energy as they provide a clean energy source and a sustainable method of managing agricultural waste. But by 2037, it is estimated that more than 10% of the alternative energy in Thailand will be dominated by solar energy.
        </p>
        
        <p className="mb-4">
          Thailand's shift to renewable energy will result in:
        </p>

        <div className="space-y-2 mb-10 text-gray-800">
          <p>1. Expand job market opportunities</p>
          <p>2. Create a positive environmental impact</p>
          <p>3. Social Development</p>
        </div>
      </>
    )
  },
  {
    id: 3,
    title: "Understanding the importance of circular economy in Thailand",
    image: blog3,
    tags: ["Circular Economy"],
    date: "11 October 2024",
    excerpt: "The \"Take-Make-Waste\" system normally endorsed by Thailand's linear economy has been reprimanded recently due to its role in promoting climatic hazards...",
    content: () => (
      <>
        <p className="mb-6">
          The "Take-Make-Waste" system normally endorsed by Thailand's linear economy has been reprimanded recently due to its role in promoting climatic hazards. Under this production process, resources that are not utilized during the manufacturing period are discarded as waste and even after the product is manufactured, waste is produced from the packaging and eventually, the end of a product's usable life signals its call to further become a waste.
        </p>
        <p className="mb-6">
          The Take-Make-Waste model has shown to be unsustainable as it has been exacerbating environmental and climate issues in today's expanding economy of over-consumption where high waste generation and depletion of natural resources have significantly been contributing to climate change, and accelerating the scarcity of resources.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-10 mb-4">The Circular Economy: A Sustainable Solution</h3>
        <p className="mb-6">
          The circular economy model presents a sustainable alternative to the linear model. It is a closed-loop system where materials and resources are maintained in the economy for as long as possible, while substantially reducing emissions. This circularity is fundamentally based on designing out waste, keeping materials in use, and regenerating natural systems, thereby simultaneously reducing pollution.
        </p>
        <p className="mb-6">
          The importance of a circular economy extends beyond environmental benefits. It unlocks a multitude of innovative opportunities that can boost profits for businesses. In Thailand, industries have taken an ambitious goal of integrating a circular economy as part of their business core strategies to adopt a circular economy. A report by Thailand's environment board found that within months, profits of industries which integrated this economic model saw a rise by 15%. Other major findings show that Thailand was able to target a drop of total plastic waste overall by 2 million tons, which is profound.
        </p>
        <p className="mb-6">
          While the circular economy model in Thailand has heavily caught on with populations and the government, there are major gaps facing its execution. One of the primary reasons behind the implementation gap could be the lack of investment flows. Resulting in high economic growth, it consequently results in high waste production and waste management gaps. In fact, in 2018, Thailand produced 27 million tons of household waste out of which only 20% of the total plastic waste was recycled by the government, highlighting the urgent need for action by the government.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mt-10 mb-4">Thailand's Circular Economy Initiatives 2024</h3>
        <p className="mb-6">
          Currently, the initiatives related to CE are mainly handled by private and public sectors through voluntary engagements. While the government of Thailand has shown a growing interest and dedication in resolving the linear economic model and transitioning towards a circular one, the agenda for the longer term generally relies on the Sufficiency Economy Philosophy (SEP) introduced by His Majesty King Bhumibol Adulyadej the Great back in 1974. The SEP framework has a core of moderation, reasonableness, and prudence to boost Thailand's goal of achieving the 2030 Agenda for Sustainable Development and the 20-year National Strategy Framework and Green National Economic and Development Plan.
        </p>
        <p className="mb-6">
          The Thai government's current stance on adopting CE is accelerated through its Bio-Circular-Green (BCG) economic model where it introduces initiatives on the level of:
        </p>

        <div className="space-y-4 mb-10 text-gray-700">
          <p>
            <span className="font-bold text-gray-900">1. Plastic Waste Management:</span> Thailand is one of the biggest polluters for plastic waste with an estimated amount of 2 million tons of plastic waste generated per year. The government is encouraging the use of biodegradable plastics and the promotion of recycling under the Extended Producer Responsibility (EPR) framework.
          </p>
          <p>
            <span className="font-bold text-gray-900">2. Food Waste Reduction:</span> The Thai government is promoting food waste management through better packaging and awareness campaigns.
          </p>
          <p>
            <span className="font-bold text-gray-900">3. Legislation and Policies:</span> The Thai government is creating a legal framework to promote a circular economy, like promoting green procurement and establishing certifications and proper standards for circular products.
          </p>
        </div>
      </>
    )
  }
];

export default function ArticleDetail() {
  // Capture the :id from the URL (e.g., /articles/3)
  const [match, params] = useRoute('/articles/:id');
  
  // Convert URL id to a number, default to article 3 if no match is found
  const articleId = match && params ? parseInt(params.id) : 3; 

  // Find the exact article data based on the ID
  const currentArticle = articlesData.find(a => a.id === articleId) || articlesData[2]; // Fallback to article 3

  // Filter out the current article to show the OTHERS in the sidebar and related section
  const otherBlogs = articlesData.filter(a => a.id !== currentArticle.id);
  const popularBlogs = otherBlogs.slice(0, 2); // Show top 2 others in sidebar
  const relatedBlogs = otherBlogs.slice(0, 1); // Show 1 other at the bottom

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-grow py-12">
        <div className="container px-4 sm:px-8 lg:px-12 max-w-7xl">
          
          {/* Breadcrumb */}
          <div className="mb-10 text-sm font-medium text-gray-500 flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-gray-900 cursor-pointer transition-colors">Home</Link>
            <ChevronRight size={14} className="text-gray-300" />
            <Link href="/articles" className="hover:text-gray-900 cursor-pointer transition-colors">Articles</Link>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-gray-900 font-bold">{currentArticle.title}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
             
             {/* LEFT COLUMN: ARTICLE CONTENT */}
             <div className="lg:col-span-8">
                
                {/* Article Header */}
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#1B5E20] mb-6 leading-tight">
                  {currentArticle.title}
                </h1>
                
                <div className="flex flex-wrap gap-2 mb-6">
                   {currentArticle.tags.map(tag => (
                     <span key={tag} className="inline-block border border-gray-300 rounded-full px-4 py-1 text-xs font-semibold text-gray-700 bg-white">
                       {tag}
                     </span>
                   ))}
                </div>
                
                <div className="text-gray-500 text-sm mb-8 font-medium">
                  {currentArticle.date}
                </div>

                <hr className="border-gray-200 mb-12" />

                {/* Main Image */}
                <div className="w-full h-auto md:h-[450px] overflow-hidden rounded-2xl mb-10 shadow-sm border border-gray-100">
                  <img 
                    src={currentArticle.image} 
                    alt={currentArticle.title} 
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Article Body (Rendered Dynamically!) */}
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                   {currentArticle.content()}
                </div>

                {/* Related Blogs Section */}
                <div className="mt-16 pt-12 border-t border-gray-100">
                   <h2 className="text-2xl font-bold text-[#1B5E20] mb-8">Related Blogs</h2>
                   
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {relatedBlogs.map((blog) => (
                        <Link 
                          key={blog.id}
                          href={`/articles/${blog.id}`} 
                          onClick={() => window.scrollTo(0, 0)} // Ensures page scrolls to top on click
                          className="group cursor-pointer flex flex-col"
                        >
                          <div className="rounded-2xl overflow-hidden mb-5 h-[220px] relative shrink-0 shadow-sm">
                             <img src={blog.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={blog.title} />
                          </div>
                          
                          <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-[#1B5E20] transition-colors leading-snug">
                             {blog.title}
                          </h3>
                          
                          <div className="flex flex-wrap gap-2 mb-4">
                             {blog.tags.map(tag => (
                               <span key={tag} className="border border-gray-300 rounded-full px-3 py-1 text-[11px] font-medium text-gray-600 bg-white">{tag}</span>
                             ))}
                          </div>
                          
                          <p className="text-gray-500 text-sm mb-4 line-clamp-3 leading-relaxed">
                             {blog.excerpt}
                          </p>
                          
                          <div className="text-gray-400 text-xs mb-4">
                            {blog.date}
                          </div>
                          
                          <span className="text-[#E2552B] font-bold text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
                            Read More <ArrowRight size={14} />
                          </span>
                        </Link>
                      ))}
                   </div>
                </div>

             </div>


             {/* RIGHT COLUMN: SIDEBAR */}
             <div className="lg:col-span-4">
                <div className="sticky top-24">
                   <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular Blogs</h2>
                   
                   <div className="flex flex-col gap-6">
                      {popularBlogs.map((blog) => (
                        <Link 
                          key={blog.id} 
                          href={`/articles/${blog.id}`} 
                          onClick={() => window.scrollTo(0, 0)} // Ensures page scrolls to top on click
                          className="group flex gap-4 cursor-pointer items-start"
                        >
                           {/* Sidebar Thumbnail */}
                           <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden shadow-sm">
                             <img src={blog.image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                           </div>
                           
                           {/* Sidebar Content */}
                           <div className="flex flex-col">
                             <h4 className="font-bold text-sm text-gray-900 group-hover:text-[#1B5E20] transition-colors mb-2 line-clamp-2 leading-tight">
                               {blog.title}
                             </h4>
                             
                             <div className="flex flex-wrap gap-1.5 mb-2">
                               {blog.tags.map(tag => (
                                 <span key={tag} className="border border-gray-200 rounded-full px-2 py-0.5 text-[10px] font-medium text-gray-500 bg-white">
                                   {tag}
                                 </span>
                               ))}
                             </div>
                             
                             <span className="text-xs text-gray-400">{blog.date}</span>
                           </div>

                        </Link>
                      ))}
                   </div>
                </div>
             </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}