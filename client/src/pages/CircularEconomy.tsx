import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { Calculator, ChevronRight } from 'lucide-react';

// --- ASSET IMPORTS ---
// Replace these with the actual images you upload to your assets folder
import ceHero from '@/assets/images/about-hero.jpg'; // Placeholder for hero
import waterImg from '@/assets/images/cir1.png'; // Placeholder for Water Usage
import biomassImg from '@/assets/images/cir2.png'; // Placeholder for Organic Biomass
import fertilizerImg from '@/assets/images/cir3.png'; // Placeholder for Organic Fertilizer
import plasticImg from '@/assets/images/cir4.png'; // Placeholder for Plastic
import paperImg from '@/assets/images/cir5.png'; // Placeholder for Paper
import metalImg from '@/assets/images/cir6.png'; // Placeholder for Metal
import glassImg from '@/assets/images/cir7.png'; // Placeholder for Glass
import ewasteImg from '@/assets/images/cir8.png'; // Placeholder for E-waste
import oilImg from '@/assets/images/w1.webp'; // Placeholder for Waste Oils

export default function CircularEconomy() {
  
  const materials = [
    {
      title: "Water Usage",
      image: waterImg,
      desc: "Wastewater is carefully treated and filtered before being released back into the environment or reused for industrial purposes. Implementing closed-loop water systems helps businesses significantly reduce their freshwater consumption and minimize ecological impact."
    },
    {
      title: "Organic Biomass",
      image: biomassImg,
      desc: "Food waste and other organic materials are collected and processed efficiently. Instead of ending up in landfills where they produce harmful methane gas, these materials are repurposed to generate renewable energy or create valuable agricultural byproducts."
    },
    {
      title: "Organic Fertilizer",
      image: fertilizerImg,
      desc: "Through advanced commercial composting techniques, organic waste is converted into nutrient-rich, high-quality fertilizer. This organic compost is then supplied to local agricultural sectors, enriching soil health and reducing the reliance on chemical fertilizers."
    },
    {
      title: "Plastic Materials",
      image: plasticImg,
      desc: "Various types of plastics are carefully sorted, cleaned, and shredded into reusable pellets. These secondary raw materials are then reintroduced into the manufacturing supply chain to produce new plastic goods, drastically reducing plastic pollution."
    },
    {
      title: "Paper & Cardboard Materials",
      image: paperImg,
      desc: "Collected paper and cardboard waste are processed, repulped, and recycled into new packaging materials and paper products. This continuous recycling loop preserves forests and saves massive amounts of water and energy compared to virgin paper production."
    },
    {
      title: "Aluminum (Tin) Cans / Metal Materials",
      image: metalImg,
      desc: "Metals are highly valuable in the circular economy because they can be melted down and endlessly recycled without losing their structural quality. We ensure all scrap metals and cans are diverted from landfills to metal foundries."
    },
    {
      title: "Glass Materials",
      image: glassImg,
      desc: "Glass is sorted by color, crushed into cullet, and melted at high temperatures to form new bottles and jars. Recycling glass saves raw materials like sand and significantly reduces the energy required for manufacturing."
    },
    {
      title: "Electronic and Electrical Waste (E-waste)",
      image: ewasteImg,
      desc: "E-waste is safely and meticulously dismantled to recover valuable precious metals like gold, silver, and copper, while hazardous components like batteries and heavy metals are securely and responsibly disposed of to prevent soil and water contamination."
    },
    {
      title: "Waste Oils (Engine Oil)",
      image: oilImg,
      desc: "Used engine oils and industrial lubricants are collected, re-refined, and purified. This specialized recycling process removes impurities so the oil can be safely reused, preventing toxic dumping and reducing the need for crude oil extraction."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      {/* 1. HERO SECTION */}
      <section className="relative py-12 md:py-24 overflow-hidden bg-[#1B5E20]">
        <div 
          className="absolute inset-0 z-0 opacity-80"
          style={{
            backgroundImage: `url(${ceHero})`, 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="container px-4 sm:px-8 lg:px-12 relative z-10">
          <div className="max-w-xl bg-white/95 backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-xl border border-white/20">
             <h2 className="text-sm md:text-base font-bold mb-2 text-gray-800 uppercase tracking-wide">
                Working for world a cleaner place
             </h2>
             <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#1B5E20] leading-[1.1]">
                Circular Economy
             </h1>
             <p className="text-base text-gray-600 mb-8 leading-relaxed">
                RecyGlo promotes the transition from linear to circular models by helping businesses recover, recycle, and repurpose materials. We guide organizations in closing the loop, minimizing waste, and creating sustainable value chains.
             </p>

             <div className="flex flex-col sm:flex-row gap-4">
                <Button className="bg-white text-gray-900 border border-gray-200 hover:bg-gray-50 font-bold px-6 py-6 rounded-md shadow-sm flex items-center gap-2 transition-all">
                  <Calculator size={18} className="text-gray-500" />
                  Calculate Carbon Footprint
                </Button>
                <Button className="bg-[#E2552B] text-white hover:bg-[#E2552B]/90 font-bold px-8 py-6 rounded-md shadow-md transition-all">
                  Our Solutions
                </Button>
             </div>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT SECTION */}
      <section className="py-12 md:py-20">
        <div className="container px-4 sm:px-8 lg:px-12 max-w-4xl">
          
          {/* Breadcrumb */}
          <div className="mb-10 text-sm font-medium text-gray-500 flex items-center gap-2">
            <Link href="/" className="hover:text-gray-900 cursor-pointer transition-colors">Home</Link>
            <ChevronRight size={14} className="text-gray-300" />
            <Link href="/solutions" className="hover:text-gray-900 cursor-pointer transition-colors">Our Solutions</Link>
            <ChevronRight size={14} className="text-gray-300" />
            <span className="text-gray-900 font-bold">Circular Economy</span>
          </div>

          {/* Section Header */}
          <div className="mb-12">
             <span className="text-sm font-bold text-[#E2552B] uppercase tracking-wider mb-2 block">Our Solution</span>
             <h2 className="text-4xl font-bold text-[#1B5E20] mb-6">Circular Economy</h2>
             <h3 className="text-2xl font-bold text-gray-900 mb-4">Waste Material Types</h3>
             <p className="text-gray-600 text-lg leading-relaxed">
               At RecyGlo, we specialize in handling a wide variety of waste streams to ensure they are properly diverted from landfills and reintroduced into the manufacturing cycle. Here are the primary material types we process to support your circular economy goals:
             </p>
          </div>

          {/* Material Types List */}
          <div className="space-y-16">
             {materials.map((item, index) => (
                <div key={index} className="flex flex-col">
                   <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                     {item.title}
                   </h3>
                   
                   <div className="w-full h-auto md:h-[400px] overflow-hidden rounded-2xl mb-6 shadow-sm border border-gray-100">
                     <img 
                       src={item.image} 
                       alt={item.title} 
                       className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                     />
                   </div>
                   
                   <p className="text-gray-600 leading-relaxed text-[15px] md:text-base">
                     {item.desc}
                   </p>

                   {/* Separator line (hidden on the very last item) */}
                   {index !== materials.length - 1 && (
                     <hr className="mt-16 border-gray-200" />
                   )}
                </div>
             ))}
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}