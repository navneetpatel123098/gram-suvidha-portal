/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { X } from 'lucide-react';
import { Citizen, ServiceApplication } from '../types/portal';
import AgricultureServices from './AgricultureServices';
import TransportServices from './TransportServices';
import WelfareServices from './WelfareServices';
import CitizenServices from './CitizenServices';

interface ServiceDetailModalProps {
  serviceId: string;
  serviceName: string;
  category: 'कृषि' | 'परिवहन' | 'कल्याण' | 'नागरिक';
  citizen: Citizen | null;
  onClose: () => void;
  onAddApplication: (app: ServiceApplication) => void;
}

export default function ServiceDetailModal({
  serviceId,
  serviceName,
  category,
  citizen,
  onClose,
  onAddApplication,
}: ServiceDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-gray-50 rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col my-8">
        {/* Header bar */}
        <div className="bg-[#008f5d] px-5 py-4 flex justify-between items-center text-white">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-white/20 rounded-md">
              {category} सेवा
            </span>
            <h3 className="text-base font-bold mt-1 font-sans">{serviceName}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/10 transition-colors text-white outline-none"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {category === 'कृषि' && (
            <AgricultureServices
              citizen={citizen}
              serviceId={serviceId}
              onAddApplication={onAddApplication}
            />
          )}

          {category === 'परिवहन' && (
            <TransportServices
              citizen={citizen}
              serviceId={serviceId}
              onAddApplication={onAddApplication}
            />
          )}

          {category === 'कल्याण' && (
            <WelfareServices
              citizen={citizen}
              serviceId={serviceId}
              onAddApplication={onAddApplication}
            />
          )}

          {category === 'नागरिक' && (
            <CitizenServices
              citizen={citizen}
              serviceId={serviceId}
              onAddApplication={onAddApplication}
            />
          )}
        </div>

        {/* Footer info bar */}
        <div className="bg-white px-5 py-3 border-t border-gray-100 text-[10px] text-gray-500 text-center font-sans">
          ग्राम सुविधा पोर्टल - राष्ट्रीय सूचना विज्ञान केंद्र (NIC) द्वारा संचालित एवं डिजिटल इंडिया समर्थित।
        </div>
      </div>
    </div>
  );
}
