/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Citizen, CropRegistration, PMKisanStatus, ServiceApplication } from '../types/portal';
import { Sprout, Search, Receipt, Calendar, Calculator, Sparkles, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { mpDistricts } from '../data/mpLocations';

interface AgricultureServicesProps {
  citizen: Citizen | null;
  serviceId: string;
  onAddApplication: (app: ServiceApplication) => void;
}

export default function AgricultureServices({ citizen, serviceId, onAddApplication }: AgricultureServicesProps) {
  // e-Uparjan states
  const [cropType, setCropType] = useState<string>('गेहूं (Wheat)');
  const [area, setArea] = useState<string>('');
  const [yieldQty, setYieldQty] = useState<string>('');
  const [bankAccount, setBankAccount] = useState<string>('');
  const [ifsc, setIfsc] = useState<string>('');
  const [uparjanSuccess, setUparjanSuccess] = useState<string>('');

  // PM Kisan states
  const [kisanAadhaar, setKisanAadhaar] = useState<string>('');
  const [kisanStatus, setKisanStatus] = useState<PMKisanStatus | null>(null);
  const [kisanSearchDone, setKisanSearchDone] = useState<boolean>(false);

  // Fasal Bima states
  const [district, setDistrict] = useState<string>('रायसेन');
  const [bimaCrop, setBimaCrop] = useState<string>('सोयाबीन (Soybean)');
  const [bimaArea, setBimaArea] = useState<string>('');
  const [calculatedPremium, setCalculatedPremium] = useState<number | null>(null);
  const [insuranceRegistered, setInsuranceRegistered] = useState<boolean>(false);

  // Khaad Token states
  const [cooperativeSociety, setCooperativeSociety] = useState<string>('प्राथमिक सहकारी साख समिति गैरतगंज');
  const [fertilizerType, setFertilizerType] = useState<string>('यूरिया (Urea - ₹266.50/बोरी)');
  const [bagsCount, setBagsCount] = useState<string>('5');
  const [pickupDate, setPickupDate] = useState<string>('');
  const [khaadSuccess, setKhaadSuccess] = useState<string>('');

  const handleKhaadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizen) {
      alert('कृपया खाद टोकन बुक करने के लिए पहले लॉगिन करें।');
      return;
    }

    const maxBags = fertilizerType.includes('यूरिया') ? 50 : 20;
    const bags = parseInt(bagsCount);
    if (isNaN(bags) || bags <= 0 || bags > maxBags) {
      alert(`सहकारी समिति के नियम अनुसार आप एक बार में अधिकतम ${maxBags} बोरी बुक कर सकते हैं।`);
      return;
    }

    const receiptNo = `KHD-${Math.floor(100000 + Math.random() * 900000)}`;
    const counterNo = Math.floor(1 + Math.random() * 4);
    const timeSlot = `${Math.floor(10 + Math.random() * 3)}:00 AM - ${Math.floor(1 + Math.random() * 4)}:00 PM`;

    const newApp: ServiceApplication = {
      id: `APP-KH-${Date.now()}`,
      serviceId: 'khaad-token',
      serviceName: 'रासायनिक खाद टोकन (Fertilizer)',
      applicantName: citizen.name,
      applicantPhone: citizen.phone,
      submissionDate: new Date().toLocaleDateString('hi-IN'),
      status: 'स्वीकृत',
      receiptNo,
      details: {
        'सहकारी समिति': cooperativeSociety,
        'खाद का प्रकार': fertilizerType,
        'बोरी की संख्या': bagsCount,
        'वितरण तिथि (Date)': pickupDate,
        'आवंटित काउंटर': `काउंटर नंबर ${counterNo}`,
        'समय स्लॉट (Time)': timeSlot,
      }
    };

    onAddApplication(newApp);
    setKhaadSuccess(`बधाई हो! आपका खाद टोकन सफलतापूर्वक आरक्षित हो गया है। रसीद नंबर: ${receiptNo} है। कृपया निर्धारित तिथि को समिति जाकर काउंटर नंबर ${counterNo} पर यह टोकन दिखाकर खाद प्राप्त करें।`);
  };

  const handleUparjanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizen) {
      alert('कृपया सेवा का लाभ लेने के लिए पहले लॉगिन करें।');
      return;
    }

    const receiptNo = `UPJ-${Math.floor(100000 + Math.random() * 900000)}`;
    const newApp: ServiceApplication = {
      id: `APP-UP-${Date.now()}`,
      serviceId: 'e-uparjan',
      serviceName: 'e-Uparjan कृषि उपज खरीद',
      applicantName: citizen.name,
      applicantPhone: citizen.phone,
      submissionDate: new Date().toLocaleDateString('hi-IN'),
      status: 'जांच के अधीन',
      receiptNo,
      details: {
        'फसल का प्रकार': cropType,
        'भूमि का क्षेत्रफल (एकड़)': area,
        'अनुमानित उपज (क्विंटल)': yieldQty,
        'बैंक खाता संख्या': bankAccount,
        'IFSC कोड': ifsc,
      }
    };

    onAddApplication(newApp);
    setUparjanSuccess(`पंजीकरण सफल! आपकी रसीद संख्या ${receiptNo} है। आप इसे डैशबोर्ड में ट्रैक कर सकते हैं।`);
    
    // Clear fields
    setArea('');
    setYieldQty('');
    setBankAccount('');
    setIfsc('');
  };

  const handlePMKisanSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setKisanSearchDone(true);
    
    if (kisanAadhaar.length !== 12 && kisanAadhaar.length !== 10) {
      setKisanStatus(null);
      return;
    }

    // Generate simulated kisan status based on search
    const mockKisan: PMKisanStatus = {
      farmerName: citizen ? citizen.name : 'रामनाथ सिंह यादव',
      aadhaar: kisanAadhaar,
      installmentsPaid: 15,
      lastPaymentDate: '12/05/2026',
      status: 'सक्रिय',
      bankAccount: 'XXXXXX5642',
    };
    setKisanStatus(mockKisan);
  };

  const calculateInsurance = (e: React.FormEvent) => {
    e.preventDefault();
    const areaVal = parseFloat(bimaArea);
    if (isNaN(areaVal) || areaVal <= 0) return;

    // Standard rate is 150 Rs per acre for soybean, 220 for wheat, 180 for others
    let rate = 180;
    if (bimaCrop.includes('सोयाबीन')) rate = 150;
    if (bimaCrop.includes('गेहूं')) rate = 220;

    const premium = areaVal * rate;
    setCalculatedPremium(premium);
  };

  const handleFasalBimaRegister = () => {
    if (!citizen) {
      alert('कृपया सेवा का लाभ लेने के लिए पहले लॉगिन करें।');
      return;
    }

    const receiptNo = `BIM-${Math.floor(100000 + Math.random() * 900000)}`;
    const newApp: ServiceApplication = {
      id: `APP-BI-${Date.now()}`,
      serviceId: 'fasal-bima',
      serviceName: 'प्रधानमंत्री फसल बीमा योजना',
      applicantName: citizen.name,
      applicantPhone: citizen.phone,
      submissionDate: new Date().toLocaleDateString('hi-IN'),
      status: 'स्वीकृत',
      receiptNo,
      details: {
        'जिला': district,
        'फसल का प्रकार': bimaCrop,
        'क्षेत्रफल (एकड़)': bimaArea,
        'कुल प्रीमियम भुगतान (₹)': calculatedPremium?.toString() || '0',
      }
    };

    onAddApplication(newApp);
    setInsuranceRegistered(true);
  };

  return (
    <div className="space-y-6">
      {/* 1. e-Uparjan Section */}
      {serviceId === 'e-uparjan' && (
        <div className="bg-white rounded-xl p-6 border border-amber-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <Sprout className="h-6 w-6" id="uparjan-sprout-icon" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 font-sans">e-Uparjan कृषि उपज खरीद पंजीकरण</h4>
              <p className="text-xs text-gray-500 font-sans">समर्थन मूल्य पर अपनी उपज बेचने के लिए ऑनलाइन स्लॉट बुक करें</p>
            </div>
          </div>

          {uparjanSuccess ? (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-5 rounded-xl text-center">
              <CheckCircle className="h-12 w-12 text-emerald-600 mx-auto mb-3" />
              <h5 className="font-bold text-lg mb-2 font-sans">बधाई हो! आपका पंजीकरण हो गया है</h5>
              <p className="text-sm font-sans mb-4">{uparjanSuccess}</p>
              <button
                onClick={() => setUparjanSuccess('')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2 rounded-lg font-medium"
              >
                नया पंजीकरण करें
              </button>
            </div>
          ) : (
            <form onSubmit={handleUparjanSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">फसल का प्रकार चुनें</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm bg-white"
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                  >
                    <option value="गेहूं (Wheat)">गेहूं (Wheat) - समर्थन मूल्य: ₹2,275/क्विंटल</option>
                    <option value="चना (Gram)">चना (Gram) - समर्थन मूल्य: ₹5,440/क्विंटल</option>
                    <option value="धान (Paddy)">धान (Paddy) - समर्थन मूल्य: ₹2,183/क्विंटल</option>
                    <option value="सोयाबीन (Soybean)">सोयाबीन (Soybean) - समर्थन मूल्य: ₹4,600/क्विंटल</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">क्षेत्रफल (एकड़ में)</label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      placeholder="उदा. 4.5"
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">अनुमानित उपज (क्विंटल)</label>
                    <input
                      type="number"
                      required
                      placeholder="उदा. 45"
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      value={yieldQty}
                      onChange={(e) => setYieldQty(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4 mt-2">
                <h5 className="text-xs font-bold text-gray-800 mb-3">भुगतान हेतु बैंक विवरण</h5>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">बैंक खाता संख्या</label>
                    <input
                      type="text"
                      required
                      placeholder="12 से 16 अंकों का बैंक खाता"
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 text-xs focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      value={bankAccount}
                      onChange={(e) => setBankAccount(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">IFSC कोड</label>
                    <input
                      type="text"
                      required
                      placeholder="उदा. SBIN0001234"
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 text-xs uppercase focus:ring-2 focus:ring-amber-500 focus:outline-none"
                      value={ifsc}
                      onChange={(e) => setIfsc(e.target.value)}
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      id="uparjan-register-btn"
                      className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm py-2 px-4 rounded-lg transition-all"
                    >
                      किसान स्लॉट बुक करें
                    </button>
                  </div>
                </div>
              </div>

              {!citizen && (
                <p className="text-xs text-red-500 mt-2 text-center font-sans">
                  * इस सेवा का लाभ लेने के लिए कृपया ऊपर लॉगिन / पंजीकरण बटन का उपयोग करके लॉगिन करें।
                </p>
              )}
            </form>
          )}
        </div>
      )}

      {/* 2. PM Kisan Section */}
      {serviceId === 'pm-kisan' && (
        <div className="bg-white rounded-xl p-6 border border-amber-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <Calendar className="h-6 w-6" id="kisan-calendar-icon" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 font-sans">PM-KISAN प्रधानमंत्री किसान सम्मान निधि स्थिति</h4>
              <p className="text-xs text-gray-500 font-sans">अपनी ₹6,000 वार्षिक सहायता राशि की किस्तों का विवरण जाँचें</p>
            </div>
          </div>

          <form onSubmit={handlePMKisanSearch} className="flex gap-2 max-w-md mb-6">
            <input
              type="text"
              required
              placeholder="12 अंकों का आधार नंबर दर्ज करें"
              className="flex-1 border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
              value={kisanAadhaar}
              onChange={(e) => setKisanAadhaar(e.target.value.replace(/\D/g, ''))}
            />
            <button
              type="submit"
              id="kisan-search-btn"
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 rounded-lg flex items-center gap-1.5 font-semibold text-xs"
            >
              <Search className="h-4 w-4" /> स्थिति देखें
            </button>
          </form>

          {kisanSearchDone && (
            kisanStatus ? (
              <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl space-y-4">
                <div className="flex justify-between items-center border-b border-emerald-200/50 pb-2">
                  <span className="text-sm font-bold text-emerald-800">लाभार्थी विवरण</span>
                  <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-xs font-bold">
                    दर्ज स्थिति: {kisanStatus.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <span className="text-gray-500 block">कृषक का नाम</span>
                    <strong className="text-gray-800 text-sm">{kisanStatus.farmerName}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">कुल प्राप्त किस्तें</span>
                    <strong className="text-emerald-700 text-sm font-bold">{kisanStatus.installmentsPaid} किस्तें (₹30,000)</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">अंतिम किस्त तिथि</span>
                    <strong className="text-gray-800 text-sm">{kisanStatus.lastPaymentDate}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">संबद्ध बैंक खाता</span>
                    <strong className="text-gray-800 text-sm">{kisanStatus.bankAccount}</strong>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-emerald-100 mt-2">
                  <p className="text-xs text-gray-600 font-sans">
                    💡 <strong>सूचना:</strong> प्रधानमंत्री किसान सम्मान निधि की अगली किस्त (16वीं किस्त) जल्द ही सीधे आपके आधार लिंक्ड बैंक खाते (e-KYC) में भेजी जाएगी। सुनिश्चित करें कि आपका बैंक खाता e-KYC प्रमाणित है।
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>अमान्य आधार नंबर! कृपया सही 12 अंकों का आधार कार्ड नंबर दर्ज करें।</span>
              </div>
            )
          )}
        </div>
      )}

      {/* 3. Fasal Bima Section */}
      {serviceId === 'fasal-bima' && (
        <div className="bg-white rounded-xl p-6 border border-amber-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <Calculator className="h-6 w-6" id="bima-calc-icon" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 font-sans">प्रधानमंत्री फसल बीमा योजना</h4>
              <p className="text-xs text-gray-500 font-sans">अपनी फसल के नुकसान की सुरक्षा के लिए बीमा प्रीमियम और ऑनलाइन पंजीयन करें</p>
            </div>
          </div>

          {insuranceRegistered ? (
            <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-xl text-center">
              <CheckCircle className="h-12 w-12 text-emerald-600 mx-auto mb-3" />
              <h5 className="font-bold text-lg mb-1 font-sans">बीमा आवेदन सफलतापूर्वक जमा हुआ</h5>
              <p className="text-xs text-gray-600 font-sans mb-4">
                आपका फसल बीमा आवेदन स्वीकार कर लिया गया है। समीक्षा और रसीद डैशबोर्ड के &apos;मेरे आवेदन&apos; अनुभाग में उपलब्ध है।
              </p>
              <button
                onClick={() => {
                  setInsuranceRegistered(false);
                  setCalculatedPremium(null);
                  setBimaArea('');
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-2 rounded-lg font-semibold"
              >
                नया फसल बीमा आवेदन
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <form onSubmit={calculateInsurance} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">जिला चुनें</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm bg-white"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                  >
                    {mpDistricts.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">बीमा हेतु फसल</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm bg-white"
                    value={bimaCrop}
                    onChange={(e) => setBimaCrop(e.target.value)}
                  >
                    <option value="सोयाबीन (Soybean)">सोयाबीन (Soybean) [खरीफ]</option>
                    <option value="धान (Rice)">धान (Rice) [खरीफ]</option>
                    <option value="गेहूं (Wheat)">गेहूं (Wheat) [रबी]</option>
                    <option value="चना (Gram)">चना (Gram) [रबी]</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">फसल का क्षेत्र (एकड़ में)</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="उदा. 5.0"
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    value={bimaArea}
                    onChange={(e) => setBimaArea(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  id="bima-calc-btn"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-2 rounded-lg text-xs"
                >
                  प्रीमियम की गणना करें
                </button>
              </form>

              <div className="bg-amber-50/50 rounded-xl p-4 border border-amber-100 flex flex-col justify-between">
                <div>
                  <h5 className="font-bold text-xs text-amber-800 mb-3 flex items-center gap-1.5">
                    <Sparkles className="h-4 w-4" /> प्रीमियम गणना परिणाम
                  </h5>
                  {calculatedPremium !== null ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-600">कुल बीमा राशि (Sum Insured):</span>
                        <strong className="text-gray-900">₹{parseFloat(bimaArea) * 25000}</strong>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-gray-600">सरकारी सब्सिडी (80%):</span>
                        <strong className="text-emerald-700">- ₹{calculatedPremium * 4}</strong>
                      </div>
                      <div className="flex justify-between items-center text-xs border-t border-amber-200/50 pt-2">
                        <span className="text-gray-800 font-bold">कृषक का प्रीमियम हिस्सा (2%):</span>
                        <strong className="text-amber-800 text-lg">₹{calculatedPremium}</strong>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic mt-4 text-center">
                      कृपया फसल का क्षेत्रफल दर्ज करके गणना करें।
                    </p>
                  )}
                </div>

                {calculatedPremium !== null && (
                  <div className="mt-4 pt-4 border-t border-amber-200">
                    <button
                      onClick={handleFasalBimaRegister}
                      id="bima-register-btn"
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg text-xs"
                    >
                      अभी बीमा सुरक्षित करें (ऑनलाइन पंजीकरण)
                    </button>
                    {!citizen && (
                      <p className="text-[10px] text-red-500 text-center mt-2 font-sans">
                        * आवेदन जमा करने के लिए कृपया पहले लॉगिन करें।
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Khaad Token Booking Section */}
      {serviceId === 'khaad-token' && (
        <div className="bg-white rounded-xl p-6 border border-amber-100 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-2 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                <Calendar className="h-6 w-6" id="fertilizer-calendar-icon" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 font-sans">सहकारी समिति रासायनिक खाद टोकन बुकिंग</h4>
                <p className="text-xs text-gray-500 font-sans">यूरिया एवं डीएपी (DAP) खाद के लिए ऑनलाइन अग्रिम स्लॉट व टोकन बुक करें</p>
              </div>
            </div>
            <a 
              href="https://dbt.mpdage.org/" 
              target="_blank" 
              rel="noreferrer" 
              className="bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs py-1.5 px-3 rounded-lg border border-amber-200 flex items-center gap-1 cursor-pointer transition-colors"
            >
              डीबीटी पोर्टल <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {khaadSuccess ? (
            <div className="bg-emerald-50 border-2 border-dashed border-emerald-200 rounded-xl p-5 space-y-4">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-emerald-600 mx-auto mb-2" />
                <h5 className="font-extrabold text-emerald-950 text-base font-sans">खाद टोकन बुकिंग रसीद (Advance Fertilizer Token)</h5>
                <p className="text-xs text-gray-500">मध्य प्रदेश राज्य सहकारी विपणन संघ मर्यादित</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-emerald-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                <div>
                  <span className="text-gray-400 block text-[10px]">आवेदक किसान</span>
                  <strong className="text-gray-800">{citizen?.name}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">सोसाइटी / सहकारी समिति</span>
                  <strong className="text-gray-800">{cooperativeSociety}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">खाद एवं दर</span>
                  <strong className="text-gray-800">{fertilizerType}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">आवंटित बोरी की संख्या</span>
                  <strong className="text-gray-800">{bagsCount} बोरी</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">वितरण तिथि एवं समय</span>
                  <strong className="text-amber-800 font-bold">{pickupDate} ({Math.floor(10 + Math.random() * 2)}:00 AM से 3:00 PM)</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">काउंटर नंबर व टोकन</span>
                  <strong className="text-emerald-700 font-bold">काउंटर {Math.floor(1 + Math.random() * 3)} • टोकन: #{Math.floor(100 + Math.random() * 900)}</strong>
                </div>
              </div>

              <div className="bg-emerald-100/40 p-3 rounded-lg text-[10px] text-emerald-800 space-y-1">
                <p className="font-bold">⚠️ निर्देश:</p>
                <p>1. कृपया वितरण तिथि को अपना मूल आधार कार्ड एवं अंगूठा सत्यापन (Biometric) हेतु स्वयं उपस्थित हों।</p>
                <p>2. भुगतान नगद अथवा यूपीआई के माध्यम से वितरण काउंटर पर ही स्वीकार किया जाएगा।</p>
              </div>

              <div className="flex justify-center gap-2">
                <button 
                  onClick={() => window.print()}
                  className="bg-[#008f5d] hover:bg-[#00764d] text-white font-bold text-xs py-2 px-4 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  टोकन रसीद प्रिंट करें
                </button>
                <button 
                  onClick={() => setKhaadSuccess('')}
                  className="bg-white border border-gray-300 text-gray-700 font-bold text-xs py-2 px-4 rounded-lg cursor-pointer"
                >
                  नया टोकन बुक करें
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleKhaadSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">अपने ग्राम की सहकारी समिति चुनें</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm bg-white"
                    value={cooperativeSociety}
                    onChange={(e) => setCooperativeSociety(e.target.value)}
                  >
                    <option value="प्राथमिक सहकारी साख समिति गैरतगंज">प्राथमिक सहकारी साख समिति गैरतगंज (Raisen)</option>
                    <option value="कृषक सेवा सहकारी समिति सिलवानी">कृषक सेवा सहकारी समिति सिलवानी</option>
                    <option value="पगरनेश्वर सहकारी दुग्ध एवं विपणन समिति">पगरनेश्वर सहकारी दुग्ध एवं विपणन समिति</option>
                    <option value="मध्य प्रदेश डबल लॉक कृषि केंद्र रायसेन">एमपी डबल लॉक कृषि केंद्र रायसेन</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">रासायनिक खाद प्रकार व सरकारी दर</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm bg-white"
                    value={fertilizerType}
                    onChange={(e) => setFertilizerType(e.target.value)}
                  >
                    <option value="यूरिया (Urea - ₹266.50/बोरी)">यूरिया (Urea - ₹266.50/बोरी 45kg)</option>
                    <option value="डीएपी (DAP - ₹1350/बोरी)">डीएपी (DAP - ₹1,350/बोरी 50kg)</option>
                    <option value="एनपीके (NPK - ₹1470/बोरी)">एनपीके (NPK - ₹1,470/बोरी 50kg)</option>
                    <option value="सुपर फॉस्फेट (SSP - ₹425/बोरी)">सिंगल सुपर फॉस्फेट (SSP - ₹425/बोरी)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">बोरी की संख्या (अधिकतम 50 बोरी)</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    required
                    placeholder="उदा. 10"
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    value={bagsCount}
                    onChange={(e) => setBagsCount(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">समिति जाने की तिथि (Distribution Date)</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-amber-500 focus:outline-none"
                    value={pickupDate}
                    onChange={(e) => setPickupDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-amber-50/50 p-3 rounded-lg border border-amber-100 text-xs text-gray-600">
                <p className="font-bold text-amber-800 mb-1">💡 खाद स्लॉट उपलब्धता निर्देश:</p>
                <p>सहकारी समिति में दैनिक खाद का स्टॉक सीमित रहता है, टोकन अग्रिम रूप से आरक्षित करने से आपको समिति के काउंटर पर लंबी लाइनों में खड़े होने की आवश्यकता नहीं होगी।</p>
              </div>

              <button
                type="submit"
                id="khaad-token-btn"
                className="w-full bg-[#008f5d] hover:bg-[#00764d] text-white font-bold py-2.5 rounded-lg text-sm transition-all cursor-pointer"
              >
                खाद टोकन बुक करें और स्लॉट आरक्षित करें
              </button>

              {!citizen && (
                <p className="text-xs text-red-500 text-center mt-2 font-sans">
                  * इस सेवा का लाभ लेने के लिए कृपया पहले ऊपर लॉगिन करें।
                </p>
              )}
            </form>
          )}
        </div>
      )}
    </div>
  );
}
