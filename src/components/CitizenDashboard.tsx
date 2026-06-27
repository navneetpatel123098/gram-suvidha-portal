/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Citizen, ServiceApplication, CitizenComplaint } from '../types/portal';
import { ClipboardList, AlertCircle, Plus, CheckCircle2, Clock, MapPin, Phone, Download, FileText } from 'lucide-react';

interface CitizenDashboardProps {
  citizen: Citizen;
  applications: ServiceApplication[];
  onLogout: () => void;
}

export default function CitizenDashboard({ citizen, applications, onLogout }: CitizenDashboardProps) {
  const [activeTab, setActiveTab] = useState<'complaints' | 'profile'>('complaints');
  
  // Complaints state
  const [complaints, setComplaints] = useState<CitizenComplaint[]>(() => {
    const saved = localStorage.getItem('citizen_complaints');
    return saved ? JSON.parse(saved) : [];
  });

  const [newComplaintTitle, setNewComplaintTitle] = useState<string>('');
  const [newComplaintCat, setNewComplaintCat] = useState<string>('पेयजल (Drinking Water)');
  const [newComplaintDesc, setNewComplaintDesc] = useState<string>('');
  const [showAddComplaint, setShowAddComplaint] = useState<boolean>(false);
  const [complaintSuccess, setComplaintSuccess] = useState<boolean>(false);

  const handleAddComplaint = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComplaintTitle.trim() || !newComplaintDesc.trim()) return;

    const newComp: CitizenComplaint = {
      id: `CMP-${Math.floor(1000 + Math.random() * 9000)}`,
      title: newComplaintTitle,
      category: newComplaintCat,
      description: newComplaintDesc,
      date: new Date().toLocaleDateString('hi-IN'),
      status: 'पंजीकृत'
    };

    const updated = [newComp, ...complaints];
    setComplaints(updated);
    localStorage.setItem('citizen_complaints', JSON.stringify(updated));
    setNewComplaintTitle('');
    setNewComplaintDesc('');
    setShowAddComplaint(false);
    setComplaintSuccess(true);
    setTimeout(() => setComplaintSuccess(false), 5000);
  };

  const downloadCertificate = (app: ServiceApplication) => {
    alert(`प्रमाणपत्र डाउनलोड प्रारंभ हुआ: \nसेवा: ${app.serviceName}\nरसीद सं: ${app.receiptNo}\nआवेदक: ${app.applicantName}\nस्थिति: ${app.status}`);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden font-sans">
      {/* User Info Bar */}
      <div className="bg-emerald-50 px-6 py-5 border-b border-emerald-100/50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h4 className="text-base font-bold text-gray-900">नमस्ते, {citizen.name}</h4>
            <span className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] rounded-full font-bold">नागरिक खाता</span>
          </div>
          <div className="text-xs text-gray-500 mt-1.5 flex flex-wrap gap-x-4 gap-y-1">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> ग्राम: {citizen.village}, जिला: {citizen.district}</span>
            <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> मोबाइल: {citizen.phone}</span>
          </div>
        </div>

        <button
          onClick={onLogout}
          id="logout-btn"
          className="bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs px-3 py-1.5 rounded-lg font-bold transition-all"
        >
          लॉगआउट (Logout)
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        <button
          onClick={() => setActiveTab('complaints')}
          className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 text-center ${
            activeTab === 'complaints'
              ? 'border-[#008f5d] text-[#008f5d] bg-[#008f5d]/5'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          मेरी शिकायतें ({complaints.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-3 text-xs font-bold transition-all border-b-2 text-center ${
            activeTab === 'profile'
              ? 'border-[#008f5d] text-[#008f5d] bg-[#008f5d]/5'
              : 'border-transparent text-gray-500 hover:text-gray-800'
          }`}
        >
          नागरिक प्रोफाइल
        </button>
      </div>

      {/* Tab Panels */}
      <div className="p-6">
        {/* TAB 1: Complaints */}
        {activeTab === 'complaints' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center mb-2">
              <h5 className="text-sm font-bold text-gray-800">ग्राम समस्या निवारण मंच</h5>
              <button
                onClick={() => setShowAddComplaint(!showAddComplaint)}
                id="toggle-complaint-btn"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all"
              >
                <Plus className="h-3.5 w-3.5" /> नई शिकायत दर्ज़ करें
              </button>
            </div>

            {complaintSuccess && (
              <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-lg text-xs font-medium text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>आपकी शिकायत सफलतापूर्वक दर्ज़ कर ली गई है। ग्राम विकास अधिकारी जल्द ही आपसे संपर्क करेंगे।</span>
              </div>
            )}

            {showAddComplaint && (
              <form onSubmit={handleAddComplaint} className="bg-emerald-50/30 border border-emerald-100 p-4 rounded-xl space-y-3">
                <h6 className="text-xs font-bold text-emerald-950 mb-1">नई शिकायत दर्ज करने का फॉर्म</h6>
                
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">शिकायत का विषय (शीर्षक) *</label>
                  <input
                    type="text"
                    required
                    placeholder="उदा. हैंडपंप खराब होने के संबंध में या नाली सफाई समस्या"
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    value={newComplaintTitle}
                    onChange={(e) => setNewComplaintTitle(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-700 mb-1">विभाग / श्रेणी *</label>
                    <select
                      className="w-full border border-gray-300 rounded-lg py-2 px-3 text-xs bg-white focus:outline-none"
                      value={newComplaintCat}
                      onChange={(e) => setNewComplaintCat(e.target.value)}
                    >
                      <option value="पेयजल (Drinking Water)">पेयजल (Drinking Water)</option>
                      <option value="सड़क एवं नाली (Roads & Drainage)">सड़क एवं नाली (Roads & Drainage)</option>
                      <option value="बिजली (Electricity)">बिजली (Electricity)</option>
                      <option value="स्वच्छता (Cleanliness)">स्वच्छता (Cleanliness)</option>
                      <option value="राशन दुकान (Ration Shop)">राशन दुकान (Ration Shop)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 mb-1">समस्या का विस्तृत विवरण *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="कृपया समस्या का पूरा पता और विवरण लिखें ताकि जल्द समाधान हो सके।"
                    className="w-full border border-gray-300 rounded-lg py-2 px-3 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    value={newComplaintDesc}
                    onChange={(e) => setNewComplaintDesc(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddComplaint(false)}
                    className="border border-gray-200 text-gray-600 text-xs px-4 py-1.5 rounded-lg"
                  >
                    निरस्त करें
                  </button>
                  <button
                    type="submit"
                    id="submit-complaint-btn"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-4 py-1.5 rounded-lg font-bold"
                  >
                    दर्ज़ करें
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3 mt-3">
              {complaints.map((comp) => (
                <div key={comp.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50/50">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="font-mono text-[10px] font-bold text-gray-400">{comp.id}</span>
                      <h6 className="text-sm font-bold text-gray-900 mt-0.5">{comp.title}</h6>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap ${
                      comp.status === 'पंजीकृत' ? 'bg-blue-100 text-blue-800' :
                      comp.status === 'कार्य प्रगति पर' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {comp.status}
                    </span>
                  </div>

                  <p className="text-xs text-gray-600 leading-relaxed mb-3">{comp.description}</p>
                  
                  <div className="flex flex-wrap justify-between items-center text-[10px] text-gray-400 border-t border-gray-200/50 pt-2">
                    <span>श्रेणी: <strong>{comp.category}</strong></span>
                    <span>दिनांक: {comp.date}</span>
                  </div>

                  {comp.remarks && (
                    <div className="bg-amber-50 text-amber-900 text-xs p-2.5 rounded-lg border border-amber-100/50 mt-2.5">
                      <strong>कार्यालय टिप्पणी:</strong> {comp.remarks}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: Profile */}
        {activeTab === 'profile' && (
          <div className="space-y-4 max-w-md mx-auto py-2">
            <h5 className="text-sm font-bold text-gray-800 text-center mb-4">डिजिटल नागरिक पहचान पत्र</h5>
            
            <div className="border border-emerald-200 bg-white rounded-xl shadow-xs overflow-hidden">
              <div className="bg-[#008f5d] px-4 py-3 text-white text-center font-bold text-xs uppercase tracking-wider">
                भारत सरकार - ग्राम नागरिक पत्रक
              </div>
              <div className="p-5 space-y-3 text-xs font-sans">
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">नागरिक का नाम:</span>
                  <strong className="text-gray-900">{citizen.name}</strong>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">पंजीकृत मोबाइल:</span>
                  <strong className="text-gray-900 font-mono">+91 {citizen.phone}</strong>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">पहचान आधार सं:</span>
                  <strong className="text-gray-900 font-mono">{citizen.aadhaar}</strong>
                </div>
                <div className="flex justify-between border-b border-gray-100 pb-2">
                  <span className="text-gray-500">गाँव (Gram):</span>
                  <strong className="text-gray-900">{citizen.village}</strong>
                </div>
                <div className="flex justify-between pb-1">
                  <span className="text-gray-500">जिला (District):</span>
                  <strong className="text-gray-900">{citizen.district}</strong>
                </div>
              </div>
            </div>

            <p className="text-[10px] text-gray-400 text-center italic mt-4 leading-normal font-sans">
              यह कार्ड ग्राम नागरिक की विशिष्ट पहचान संख्या है। सरकारी सेवाओं के त्वरित सत्यापन हेतु इस कार्ड को संभाल कर रखें।
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
