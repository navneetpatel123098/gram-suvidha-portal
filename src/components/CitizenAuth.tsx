/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Citizen } from '../types/portal';
import { ShieldCheck, UserCheck, Phone, Check, ArrowRight, Home, Loader2 } from 'lucide-react';
import { mpDistricts, getVillagesForDistrict } from '../data/mpLocations';

interface CitizenAuthProps {
  onLoginSuccess: (citizen: Citizen) => void;
  onClose: () => void;
}

export default function CitizenAuth({ onLoginSuccess, onClose }: CitizenAuthProps) {
  const [isLoginMode, setIsLoginMode] = useState<boolean>(true);
  const [phone, setPhone] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [aadhaar, setAadhaar] = useState<string>('');
  const [district, setDistrict] = useState<string>('भोपाल'); // Default district
  const [village, setVillage] = useState<string>('बैरसिया'); // Default village for Bhopal
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [receivedOtp, setReceivedOtp] = useState<string>('');

  const handleDistrictChange = (selectedDistrict: string) => {
    setDistrict(selectedDistrict);
    const villages = getVillagesForDistrict(selectedDistrict);
    if (villages && villages.length > 0) {
      setVillage(villages[0]);
    } else {
      setVillage('');
    }
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (phone.length !== 10 || !/^\d+$/.test(phone)) {
      setError('कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें।');
      return;
    }

    if (!isLoginMode) {
      if (!name.trim()) {
        setError('कृपया अपना पूरा नाम दर्ज करें।');
        return;
      }
      if (aadhaar.length !== 12 || !/^\d+$/.test(aadhaar)) {
        setError('कृपया 12 अंकों का वैध आधार नंबर दर्ज करें।');
        return;
      }
      if (!village.trim()) {
        setError('कृपया अपने गाँव का नाम दर्ज करें।');
        return;
      }
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await response.json();

      if (data.success) {
        setOtpSent(true);
        setSuccess(data.message);
        if (data.debugOtp) {
          setReceivedOtp(data.debugOtp);
        }
      } else {
        setError(data.message || 'ओटीपी भेजने में असमर्थ। कृपया पुनः प्रयास करें।');
      }
    } catch (err) {
      console.error(err);
      setError('सर्वर से संपर्क करने में त्रुटि हुई।');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (otpCode.length !== 6 || !/^\d+$/.test(otpCode)) {
      setError('कृपया 6 अंकों का वैध ओटीपी दर्ज करें।');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          otpCode,
          isLoginMode,
          name,
          aadhaar,
          village,
          district,
        }),
      });
      const data = await response.json();

      if (data.success && data.citizen) {
        localStorage.setItem('active_citizen', JSON.stringify(data.citizen));
        
        // Save to local registered list for backward compatibility
        const registeredList = JSON.parse(localStorage.getItem('all_registered_citizens') || '[]');
        const exists = registeredList.some((c: any) => c.phone === phone);
        if (!exists) {
          registeredList.push(data.citizen);
          localStorage.setItem('all_registered_citizens', JSON.stringify(registeredList));
        }

        onLoginSuccess(data.citizen);
      } else {
        setError(data.message || 'ओटीपी सत्यापन विफल हुआ।');
      }
    } catch (err) {
      console.error(err);
      setError('सत्यापन के दौरान त्रुटि हुई।');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl max-w-md w-full border border-gray-100">
      <div className="text-center mb-6">
        <div className="bg-emerald-50 text-emerald-600 inline-flex p-3 rounded-full mb-3 border border-emerald-100">
          <ShieldCheck className="h-8 w-8" id="auth-shield-icon" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 font-sans">
          {isLoginMode ? 'नागरिक लॉगिन' : 'नया नागरिक पंजीकरण'}
        </h3>
        <p className="text-xs text-gray-500 mt-1 font-sans">
          {isLoginMode 
            ? 'सुरक्षित प्रमाणीकरण के लिए अपना विवरण दर्ज करें' 
            : 'पोर्टल सेवाओं का लाभ उठाने के लिए पंजीकरण करें'}
        </p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4 text-xs font-medium border border-red-100">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-emerald-50 text-emerald-700 p-3 rounded-lg mb-4 text-xs font-medium border border-emerald-100">
          {success}
        </div>
      )}

      {!otpSent ? (
        <form onSubmit={handleSendOTP} className="space-y-4">
          {!isLoginMode && (
            <>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">पूरा नाम (आधार के अनुसार) *</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    disabled={isLoading}
                    className="w-full pl-3 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none disabled:bg-gray-50"
                    placeholder="जैसे: नवनीत पटेल"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">आधार संख्या (12 अंक) *</label>
                <input
                  type="text"
                  maxLength={12}
                  required
                  disabled={isLoading}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none disabled:bg-gray-50"
                  placeholder="12 अंकों का आधार नंबर"
                  value={aadhaar}
                  onChange={(e) => setAadhaar(e.target.value.replace(/\D/g, ''))}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">जिला चुनें *</label>
                  <select
                    required
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white outline-none disabled:bg-gray-50"
                    value={district}
                    onChange={(e) => handleDistrictChange(e.target.value)}
                  >
                    {mpDistricts.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">ग्राम / गाँव *</label>
                  <select
                    required
                    disabled={isLoading}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white outline-none disabled:bg-gray-50"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                  >
                    {getVillagesForDistrict(district).map((vil) => (
                      <option key={vil} value={vil}>
                        {vil}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">मोबाइल नंबर (ओटीपी के लिए) *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <span className="text-sm">+91</span>
              </div>
              <input
                type="tel"
                maxLength={10}
                required
                disabled={isLoading}
                className="w-full pl-12 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none disabled:bg-gray-50"
                placeholder="10 अंकों का मोबाइल नंबर"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              />
            </div>
          </div>

          <button
            type="submit"
            id="send-otp-btn"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm disabled:bg-emerald-400"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> प्रक्रिया जारी है...
              </>
            ) : (
              <>
                ओटीपी भेजें <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOTP} className="space-y-4">
          <div>
            {receivedOtp && (
              <div className="bg-amber-50 text-amber-800 p-3 rounded-lg text-xs mb-3 text-center border border-amber-100">
                सत्यापन के लिए ओटीपी <strong>{receivedOtp}</strong> का उपयोग करें।
              </div>
            )}
            <label className="block text-xs font-semibold text-gray-700 mb-1 text-center">मोबाइल ओटीपी दर्ज करें</label>
            <input
              type="text"
              maxLength={6}
              required
              disabled={isLoading}
              className="w-full text-center tracking-widest text-lg font-bold px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none disabled:bg-gray-50"
              placeholder="******"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
            />
          </div>

          <button
            type="submit"
            id="verify-otp-btn"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-sm disabled:bg-emerald-400"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> सत्यापित किया जा रहा है...
              </>
            ) : (
              <>
                ओटीपी सत्यापित करें <UserCheck className="h-4 w-4" />
              </>
            )}
          </button>

          <button
            type="button"
            disabled={isLoading}
            className="w-full text-gray-500 hover:text-gray-700 text-xs text-center font-medium underline disabled:opacity-50"
            onClick={() => setOtpSent(false)}
          >
            मोबाइल नंबर बदलें
          </button>
        </form>
      )}

      <div className="mt-6 pt-4 border-t border-gray-100 text-center">
        <button
          type="button"
          disabled={isLoading}
          className="text-emerald-600 hover:text-emerald-700 text-xs font-semibold underline disabled:opacity-50"
          onClick={() => {
            setIsLoginMode(!isLoginMode);
            setError('');
            setSuccess('');
            setOtpSent(false);
          }}
        >
          {isLoginMode ? 'नया खाता बनाएँ (पंजीकरण करें)' : 'पहले से पंजीकृत हैं? यहाँ लॉगिन करें'}
        </button>
      </div>

      <div className="mt-4 text-center">
        <button
          type="button"
          disabled={isLoading}
          className="text-gray-400 hover:text-gray-600 text-xs inline-flex items-center gap-1.5 disabled:opacity-50"
          onClick={onClose}
        >
          <Home className="h-3 w-3" /> अतिथि के रूप में ब्राउज़ करें
        </button>
      </div>
    </div>
  );
}
