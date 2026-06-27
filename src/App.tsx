/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { Citizen, ServiceItem, ServiceApplication } from './types/portal';
import CitizenAuth from './components/CitizenAuth';
import ServiceCard from './components/ServiceCard';
import ServiceDetailModal from './components/ServiceDetailModal';
import CitizenDashboard from './components/CitizenDashboard';
import GramPanchayatHelper from './components/GramPanchayatHelper';
import { Building2, Search, ArrowUpRight, HelpCircle, Heart, Sparkles, BookOpen, User, LayoutDashboard } from 'lucide-react';

export default function App() {
  // State variables
  const [activeCitizen, setActiveCitizen] = useState<Citizen | null>(null);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);
  const [showDashboardModal, setShowDashboardModal] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('सभी');
  
  // Modal tracking
  const [activeService, setActiveService] = useState<ServiceItem | null>(null);

  // Applications registry
  const [applications, setApplications] = useState<ServiceApplication[]>([]);

  // Sample static list of rural digital services matching mockup visual styles
  const services: ServiceItem[] = [
    {
      id: 'e-uparjan',
      name: 'e-Uparjan (ई-उपार्जन)',
      hindiName: 'कृषि उपज खरीद पंजीकरण',
      category: 'कृषि',
      description: 'न्यूनतम समर्थन मूल्य (MSP) पर अनाज बेचने हेतु स्लॉट बुकिंग एवं गिरदावरी रकबा सत्यापन करवाएं।',
      iconName: 'sprout',
      borderColor: 'border-amber-200 hover:border-amber-400',
      accentColor: 'text-amber-600',
      tagColor: 'bg-amber-100 text-amber-800',
      bgIconColor: 'bg-amber-50',
      externalUrl: 'https://mpeuparjan.nic.in/',
    },
    {
      id: 'pm-kisan',
      name: 'PM-KISAN (पीएम किसान)',
      hindiName: 'प्रधानमंत्री किसान सम्मान निधि',
      category: 'कृषि',
      description: '₹6,000 वार्षिक सम्मान राशि किस्तों की स्थिति, आधार e-KYC तथा लाभार्थी सूची में नाम खोजें।',
      iconName: 'sprout',
      borderColor: 'border-amber-200 hover:border-amber-400',
      accentColor: 'text-amber-600',
      tagColor: 'bg-amber-100 text-amber-800',
      bgIconColor: 'bg-amber-50',
      externalUrl: 'https://pmkisan.gov.in/',
    },
    {
      id: 'fasal-bima',
      name: 'फसल बीमा (Crop Insurance)',
      hindiName: 'प्रधानमंत्री फसल बीमा योजना',
      category: 'कृषि',
      description: 'सूखा, बाढ़ या कीटों से फसल नष्ट होने की स्थिति में सुरक्षा एवं त्वरित दावा आकलन बीमा प्रीमियम निकालें।',
      iconName: 'sprout',
      borderColor: 'border-amber-200 hover:border-amber-400',
      accentColor: 'text-amber-600',
      tagColor: 'bg-amber-100 text-amber-800',
      bgIconColor: 'bg-amber-50',
      externalUrl: 'https://pmfby.gov.in/',
    },
    {
      id: 'driving-license',
      name: 'ड्राइविंग लाइसेंस (DL)',
      hindiName: 'लर्निंग लाइसेंस बनवाएं / नवीनीकृत करें',
      category: 'परिवहन',
      description: 'नया लर्निंग या पक्का ड्राइविंग लाइसेंस आवेदन पत्र, ऑनलाइन कम्प्यूटर परीक्षा तथा नवीनीकरण स्लॉट।',
      iconName: 'car',
      borderColor: 'border-purple-200 hover:border-purple-400',
      accentColor: 'text-purple-600',
      tagColor: 'bg-purple-100 text-purple-800',
      bgIconColor: 'bg-purple-50',
      externalUrl: 'https://sarathi.parivahan.gov.in/',
    },
    {
      id: 'vahan-rc',
      name: 'वाहन RC विवरण (Vehicle RC)',
      hindiName: 'वाहन पंजीकरण प्रमाण पत्र',
      category: 'परिवहन',
      description: 'गाड़ी नंबर डालकर मालिक का नाम, बीमा वैधता, चेसिस नंबर तथा प्रदूषण प्रमाणपत्र (PUC) की स्थिति जानें।',
      iconName: 'car',
      borderColor: 'border-purple-200 hover:border-purple-400',
      accentColor: 'text-purple-600',
      tagColor: 'bg-purple-100 text-purple-800',
      bgIconColor: 'bg-purple-50',
      externalUrl: 'https://vahan.parivahan.gov.in/',
    },
    {
      id: 'challan-check',
      name: 'Challan Check (चालान जाँच)',
      hindiName: 'ई-चालान की स्थिति जाँचें',
      category: 'परिवहन',
      description: 'अपनी गाड़ी के ट्रैफिक नियमों के उल्लंघन संबंधी बकाया चालानों की सूची देखें एवं सुरक्षित भुगतान करें।',
      iconName: 'car',
      borderColor: 'border-purple-200 hover:border-purple-400',
      accentColor: 'text-purple-600',
      tagColor: 'bg-purple-100 text-purple-800',
      bgIconColor: 'bg-purple-50',
      externalUrl: 'https://echallan.parivahan.gov.in/',
    },
    {
      id: 'ration-card',
      name: 'राशन कार्ड (Ration Card)',
      hindiName: 'नया डिजिटल राशन कार्ड आवेदन',
      category: 'कल्याण',
      description: 'बीपीएल (BPL) एवं अंत्योदय परिवारों के लिए सस्ते अनाज/राशन वितरण की सूची तथा नया कार्ड आवेदन।',
      iconName: 'users',
      borderColor: 'border-blue-200 hover:border-blue-400',
      accentColor: 'text-blue-600',
      tagColor: 'bg-blue-100 text-blue-800',
      bgIconColor: 'bg-blue-50',
      externalUrl: 'https://rationcard.mponline.gov.in/',
    },
    {
      id: 'pension-scheme',
      name: 'वृद्धावस्था पेंशन (Pension)',
      hindiName: 'सामाजिक सुरक्षा पेंशन योजना',
      category: 'कल्याण',
      description: 'ग्राम के वृद्धजनों, विधवा कल्याणी महिलाओं तथा दिव्यांगजनों के लिए मासिक पेंशन डायरेक्ट ट्रांसफर।',
      iconName: 'users',
      borderColor: 'border-blue-200 hover:border-blue-400',
      accentColor: 'text-blue-600',
      tagColor: 'bg-blue-100 text-blue-800',
      bgIconColor: 'bg-blue-50',
      externalUrl: 'https://socialsecurity.mp.gov.in/',
    },
    {
      id: 'mp-bhulekh',
      name: 'MP भूलेख (नक्शा/खसरा)',
      hindiName: 'नकल खसरा B-1 एवं भू-नक्शा',
      category: 'नागरिक',
      description: 'ग्राम की कृषि भूमि का खसरा नंबर (Khasra B-1) और नक्शा ऑनलाइन देखें, डाउनलोड व प्रिंट करें।',
      iconName: 'map',
      borderColor: 'border-emerald-200 hover:border-emerald-400',
      accentColor: 'text-emerald-600',
      tagColor: 'bg-emerald-100 text-emerald-800',
      bgIconColor: 'bg-emerald-50',
      externalUrl: 'https://webgis2.mpbhulekh.gov.in/#/home',
    },
    {
      id: 'electricity-bill',
      name: 'बिजली बिल भुगतान (MPEB)',
      hindiName: 'घरेलू व कृषि बिजली बिल भुगतान',
      category: 'नागरिक',
      description: 'मध्य प्रदेश मध्य/पूर्व/पश्चिम क्षेत्र विद्युत कंपनियों के बकाया बिल की स्थिति देखें और भुगतान करें।',
      iconName: 'zap',
      borderColor: 'border-amber-200 hover:border-amber-400',
      accentColor: 'text-amber-600',
      tagColor: 'bg-amber-100 text-amber-800',
      bgIconColor: 'bg-amber-50',
      externalUrl: 'https://billing.mpez.co.in/',
    },
    {
      id: 'aadhaar-download',
      name: 'आधार डाउनलोड (UIDAI)',
      hindiName: 'नया ई-आधार कार्ड डाउनलोड करें',
      category: 'नागरिक',
      description: 'आधार संख्या का उपयोग कर OTP सत्यापन के द्वारा घर बैठे ई-आधार (E-Aadhaar) डाउनलोड और प्रिंट करें।',
      iconName: 'download',
      borderColor: 'border-purple-200 hover:border-purple-400',
      accentColor: 'text-purple-600',
      tagColor: 'bg-purple-100 text-purple-800',
      bgIconColor: 'bg-purple-50',
      externalUrl: 'https://myaadhaar.uidai.gov.in/',
    },
    {
      id: 'samagra-id',
      name: 'समग्र आईडी (Samagra ID)',
      hindiName: 'समग्र सदस्य व परिवार आईडी डाउनलोड',
      category: 'नागरिक',
      description: 'मध्य प्रदेश शासन की परिवार आईडी, सदस्य प्रोफ़ाइल और ई-केवाईसी की स्थिति की जाँच करें।',
      iconName: 'users',
      borderColor: 'border-blue-200 hover:border-blue-400',
      accentColor: 'text-blue-600',
      tagColor: 'bg-blue-100 text-blue-800',
      bgIconColor: 'bg-blue-50',
      externalUrl: 'https://samagra.gov.in/',
    },
    {
      id: 'khaad-token',
      name: 'खाद टोकन बुकिंग (Fertilizer)',
      hindiName: 'सहकारी समिति रासायनिक खाद स्लॉट',
      category: 'कृषि',
      description: 'सोसाइटी (समिति) से यूरिया, डीएपी (DAP) खाद प्राप्त करने के लिए टोकन और वितरण तिथि ऑनलाइन बुक करें।',
      iconName: 'sprout',
      borderColor: 'border-amber-200 hover:border-amber-400',
      accentColor: 'text-amber-600',
      tagColor: 'bg-amber-100 text-amber-800',
      bgIconColor: 'bg-amber-50',
      externalUrl: 'https://dbt.mpdage.org/',
    },
    {
      id: 'vahan-token',
      name: 'वाहन टोकन स्लॉट (Vahan Token)',
      hindiName: 'परिवहन विभाग स्लॉट बुकिंग',
      category: 'परिवहन',
      description: 'नये वाहन पंजीकरण, फिटनेस टेस्ट, परमिट रिन्यूअल या आरटीओ अपॉइंटमेंट का टोकन घर बैठे बुक करें।',
      iconName: 'car',
      borderColor: 'border-purple-200 hover:border-purple-400',
      accentColor: 'text-purple-600',
      tagColor: 'bg-purple-100 text-purple-800',
      bgIconColor: 'bg-purple-50',
      externalUrl: 'https://parivahan.gov.in/',
    }
  ];

  // Load state from local storage on load
  useEffect(() => {
    const savedUser = localStorage.getItem('active_citizen');
    if (savedUser) {
      setActiveCitizen(JSON.parse(savedUser));
    }

    const savedApps = localStorage.getItem('citizen_applications');
    if (savedApps) {
      setApplications(JSON.parse(savedApps));
    } else {
      // Clear initial apps as requested
      const initialApps: ServiceApplication[] = [];
      setApplications(initialApps);
      localStorage.setItem('citizen_applications', JSON.stringify(initialApps));
    }
  }, []);

  // Sync applications to localStorage
  const handleAddApplication = (newApp: ServiceApplication) => {
    const updatedApps = [newApp, ...applications];
    setApplications(updatedApps);
    localStorage.setItem('citizen_applications', JSON.stringify(updatedApps));
  };

  const handleLoginSuccess = (citizen: Citizen) => {
    setActiveCitizen(citizen);
    setShowAuthModal(false);
    setShowDashboardModal(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('active_citizen');
    setActiveCitizen(null);
    setShowDashboardModal(false);
  };

  const openService = (id: string) => {
    const found = services.find((s) => s.id === id);
    if (found) {
      setActiveService(found);
    }
  };

  // Filter logic
  const filteredServices = services.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.hindiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === 'सभी' || s.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* 1. Header component - EXACT replication of provided screenshot design */}
      <header className="bg-[#008f5d] text-white py-3.5 px-6 shadow-md border-b-4 border-amber-400 shrink-0 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-white/10 p-2 rounded-xl border border-white/20">
              <Building2 className="h-7 w-7 text-white" id="main-building-icon" />
            </div>
            <div>
              <h1 className="text-xl md:text-2xl font-bold tracking-tight font-sans">ग्राम सुविधा पोर्टल</h1>
              <p className="text-[11px] text-emerald-100 font-medium">सभी सरकारी सेवाएँ एक जगह • डिजिटल पंचायत आत्मनिर्भर गाँव</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {activeCitizen ? (
              <div className="flex items-center gap-2">
                <div className="bg-white/10 hover:bg-white/15 px-3 py-1.5 rounded-xl border border-white/20 flex items-center gap-2 text-xs">
                  <User className="h-3.5 w-3.5 text-amber-300" />
                  <span className="font-semibold hidden sm:inline">{activeCitizen.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-amber-400 hover:bg-amber-500 text-emerald-950 font-bold text-xs py-1.5 px-3 rounded-lg transition-all"
                >
                  लॉगआउट
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                id="header-login-btn"
                className="bg-white hover:bg-emerald-50 text-[#008f5d] font-bold text-xs px-4 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <User className="h-4 w-4" /> लॉगिन / पंजीकरण
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-6 space-y-8">
        
        {/* Hero Section */}
        <div className="relative bg-gradient-to-r from-emerald-800 to-emerald-950 rounded-3xl p-6 md:p-8 text-white shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <Building2 className="h-48 w-48" id="bg-decoration-building" />
          </div>
          
          <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full text-xs font-bold">
                <Sparkles className="h-3.5 w-3.5" /> समृद्ध ग्राम - डिजिटल गाँव पहल
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold font-sans tracking-tight leading-tight">
                समृद्ध गाँव, सशक्त नागरिक!
              </h2>
              <p className="text-xs md:text-sm text-emerald-100 font-sans leading-relaxed">
                सभी कृषि सहायता, परिवहन, सामाजिक सुरक्षा पेंशन और राशन कार्ड सेवाओं को एक ही सरल डिजिटल मंच पर लाते हुए नागरिकों को आत्मनिर्भर बनाने का हमारा छोटा प्रयास।
              </p>

              {/* Live Search and Filter block */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="योजना का नाम लिखें (उदा. पीएम किसान, लाइसेंस, राशन, पेंशन)..."
                    className="w-full bg-white text-gray-800 text-xs rounded-xl pl-10 pr-4 py-2.5 outline-none focus:ring-2 focus:ring-amber-400 font-sans"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Right side Image replacement */}
            <div className="md:col-span-4 flex justify-center md:justify-end">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-emerald-500 rounded-2xl blur opacity-35 group-hover:opacity-50 transition duration-1000"></div>
                <div className="relative bg-emerald-900/60 backdrop-blur-md border border-emerald-500/30 rounded-2xl p-2.5 shadow-2xl w-40 md:w-48 text-center">
                  <div className="aspect-square rounded-xl overflow-hidden mb-2 border border-emerald-400/20">
                    <img
                      src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&q=80&w=400"
                      alt="AI Digital Gram Sahayak"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h4 className="text-xs font-bold text-white font-sans">AI डिजिटल सहायक</h4>
                  <p className="text-[8px] md:text-[9px] text-amber-300 font-mono mt-1 break-all select-all">
                    cse23.navneetkumarpatel@ggct.co.in
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Selector Tabs */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-2">
            <h3 className="text-base font-bold text-gray-800 font-sans">
              योजना श्रेणियां (Service Categories)
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  if (activeCitizen) {
                    setShowDashboardModal(true);
                  } else {
                    setShowAuthModal(true);
                  }
                }}
                className="bg-[#008f5d] hover:bg-[#00764d] text-white font-bold text-xs px-4 py-2 rounded-xl shadow-xs transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
              >
                <LayoutDashboard className="h-3.5 w-3.5" />
                आपका नागरिक डैशबोर्ड (Your Workspace)
                {activeCitizen && (
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse ml-0.5" />
                )}
              </button>
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-[#008f5d] font-semibold hover:underline bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-100"
                >
                  खोज हटाएँ
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {['सभी', 'कृषि', 'परिवहन', 'कल्याण', 'नागरिक'].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-[#008f5d] text-white shadow-xs'
                    : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {cat === 'सभी' ? 'सभी सेवाएँ (All)' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Services Grid matching UI specs */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onOpen={openService}
              />
            ))}
          </div>

          {filteredServices.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-gray-200">
              <Search className="h-10 w-10 text-gray-300 mx-auto mb-2" />
              <h4 className="text-xs font-bold text-gray-800">कोई सेवा नहीं मिली</h4>
              <p className="text-[11px] text-gray-400 mt-1">कृपया कोई अन्य कीवर्ड खोजें।</p>
            </div>
          )}
        </div>

        {/* 3. Helper directory & Chatbot assistance */}
        <div className="space-y-4 pt-6 border-t border-gray-200">
          <h3 className="text-base font-bold text-gray-800 font-sans">
            पंचायत सहायता एवं डिजिटल लोक-मित्र (Panchayat Helpdesk)
          </h3>
          <GramPanchayatHelper />
        </div>

      </main>

      {/* Citizen Dashboard Modal */}
      {showDashboardModal && activeCitizen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="relative bg-white rounded-3xl p-6 shadow-2xl max-w-4xl w-full border border-gray-100 max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowDashboardModal(false)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-800 rounded-full p-2 shadow-xs transition-colors cursor-pointer"
            >
              ✕ बंद करें
            </button>
            <div className="space-y-4 pt-2">
              <div className="border-b border-gray-100 pb-3 flex items-center gap-3">
                <LayoutDashboard className="h-6 w-6 text-emerald-600" />
                <div>
                  <h3 className="text-base font-bold text-gray-900 font-sans">
                    आपका नागरिक डैशबोर्ड (Your Workspace)
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    ग्राम सुविधा ऑनलाइन सेवा स्थिति, आवेदन रसीदें और आपकी प्रोफ़ाइल
                  </p>
                </div>
              </div>
              <CitizenDashboard
                citizen={activeCitizen}
                applications={applications}
                onLogout={handleLogout}
              />
            </div>
          </div>
        </div>
      )}

      {/* Login Popup Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute -top-3 -right-3 bg-white hover:bg-gray-100 text-gray-500 hover:text-gray-800 rounded-full p-1.5 shadow-md border border-gray-200 z-10 transition-colors"
            >
              ✕
            </button>
            <CitizenAuth
              onLoginSuccess={handleLoginSuccess}
              onClose={() => setShowAuthModal(false)}
            />
          </div>
        </div>
      )}

      {/* Service Interactive workspace modal */}
      {activeService && (
        <ServiceDetailModal
          serviceId={activeService.id}
          serviceName={activeService.hindiName}
          category={activeService.category}
          citizen={activeCitizen}
          onClose={() => setActiveService(null)}
          onAddApplication={handleAddApplication}
        />
      )}

      {/* Standard Rural Development Department Footer */}
      <footer className="bg-slate-900 text-gray-400 py-8 px-6 mt-12 border-t border-gray-800 shrink-0 text-xs font-sans">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white">
              <Building2 className="h-5 w-5 text-emerald-500" />
              <span className="font-bold">ग्राम सुविधा पोर्टल</span>
            </div>
            <p className="text-gray-500 text-[11px] leading-relaxed">
              डिजिटल इंडिया अभियान के तहत ग्रामीण भारत में सरकारी योजनाओं की त्वरित पहुँच सुनिश्चित करने हेतु ग्राम पंचायत स्तर का अभिनव प्रयास।
            </p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">महत्वपूर्ण लिंक</h4>
            <ul className="space-y-2 text-gray-500 text-[11px]">
              <li><a href="#" className="hover:text-emerald-400 transition-colors">राष्ट्रीय मतदाता सेवा पोर्टल (NVSP)</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">आधार विशिष्ट पहचान प्राधिकरण (UIDAI)</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">एमपी जनसुनवाई शिकायत निवारण</a></li>
              <li><a href="#" className="hover:text-emerald-400 transition-colors">कृषि एवं किसान कल्याण मंत्रालय</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-3">सहयोग एवं संपर्क</h4>
            <p className="text-gray-500 text-[11px] leading-relaxed mb-3">
              तकनीकी समस्याओं हेतु अपने स्थानीय पंचायत सचिव या जनसेवा केंद्र (CSC) प्रबंधक से संपर्क करें।
            </p>
            <div className="text-[10px] text-gray-600">
              © 2026 ग्राम पंचायत विभाग। सर्वाधिकार सुरक्षित।
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto border-t border-gray-800 mt-8 pt-4 text-center text-[10px] text-gray-600 flex flex-col sm:flex-row justify-between items-center gap-4">
          <span>राष्ट्रीय सूचना विज्ञान केंद्र (NIC) द्वारा तकनीकी समर्थन के साथ डिज़ाइन एवं विकसित।</span>
          <span className="flex items-center gap-1">सच्चे मन से बनाया गया <Heart className="h-3 w-3 text-red-600 fill-red-600" /> ग्राम उत्थान अभियान</span>
        </div>
      </footer>
    </div>
  );
}
