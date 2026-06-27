/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Phone, ShieldAlert, Sparkles, MessageSquare, Send } from 'lucide-react';

export default function GramPanchayatHelper() {
  const helplines = [
    { name: 'किसान कॉल सेंटर (Kisan Helpline)', number: '1800-180-1551', desc: 'कृषि सलाह' },
    { name: 'मुख्यमंत्री जनसेवा हेल्पलाइन', number: '181', desc: 'समस्या निवारण' },
    { name: 'महिला सुरक्षा हेल्पलाइन', number: '1090', desc: 'आपातकालीन सहायता' },
    { name: 'पुलिस नियंत्रण कक्ष (Police)', number: '100', desc: 'सुरक्षा सेवाएँ' },
    { name: 'एम्बुलेंस स्वास्थ्य सेवा (Ambulance)', number: '108', desc: 'चिकित्सा आपातकालीन' },
  ];

  // AI Chatbot State
  const [messages, setMessages] = useState<Array<{ text: string; isBot: boolean }>>([
    { text: 'राम-राम सा! मैं हूँ आपका डिजिटल ग्राम सहायक। आप मुझसे ग्राम सुविधाओं, योजनाओं या शिकायत दर्ज करने के बारे में कुछ भी पूछ सकते हैं।', isBot: true }
  ]);
  const [inputText, setInputText] = useState<string>('');

  const chatbotResponses: Record<string, string> = {
    'pm kisan': 'पीएम किसान सम्मान निधि के अंतर्गत पात्र किसानों को प्रतिवर्ष ₹6,000 की वित्तीय सहायता ₹2,000 की तीन किस्तों में सीधे बैंक खाते में दी जाती है। स्थिति जानने के लिए पीएम किसान सेवा खोलें।',
    'pension': 'सामाजिक सुरक्षा पेंशन योजना का लाभ केवल 60 वर्ष से अधिक आयु के वृद्धजनों, विधवा महिलाओं या 40% से अधिक दिव्यांगजनों को प्राप्त होता है। आप सामाजिक सुरक्षा पेंशन सेवा के अंतर्गत आवेदन पत्र भर सकते हैं।',
    'uparjan': 'e-Uparjan पर अपनी उपज (गेहूं, चना, धान) बेचने के लिए आपको सबसे पहले अपना फसल रकबा पंजीकृत कराना होगा। इसके बाद आप अपनी सुविधानुसार उपार्जन केंद्र पर फसल लाने हेतु स्लॉट बुक कर सकते हैं।',
    'bima': 'फसल बीमा योजना के तहत मौसम की मार से फसल खराब होने पर मुआवजा प्राप्त होता है। इसमें रबी के लिए 1.5% और खरीफ फसलों के लिए 2% प्रीमियम कृषक द्वारा देय होता है। हमारे पोर्टल के प्रीमियम कैलकुलेटर से अपनी फसल का बीमा शुल्क मापें।',
    'ration': 'नया राशन कार्ड (BPL/APL) बनवाने के लिए परिवार के सभी सदस्यों के आधार कार्ड और समग्र आईडी की आवश्यकता होती है। आप हमारे पोर्टल के "राशन कार्ड आवेदन" विभाग से फॉर्म भरकर रसीद प्राप्त कर सकते हैं।',
    'license': 'ड्राइविंग लाइसेंस बनाने के लिए आपको पहले लर्निंग लाइसेंस का फॉर्म भरना होगा। इसके बाद सड़क नियमों की कम्प्यूटर परीक्षा पास करने पर 6 माह हेतु वैध लर्निंग लाइसेंस तुरंत मिल जाएगा।',
    'शिकायत': 'यदि आपको गाँव में बिजली, पानी, सड़क या नाली की कोई समस्या है, तो आप अपने नागरिक खाते में लॉगिन करके सीधे शिकायत दर्ज़ कर सकते हैं। हमारी पंचायत समिति त्वरित कार्यवाही सुनिश्चित करेगी।',
    'नमस्ते': 'राम-राम! आप मुझसे किसी भी ग्राम सरकारी सेवा के बारे में प्रश्न पूछ सकते हैं। जैसे: "पीएम किसान", "राशन", "पेंशन", "लाइसेंस"।'
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText;
    setMessages(prev => [...prev, { text: userMsg, isBot: false }]);
    setInputText('');

    // Process Response
    setTimeout(() => {
      let botText = 'क्षमा करें, मुझे इस बारे में जानकारी नहीं है। आप मुख्य योजनाओं (पीएम किसान, पेंशन, फसल बीमा, उपार्जन, राशन) या "शिकायत" के बारे में लिख सकते हैं।';
      
      const cleanUserMsg = userMsg.toLowerCase();
      for (const [key, resp] of Object.entries(chatbotResponses)) {
        if (cleanUserMsg.includes(key)) {
          botText = resp;
          break;
        }
      }

      setMessages(prev => [...prev, { text: botText, isBot: true }]);
    }, 600);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 font-sans">
      {/* 1. Helpline Panel */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex flex-col justify-between">
        <div>
          <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-red-500 animate-pulse" />
            महत्वपूर्ण आपातकालीन हेल्पलाइन
          </h4>
          <div className="space-y-3">
            {helplines.map((hl, idx) => (
              <div key={idx} className="flex justify-between items-center p-2.5 bg-red-50/30 rounded-xl border border-red-50 hover:bg-red-50/50 transition-colors">
                <div>
                  <h5 className="text-xs font-bold text-gray-800">{hl.name}</h5>
                  <p className="text-[10px] text-gray-500 mt-0.5">{hl.desc}</p>
                </div>
                <a
                  href={`tel:${hl.number}`}
                  className="bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 font-mono transition-all"
                >
                  <Phone className="h-3 w-3" /> {hl.number}
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 text-[10px] text-gray-400 italic">
          * सभी आपातकालीन सेवाएँ 24 घंटे बिना किसी शुल्क के कार्य करती हैं।
        </div>
      </div>

      {/* 2. AI Assistant Bot */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-xs flex flex-col h-[380px] lg:h-auto">
        <div className="flex items-center gap-2 mb-3 border-b border-gray-100 pb-3 shrink-0">
          <div className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900">डिजिटल ग्राम सहायता सहायक</h4>
            <p className="text-[10px] text-emerald-600">ऑनलाइन • तत्काल समाधान</p>
          </div>
        </div>

        {/* Message Container */}
        <div className="flex-1 overflow-y-auto space-y-2 mb-3 pr-1 text-xs">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`max-w-[85%] rounded-2xl p-2.5 ${
                msg.isBot
                  ? 'bg-emerald-50 text-emerald-950 rounded-tl-none self-start border border-emerald-100'
                  : 'bg-emerald-600 text-white rounded-tr-none ml-auto'
              }`}
            >
              <p className="leading-relaxed">{msg.text}</p>
            </div>
          ))}
        </div>

        {/* Input Form */}
        <form onSubmit={handleSendMessage} className="flex gap-1.5 border-t border-gray-100 pt-3 shrink-0">
          <input
            type="text"
            placeholder="जैसे: 'राशन', 'पीएम किसान', 'लाइसेंस' लिखकर पूछें"
            className="flex-1 border border-gray-300 rounded-xl px-3 py-1.5 text-xs focus:ring-1 focus:ring-emerald-500 focus:outline-none"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button
            type="submit"
            id="chatbot-send-btn"
            className="bg-[#008f5d] hover:bg-[#00764d] text-white p-2 rounded-xl transition-all"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
