import { useState } from "react";
import { Link } from "wouter";
import { AlertTriangle, X } from "lucide-react";

const AnnouncementBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  
  if (!isVisible) {
    return null;
  }
  
  return (
    <div className="bg-[#D97706] text-white py-3 relative">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center">
          <AlertTriangle className="mr-2" size={18} />
          <p className="font-medium">Help us reach our fundraising goal for our building remodel! 
            <Link href="/fundraising">
              <a className="underline font-bold ml-1">Learn more</a>
            </Link>
          </p>
        </div>
        <button 
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/80 hover:text-white"
          onClick={() => setIsVisible(false)}
          aria-label="Close announcement"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};

export default AnnouncementBanner;
