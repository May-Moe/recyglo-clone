import { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';
import { ChevronRight, ChevronDown, Loader2 } from 'lucide-react';
import logo from '@/assets/images/logo.png'; 
import { useForm } from 'react-hook-form';

// --- PDF GENERATION IMPORTS ---
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import calculatorHero from '@/assets/images/about-hero.jpg'; 

// --- TYPES ---
type Car = { id: string; name: string };
type Model = { id: string; name: string };

type CarbonFormType = {
  carBrand: Car;
  carModel: Model;
  distance: number | '';
  unit: string;
  directEmissionResult: number;
  electricityUnit: number | '';
  IndirectEmissionResult: number;
  flightUnit: number | '';
  waterUnit: number | '';
  wasteWaterUnit: number | '';
  flightEmissionResult: number;
  waterEmissionResult: number;
  wasteWaterEmissionResult: number;
  organizationName: string;
  email: string;
};

const defaultValues: CarbonFormType = {
  carBrand: { id: '', name: '' },
  carModel: { id: '', name: '' },
  distance: '',
  unit: 'km',
  directEmissionResult: 0,
  electricityUnit: '',
  IndirectEmissionResult: 0,
  flightUnit: '',
  waterUnit: '',
  wasteWaterUnit: '',
  flightEmissionResult: 0,
  waterEmissionResult: 0,
  wasteWaterEmissionResult: 0,
  organizationName: '',
  email: '',
};

export default function CarbonCalculator() {
  const token = '2ZwRwtGYYh8IjI5OZhbqyw'; // Your API token
  const receiptRef = useRef<HTMLDivElement>(null);
  
  // --- STATE ---
  const [currentStep, setCurrentStep] = useState(0);
  const [isCalculating, setIsCalculating] = useState(false);
  const [carMakes, setCarMakes] = useState<Car[]>([]);
  const [carModels, setCarModels] = useState<Model[]>([]);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  const steps = ['Direct Emission', 'Indirect Emission', 'Indirect Indirect Emission', 'Download'];

  const { getValues, setValue, watch, register } = useForm<CarbonFormType>({
    defaultValues: defaultValues,
  });

  const formValues = watch();

  // --- 1. FETCH CAR BRANDS ON LOAD ---
  useEffect(() => {
    const fetchMakes = async () => {
      try {
        const response = await fetch('https://www.carboninterface.com/api/v1/vehicle_makes', {
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        });
        const data = await response.json();
        const makes = data.map((car: any) => ({ id: car.data.id, name: car.data.attributes.name }));
        
        // Sort alphabetically for a better UI experience
        makes.sort((a: Car, b: Car) => a.name.localeCompare(b.name));
        setCarMakes(makes);
      } catch (err) {
        console.error("Failed to fetch car makes", err);
      }
    };
    fetchMakes();
  }, []);

  // --- 2. FETCH MODELS WHEN BRAND CHANGES ---
  const handleBrandChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedMakeId = e.target.value;
    const selectedMakeName = e.target.options[e.target.selectedIndex].text;
    
    setValue('carBrand', { id: selectedMakeId, name: selectedMakeName });
    setValue('carModel', { id: '', name: '' }); // Reset model when brand changes
    
    setIsLoadingModels(true);
    try {
      const response = await fetch(`https://www.carboninterface.com/api/v1/vehicle_makes/${selectedMakeId}/vehicle_models`, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      });
      const data = await response.json();
      
      // Remove duplicates
      const uniqueModels: Model[] = [];
      const seenNames = new Set();
      data.forEach((model: any) => {
        const name = model.data.attributes.name;
        if (!seenNames.has(name)) {
          seenNames.add(name);
          uniqueModels.push({ id: model.data.id, name: name });
        }
      });
      
      uniqueModels.sort((a, b) => a.name.localeCompare(b.name));
      setCarModels(uniqueModels);
    } catch (err) {
      console.error("Failed to fetch models", err);
    } finally {
      setIsLoadingModels(false);
    }
  };

  // --- 3. API CALCULATION FOR STEP 1 ---
  const handleSubmitForm1 = async () => {
    setIsCalculating(true);
    const payload = {
      type: 'vehicle',
      distance_unit: getValues('unit'),
      distance_value: getValues('distance'),
      vehicle_model_id: getValues('carModel').id,
    };

    try {
      const response = await fetch('https://www.carboninterface.com/api/v1/estimates', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      
      if (result.data) {
        setValue('directEmissionResult', result.data.attributes.carbon_kg);
      }
      setCurrentStep(currentStep + 1);
    } catch (err) {
      console.error("Calculation failed", err);
      setCurrentStep(currentStep + 1); // Proceed anyway if API fails
    } finally {
      setIsCalculating(false);
    }
  };

  // --- MATH FOR OTHER SCOPES (Based on your backend files) ---
  const calcScope2 = () => formValues.electricityUnit ? (Number(formValues.electricityUnit) * 0.483) : 0;
  const calcFlight = () => formValues.flightUnit ? (Number(formValues.flightUnit) * 0.15102) : 0;
  const calcWater = () => formValues.waterUnit ? (Number(formValues.waterUnit) * 0.149) : 0;
  const calcWasteWater = () => formValues.wasteWaterUnit ? (Number(formValues.wasteWaterUnit) * 0.272) : 0;
  
  const calcTotal = () => {
    const total = (formValues.directEmissionResult || 0) + calcScope2() + calcFlight() + calcWater() + calcWasteWater();
    return total > 0 ? total.toFixed(2) : '-';
  };

  // --- NAVIGATION ---
  const handleNext = () => {
    if (currentStep === 0) {
      handleSubmitForm1();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };
  const handleBack = () => { if (currentStep > 0) setCurrentStep(currentStep - 1); };
  const handleSkip = () => { if (currentStep < steps.length - 1) setCurrentStep(currentStep + 1); };

  // --- PDF DOWNLOAD ---
  const handleDownloadPDF = async () => {
    // Hide buttons during screenshot capture
    document.querySelectorAll('.download-hide').forEach((el) => el.classList.add('hidden'));
    
    const element = receiptRef.current;
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 10, pdfWidth, pdfHeight);
      pdf.save('Carbon_Footprint_Receipt.pdf');
    } catch (error) {
      console.error("PDF generation error", error);
    } finally {
      // Restore buttons
      document.querySelectorAll('.download-hide').forEach((el) => el.classList.remove('hidden'));
    }
  };

  const isStepValid = () => {
    if (currentStep === 0) return formValues.carBrand.id && formValues.carModel.id && formValues.distance;
    if (currentStep === 1) return formValues.electricityUnit !== '';
    if (currentStep === 2) return formValues.flightUnit !== '' || formValues.waterUnit !== '' || formValues.wasteWaterUnit !== '';
    if (currentStep === 3) return formValues.organizationName && formValues.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email);
    return true;
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9F7]">
      <Header />

      <section className="relative py-12 md:py-24 overflow-hidden bg-[#1B5E20]">
        <div className="absolute inset-0 z-0 opacity-80" style={{ backgroundImage: `url(${calculatorHero})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="container px-4 sm:px-8 lg:px-12 relative z-10">
          <div className="max-w-xl bg-[#ffffffF2] backdrop-blur-sm p-8 md:p-10 rounded-2xl shadow-xl border border-[#ffffff33]">
             <h2 className="text-sm md:text-base font-bold mb-2 text-[#1F2937] uppercase tracking-wide">Making the World a Cleaner Place</h2>
             <h1 className="text-5xl md:text-6xl font-bold mb-6 text-[#1B5E20] leading-[1.1]">RecyGlo Resources & Knowledge Hub</h1>
             <p className="text-base text-[#4B5563] mb-8 leading-relaxed">Tailored waste management strategies to help businesses reduce, reuse, and recycle efficiently.</p>
             <Button className="bg-[#ffffff] text-[#111827] border border-[#E5E7EB] hover:bg-[#F9FAFB] font-bold px-8 py-6 rounded-md shadow-sm transition-all">Our Solutions</Button>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="container px-4 sm:px-8 lg:px-12 max-w-6xl">
          
          <div className="mb-8 text-sm font-medium text-[#6B7280] flex items-center gap-2 flex-wrap">
            <Link href="/" className="hover:text-[#111827] cursor-pointer transition-colors">Home</Link>
            <ChevronRight size={14} className="text-[#D1D5DB]" />
            <span className="text-[#111827] font-bold">Carbon Footprint Calculator</span>
          </div>

          <div className="mb-10">
             <h2 className="text-3xl md:text-4xl font-bold text-[#1B5E20] mb-3">Carbon Footprint Calculator</h2>
             <p className="text-[#4B5563]">Please complete each step of the business emissions calculator that is relevant to your business, using actual (or estimated) annual operational data.</p>
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
                       <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mb-3 transition-colors ${
                           isActive ? 'border-[#E2552B] bg-[#E2552B]' : isCompleted ? 'border-[#1B5E20] bg-[#1B5E20]' : 'border-[#9CA3AF] bg-[#ffffff]' 
                         }`} />
                       <span className={`text-xs font-bold text-center leading-tight ${isActive ? 'text-[#E2552B]' : 'text-[#6B7280]'}`}>{step.replace(' ', '\n')}</span>
                     </div>
                   );
                 })}
               </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* LEFT COLUMN: FORM */}
                <div className="lg:col-span-5 flex flex-col">
                   
                   {currentStep === 0 && (
                      <>
                        <h3 className="text-xl font-bold text-[#1B5E20] mb-8">Scope 1 : Direct Emission</h3>
                        <div className="space-y-6 flex-grow">
                          <div>
                            <label className="block text-sm font-bold text-[#374151] mb-2">Enter Your Car Brand</label>
                            <div className="relative">
                              <select value={formValues.carBrand.id} onChange={handleBrandChange} className="w-full px-4 py-3 rounded-md border border-[#E5E7EB] appearance-none bg-white text-[#374151] focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] cursor-pointer">
                                <option value="" disabled>Select Car Brand</option>
                                {carMakes.map(make => <option key={make.id} value={make.id}>{make.name}</option>)}
                              </select>
                              <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-[#374151] mb-2">Enter Your Car Model</label>
                            <div className="relative">
                              <select 
                                value={formValues.carModel.id} 
                                onChange={(e) => setValue('carModel', { id: e.target.value, name: e.target.options[e.target.selectedIndex].text })}
                                disabled={!formValues.carBrand.id || isLoadingModels}
                                className="w-full px-4 py-3 rounded-md border border-[#E5E7EB] appearance-none bg-white text-[#374151] focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] cursor-pointer disabled:bg-gray-50"
                              >
                                <option value="" disabled>{isLoadingModels ? 'Loading models...' : 'Select Car Model'}</option>
                                {carModels.map(model => <option key={model.id} value={model.id}>{model.name}</option>)}
                              </select>
                              {isLoadingModels ? <Loader2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] animate-spin" /> : <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-bold text-[#374151] mb-2">Enter Distance</label>
                              <input type="number" {...register("distance")} placeholder="e.g. 100" className="w-full px-4 py-3 rounded-md border border-[#E5E7EB] focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20]" />
                            </div>
                            <div>
                              <label className="block text-sm font-bold text-[#374151] mb-2">Unit</label>
                              <div className="relative">
                                <select {...register("unit")} className="w-full px-4 py-3 rounded-md border border-[#E5E7EB] appearance-none bg-white text-[#111827] focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20] cursor-pointer">
                                  <option value="km">Kilometer</option>
                                  <option value="mi">Mile</option>
                                </select>
                                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9CA3AF] pointer-events-none" />
                              </div>
                            </div>
                          </div>
                        </div>
                      </>
                   )}

                   {currentStep === 1 && (
                      <>
                        <h3 className="text-xl font-bold text-[#1B5E20] mb-8">Scope 2 : Indirect Emission</h3>
                        <div className="space-y-6 flex-grow">
                          <div>
                            <label className="block text-sm font-bold text-[#374151] mb-2">Enter Electricity (Kilowatt)</label>
                            <input type="number" {...register("electricityUnit")} placeholder="Kilowatt" className="w-full px-4 py-3 rounded-md border border-[#E5E7EB] focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20]" />
                          </div>
                        </div>
                      </>
                   )}

                   {currentStep === 2 && (
                      <>
                        <h3 className="text-xl font-bold text-[#1B5E20] mb-8">Scope 3 : Indirect Indirect Emission</h3>
                        <div className="space-y-6 flex-grow">
                          <div>
                            <label className="block text-sm font-bold text-[#374151] mb-2">Flight (Air Travel)</label>
                            <input type="number" {...register("flightUnit")} placeholder="Kilometer" className="w-full px-4 py-3 rounded-md border border-[#E5E7EB] focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20]" />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-[#374151] mb-2">Water Supply</label>
                            <input type="number" {...register("waterUnit")} placeholder="Liter" className="w-full px-4 py-3 rounded-md border border-[#E5E7EB] focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20]" />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-[#374151] mb-2">Waste Water</label>
                            <input type="number" {...register("wasteWaterUnit")} placeholder="Liter" className="w-full px-4 py-3 rounded-md border border-[#E5E7EB] focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20]" />
                          </div>
                        </div>
                      </>
                   )}

                   {currentStep === 3 && (
                      <>
                        <h3 className="text-xl font-bold text-[#1B5E20] mb-8">Scope 4 : Information Download</h3>
                        <div className="space-y-6 flex-grow">
                          <div>
                            <label className="block text-sm font-bold text-[#374151] mb-2">Enter Organization / Individual Name</label>
                            <input type="text" {...register("organizationName")} placeholder="Name or Company Name" className="w-full px-4 py-3 rounded-md border border-[#E5E7EB] focus:ring-2 focus:ring-[#1B5E20]/20 focus:border-[#1B5E20]" />
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-[#374151] mb-2">Enter Email Address</label>
                            <input type="email" {...register("email")} placeholder="RecyGlo@RecyGlo.com" className="w-full px-4 py-3 rounded-md border border-[#E2552B] focus:ring-2 focus:ring-[#E2552B]/20 outline-none" />
                          </div>
                        </div>
                      </>
                   )}

                   {/* Action Buttons */}
                   <div className="grid grid-cols-2 gap-4 mt-8 pt-4">
                      {currentStep === 0 ? (
                        <Button variant="outline" onClick={handleSkip} className="w-full py-6 text-[#374151] font-bold border-[#D1D5DB] hover:bg-[#F9FAFB] rounded-md">Skip</Button>
                      ) : (
                        <Button variant="outline" onClick={handleBack} className="w-full py-6 text-[#1B5E20] font-bold border-[#1B5E20] hover:bg-[#1B5E20]/5 rounded-md">Back</Button>
                      )}

                      {currentStep === 3 ? (
                        <Button onClick={handleDownloadPDF} disabled={!isStepValid()} className="w-full py-6 bg-[#C4381C] hover:bg-[#A32A12] text-[#ffffff] font-bold disabled:opacity-50 rounded-md shadow-md transition-colors">Download</Button>
                      ) : (
                        <Button onClick={handleNext} disabled={!isStepValid() || isCalculating} className="w-full py-6 bg-[#C4381C] hover:bg-[#A32A12] text-[#ffffff] font-bold disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-colors">
                          {isCalculating ? <Loader2 className="animate-spin mr-2" size={20} /> : ''}
                          {currentStep === 0 ? 'Calculate and Next' : 'Next'}
                        </Button>
                      )}
                   </div>
                </div>

                {/* RIGHT COLUMN: RECEIPT */}
                <div className="lg:col-span-7">
                   <div ref={receiptRef} className="bg-[#ffffff] shadow-[0_0_20px_rgba(0,0,0,0.08)] rounded-xl p-8 h-full flex flex-col">
                      
                      {/* Receipt Header */}
                      <div className="flex flex-col sm:flex-row items-start gap-6 mb-8 pb-6 border-b border-[#E5E7EB]">
                         <img src={logo} alt="RecyGlo Logo" className="h-8 object-contain shrink-0" />
                         <div>
                            <h3 className="text-2xl font-bold text-[#1B5E20] mb-2">Carbon Footprint Receipt</h3>
                            <p className="text-xs text-[#6B7280] leading-relaxed">GHG Protocol - powered by RecyGlo<br/>www.recyglo.com The<br/>Offices At Central World, 999/9 Rama 1 Rd, Kwaeng Pathum Wan, Pathum Wan, Bangkok 10330</p>
                         </div>
                      </div>

                      {/* User Info */}
                      <div className="space-y-3 mb-8 text-sm">
                         <div className="flex gap-2 text-[#4B5563]">
                            <span className="min-w-[150px]">Name (Org / Individual) :</span>
                            <span className="font-bold text-[#1B5E20]">{formValues.organizationName || '-'}</span>
                         </div>
                         <div className="flex gap-2 text-[#4B5563]">
                            <span className="min-w-[150px]">Email Address :</span>
                            <span className="font-bold text-[#1B5E20]">{formValues.email || '-'}</span>
                         </div>
                      </div>

                      {/* Tables Container */}
                      <div className="space-y-8 flex-grow">
                         {/* Scope 1 */}
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
                                        <td className="p-3 text-[#1B5E20]">{formValues.carBrand.name || '-'}</td>
                                        <td className="p-3 text-[#1B5E20] border-l border-[#E5E7EB]">{formValues.carModel.name || '-'}</td>
                                        <td className="p-3 text-[#1B5E20] border-l border-[#E5E7EB]">{formValues.distance ? `${formValues.distance}.00 ${formValues.unit}` : '-'}</td>
                                        <td className="p-3 text-[#1B5E20] border-l border-[#E5E7EB]">{formValues.directEmissionResult ? formValues.directEmissionResult.toFixed(2) : '-'}</td>
                                     </tr>
                                  </tbody>
                               </table>
                            </div>
                         </div>

                         {/* Scope 2 */}
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
                                        <td className="p-3 text-[#1B5E20] border-l border-[#E5E7EB]">{formValues.electricityUnit ? `${formValues.electricityUnit}.00` : '-'}</td>
                                        <td className="p-3 text-[#1B5E20] border-l border-[#E5E7EB]">{calcScope2() || '-'}</td>
                                     </tr>
                                  </tbody>
                               </table>
                            </div>
                         </div>

                         {/* Scope 3 */}
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
                                        <td className="p-3 text-[#1B5E20] border-l border-b border-[#E5E7EB]">{formValues.flightUnit ? `${formValues.flightUnit}.00` : '-'}</td>
                                        <td className="p-3 text-[#1B5E20] border-l border-b border-[#E5E7EB]">{calcFlight() || '-'}</td>
                                     </tr>
                                     <tr>
                                        <td className="p-3 text-[#1B5E20] border-b border-[#E5E7EB]">Water Supply</td>
                                        <td className="p-3 text-[#1B5E20] border-l border-b border-[#E5E7EB]">{formValues.waterUnit ? `${formValues.waterUnit}.00` : '-'}</td>
                                        <td className="p-3 text-[#1B5E20] border-l border-b border-[#E5E7EB]">{calcWater() || '-'}</td>
                                     </tr>
                                     <tr>
                                        <td className="p-3 text-[#1B5E20]">Waste Water</td>
                                        <td className="p-3 text-[#1B5E20] border-l border-[#E5E7EB]">{formValues.wasteWaterUnit ? `${formValues.wasteWaterUnit}.00` : '-'}</td>
                                        <td className="p-3 text-[#1B5E20] border-l border-[#E5E7EB]">{calcWasteWater() || '-'}</td>
                                     </tr>
                                  </tbody>
                               </table>
                            </div>

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