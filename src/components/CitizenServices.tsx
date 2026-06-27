/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Citizen, ServiceApplication } from '../types/portal';
import { Search, Map, Receipt, ShieldCheck, Download, Users, CheckCircle, FileText, ExternalLink, Zap, AlertCircle } from 'lucide-react';

interface CitizenServicesProps {
  citizen: Citizen | null;
  serviceId: string;
  onAddApplication: (app: ServiceApplication) => void;
}

export default function CitizenServices({ citizen, serviceId, onAddApplication }: CitizenServicesProps) {
  // --- 1. MP Bhulekh States ---
  const [bhulekhDistrict, setBhulekhDistrict] = useState<string>('रायसेन');
  const [bhulekhTehsil, setBhulekhTehsil] = useState<string>('गैरतगंज');
  const [bhulekhVillage, setBhulekhVillage] = useState<string>(citizen?.village || 'पगरनेश्वर');
  const [bhulekhKhasra, setBhulekhKhasra] = useState<string>('124/2');
  const [bhulekhResult, setBhulekhResult] = useState<any | null>(null);
  const [bhulekhSearchDone, setBhulekhSearchDone] = useState<boolean>(false);

  // --- 2. Electricity Bill States ---
  const [electricityCompany, setElectricityCompany] = useState<string>('MPMKVVCL (मध्य क्षेत्र - भोपाल)');
  const [consumerNumber, setConsumerNumber] = useState<string>('');
  const [billDetails, setBillDetails] = useState<any | null>(null);
  const [billSearchDone, setBillSearchDone] = useState<boolean>(false);
  const [billPaid, setBillPaid] = useState<boolean>(false);
  const [paymentSuccessMsg, setPaymentSuccessMsg] = useState<string>('');

  // --- 3. Aadhaar Download States ---
  const [aadhaarNo, setAadhaarNo] = useState<string>('');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [aadhaarOtp, setAadhaarOtp] = useState<string>('');
  const [aadhaarVerified, setAadhaarVerified] = useState<boolean>(false);
  const [aadhaarCard, setAadhaarCard] = useState<any | null>(null);

  // --- 4. Samagra ID States ---
  const [samagraId, setSamagraId] = useState<string>('');
  const [samagraType, setSamagraType] = useState<'member' | 'family'>('member');
  const [samagraResult, setSamagraResult] = useState<any | null>(null);
  const [samagraSearchDone, setSamagraSearchDone] = useState<boolean>(false);

  // --- Handlers ---
  const handleBhulekhSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setBhulekhSearchDone(true);
    if (!bhulekhKhasra) {
      setBhulekhResult(null);
      return;
    }

    // Generate simulated land records based on input
    const mockLand = {
      ownerName: citizen ? `${citizen.name}` : 'मदनलाल पिता रामचरण पटेल',
      district: bhulekhDistrict,
      tehsil: bhulekhTehsil,
      village: bhulekhVillage,
      khasraNo: bhulekhKhasra,
      areaHectare: '1.4500 हेक्टर (लगभग 3.58 एकड़)',
      landType: 'सिंचित कृषि भूमि (Irrigated Agriculture)',
      cropRecorded: 'सोयाबीन / गेहूं (Soybean / Wheat)',
      b1ReceiptNo: `MPB-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'कोई बंधक या विवाद नहीं (Clear Title)',
    };
    setBhulekhResult(mockLand);
  };

  const handleDownloadKhasraCopy = () => {
    if (!citizen) {
      alert('कृपया खसरा कॉपी डाउनलोड करने के लिए पहले लॉगिन करें।');
      return;
    }
    const receiptNo = bhulekhResult?.b1ReceiptNo || `MPB-${Math.floor(100000 + Math.random() * 900000)}`;
    const newApp: ServiceApplication = {
      id: `APP-BH-${Date.now()}`,
      serviceId: 'mp-bhulekh',
      serviceName: 'डिजिटल खसरा (B1) / नक्शा प्रति',
      applicantName: citizen.name,
      applicantPhone: citizen.phone,
      submissionDate: new Date().toLocaleDateString('hi-IN'),
      status: 'स्वीकृत',
      receiptNo,
      details: {
        'खसरा नंबर': bhulekhKhasra,
        'गाँव/हल्का': bhulekhVillage,
        'रकबा (क्षेत्रफल)': bhulekhResult?.areaHectare || '1.4500 हेक्टर',
        'भूमि स्वामी': bhulekhResult?.ownerName || citizen.name,
      }
    };
    onAddApplication(newApp);
    alert(`खसरा (B1) कॉपी आपके नागरिक डैशबोर्ड 'मेरे आवेदन' में सुरक्षित कर दी गई है! आप इसे कभी भी डाउनलोड कर सकते हैं।`);
  };

  const handleElectricitySearch = (e: React.FormEvent) => {
    e.preventDefault();
    setBillSearchDone(true);
    setBillPaid(false);
    setPaymentSuccessMsg('');

    if (consumerNumber.length < 8) {
      setBillDetails(null);
      return;
    }

    const hash = consumerNumber.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const mockBill = {
      consumerName: citizen ? citizen.name : 'हरिशंकर प्रसाद तिवारी',
      consumerId: consumerNumber,
      billMonth: 'जून 2026',
      dueDate: '10/07/2026',
      amountDue: (hash % 1200) + 250, // Simulated bill amount
      unitsConsumed: (hash % 200) + 80,
      prevReading: (hash % 1000) + 5000,
      currReading: (hash % 1000) + 5000 + (hash % 200) + 80,
      company: electricityCompany
    };
    setBillDetails(mockBill);
  };

  const handlePayBill = () => {
    if (!billDetails) return;

    setBillPaid(true);
    const receiptNo = `MPEB-${Math.floor(1000000 + Math.random() * 9000000)}`;
    setPaymentSuccessMsg(`सफल भुगतान! राशि ₹${billDetails.amountDue} का भुगतान कर दिया गया है। रसीद नंबर: ${receiptNo}`);

    if (citizen) {
      const newApp: ServiceApplication = {
        id: `APP-EL-${Date.now()}`,
        serviceId: 'electricity-bill',
        serviceName: 'बिजली बिल भुगतान रसीद',
        applicantName: citizen.name,
        applicantPhone: citizen.phone,
        submissionDate: new Date().toLocaleDateString('hi-IN'),
        status: 'स्वीकृत',
        receiptNo,
        details: {
          'आईवीआरएस नंबर': billDetails.consumerId,
          'बिल माह': billDetails.billMonth,
          'भुगतान की गई राशि': `₹${billDetails.amountDue}`,
          'विद्युत कंपनी': billDetails.company,
        }
      };
      onAddApplication(newApp);
    }
  };

  const handleSendAadhaarOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (aadhaarNo.length !== 12) {
      alert('कृपया 12 अंकों का वैध आधार नंबर दर्ज करें।');
      return;
    }
    setOtpSent(true);
    alert('OTP आपके आधार से लिंक मोबाइल नंबर पर भेज दिया गया है! (डेमो के लिए कोड "123456" दर्ज करें)');
  };

  const handleVerifyAadhaarOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (aadhaarOtp === '123456') {
      setAadhaarVerified(true);
      const mockCard = {
        name: citizen ? citizen.name : 'राजेश कुमार अहिरवार',
        dob: '15/08/1988',
        gender: 'पुरुष / Male',
        aadhaarNo: `XXXX XXXX ${aadhaarNo.substring(8)}`,
        address: citizen 
          ? `ग्राम- ${citizen.village}, तहसील- गैरतगंज, जिला- ${citizen.district}, मध्य प्रदेश - 464001`
          : `ग्राम- पगरनेश्वर, तहसील- रायसेन, जिला- रायसेन, मध्य प्रदेश - 464001`,
        photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=60'
      };
      setAadhaarCard(mockCard);

      if (citizen) {
        const newApp: ServiceApplication = {
          id: `APP-AD-${Date.now()}`,
          serviceId: 'aadhaar-download',
          serviceName: 'ई-आधार कार्ड डाउनलोड',
          applicantName: citizen.name,
          applicantPhone: citizen.phone,
          submissionDate: new Date().toLocaleDateString('hi-IN'),
          status: 'स्वीकृत',
          receiptNo: `UID-${Math.floor(100000 + Math.random() * 900000)}`,
          details: {
            'आधार नंबर': `XXXX XXXX ${aadhaarNo.substring(8)}`,
            'नाम': mockCard.name,
            'डाउनलोड स्थिति': 'सफल'
          }
        };
        onAddApplication(newApp);
      }
    } else {
      alert('गलत OTP! कृपया डेमो OTP "123456" का उपयोग करें।');
    }
  };

  const handleSamagraSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSamagraSearchDone(true);

    const lengthNeeded = samagraType === 'member' ? 9 : 8;
    if (samagraId.length !== lengthNeeded) {
      setSamagraResult(null);
      return;
    }

    const hash = samagraId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Mock Samagra family details
    const mockSamagra = {
      familyId: samagraType === 'family' ? samagraId : `38${hash % 9000}41`,
      village: citizen?.village || 'पगरनेश्वर',
      district: citizen?.district || 'रायसेन',
      headName: 'कैलाश प्रसाद धाकड़',
      members: [
        { memberId: samagraType === 'member' ? samagraId : `19${hash % 9000}52`, name: citizen ? citizen.name : 'दिनेश धाकड़', relation: 'स्वयं / पुत्र', age: 34, gender: 'पुरुष', aadhaarLinked: 'हाँ (सत्यापित)', dbtActive: 'सक्रिय (डीबीटी चालू)' },
        { memberId: `19${(hash + 1) % 9000}81`, name: 'कांति बाई धाकड़', relation: 'माता', age: 58, gender: 'महिला', aadhaarLinked: 'हाँ (सत्यापित)', dbtActive: 'सक्रिय (डीबीटी चालू)' },
        { memberId: `19${(hash + 2) % 9000}94`, name: 'कमला धाकड़', relation: 'पत्नी', age: 31, gender: 'महिला', aadhaarLinked: 'हाँ (सत्यापित)', dbtActive: 'सक्रिय (डीबीटी चालू)' },
      ]
    };
    setSamagraResult(mockSamagra);
  };

  const handleSaveSamagraCopy = () => {
    if (!citizen) {
      alert('कृपया समग्र आईडी सुरक्षित करने के लिए पहले लॉगिन करें।');
      return;
    }
    const receiptNo = `SMG-${samagraResult?.familyId || '849182'}`;
    const newApp: ServiceApplication = {
      id: `APP-SM-${Date.now()}`,
      serviceId: 'samagra-id',
      serviceName: 'डिजिटल समग्र परिवार प्रोफ़ाइल',
      applicantName: citizen.name,
      applicantPhone: citizen.phone,
      submissionDate: new Date().toLocaleDateString('hi-IN'),
      status: 'स्वीकृत',
      receiptNo,
      details: {
        'समग्र परिवार आईडी': samagraResult?.familyId || '',
        'मुखिया का नाम': samagraResult?.headName || '',
        'कुल सदस्य संख्या': samagraResult?.members.length.toString() || '3',
      }
    };
    onAddApplication(newApp);
    alert(`समग्र आईडी प्रोफ़ाइल रसीद आपके नागरिक डैशबोर्ड में सहेज ली गई है!`);
  };

  return (
    <div className="space-y-6">
      {/* ==================== 1. MP BHULEKH ==================== */}
      {serviceId === 'mp-bhulekh' && (
        <div className="bg-white rounded-xl p-5 border border-emerald-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg text-[#008f5d]">
                <Map className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 font-sans">MP भूलेख (नक्शा व खसरा) डिजिटल प्रति</h4>
                <p className="text-xs text-gray-500 font-sans">घर बैठे अपनी जमीन का खसरा नंबर डालकर B-1 नक्शा एवं स्वामित्व रिकॉर्ड देखें</p>
              </div>
            </div>
            <a 
              href="https://webgis2.mpbhulekh.gov.in/#/home" 
              target="_blank" 
              rel="noreferrer" 
              className="bg-emerald-50 hover:bg-emerald-100 text-[#008f5d] font-bold text-xs py-1.5 px-3 rounded-lg border border-emerald-200 flex items-center gap-1 cursor-pointer transition-colors"
            >
              आधिकारिक वेबसाइट <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <form onSubmit={handleBhulekhSearch} className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">जिला (District)</label>
              <select 
                value={bhulekhDistrict}
                onChange={(e) => setBhulekhDistrict(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs"
              >
                <option value="रायसेन">रायसेन (Raisen)</option>
                <option value="भोपाल">भोपाल (Bhopal)</option>
                <option value="सीहोर">सीहोर (Sehore)</option>
                <option value="विदिशा">विदिशा (Vidisha)</option>
                <option value="जबलपुर">जबलपुर (Jabalpur)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">तहसील (Tehsil)</label>
              <select 
                value={bhulekhTehsil}
                onChange={(e) => setBhulekhTehsil(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs"
              >
                <option value="गैरतगंज">गैरतगंज (Gairatganj)</option>
                <option value="बरेली">बरेली (Bareli)</option>
                <option value="हुजूर">हुजूर (Huzur)</option>
                <option value="नसरुल्लागंज">नसरुल्लागंज (Nasrullaganj)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">गाँव (Village)</label>
              <input 
                type="text" 
                value={bhulekhVillage}
                onChange={(e) => setBhulekhVillage(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs"
                placeholder="उदा. पगरनेश्वर"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">खसरा संख्या (Khasra No)</label>
              <div className="flex gap-1">
                <input 
                  type="text" 
                  required
                  value={bhulekhKhasra}
                  onChange={(e) => setBhulekhKhasra(e.target.value)}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder="उदा. 124/2"
                />
                <button 
                  type="submit"
                  className="bg-[#008f5d] hover:bg-[#00764d] text-white px-3 py-2 rounded-lg font-bold text-xs shrink-0 cursor-pointer transition-colors"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </div>
          </form>

          {bhulekhSearchDone && (
            bhulekhResult ? (
              <div className="border-2 border-dashed border-emerald-200 rounded-xl p-5 bg-emerald-50/20 relative overflow-hidden">
                {/* Simulated Certificate Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none rotate-12">
                  <span className="text-4xl font-extrabold text-[#008f5d]">मध्य प्रदेश शासन भू-अभिलेख</span>
                </div>

                <div className="flex justify-between items-center border-b border-emerald-100 pb-2 mb-4">
                  <h5 className="text-xs font-extrabold text-emerald-950 uppercase tracking-wide">नक़ल खसरा (B-1) विवरण - वर्ष 2026-27</h5>
                  <span className="bg-emerald-100 text-emerald-800 text-[10px] px-2 py-0.5 rounded font-bold">डिजिटल हस्ताक्षरित प्रति</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-sans">
                  <div>
                    <span className="text-gray-500 block text-[10px]">भूमि स्वामी का नाम</span>
                    <strong className="text-gray-800">{bhulekhResult.ownerName}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">खसरा / भू-भाग संख्या</span>
                    <strong className="text-gray-800">{bhulekhResult.khasraNo}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">कुल रकबा (क्षेत्रफल)</span>
                    <strong className="text-gray-800">{bhulekhResult.areaHectare}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">भूमि प्रकार / वर्गीकरण</span>
                    <strong className="text-gray-800">{bhulekhResult.landType}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">बोई गई प्रमुख फसलें</span>
                    <strong className="text-gray-800">{bhulekhResult.cropRecorded}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">अभिलेख स्थिति / बंधक</span>
                    <strong className="text-emerald-700 font-bold">{bhulekhResult.status}</strong>
                  </div>
                </div>

                {/* Simulated Visual Land Map representation */}
                <div className="mt-4 p-4 bg-white border border-gray-200 rounded-xl">
                  <p className="text-[10px] text-gray-500 font-bold mb-2 flex items-center gap-1">
                    <Map className="h-3 w-3 text-[#008f5d]" /> डिजिटल नक्शा खाका (Simulated Parcel Boundary Map)
                  </p>
                  <div className="h-28 bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center relative overflow-hidden">
                    {/* SVG map visual */}
                    <svg className="w-48 h-24 text-[#008f5d] stroke-current stroke-2 fill-emerald-100/30" viewBox="0 0 100 50">
                      <polygon points="10,10 40,15 45,35 15,40" />
                      <polygon points="40,15 80,10 75,30 45,35" className="fill-[#008f5d]/10" />
                      <polygon points="15,40 45,35 50,48 20,45" />
                      {/* Highlight our khasra */}
                      <polygon points="45,35 75,30 85,45 50,48" className="fill-amber-400/40 stroke-amber-500 stroke-2" />
                      <text x="56" y="42" className="text-[6px] fill-amber-950 font-bold stroke-none">खसरा {bhulekhKhasra}</text>
                    </svg>
                    <div className="absolute bottom-1 right-2 text-[8px] text-gray-400 bg-white/80 px-1 rounded">पैमाना: 1:4000</div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-emerald-100/60 flex flex-col sm:flex-row gap-2 justify-end">
                  <button 
                    onClick={handleDownloadKhasraCopy}
                    className="bg-[#008f5d] hover:bg-[#00764d] text-white text-xs py-2 px-4 rounded-lg font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-all"
                  >
                    <Download className="h-4 w-4" /> खसरा B-1 कॉपी सुरक्षित करें (Save to Dashboard)
                  </button>
                  <button 
                    onClick={() => window.print()}
                    className="bg-white hover:bg-gray-100 text-gray-700 text-xs py-2 px-4 rounded-lg font-bold border border-gray-300 flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <FileText className="h-4 w-4" /> सीधे प्रिंट लें / PDF बनाएँ
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>खसरा संख्या नहीं मिली! कृपया वैध खसरा नंबर या खाता संख्या दर्ज करें।</span>
              </div>
            )
          )}
        </div>
      )}

      {/* ==================== 2. ELECTRICITY BILL ==================== */}
      {serviceId === 'electricity-bill' && (
        <div className="bg-white rounded-xl p-5 border border-amber-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
                <Zap className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 font-sans">मध्य प्रदेश बिजली बिल भुगतान</h4>
                <p className="text-xs text-gray-500 font-sans">मध्य/पूर्व/पश्चिम क्षेत्र वितरण कंपनी के घरेलू एवं कृषि बिजली बिल का भुगतान करें</p>
              </div>
            </div>
            <a 
              href="https://mponline.gov.in/" 
              target="_blank" 
              rel="noreferrer" 
              className="bg-amber-50 hover:bg-amber-100 text-amber-700 font-bold text-xs py-1.5 px-3 rounded-lg border border-amber-200 flex items-center gap-1 cursor-pointer transition-colors"
            >
              MP Online बिल भुगतान <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <form onSubmit={handleElectricitySearch} className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-gray-600 mb-1">विद्युत वितरण कंपनी (Select Discom)</label>
              <select 
                value={electricityCompany}
                onChange={(e) => setElectricityCompany(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs"
              >
                <option value="MPMKVVCL (मध्य क्षेत्र - भोपाल)">MPMKVVCL - मध्य क्षेत्र विद्युत वितरण कंपनी (भोपाल संभाग)</option>
                <option value="MPPKVVCL (पश्चिम क्षेत्र - इंदौर)">MPPKVVCL - पश्चिम क्षेत्र विद्युत वितरण कंपनी (इंदौर/उज्जैन)</option>
                <option value="MPPKVVCL (पूर्व क्षेत्र - जबलपुर)">MPPKVVCL - पूर्व क्षेत्र विद्युत वितरण कंपनी (जबलपुर/सागर)</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">IVRS उपभोक्ता संख्या (Consumer ID)</label>
              <div className="flex gap-1">
                <input 
                  type="text" 
                  required
                  value={consumerNumber}
                  onChange={(e) => setConsumerNumber(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                  placeholder="10 अंकों की IVRS संख्या दर्ज करें"
                />
                <button 
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg font-bold text-xs shrink-0 cursor-pointer"
                >
                  खोजें
                </button>
              </div>
            </div>
          </form>

          {billSearchDone && (
            billDetails ? (
              <div className="border border-amber-200 rounded-xl p-5 bg-amber-50/10 space-y-4">
                <div className="flex justify-between items-center border-b border-amber-100 pb-2">
                  <h5 className="text-xs font-bold text-amber-950">उपभोक्ता एवं बकाया राशि विवरण</h5>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${billPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                    {billPaid ? 'भुगतान सफल (Paid)' : 'अशोधित / लंबित (Unpaid)'}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-sans">
                  <div>
                    <span className="text-gray-500 block text-[10px]">उपभोक्ता का नाम</span>
                    <strong className="text-gray-800">{billDetails.consumerName}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">IVRS उपभोक्ता नंबर</span>
                    <strong className="text-gray-800">{billDetails.consumerId}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">बिल महीना (Billing Month)</span>
                    <strong className="text-gray-800">{billDetails.billMonth}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">अंतिम तिथि (Due Date)</span>
                    <strong className="text-gray-800">{billDetails.dueDate}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">कुल खपत (Electricity Units)</span>
                    <strong className="text-gray-800">{billDetails.unitsConsumed} Units</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block text-[10px]">कुल देय राशि (Amount Due)</span>
                    <strong className="text-amber-700 text-sm font-extrabold">₹{billDetails.amountDue}</strong>
                  </div>
                </div>

                {paymentSuccessMsg ? (
                  <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xl text-center space-y-2">
                    <CheckCircle className="h-10 w-10 text-emerald-600 mx-auto" />
                    <p className="font-bold text-xs">{paymentSuccessMsg}</p>
                    <p className="text-[10px] text-gray-500">यह रसीद आपके ग्राम सुविधा पोर्टल नागरिक डैशबोर्ड पर भी हमेशा उपलब्ध रहेगी।</p>
                  </div>
                ) : (
                  <div className="bg-white p-4 rounded-xl border border-amber-200/60 flex flex-col sm:flex-row justify-between items-center gap-3">
                    <div className="text-xs">
                      <p className="text-gray-600 font-medium">✨ <strong>एमपी ऑनलाइन बिल छूट विकल्प लागू:</strong></p>
                      <p className="text-gray-400 text-[10px]">समय पर भुगतान करने से आगामी बिल में ₹15 की अतिरिक्त छूट प्राप्त होगी।</p>
                    </div>
                    <button 
                      onClick={handlePayBill}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-5 rounded-lg transition-all shadow-xs cursor-pointer w-full sm:w-auto"
                    >
                      ₹{billDetails.amountDue} का भुगतान करें (Pay Now)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>उपभोक्ता नंबर अमान्य! कृपया सही 10 अंकों का IVRS नंबर दर्ज करें।</span>
              </div>
            )
          )}
        </div>
      )}

      {/* ==================== 3. AADHAAR DOWNLOAD ==================== */}
      {serviceId === 'aadhaar-download' && (
        <div className="bg-white rounded-xl p-5 border border-purple-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 font-sans">आधार कार्ड डाउनलोड सेवा (UIDAI)</h4>
                <p className="text-xs text-gray-500 font-sans">घर बैठे बिना केंद्र जाये सुरक्षित ई-आधार (E-Aadhaar) कार्ड PDF डाउनलोड करें</p>
              </div>
            </div>
            <a 
              href="https://myaadhaar.uidai.gov.in/" 
              target="_blank" 
              rel="noreferrer" 
              className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs py-1.5 px-3 rounded-lg border border-purple-200 flex items-center gap-1 cursor-pointer transition-colors"
            >
              myAadhaar पोर्टल <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          {!aadhaarVerified ? (
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 max-w-md mx-auto space-y-4">
              <form onSubmit={handleSendAadhaarOtp} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">12-अंकीय आधार संख्या (Aadhaar Number)</label>
                  <input 
                    type="text" 
                    required
                    maxLength={12}
                    value={aadhaarNo}
                    onChange={(e) => setAadhaarNo(e.target.value.replace(/\D/g, ''))}
                    className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm font-mono tracking-widest text-center focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="0000 0000 0000"
                  />
                </div>
                {!otpSent && (
                  <button 
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    सत्यापित करें और OTP भेजें
                  </button>
                )}
              </form>

              {otpSent && (
                <form onSubmit={handleVerifyAadhaarOtp} className="space-y-3 pt-2 border-t border-slate-200/60">
                  <div>
                    <label className="block text-xs font-bold text-emerald-800 mb-1">मोबाइल पर प्राप्त 6-अंकीय OTP दर्ज करें</label>
                    <input 
                      type="password" 
                      required
                      maxLength={6}
                      value={aadhaarOtp}
                      onChange={(e) => setAadhaarOtp(e.target.value.replace(/\D/g, ''))}
                      className="w-full bg-white border border-gray-300 rounded-lg p-2.5 text-sm font-mono tracking-widest text-center focus:ring-2 focus:ring-emerald-500 outline-none"
                      placeholder="• • • • • •"
                    />
                  </div>
                  <button 
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    OTP सत्यापित करें और आधार डाउनलोड करें
                  </button>
                </form>
              )}
            </div>
          ) : (
            aadhaarCard && (
              <div className="space-y-4">
                <div className="border-2 border-purple-200 rounded-2xl p-5 bg-purple-50/10 max-w-lg mx-auto relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-purple-600 text-white text-[9px] px-3 py-1 rounded-bl-xl font-bold">
                    भारत सरकार / Govt. of India
                  </div>
                  <h5 className="text-xs font-bold text-gray-900 border-b border-purple-100 pb-2 mb-4">विशिष्ट पहचान प्राधिकरण (UIDAI) - ई-आधार</h5>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="w-24 h-28 bg-gray-100 rounded-lg border border-gray-200 overflow-hidden shrink-0 mx-auto sm:mx-0">
                      <img 
                        src={aadhaarCard.photoUrl} 
                        alt="Aadhaar Photo" 
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="space-y-2 text-xs font-sans text-left flex-1">
                      <div>
                        <span className="text-gray-400 text-[10px] block">नाम (Name)</span>
                        <strong className="text-gray-900 text-sm font-extrabold">{aadhaarCard.name}</strong>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-gray-400 text-[10px] block">जन्मतिथि / DOB</span>
                          <strong className="text-gray-800">{aadhaarCard.dob}</strong>
                        </div>
                        <div>
                          <span className="text-gray-400 text-[10px] block">लिंग / Gender</span>
                          <strong className="text-gray-800">{aadhaarCard.gender}</strong>
                        </div>
                      </div>
                      <div>
                        <span className="text-gray-400 text-[10px] block">पता (Address)</span>
                        <p className="text-gray-600 text-[11px] leading-snug">{aadhaarCard.address}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 border-t-2 border-dashed border-gray-300 pt-3 text-center">
                    <span className="text-gray-500 text-[9px] block mb-1">आपका आधार संख्या / Your Aadhaar No.</span>
                    <span className="text-base sm:text-lg font-bold font-mono tracking-widest text-gray-900 bg-slate-100 px-4 py-1.5 rounded-lg border border-slate-200 inline-block">
                      {aadhaarCard.aadhaarNo}
                    </span>
                    <p className="text-[9px] text-emerald-700 font-bold mt-2">✓ आधार - आम आदमी का अधिकार</p>
                  </div>
                </div>

                <div className="flex justify-center gap-3">
                  <button 
                    onClick={() => {
                      alert('पीडीएफ ई-आधार आपके कंप्यूटर/लैपटॉप पर सफलतापूर्वक सहेज लिया गया है। पासवर्ड आपके नाम के पहले 4 अक्षर और जन्म का वर्ष है।');
                    }}
                    className="bg-[#008f5d] hover:bg-[#00764d] text-white text-xs py-2.5 px-6 rounded-xl font-bold flex items-center gap-2 cursor-pointer transition-all shadow-xs"
                  >
                    <Download className="h-4 w-4" /> PDF कार्ड डाउनलोड करें
                  </button>
                  <button 
                    onClick={() => {
                      setAadhaarVerified(false);
                      setOtpSent(false);
                      setAadhaarNo('');
                      setAadhaarOtp('');
                    }}
                    className="bg-white hover:bg-gray-100 text-gray-700 text-xs py-2.5 px-4 rounded-xl font-bold border border-gray-300 cursor-pointer"
                  >
                    दूसरा आधार डाउनलोड करें
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      )}

      {/* ==================== 4. SAMAGRA ID ==================== */}
      {serviceId === 'samagra-id' && (
        <div className="bg-white rounded-xl p-5 border border-emerald-100 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg text-[#008f5d]">
                <Users className="h-6 w-6" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 font-sans">समग्र सामाजिक सुरक्षा मिशन (Samagra ID)</h4>
                <p className="text-xs text-gray-500 font-sans">मध्य प्रदेश शासन के समग्र पोर्टल से अपनी परिवार आईडी या सदस्य आईडी निकालें और प्रिंट करें</p>
              </div>
            </div>
            <a 
              href="https://samagra.gov.in/" 
              target="_blank" 
              rel="noreferrer" 
              className="bg-emerald-50 hover:bg-emerald-100 text-[#008f5d] font-bold text-xs py-1.5 px-3 rounded-lg border border-emerald-200 flex items-center gap-1 cursor-pointer transition-colors"
            >
              समग्र SSSM पोर्टल <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>

          <form onSubmit={handleSamagraSearch} className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1">खोज का प्रकार (Search By)</label>
              <select 
                value={samagraType}
                onChange={(e) => {
                  setSamagraType(e.target.value as 'member' | 'family');
                  setSamagraId('');
                }}
                className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs"
              >
                <option value="member">9-अंकीय समग्र सदस्य आईडी (Member ID)</option>
                <option value="family">8-अंकीय समग्र परिवार आईडी (Family ID)</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="block text-[11px] font-bold text-gray-600 mb-1">समग्र आईडी प्रविष्ट करें (Enter Samagra ID)</label>
              <div className="flex gap-1">
                <input 
                  type="text" 
                  required
                  maxLength={samagraType === 'member' ? 9 : 8}
                  value={samagraId}
                  onChange={(e) => setSamagraId(e.target.value.replace(/\D/g, ''))}
                  className="w-full bg-white border border-gray-300 rounded-lg p-2 text-xs font-mono tracking-wider focus:ring-2 focus:ring-emerald-500 outline-none"
                  placeholder={samagraType === 'member' ? "9 अंकों की सदस्य आईडी दर्ज करें" : "8 अंकों की परिवार आईडी दर्ज करें"}
                />
                <button 
                  type="submit"
                  className="bg-[#008f5d] hover:bg-[#00764d] text-white px-5 py-2 rounded-lg font-bold text-xs shrink-0 cursor-pointer"
                >
                  खोजें
                </button>
              </div>
            </div>
          </form>

          {samagraSearchDone && (
            samagraResult ? (
              <div className="border-2 border-emerald-100 rounded-2xl p-5 bg-white space-y-4 shadow-xs">
                <div className="flex justify-between items-center border-b border-gray-200 pb-2">
                  <div className="text-left">
                    <span className="text-[10px] bg-emerald-50 text-[#008f5d] font-bold px-2 py-0.5 rounded">मध्य प्रदेश शासन</span>
                    <h5 className="text-xs font-bold text-gray-900 mt-1">समग्र परिवार सदस्य प्रोफ़ाइल (SSSM Profile)</h5>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-gray-700 block">परिवार आईडी: {samagraResult.familyId}</span>
                    <span className="text-[9px] text-gray-400">ग्राम पंचायत: {samagraResult.village}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs text-left bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div>
                    <span className="text-gray-400 block text-[10px]">परिवार मुखिया</span>
                    <strong className="text-gray-800">{samagraResult.headName}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[10px]">जिला व जनपद</span>
                    <strong className="text-gray-800">{samagraResult.district} ({samagraResult.village})</strong>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-sans">
                    <thead>
                      <tr className="bg-slate-100 border-b border-gray-200 text-gray-700">
                        <th className="p-2 text-[10px] font-bold uppercase">समग्र सदस्य आईडी</th>
                        <th className="p-2 text-[10px] font-bold uppercase">सदस्य का नाम</th>
                        <th className="p-2 text-[10px] font-bold uppercase">मुखिया से संबंध</th>
                        <th className="p-2 text-[10px] font-bold uppercase">आयु / लिंग</th>
                        <th className="p-2 text-[10px] font-bold uppercase">आधार स्थिति</th>
                        <th className="p-2 text-[10px] font-bold uppercase">DBT स्थिति</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {samagraResult.members.map((member: any, idx: number) => (
                        <tr key={idx} className="hover:bg-slate-50">
                          <td className="p-2 font-mono text-gray-900 font-bold">{member.memberId}</td>
                          <td className="p-2 font-bold text-gray-800">{member.name}</td>
                          <td className="p-2 text-gray-500">{member.relation}</td>
                          <td className="p-2 text-gray-600">{member.age} वर्ष / {member.gender}</td>
                          <td className="p-2 text-emerald-700 font-bold">{member.aadhaarLinked}</td>
                          <td className="p-2 text-emerald-800 font-bold">{member.dbtActive}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="bg-amber-50 border border-amber-100 p-3 rounded-lg text-[10px] text-amber-800 font-sans">
                  💡 <strong>महत्वपूर्ण सूचना:</strong> समग्र पोर्टल पर ई-केवाईसी (e-KYC) के माध्यम से अपना नाम, जन्मतिथि एवं लिंग आधार के अनुसार तुरंत ऑनलाइन संशोधित कर सकते हैं, अब सीएससी या ग्राम पंचायत कार्यालय जाने की आवश्यकता नहीं है।
                </div>

                <div className="flex gap-2 justify-end pt-3 border-t border-gray-100">
                  <button 
                    onClick={handleSaveSamagraCopy}
                    className="bg-[#008f5d] hover:bg-[#00764d] text-white text-xs py-2 px-4 rounded-lg font-bold flex items-center justify-center gap-1 cursor-pointer transition-all"
                  >
                    <Download className="h-4 w-4" /> समग्र आईडी रसीद सहेजें (Save Copy)
                  </button>
                  <button 
                    onClick={() => window.print()}
                    className="bg-white hover:bg-gray-100 text-gray-700 text-xs py-2 px-4 rounded-lg font-bold border border-gray-300 flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <FileText className="h-4 w-4" /> प्रोफ़ाइल प्रिंट करें
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                <span>समग्र आईडी नहीं मिली! कृपया सही {samagraType === 'member' ? '9' : '8'} अंकों की आईडी दर्ज करें।</span>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
