/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Citizen, ServiceApplication } from '../types/portal';
import { Clipboard, Shield, CheckCircle, Users } from 'lucide-react';

interface WelfareServicesProps {
  citizen: Citizen | null;
  serviceId: string;
  onAddApplication: (app: ServiceApplication) => void;
}

export default function WelfareServices({ citizen, serviceId, onAddApplication }: WelfareServicesProps) {
  // Ration card states
  const [familyMembers, setFamilyMembers] = useState<string>('3');
  const [rationType, setRationType] = useState<string>('BPL (गरीबी रेखा के नीचे)');
  const [rationSuccess, setRationSuccess] = useState<string>('');

  // Pension states
  const [pensionType, setPensionType] = useState<string>('इंदिरा गांधी वृद्धावस्था पेंशन');
  const [pensionApplicantAge, setPensionApplicantAge] = useState<string>('');
  const [pensionSuccess, setPensionSuccess] = useState<string>('');

  const handleRationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizen) {
      alert('कृपया राशन कार्ड आवेदन के लिए पहले लॉगिन करें।');
      return;
    }

    const receiptNo = `RAT-${Math.floor(100000 + Math.random() * 900000)}`;
    const newApp: ServiceApplication = {
      id: `APP-WA-${Date.now()}`,
      serviceId: 'ration-card',
      serviceName: 'नया राशन कार्ड हेतु आवेदन',
      applicantName: citizen.name,
      applicantPhone: citizen.phone,
      submissionDate: new Date().toLocaleDateString('hi-IN'),
      status: 'लंबित',
      receiptNo,
      details: {
        'राशन कार्ड श्रेणी': rationType,
        'परिवार के कुल सदस्य': familyMembers,
        'गाँव': citizen.village,
        'जिला': citizen.district,
      }
    };

    onAddApplication(newApp);
    setRationSuccess(`आपका राशन कार्ड आवेदन सफलतापूर्वक जमा हो गया है! रसीद संख्या: ${receiptNo} है। आप इसे अपने नागरिक डैशबोर्ड में ट्रैक कर सकते हैं।`);
    setFamilyMembers('3');
  };

  const handlePensionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizen) {
      alert('कृपया पेंशन योजना के लिए पहले लॉगिन करें।');
      return;
    }

    const age = parseInt(pensionApplicantAge);
    if (isNaN(age) || age < 60) {
      alert('क्षमा करें, वृद्धावस्था पेंशन के लिए न्यूनतम आयु 60 वर्ष आवश्यक है।');
      return;
    }

    const receiptNo = `PEN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newApp: ServiceApplication = {
      id: `APP-PE-${Date.now()}`,
      serviceId: 'pension-scheme',
      serviceName: `${pensionType} आवेदन`,
      applicantName: citizen.name,
      applicantPhone: citizen.phone,
      submissionDate: new Date().toLocaleDateString('hi-IN'),
      status: 'जांच के अधीन',
      receiptNo,
      details: {
        'पेंशन योजना का नाम': pensionType,
        'आवेदक की आयु': pensionApplicantAge,
        'मासिक पेंशन सहायता (₹)': '600 / महीना',
      }
    };

    onAddApplication(newApp);
    setPensionSuccess(`पेंशन आवेदन सफलतापूर्वक स्वीकार कर लिया गया है। समीक्षा रसीद नंबर: ${receiptNo} है।`);
    setPensionApplicantAge('');
  };

  return (
    <div className="space-y-6">
      {/* 1. Ration Card */}
      {serviceId === 'ration-card' && (
        <div className="bg-white rounded-xl p-6 border border-blue-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Users className="h-6 w-6" id="ration-users-icon" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 font-sans">नया डिजिटल राशन कार्ड आवेदन</h4>
              <p className="text-xs text-gray-500 font-sans">राष्ट्रीय खाद्य सुरक्षा अधिनियम के तहत सस्ता राशन/अनाज कार्ड पंजीकरण</p>
            </div>
          </div>

          {rationSuccess ? (
            <div className="bg-blue-50 border border-blue-100 text-blue-800 p-5 rounded-xl text-center">
              <CheckCircle className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h5 className="font-bold text-lg mb-2 font-sans">राशन कार्ड आवेदन पत्र जमा हुआ</h5>
              <p className="text-sm font-sans mb-4">{rationSuccess}</p>
              <button
                onClick={() => setRationSuccess('')}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-lg font-medium"
              >
                नया राशन कार्ड आवेदन करें
              </button>
            </div>
          ) : (
            <form onSubmit={handleRationSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">राशन कार्ड श्रेणी चुनें</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm bg-white"
                    value={rationType}
                    onChange={(e) => setRationType(e.target.value)}
                  >
                    <option value="BPL (गरीबी रेखा के नीचे)">BPL (पीला कार्ड - गरीबी रेखा के नीचे)</option>
                    <option value="AAY (अंत्योदय अन्न योजना)">AAY (गुलाबी कार्ड - अत्यंत गरीब परिवार)</option>
                    <option value="APL (सामान्य गरीबी रेखा के ऊपर)">APL (नीला कार्ड - गरीबी रेखा के ऊपर)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">परिवार में कुल सदस्यों की संख्या</label>
                  <input
                    type="number"
                    min="1"
                    required
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={familyMembers}
                    onChange={(e) => setFamilyMembers(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100/50 text-xs text-gray-600">
                <p className="font-bold text-blue-800 mb-1">💡 आवश्यक संलग्नक (तहसील सत्यापन हेतु):</p>
                <p>आवेदन स्वीकार होने के बाद राशन दुकान डीलर को परिवार के सभी सदस्यों का आधार कार्ड और समग्र आईडी फोटोकॉपी जमा करना होगा।</p>
              </div>

              <button
                type="submit"
                id="ration-submit-btn"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-sm transition-all"
              >
                डिजिटल राशन कार्ड के लिए आवेदन पत्र जमा करें
              </button>

              {!citizen && (
                <p className="text-xs text-red-500 text-center mt-2 font-sans">
                  * इस सेवा का लाभ लेने के लिए कृपया लॉगिन करें।
                </p>
              )}
            </form>
          )}
        </div>
      )}

      {/* 2. Old Age Pension */}
      {serviceId === 'pension-scheme' && (
        <div className="bg-white rounded-xl p-6 border border-blue-100 shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <Clipboard className="h-6 w-6" id="pension-clipboard-icon" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-gray-900 font-sans">सामाजिक सुरक्षा पेंशन योजना</h4>
              <p className="text-xs text-gray-500 font-sans">वृद्धजन, विधवा और दिव्यांगजनों के लिए मासिक पेंशन योजना आवेदन</p>
            </div>
          </div>

          {pensionSuccess ? (
            <div className="bg-blue-50 border border-blue-100 text-blue-800 p-5 rounded-xl text-center">
              <CheckCircle className="h-12 w-12 text-blue-600 mx-auto mb-3" />
              <h5 className="font-bold text-lg mb-2 font-sans">पेंशन आवेदन जमा हुआ</h5>
              <p className="text-sm font-sans mb-4">{pensionSuccess}</p>
              <button
                onClick={() => setPensionSuccess('')}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-lg font-medium"
              >
                नया पेंशन आवेदन करें
              </button>
            </div>
          ) : (
            <form onSubmit={handlePensionSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">पेंशन योजना का चयन करें</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm bg-white"
                    value={pensionType}
                    onChange={(e) => setPensionType(e.target.value)}
                  >
                    <option value="इंदिरा गांधी वृद्धावस्था पेंशन">इंदिरा गांधी वृद्धावस्था पेंशन (उम्र 60+)</option>
                    <option value="कल्याणी (विधवा) सुरक्षा पेंशन">कल्याणी (विधवा) सुरक्षा पेंशन</option>
                    <option value="निःशक्तजन (दिव्यांग) सुरक्षा पेंशन">निःशक्तजन (दिव्यांग) सुरक्षा पेंशन</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">आवेदक की आयु (वर्षों में)</label>
                  <input
                    type="number"
                    required
                    placeholder="उदा. 64"
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={pensionApplicantAge}
                    onChange={(e) => setPensionApplicantAge(e.target.value)}
                  />
                </div>
              </div>

              <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100/50 text-xs text-gray-600 space-y-1">
                <p className="font-bold text-blue-800">📋 पात्रता मानदंड:</p>
                <p>• वृद्धावस्था पेंशन योजना के लिए आवेदक की आयु 60 वर्ष या अधिक होनी चाहिए।</p>
                <p>• दिव्यांग पेंशन के लिए 40% या उससे अधिक का चिकित्सा प्रमाण पत्र होना अनिवार्य है।</p>
              </div>

              <button
                type="submit"
                id="pension-submit-btn"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg text-sm transition-all"
              >
                पेंशन आवेदन पत्र जमा करें
              </button>

              {!citizen && (
                <p className="text-xs text-red-500 text-center mt-2 font-sans">
                  * इस सेवा का लाभ लेने के लिए कृपया लॉगिन करें।
                </p>
              )}
            </form>
          )}
        </div>
      )}
    </div>
  );
}
