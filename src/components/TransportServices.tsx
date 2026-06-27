/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Citizen, ServiceApplication, VehicleRC, TrafficChallan } from '../types/portal';
import { CreditCard, Search, BookOpen, AlertTriangle, CheckCircle, HelpCircle, ArrowRight, ShieldCheck, Calendar, Clock } from 'lucide-react';

interface TransportServicesProps {
  citizen: Citizen | null;
  serviceId: string;
  onAddApplication: (app: ServiceApplication) => void;
}

export default function TransportServices({ citizen, serviceId, onAddApplication }: TransportServicesProps) {
  // DL State
  const [dlStep, setDlStep] = useState<'options' | 'apply' | 'test' | 'test-complete'>('options');
  const [dlType, setDlType] = useState<string>('नया लर्निंग लाइसेंस');
  const [dlApplicant, setDlApplicant] = useState<string>(citizen?.name || '');
  const [dlDob, setDlDob] = useState<string>('');
  const [dlSuccessMsg, setDlSuccessMsg] = useState<string>('');
  
  // Quiz State
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);

  const quizQuestions = [
    {
      q: "लाल बत्ती (Red Light) का क्या अर्थ है?",
      options: ["वाहन चलाएं", "सावधान रहें", "वाहन तुरंत रोकें", "गति कम करें"],
      correct: 2,
      explanation: "लाल बत्ती का अर्थ है वाहन को तुरंत रोकना।"
    },
    {
      q: "कौन सा चिन्ह दर्शाता है कि आगे रास्ता संकरा है?",
      options: ["गोल घेरे में लाल पट्टी", "त्रिकोणीय बोर्ड पर संकरा पुल", "आयताकार नीला बोर्ड", "इनमें से कोई नहीं"],
      correct: 1,
      explanation: "त्रिकोणीय चेतावनी चिन्हों का उपयोग आगे संकरा मार्ग या संकरा पुल दर्शाने के लिए किया जाता है।"
    },
    {
      q: "दुपहिया वाहन चलाते समय सुरक्षा के लिए क्या अनिवार्य है?",
      options: ["सनग्लासेस", "सीटबेल्ट", "आईएसआई प्रमाणित हेलमेट", "मोबाइल स्टैंड"],
      correct: 2,
      explanation: "हेलमेट पहनना सिर की सुरक्षा के लिए और कानूनन अनिवार्य है।"
    },
    {
      q: "एम्बुलेंस या अग्निशामक वाहन के आने पर आपको क्या करना चाहिए?",
      options: ["अपने वाहन की गति बढ़ाएं", "उन्हें रास्ता देने के लिए अपना वाहन किनारे करें", "उनके आगे-आगे चलें", "लगातार हॉर्न बजाएं"],
      correct: 1,
      explanation: "आपातकालीन वाहनों को तुरंत और बिना किसी बाधा के रास्ता देना चाहिए।"
    },
    {
      q: "अस्पताल या स्कूल के पास किस चीज़ की सख्त मनाही होती है?",
      options: ["हॉर्न बजाना (नो हॉर्न ज़ोन)", "वाहन खड़ा करना", "तेज़ गति से चलना", "उपरोक्त सभी"],
      correct: 3,
      explanation: "अस्पताल और स्कूल मौन क्षेत्र (Silent Zones) होते हैं जहाँ तेज़ गति और हॉर्न बजाना वर्जित है।"
    }
  ];

  // RC State
  const [vehicleNo, setVehicleNo] = useState<string>('');
  const [rcDetails, setRcDetails] = useState<VehicleRC | null>(null);
  const [rcSearchDone, setRcSearchDone] = useState<boolean>(false);

  // Challan State
  const [challanVehicleNo, setChallanVehicleNo] = useState<string>('');
  const [challans, setChallans] = useState<TrafficChallan[]>([]);
  const [challanSearchDone, setChallanSearchDone] = useState<boolean>(false);

  // Vahan Token State
  const [vahanNo, setVahanNo] = useState<string>('');
  const [rtoOffice, setRtoOffice] = useState<string>('RTO Raisen (MP-38)');
  const [vahanServiceType, setVahanServiceType] = useState<string>('फिटनेस प्रमाण पत्र (Fitness Certificate)');
  const [vahanDate, setVahanDate] = useState<string>('');
  const [vahanSuccess, setVahanSuccess] = useState<string>('');

  const handleVahanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizen) {
      alert('कृपया वाहन टोकन स्लॉट बुक करने के लिए पहले लॉगिन करें।');
      return;
    }

    const cleanNo = vahanNo.toUpperCase().replace(/\s+/g, '');
    if (cleanNo.length < 6) {
      alert('कृपया एक वैध वाहन नंबर दर्ज करें (उदा. MP04AB1234)।');
      return;
    }

    const receiptNo = `VHN-${Math.floor(100000 + Math.random() * 900000)}`;
    const counterNo = Math.floor(1 + Math.random() * 5);
    const appTime = `${Math.floor(10 + Math.random() * 3)}:${Math.random() > 0.5 ? '30' : '00'} AM`;

    const newApp: ServiceApplication = {
      id: `APP-VH-${Date.now()}`,
      serviceId: 'vahan-token',
      serviceName: 'वाहन टोकन स्लॉट (Vahan Token)',
      applicantName: citizen.name,
      applicantPhone: citizen.phone,
      submissionDate: new Date().toLocaleDateString('hi-IN'),
      status: 'स्वीकृत',
      receiptNo,
      details: {
        'वाहन नंबर': cleanNo,
        'आरटीओ कार्यालय (RTO)': rtoOffice,
        'सेवा का प्रकार': vahanServiceType,
        'अपॉइंटमेंट तिथि': vahanDate,
        'अपॉइंटमेंट समय': appTime,
        'आवंटित काउंटर': `काउंटर नंबर ${counterNo}`,
      }
    };

    onAddApplication(newApp);
    setVahanSuccess(`बधाई हो! आपका आरटीओ अपॉइंटमेंट स्लॉट बुक कर लिया गया है। रसीद नंबर: ${receiptNo} है। कृपया चयनित तिथि को समय ${appTime} पर आरटीओ कार्यालय में उपस्थित रहें।`);
  };

  // Apply for Learning License
  const handleDlApply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizen) {
      alert('कृपया आवेदन करने के लिए पहले लॉगिन करें।');
      return;
    }

    const receiptNo = `LLN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newApp: ServiceApplication = {
      id: `APP-DL-${Date.now()}`,
      serviceId: 'driving-license',
      serviceName: `${dlType} आवेदन`,
      applicantName: dlApplicant,
      applicantPhone: citizen.phone,
      submissionDate: new Date().toLocaleDateString('hi-IN'),
      status: 'लंबित',
      receiptNo,
      details: {
        'लाइसेंस का प्रकार': dlType,
        'जन्मतिथि': dlDob,
        'ऑनलाइन परीक्षा': 'अनिवार्य'
      }
    };

    onAddApplication(newApp);
    setDlSuccessMsg(`आपका ड्राइविंग लाइसेंस आवेदन सफलतापूर्वक पंजीकृत हो गया है! रसीद संख्या: ${receiptNo}। आप परीक्षा देकर इसे तुरंत स्वीकृत करवा सकते हैं।`);
    setDlStep('options');
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === quizQuestions[currentQuestion].correct) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < quizQuestions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
    } else {
      // Complete quiz
      setDlStep('test-complete');
    }
  };

  const startQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setDlStep('test');
  };

  // RC Search
  const handleRcSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setRcSearchDone(true);
    const cleanNo = vehicleNo.toUpperCase().replace(/\s+/g, '');

    if (cleanNo.length < 6) {
      setRcDetails(null);
      return;
    }

    // Realistic vehicle lookup mock
    const modelOptions = ["Maruti Suzuki Swift", "Hero Splendor Plus", "Hyundai Creta", "Honda Shine", "Mahindra Bolero"];
    const owners = ["कमलेश शर्मा", "सुरेश कुमार प्रजापति", "राजेंद्र सिंह बघेल", "पंकज कुमार धाकड़", "विष्णु दत्त शर्मा"];
    
    const hash = cleanNo.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const modelIndex = hash % modelOptions.length;
    const ownerIndex = hash % owners.length;

    const mockRC: VehicleRC = {
      vehicleNo: cleanNo.substring(0, 4) + ' ' + cleanNo.substring(4, 6) + ' ' + cleanNo.substring(6),
      ownerName: owners[ownerIndex],
      makerModel: modelOptions[modelIndex],
      regDate: `12/04/201${hash % 10}`,
      fuelType: modelIndex === 1 || modelIndex === 3 ? "पेट्रोल (Petrol / 2-Wheel)" : "डीजल (Diesel / 4-Wheel)",
      engineNo: `ENG${hash}983`,
      chassisNo: `CHA${hash}8491823`,
      insuranceValidTill: `14/12/202${(hash % 4) + 6}`,
      fitnessValidTill: `11/04/203${hash % 5}`,
      pucValidTill: `28/09/2026`,
    };

    setRcDetails(mockRC);
  };

  // Challan Search
  const handleChallanSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setChallanSearchDone(true);
    const cleanNo = challanVehicleNo.toUpperCase().replace(/\s+/g, '');

    if (cleanNo.length < 6) {
      setChallans([]);
      return;
    }

    const hash = cleanNo.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    if (hash % 2 === 0) {
      // Mock active challan
      setChallans([
        {
          challanId: `CHL-${hash}923`,
          vehicleNo: cleanNo,
          violation: hash % 3 === 0 ? "बिना हेलमेट दुपहिया चलाना (No Helmet)" : "तेज गति से वाहन चलाना (Overspeeding)",
          amount: hash % 3 === 0 ? 500 : 1000,
          date: `10/06/2026`,
          location: "बायपास चौराहा, रायसेन",
          status: 'लंबित'
        }
      ]);
    } else {
      setChallans([]);
    }
  };

  const handlePayChallan = (challanId: string) => {
    setChallans(prev =>
      prev.map(c => c.challanId === challanId ? { ...c, status: 'भुगतान किया गया' } : c)
    );
    alert('चालान का भुगतान सफलतापूर्वक किया गया! रसीद आपके पंजीकृत मोबाइल पर भेज दी गई है।');
  };

  return (
    <div className="space-y-6">
      {/* 1. Driving License Service */}
      {serviceId === 'driving-license' && (
        <div className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                <CreditCard className="h-6 w-6" id="dl-credit-card-icon" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 font-sans">ड्राइविंग लाइसेंस सेवाएँ</h4>
                <p className="text-xs text-gray-500 font-sans">लर्निंग लाइसेंस आवेदन, नवीनीकरण और ऑनलाइन परीक्षा</p>
              </div>
            </div>
            {dlStep !== 'options' && (
              <button
                onClick={() => setDlStep('options')}
                className="text-xs text-purple-600 hover:text-purple-800 font-bold"
              >
                ← मुख्य मेनू
              </button>
            )}
          </div>

          {dlSuccessMsg && (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xl mb-4 text-xs font-medium flex items-start gap-2.5">
              <CheckCircle className="h-5 w-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold mb-1">आवेदन सुरक्षित हुआ!</p>
                <p>{dlSuccessMsg}</p>
                <button
                  onClick={() => setDlSuccessMsg('')}
                  className="mt-2 text-emerald-700 underline font-bold"
                >
                  ठीक है
                </button>
              </div>
            </div>
          )}

          {dlStep === 'options' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-purple-100 rounded-xl p-4 bg-purple-50/20 hover:bg-purple-50/50 transition-all flex flex-col justify-between">
                <div>
                  <h5 className="font-bold text-sm text-purple-900 mb-1">नया लर्निंग लाइसेंस आवेदन</h5>
                  <p className="text-xs text-gray-500 mb-3">6 महीने की वैधता वाले शिक्षार्थी लाइसेंस के लिए नया पंजीयन दर्ज करें।</p>
                </div>
                <button
                  onClick={() => {
                    setDlType('नया लर्निंग लाइसेंस');
                    setDlStep('apply');
                  }}
                  id="dl-apply-btn"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white text-xs py-2 rounded-lg font-bold transition-all"
                >
                  नया आवेदन पत्र भरें
                </button>
              </div>

              <div className="border border-purple-100 rounded-xl p-4 bg-purple-50/20 hover:bg-purple-50/50 transition-all flex flex-col justify-between">
                <div>
                  <h5 className="font-bold text-sm text-purple-900 mb-1">कम्प्यूटर मित्र - मॉक टेस्ट परीक्षा</h5>
                  <p className="text-xs text-gray-500 mb-3">लर्निंग लाइसेंस के लिए आवश्यक ऑनलाइन सड़क सुरक्षा एवं यातायात चिन्हों की परीक्षा दें।</p>
                </div>
                <button
                  onClick={startQuiz}
                  id="dl-test-btn"
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="h-4 w-4" /> ऑनलाइन परीक्षा प्रारंभ करें
                </button>
              </div>
            </div>
          )}

          {dlStep === 'apply' && (
            <form onSubmit={handleDlApply} className="space-y-4 max-w-md">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">लाइसेंस प्रकार</label>
                <input
                  type="text"
                  readOnly
                  className="w-full border border-gray-200 bg-gray-50 rounded-lg py-2 px-3 text-sm font-semibold text-gray-800"
                  value={dlType}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">आवेदक का नाम (आधारानुसार)</label>
                <input
                  type="text"
                  required
                  placeholder="आवेदक का पूरा नाम"
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  value={dlApplicant}
                  onChange={(e) => setDlApplicant(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">जन्मतिथि (उम्र कम से कम 18 वर्ष आवश्यक)</label>
                <input
                  type="date"
                  required
                  className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  value={dlDob}
                  onChange={(e) => setDlDob(e.target.value)}
                />
              </div>

              <button
                type="submit"
                id="dl-submit-btn"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 rounded-lg text-sm transition-all"
              >
                आवेदन जमा करें और टेस्ट स्लॉट बुक करें
              </button>
            </form>
          )}

          {dlStep === 'test' && (
            <div className="bg-purple-50/50 border border-purple-100 p-5 rounded-xl">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-purple-800">प्रश्न {currentQuestion + 1} / {quizQuestions.length}</span>
                <span className="text-xs text-gray-500 font-mono">लर्निंग लाइसेंस टेस्ट</span>
              </div>

              <div className="mb-4">
                <h5 className="font-bold text-sm text-gray-900 mb-3">{quizQuestions[currentQuestion].q}</h5>
                <div className="space-y-2">
                  {quizQuestions[currentQuestion].options.map((option, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedAnswer(idx)}
                      className={`w-full text-left p-3 rounded-lg text-xs transition-all border ${
                        selectedAnswer === idx
                          ? 'border-purple-600 bg-purple-100 text-purple-950 font-semibold'
                          : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {idx + 1}. {option}
                    </button>
                  ))}
                </div>
              </div>

              {selectedAnswer !== null && (
                <div className="mt-4 flex items-center justify-between">
                  <p className="text-[11px] text-gray-500 italic max-w-[70%]">
                    💡 संकेत: {quizQuestions[currentQuestion].explanation}
                  </p>
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="bg-purple-600 hover:bg-purple-700 text-white text-xs px-4 py-1.5 rounded-lg font-bold flex items-center gap-1"
                  >
                    अगला प्रश्न <ArrowRight className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          )}

          {dlStep === 'test-complete' && (
            <div className="bg-white border border-gray-200 p-6 rounded-xl text-center space-y-4 shadow-inner">
              <div className="inline-flex p-3 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                <ShieldCheck className="h-10 w-10 animate-bounce" id="test-shield-check" />
              </div>
              <div>
                <h5 className="font-bold text-lg text-gray-900 font-sans">परीक्षण परिणाम (Test Report)</h5>
                <p className="text-sm text-gray-600 mt-1">आपने 5 में से <strong>{score}</strong> अंक प्राप्त किए हैं।</p>
              </div>

              {score >= 4 ? (
                <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl max-w-md mx-auto">
                  <p className="text-xs text-emerald-800 font-bold mb-1">🎉 उत्तीर्ण (Passed)!</p>
                  <p className="text-[11px] text-emerald-700">
                    बधाई हो! आपने ऑनलाइन कम्प्यूटर परीक्षा पास कर ली है। आपका लर्निंग लाइसेंस स्वीकृत किया जाता है। रसीद आपके मोबाइल नंबर पर एसएमएस द्वारा भेजी गई है।
                  </p>
                  <div className="mt-3 p-2 bg-white border border-emerald-200 rounded-lg font-mono text-[10px] text-gray-600">
                    डिजिटल प्रमाण पत्र सं: LL-DL-{Math.floor(100000 + Math.random() * 900000)}
                  </div>
                </div>
              ) : (
                <div className="bg-red-50 border border-red-100 p-4 rounded-xl max-w-md mx-auto">
                  <p className="text-xs text-red-800 font-bold mb-1">❌ अनुत्तीर्ण (Failed)</p>
                  <p className="text-[11px] text-red-700">
                    परीक्षण पास करने के लिए कम से कम 4 प्रश्नों का सही उत्तर देना आवश्यक है। कृपया यातायात नियमों को पुनः पढ़कर फिर से प्रयास करें।
                  </p>
                  <button
                    onClick={startQuiz}
                    className="mt-3 bg-red-600 hover:bg-red-700 text-white text-xs px-4 py-1.5 rounded-md font-semibold"
                  >
                    पुनः परीक्षा दें
                  </button>
                </div>
              )}

              <button
                onClick={() => setDlStep('options')}
                className="text-xs text-purple-600 hover:text-purple-800 font-bold block mx-auto underline pt-2"
              >
                वापस परिवहन होम पर जाएं
              </button>
            </div>
          )}
        </div>
      )}

      {/* 2. Vahan RC Information */}
      {serviceId === 'vahan-rc' && (
        <div className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <Search className="h-6 w-6" id="rc-search-icon" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 font-sans">वाहन RC (पंजीकरण प्रमाण पत्र) खोज</h4>
              <p className="text-xs text-gray-500 font-sans">वाहन पंजीकरण संख्या (जैसे: MP04-HE-1234) दर्ज कर पूर्ण विवरण जानें</p>
            </div>
          </div>

          <form onSubmit={handleRcSearch} className="flex gap-2 max-w-md mb-6">
            <input
              type="text"
              required
              placeholder="उदा. MP04HE1234"
              className="flex-1 border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none uppercase"
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value)}
            />
            <button
              type="submit"
              id="rc-find-btn"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 rounded-lg flex items-center gap-1.5 font-bold text-xs"
            >
              <Search className="h-4 w-4" /> खोजें
            </button>
          </form>

          {rcSearchDone && (
            rcDetails ? (
              <div className="bg-purple-50/30 border border-purple-100 rounded-xl p-5 space-y-4">
                <div className="flex justify-between items-center border-b border-purple-200/50 pb-2">
                  <span className="text-sm font-bold text-purple-950 font-mono">{rcDetails.vehicleNo}</span>
                  <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full text-[10px] font-bold">
                    सक्रिय (Active RC)
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs font-sans">
                  <div>
                    <span className="text-gray-500 block">वाहन स्वामी (Owner)</span>
                    <strong className="text-gray-900 text-sm">{rcDetails.ownerName}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">मेकर / मॉडल</span>
                    <strong className="text-gray-900 text-sm">{rcDetails.makerModel}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">पंजीकरण तिथि</span>
                    <strong className="text-gray-900 text-sm">{rcDetails.regDate}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">ईंधन का प्रकार</span>
                    <strong className="text-gray-900 text-sm">{rcDetails.fuelType}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">बीमा वैधता तिथि</span>
                    <strong className="text-gray-900 text-sm">{rcDetails.insuranceValidTill}</strong>
                  </div>
                  <div>
                    <span className="text-gray-500 block">प्रदूषण जाँच (PUC)</span>
                    <strong className="text-emerald-700 text-sm font-bold">वैध: {rcDetails.pucValidTill}</strong>
                  </div>
                </div>

                <div className="border-t border-purple-100 pt-3 grid grid-cols-2 gap-4 text-[10px] text-gray-500 font-mono">
                  <div>इंजन नंबर: {rcDetails.engineNo}</div>
                  <div>चेसिस नंबर: {rcDetails.chassisNo}</div>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-100 text-amber-800 p-4 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>वाहन विवरण नहीं मिला। कृपया वैध पंजीकरण नंबर दर्ज करें (जैसे: MP04HE1234)।</span>
              </div>
            )
          )}
        </div>
      )}

      {/* 3. Traffic Challan Check */}
      {serviceId === 'challan-check' && (
        <div className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <AlertTriangle className="h-6 w-6" id="challan-warning-icon" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 font-sans">ई-चालान की स्थिति जाँचें</h4>
              <p className="text-xs text-gray-500 font-sans">यातायात नियमों के उल्लंघन के लंबित चालान खोजें और भुगतान करें</p>
            </div>
          </div>

          <form onSubmit={handleChallanSearch} className="flex gap-2 max-w-md mb-6">
            <input
              type="text"
              required
              placeholder="उदा. MP04HE1234 या चालान संख्या"
              className="flex-1 border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none uppercase"
              value={challanVehicleNo}
              onChange={(e) => setChallanVehicleNo(e.target.value)}
            />
            <button
              type="submit"
              id="challan-find-btn"
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 rounded-lg flex items-center gap-1.5 font-bold text-xs"
            >
              <Search className="h-4 w-4" /> खोजें
            </button>
          </form>

          {challanSearchDone && (
            challans.length > 0 ? (
              <div className="space-y-3">
                {challans.map((challan) => (
                  <div key={challan.challanId} className="bg-red-50/50 border border-red-100 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-mono text-xs font-bold text-red-900">{challan.challanId}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          challan.status === 'लंबित' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {challan.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-800 font-semibold mb-1">{challan.violation}</p>
                      <div className="text-[11px] text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                        <span>दिनांक: {challan.date}</span>
                        <span>स्थान: {challan.location}</span>
                      </div>
                    </div>

                    <div className="text-right w-full md:w-auto flex justify-between md:flex-col items-center md:items-end gap-2 border-t md:border-0 border-red-100 pt-2.5 md:pt-0">
                      <div>
                        <span className="text-[10px] text-gray-500 block">जुर्माना राशि</span>
                        <strong className="text-sm text-red-700 font-bold">₹{challan.amount}</strong>
                      </div>
                      {challan.status === 'लंबित' && (
                        <button
                          onClick={() => handlePayChallan(challan.challanId)}
                          id={`pay-btn-${challan.challanId}`}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-1.5 rounded-md font-semibold transition-all shadow-sm"
                        >
                          अभी ऑनलाइन भुगतान करें
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xl text-xs flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>बधाई हो! इस वाहन के लिए कोई लंबित ई-चालान नहीं पाया गया है। सुरक्षित वाहन चलाते रहें।</span>
              </div>
            )
          )}
        </div>
      )}

      {/* 4. Vahan Token Booking Section */}
      {serviceId === 'vahan-token' && (
        <div className="bg-white rounded-xl p-6 border border-purple-100 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 pb-2 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                <Calendar className="h-6 w-6" id="vahan-calendar-icon" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 font-sans">मध्य प्रदेश परिवहन विभाग - ऑनलाइन स्लॉट बुकिंग</h4>
                <p className="text-xs text-gray-500 font-sans">वाहन फिटनेस, परमिट नवीनीकरण एवं आरटीओ काउंटर हेतु ऑनलाइन अग्रिम टोकन</p>
              </div>
            </div>
            <a 
              href="https://parivahan.gov.in/" 
              target="_blank" 
              rel="noreferrer" 
              className="bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs py-1.5 px-3 rounded-lg border border-purple-200 flex items-center gap-1 cursor-pointer transition-colors"
            >
              सारथी पोर्टल <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>

          {vahanSuccess ? (
            <div className="bg-purple-50 border-2 border-dashed border-purple-200 rounded-xl p-5 space-y-4">
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-purple-600 mx-auto mb-2" />
                <h5 className="font-extrabold text-purple-950 text-base font-sans">आरटीओ अपॉइंटमेंट टोकन रसीद (RTO Appointment Slip)</h5>
                <p className="text-xs text-gray-500">परिवहन विभाग, मध्य प्रदेश शासन</p>
              </div>

              <div className="bg-white p-4 rounded-xl border border-purple-100 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
                <div>
                  <span className="text-gray-400 block text-[10px]">वाहन स्वामी</span>
                  <strong className="text-gray-800">{citizen?.name}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">वाहन नंबर (Vehicle No)</span>
                  <strong className="text-gray-800">{vahanNo.toUpperCase().replace(/\s+/g, '')}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">आरटीओ कार्यालय (RTO)</span>
                  <strong className="text-gray-800">{rtoOffice}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">चयनित सेवा का प्रकार</span>
                  <strong className="text-gray-800">{vahanServiceType}</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">अपॉइंटमेंट तिथि एवं समय</span>
                  <strong className="text-purple-800 font-bold">{vahanDate} ({Math.floor(10 + Math.random() * 2)}:30 AM)</strong>
                </div>
                <div>
                  <span className="text-gray-400 block text-[10px]">आवंटित काउंटर व टोकन</span>
                  <strong className="text-purple-700 font-bold">काउंटर {Math.floor(1 + Math.random() * 4)} • टोकन: #RTO-{Math.floor(100 + Math.random() * 900)}</strong>
                </div>
              </div>

              <div className="bg-purple-100/40 p-3 rounded-lg text-[10px] text-purple-800 space-y-1">
                <p className="font-bold">⚠️ महत्वपूर्ण निर्देश:</p>
                <p>1. कृपया निर्धारित समय से 15 मिनट पूर्व संबंधित आरटीओ कार्यालय में उपस्थित हों।</p>
                <p>2. अपने साथ वाहन के मूल दस्तावेज (RC, बीमा, प्रदूषण प्रमाण पत्र) तथा मूल आधार कार्ड आवश्यक रूप से लाएं।</p>
                <p>3. भौतिक सत्यापन होने के बाद ही रसीद काउंटर से अग्रिम प्रक्रिया पूर्ण की जाएगी।</p>
              </div>

              <div className="flex justify-center gap-2">
                <button 
                  onClick={() => window.print()}
                  className="bg-[#008f5d] hover:bg-[#00764d] text-white font-bold text-xs py-2 px-4 rounded-lg flex items-center gap-1 cursor-pointer"
                >
                  टोकन पर्ची प्रिंट करें
                </button>
                <button 
                  onClick={() => setVahanSuccess('')}
                  className="bg-white border border-gray-300 text-gray-700 font-bold text-xs py-2 px-4 rounded-lg cursor-pointer"
                >
                  नया अपॉइंटमेंट बुक करें
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleVahanSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">वाहन नंबर दर्ज करें (Vehicle Registration No)</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. MP04AB1234"
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none uppercase"
                    value={vahanNo}
                    onChange={(e) => setVahanNo(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">संबंधित आरटीओ कार्यालय चुनें (RTO)</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm bg-white"
                    value={rtoOffice}
                    onChange={(e) => setRtoOffice(e.target.value)}
                  >
                    <option value="RTO Raisen (MP-38)">आरटीओ कार्यालय रायसेन (MP-38)</option>
                    <option value="RTO Bhopal (MP-04)">आरटीओ कार्यालय भोपाल (MP-04)</option>
                    <option value="RTO Sehore (MP-37)">आरटीओ कार्यालय सीहोर (MP-37)</option>
                    <option value="RTO Vidisha (MP-40)">आरटीओ कार्यालय विदिशा (MP-40)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">सेवा का प्रकार (Service Required)</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm bg-white"
                    value={vahanServiceType}
                    onChange={(e) => setVahanServiceType(e.target.value)}
                  >
                    <option value="फिटनेस प्रमाण पत्र (Fitness Certificate)">फिटनेस प्रमाण पत्र (Fitness Certificate)</option>
                    <option value="नया वाहन पंजीकरण (New Vehicle Registration)">नया वाहन पंजीकरण (New Vehicle Registration)</option>
                    <option value="परमिट नवीनीकरण (Permit Renewal)">परमिट नवीनीकरण (Permit Renewal)</option>
                    <option value="एचएसआरपी सुरक्षा नंबर प्लेट (HSRP Booking)">एचएसआरपी सुरक्षा नंबर प्लेट (HSRP Booking)</option>
                    <option value="वाहन स्वामित्व हस्तांतरण (Transfer of Ownership)">वाहन स्वामित्व हस्तांतरण (Transfer of Ownership)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">अपॉइंटमेंट की पसंदीदा तिथि (Date)</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    value={vahanDate}
                    onChange={(e) => setVahanDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-purple-50/50 p-3 rounded-lg border border-purple-100 text-xs text-gray-600">
                <p className="font-bold text-purple-800 mb-1">💡 स्लॉट बुकिंग लाभ:</p>
                <p>परिवहन कार्यालयों में भीड़ नियंत्रण एवं त्वरित सेवा देने हेतु ऑनलाइन टाइम स्लॉट अनिवार्य किया गया है। यहाँ स्लॉट आरक्षित करके सीधे नियत काउंटर पर पहुँचें।</p>
              </div>

              <button
                type="submit"
                id="vahan-token-btn"
                className="w-full bg-[#008f5d] hover:bg-[#00764d] text-white font-bold py-2.5 rounded-lg text-sm transition-all cursor-pointer"
              >
                आरटीओ स्लॉट आरक्षित करें
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
