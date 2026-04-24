import { useState, useRef } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ChevronRight, ChevronDown } from 'lucide-react';
import logo from '@/assets/images/logo.png'; 
import { useLocation } from 'wouter'; 

// --- PDF GENERATION IMPORTS ---
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import calculatorHero from '@/assets/images/about-hero.jpg'; 

export default function CarbonCalculator() {
     const [, setLocation] = useLocation();
  // --- STATE MANAGEMENT ---
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    'Direct Emission',
    'Indirect Emission',
    'Indirect Indirect Emission',
    'Download'
  ];

  const [formData, setFormData] = useState({
    carBrand: '',
    carModel: '',
    distance: '',
    distanceUnit: 'Kilometer',
    electricity: '',
    flight: '',
    waterSupply: '',
    wasteWater: '',
    orgName: '',
    email: ''
  });

  const receiptRef = useRef<HTMLDivElement>(null);

  // --- MOCK CALCULATION LOGIC ---
  const calcScope1 = () => formData.distance ? (parseFloat(formData.distance) * 0.251).toFixed(2) : '-';
  const calcScope2 = () => formData.electricity ? (parseFloat(formData.electricity) * 0.483).toFixed(2) : '-';
  const calcFlight = () => formData.flight ? (parseFloat(formData.flight) * 0.151).toFixed(2) : '-';
  const calcWater = () => formData.waterSupply ? (parseFloat(formData.waterSupply) * 0.149).toFixed(2) : '-';
  const calcWasteWater = () => formData.wasteWater ? (parseFloat(formData.wasteWater) * 0.272).toFixed(2) : '-';
  
  const calcTotal = () => {
    let total = 0;
    if (formData.distance) total += parseFloat(formData.distance) * 0.251;
    if (formData.electricity) total += parseFloat(formData.electricity) * 0.483;
    if (formData.flight) total += parseFloat(formData.flight) * 0.151;
    if (formData.waterSupply) total += parseFloat(formData.waterSupply) * 0.149;
    if (formData.wasteWater) total += parseFloat(formData.wasteWater) * 0.272;
    return total > 0 ? total.toFixed(2) : '-';
  };

  // --- NAVIGATION HANDLERS ---
  const handleNext = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };
  
  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSkip = () => {
    if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1);
  };

  // --- STRICT PDF DOWNLOAD LOGIC ---
  const handleDownloadPDF = async () => {
    const element = receiptRef.current;
    if (!element) return;

    try {
      // html2canvas settings tweaked for maximum fidelity and crispness
      const canvas = await html2canvas(element, { 
        scale: 3, // Higher scale for better text resolution
        useCORS: true,
        backgroundColor: '#ffffff', // Force pure white background
        logging: false, // Turn off console spam
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Calculate A4 dimensions
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      // We add a tiny bit of margin to the top so it's not flush against the edge
      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save('Carbon_Footprint_Receipt.pdf');
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("There was an issue generating your PDF. Please try again.");
    }
  };

  const isStepValid = () => {
    if (currentStep === 0) return formData.carBrand && formData.carModel && formData.distance;
    if (currentStep === 1) return formData.electricity !== '';
    if (currentStep === 2) return formData.flight !== '' || formData.waterSupply !== '' || formData.wasteWater !== '';
    if (currentStep === 3) return formData.orgName && formData.email;
    return true;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <h3 className="text-xl font-bold text-[#1B5E20] mb-8">Scope 1 : Direct Emission</h3>
            <div className="space-y-6 flex-grow">
              <div>
                <label className="block text-sm font-bold text-[#374151] mb-2">Enter Your Car Brand</label>
                <div className="relative">
                  <select
                    value={formData.carBrand}
                    onChange={(e) => setFormData({...formData, carBrand: e.target.value})}
                    className="w-full px-4 py-3 rounded-md border border-[#E5E7EB] appearance-none bg-white text-[#374151] focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] cursor-pointer"
                  >
                    <option value="" disabled>e.g. Toyota, Honda, Subaru</option>
                    <option value="Toyota">Toyota</option>
                    <option value="Honda">Honda</option>
                    <option value="Subaru">Subaru</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#374151] mb-2">Enter Your Car Model</label>
                <div className="relative">
                  <select
                    value={formData.carModel}
                    onChange={(e) => setFormData({...formData, carModel: e.target.value})}
                    className="w-full px-4 py-3 rounded-md border border-[#E5E7EB] appearance-none bg-white text-[#374151] focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] cursor-pointer"
                  >
                    <option value="" disabled>e.g. Civic, Loyale Wagon</option>
                    <option value="Civic">Civic</option>
                    <option value="Corolla">Corolla</option>
                    <option value="Loyale Wagon">Loyale Wagon</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-[#374151] mb-2">Enter Distance</label>
                  <input
                    type="number"
                    value={formData.distance}
                    onChange={(e) => setFormData({...formData, distance: e.target.value})}
                    placeholder="e.g. 100"
                    className="w-full px-4 py-3 rounded-md border border-[#E5E7EB] focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#374151] mb-2">Unit</label>
                  <div className="relative">
                    <select
                      value={formData.distanceUnit}
                      onChange={(e) => setFormData({...formData, distanceUnit: e.target.value})}
                      className="w-full px-4 py-3 rounded-md border border-[#E5E7EB] appearance-none bg-white text-[#111827] focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] cursor-pointer"
                    >
                      <option value="Kilometer">Kilometer</option>
                      <option value="Mile">Mile</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      case 1:
        return (
          <>
            <h3 className="text-xl font-bold text-[#1B5E20] mb-8">Scope 2 : Indirect Emission</h3>
            <div className="space-y-6 flex-grow">
              <div>
                <label className="block text-sm font-bold text-[#374151] mb-2">Enter Electricity (Kilowatt)</label>
                <input
                  type="number"
                  value={formData.electricity}
                  onChange={(e) => setFormData({...formData, electricity: e.target.value})}
                  placeholder="Kilowatt"
                  className="w-full px-4 py-3 rounded-md border border-[#E5E7EB] focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20]"
                />
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <h3 className="text-xl font-bold text-[#1B5E20] mb-8">Scope 3 : Indirect Indirect Emission</h3>
            <div className="space-y-6 flex-grow">
              <div>
                <label className="block text-sm font-bold text-[#374151] mb-2">Flight (Air Travel)</label>
                <input
                  type="number"
                  value={formData.flight}
                  onChange={(e) => setFormData({...formData, flight: e.target.value})}
                  placeholder="e.g. 100"
                  className="w-full px-4 py-3 rounded-md border border-[#E5E7EB] focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#374151] mb-2">Water Supply (Domestic Water / Drinking Water)</label>
                <input
                  type="number"
                  value={formData.waterSupply}
                  onChange={(e) => setFormData({...formData, waterSupply: e.target.value})}
                  placeholder="e.g. 100"
                  className="w-full px-4 py-3 rounded-md border border-[#E5E7EB] focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#374151] mb-2">Waste Water</label>
                <input
                  type="number"
                  value={formData.wasteWater}
                  onChange={(e) => setFormData({...formData, wasteWater: e.target.value})}
                  placeholder="e.g. 100"
                  className="w-full px-4 py-3 rounded-md border border-[#E5E7EB] focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20]"
                />
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <h3 className="text-xl font-bold text-[#1B5E20] mb-8">Scope 4 : Information Download</h3>
            <div className="space-y-6 flex-grow">
              <div>
                <label className="block text-sm font-bold text-[#374151] mb-2">Enter Organization / Individual Name</label>
                <input
                  type="text"
                  value={formData.orgName}
                  onChange={(e) => setFormData({...formData, orgName: e.target.value})}
                  placeholder="e.g. Recyglo"
                  className="w-full px-4 py-3 rounded-md border border-[#E5E7EB] focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20]"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#374151] mb-2">Enter Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  placeholder="e.g. IT@recyglo.com"
                  className="w-full px-4 py-3 rounded-md border border-[#E2552B] focus:ring-2 focus:ring-[#E2552B]/20 outline-none"
                />
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9F7]">
      
      <Header />

      {/* 1. HERO SECTION */}
      <section className="relative py-12 md:py-24 overflow-hidden bg-[#1B5E20]">
        <div 
          className="absolute inset-0 z-0 opacity-80"
          style={{
            backgroundImage: `url(${calculatorHero})`, 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        
        <div className="container px-4 sm:px-8 lg:px-12 relative z-10">
          <div className="max-w-xl bg-[#ffffffF2] backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-xl border border-[#ffffff33]">
             <h2 className="text-sm md:text-base font-bold mb-2 text-[#1F2937] uppercase tracking-wide">
                Making the World a Cleaner Place
             </h2>
             <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#1B5E20] leading-[1.1]">
                RecyGlo Resources & Knowledge Hub
             </h1>
             <p className="text-base text-[#4B5563] mb-8 leading-relaxed">
                Tailored waste management strategies to help businesses reduce, reuse, and recycle efficiently.
             </p>

             <div className="flex flex-col sm:flex-row gap-4">
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

      {/* 2. MAIN CALCULATOR SECTION */}
      <section className="py-12 md:py-20">
        <div className="container px-4 sm:px-8 lg:px-12 max-w-6xl">
          
          <div className="mb-8 text-sm font-medium text-[#6B7280] flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-[#111827] cursor-pointer transition-colors">Home</Link>
            <ChevronRight size={14} className="text-[#D1D5DB]" />
            <span className="text-[#111827] font-bold">Carbon Footprint Calculator</span>
          </div>

          <div className="mb-10">
             <h2 className="text-3xl md:text-4xl font-bold text-[#1B5E20] mb-3">
               Carbon Footprint Calculator
             </h2>
             <p className="text-[#4B5563]">
               Please complete each step of the business emissions calculator that is relevant to your business, using actual (or estimated) annual operational data.
             </p>
          </div>

          <div className="bg-[#ffffff] rounded-2xl shadow-lg border border-[#F3F4F6] p-6 md:p-10">
             
             {/* STEPPER UI */}
             <div className="max-w-3xl mx-auto mb-16">
               <div className="flex items-center justify-between relative px-4">
                 <div className="absolute left-10 right-10 top-3 h-[2px] bg-[#E5E7EB] z-0"></div>
                 {steps.map((step, index) => {
                   const isActive = index === currentStep;
                   const isCompleted = index < currentStep;
                   
                   return (
                     <div key={index} className="relative z-10 flex flex-col items-center bg-[#ffffff] px-2 w-24">
                       <div 
                         className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mb-3 transition-colors ${
                           isActive 
                             ? 'border-[#E2552B] bg-[#E2552B]' 
                             : isCompleted 
                               ? 'border-[#1B5E20] bg-[#1B5E20]' 
                               : 'border-[#9CA3AF] bg-[#ffffff]' 
                         }`}
                       >
                       </div>
                       <span className={`text-xs font-bold text-center leading-tight ${
                         isActive ? 'text-[#E2552B]' : 'text-[#6B7280]'
                       }`}>
                         {step.replace(' ', '\n')}
                       </span>
                     </div>
                   );
                 })}
               </div>
             </div>

             {/* TWO COLUMN LAYOUT */}
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* LEFT COLUMN: FORM */}
                <div className="lg:col-span-5 flex flex-col">
                   
                   {/* Dynamic Form Content */}
                   {renderStepContent()}

                   {/* Action Buttons */}
                   <div className="grid grid-cols-2 gap-4 mt-8 pt-4">
                      {currentStep === 0 ? (
                        <Button 
                          variant="outline" 
                          onClick={handleSkip}
                          className="w-full py-6 text-[#374151] font-bold border-[#D1D5DB] hover:bg-[#F9FAFB] rounded-md"
                        >
                          Skip
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          onClick={handleBack}
                          className="w-full py-6 text-[#1B5E20] font-bold border-[#1B5E20] hover:bg-[#1B5E20]/5 rounded-md"
                        >
                          Back
                        </Button>
                      )}

                      {currentStep === 3 ? (
                        <Button 
                          onClick={handleDownloadPDF}
                          disabled={!isStepValid()}
                          className="w-full py-6 bg-[#C4381C] hover:bg-[#A32A12] text-[#ffffff] font-bold disabled:opacity-50 rounded-md shadow-md transition-colors"
                        >
                          Download
                        </Button>
                      ) : (
                        <Button 
                          onClick={handleNext}
                          disabled={!isStepValid()}
                          className="w-full py-6 bg-[#C4381C] hover:bg-[#A32A12] text-[#ffffff] font-bold disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors"
                        >
                          {currentStep === 0 ? 'Calculate and Next' : 'Next'}
                        </Button>
                      )}
                   </div>
                </div>

                {/* RIGHT COLUMN: RECEIPT */}
                <div className="lg:col-span-7">
                   {/* We wrap this in a div with receiptRef so ONLY this area is converted to PDF */}
                   <div 
                     ref={receiptRef}
                     className="bg-[#ffffff] shadow-[0_0_20px_rgba(0,0,0,0.08)] rounded-xl p-8 h-full flex flex-col"
                   >
                      
                      {/* Receipt Header */}
                      <div className="flex flex-col sm:flex-row items-start gap-6 mb-8 pb-6 border-b border-[#E5E7EB]">
                         <img src={logo} alt="RecyGlo Logo" className="h-8 object-contain shrink-0" />
                         <div>
                            <h3 className="text-2xl font-bold text-[#1B5E20] mb-2">Carbon Footprint Receipt</h3>
                            <p className="text-xs text-[#6B7280] leading-relaxed">
                              GHG Protocol - powered by RecyGlo<br/>
                              www.recyglo.com The<br/>
                              Offices At Central World, 999/9 Rama 1 Rd, Kwaeng Pathum Wan, Pathum Wan, Bangkok 10330
                            </p>
                         </div>
                      </div>

                      {/* User Info */}
                      <div className="space-y-3 mb-8 text-sm">
                         <div className="flex gap-2 text-[#4B5563]">
                            <span className="min-w-[150px]">Name (Org / Individual) :</span>
                            <span className="font-bold text-[#1B5E20]">{formData.orgName || '-'}</span>
                         </div>
                         <div className="flex gap-2 text-[#4B5563]">
                            <span className="min-w-[150px]">Email Address :</span>
                            <span className="font-bold text-[#1B5E20]">{formData.email || '-'}</span>
                         </div>
                      </div>

                      {/* Tables Container */}
                      <div className="space-y-8 flex-grow">
                         
                         {/* Scope 1 Table */}
                         <div>
                            <h4 className="font-bold text-[#1B5E20] text-base mb-3">Scope 1 : Direct Emission</h4>
                            <div className="border border-[#E5E7EB] rounded-md overflow-hidden">
                               <table className="w-full text-sm text-center">
                                  <thead className="text-[#4B5563] font-medium">
                                     <tr>
                                        <th className="p-3 border-b border-[#E5E7EB] font-bold">Car brand</th>
                                        <th className="p-3 border-b border-l border-[#E5E7EB] font-bold">Car model</th>
                                        <th className="p-3 border-b border-l border-[#E5E7EB] font-bold">Distance</th>
                                        <th className="p-3 border-b border-l border-[#E5E7EB] font-bold">Estimate CO2 (Kg)</th>
                                     </tr>
                                  </thead>
                                  <tbody>
                                     <tr>
                                        <td className="p-3 text-[#1B5E20]">{formData.carBrand || '-'}</td>
                                        <td className="p-3 text-[#1B5E20] border-l border-[#E5E7EB]">{formData.carModel || '-'}</td>
                                        <td className="p-3 text-[#1B5E20] border-l border-[#E5E7EB]">{formData.distance ? `${formData.distance}.00 km` : '-'}</td>
                                        <td className="p-3 text-[#1B5E20] border-l border-[#E5E7EB]">{calcScope1()}</td>
                                     </tr>
                                  </tbody>
                               </table>
                            </div>
                         </div>

                         {/* Scope 2 Table */}
                         <div>
                            <h4 className="font-bold text-[#1B5E20] text-base mb-3">Scope 2 : Indirect Emission</h4>
                            <div className="border border-[#E5E7EB] rounded-md overflow-hidden">
                               <table className="w-full text-sm text-center">
                                  <thead className="text-[#4B5563] font-medium">
                                     <tr>
                                        <th className="p-3 border-b border-[#E5E7EB] font-bold w-1/3">Item</th>
                                        <th className="p-3 border-b border-l border-[#E5E7EB] font-bold w-1/3">Unit Measured</th>
                                        <th className="p-3 border-b border-l border-[#E5E7EB] font-bold w-1/3">Estimate CO2 (Kg)</th>
                                     </tr>
                                  </thead>
                                  <tbody>
                                     <tr>
                                        <td className="p-3 text-[#1B5E20]">Electric Usage</td>
                                        <td className="p-3 text-[#1B5E20] border-l border-[#E5E7EB]">{formData.electricity ? `${formData.electricity}.00` : '-'}</td>
                                        <td className="p-3 text-[#1B5E20] border-l border-[#E5E7EB]">{calcScope2()}</td>
                                     </tr>
                                  </tbody>
                               </table>
                            </div>
                         </div>

                         {/* Scope 3 Table */}
                         <div>
                            <h4 className="font-bold text-[#1B5E20] text-base mb-3">Scope 3 : Indirect Indirect Emission</h4>
                            <div className="border border-[#E5E7EB] rounded-md overflow-hidden mb-6">
                               <table className="w-full text-sm text-center">
                                  <thead className="text-[#4B5563] font-medium">
                                     <tr>
                                        <th className="p-3 border-b border-[#E5E7EB] font-bold w-1/3">Item</th>
                                        <th className="p-3 border-b border-l border-[#E5E7EB] font-bold w-1/3">Unit Measured</th>
                                        <th className="p-3 border-b border-l border-[#E5E7EB] font-bold w-1/3">Estimate CO2 (Kg)</th>
                                     </tr>
                                  </thead>
                                  <tbody>
                                     <tr>
                                        <td className="p-3 text-[#1B5E20] border-b border-[#E5E7EB]">Flight (Air Travel)</td>
                                        <td className="p-3 text-[#1B5E20] border-l border-b border-[#E5E7EB]">{formData.flight ? `${formData.flight}.00` : '-'}</td>
                                        <td className="p-3 text-[#1B5E20] border-l border-b border-[#E5E7EB]">{calcFlight()}</td>
                                     </tr>
                                     <tr>
                                        <td className="p-3 text-[#1B5E20] border-b border-[#E5E7EB]">Water Supply</td>
                                        <td className="p-3 text-[#1B5E20] border-l border-b border-[#E5E7EB]">{formData.waterSupply ? `${formData.waterSupply}.00` : '-'}</td>
                                        <td className="p-3 text-[#1B5E20] border-l border-b border-[#E5E7EB]">{calcWater()}</td>
                                     </tr>
                                     <tr>
                                        <td className="p-3 text-[#1B5E20]">Waste Water</td>
                                        <td className="p-3 text-[#1B5E20] border-l border-[#E5E7EB]">{formData.wasteWater ? `${formData.wasteWater}.00` : '-'}</td>
                                        <td className="p-3 text-[#1B5E20] border-l border-[#E5E7EB]">{calcWasteWater()}</td>
                                     </tr>
                                  </tbody>
                               </table>
                            </div>

                            {/* Total Box */}
                            <div className="flex justify-end pt-4 pb-2">
                               <div className="text-right">
                                  <span className="text-[#6B7280] text-sm mr-4">Total CO2 Emission Estimate :</span>
                                  <span className="text-[#1B5E20] font-bold text-lg">{calcTotal()} Kg</span>
                               </div>
                            </div>
                         </div>

                      </div>
                   </div>
                </div>

             </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}