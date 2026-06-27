/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ServiceItem } from '../types/portal';
import { ExternalLink, Sprout, Car, GraduationCap, Users, ShieldAlert, Award, FileText, Map, Zap, Download } from 'lucide-react';

interface ServiceCardProps {
  key?: string;
  service: ServiceItem;
  onOpen: (id: string) => void;
}

export default function ServiceCard({ service, onOpen }: ServiceCardProps) {
  // Map string icon names to Lucide icons
  const renderIcon = () => {
    switch (service.iconName) {
      case 'sprout':
        return <Sprout className="h-6 w-6" id={`icon-sprout-${service.id}`} />;
      case 'car':
        return <Car className="h-6 w-6" id={`icon-car-${service.id}`} />;
      case 'graduation-cap':
        return <GraduationCap className="h-6 w-6" id={`icon-grad-${service.id}`} />;
      case 'users':
        return <Users className="h-6 w-6" id={`icon-users-${service.id}`} />;
      case 'award':
        return <Award className="h-6 w-6" id={`icon-award-${service.id}`} />;
      case 'map':
        return <Map className="h-6 w-6" id={`icon-map-${service.id}`} />;
      case 'zap':
        return <Zap className="h-6 w-6" id={`icon-zap-${service.id}`} />;
      case 'download':
        return <Download className="h-6 w-6" id={`icon-download-${service.id}`} />;
      default:
        return <FileText className="h-6 w-6" id={`icon-file-${service.id}`} />;
    }
  };

  return (
    <div
      id={`service-card-${service.id}`}
      className={`bg-white rounded-2xl p-5 border-2 transition-all duration-300 hover:shadow-md flex flex-col justify-between ${service.borderColor}`}
    >
      <div>
        {/* Top bar with tag & icon */}
        <div className="flex justify-between items-start mb-4">
          <div className={`p-2.5 rounded-xl ${service.bgIconColor} ${service.accentColor}`}>
            {renderIcon()}
          </div>
          <span className={`text-[11px] font-bold px-3 py-1 rounded-full ${service.tagColor}`}>
            {service.category}
          </span>
        </div>

        {/* Title and details */}
        <h4 className="text-base font-bold text-gray-900 mb-1 font-sans tracking-tight">
          {service.name}
        </h4>
        <p className="text-xs text-gray-500 font-sans leading-relaxed mb-6 min-h-[36px]">
          {service.description}
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mt-auto">
        {service.externalUrl ? (
          <a
            href={service.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            id={`ext-link-${service.id}`}
            className="w-full bg-[#008f5d] hover:bg-[#00764d] text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer text-center font-sans"
            title="सीधे आधिकारिक सरकारी वेबसाइट पर जाएँ"
          >
            सरकारी वेबसाइट पर जाएँ <ExternalLink className="h-4 w-4" />
          </a>
        ) : (
          <button
            type="button"
            id={`open-btn-${service.id}`}
            onClick={() => onOpen(service.id)}
            className="w-full bg-[#008f5d] hover:bg-[#00764d] text-white py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer font-sans"
          >
            सुविधा खोलें
          </button>
        )}
      </div>
    </div>
  );
}
