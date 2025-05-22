import React from 'react';
import { MapPin, Navigation, Clock, Car } from 'lucide-react';
import { Link } from "wouter";

interface StaticMapProps {
  width?: string;
  height?: string;
  className?: string;
}

const StaticMap: React.FC<StaticMapProps> = ({
  width = "100%",
  height = "auto", 
  className = "",
}) => {
  return (
    <div className={`rounded-lg ${className}`} style={{ width, height: height === "auto" ? "auto" : height }}>
      <div className="flex flex-col bg-white overflow-hidden border border-gray-200 rounded-lg shadow-md min-h-[500px]">
        <div className="p-5 bg-primary/10">
          <h3 className="text-xl font-bold mb-2 flex items-center">
            <MapPin className="h-5 w-5 mr-2 text-primary" />
            Find Us
          </h3>
          <div className="text-gray-700">
            <p className="font-medium text-lg">Alnwick Community Center</p>
            <p>2146 Big Springs Road, Maryville, TN 37801</p>
            <p>Phone: (865) 257-2122</p>
          </div>
        </div>
        
        <div className="p-5 flex-grow">
          <Link href="/contact#find-us">
            <div className="inline-block mb-3">
              <h4 className="font-semibold px-4 py-2 rounded-md border border-gray-200 hover:border-primary hover:bg-primary/10 hover:text-primary transition-colors flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                Directions
              </h4>
            </div>
          </Link>
          
          <div className="mb-6">
            <div className="flex items-start mb-3">
              <Car className="h-5 w-5 mr-3 text-gray-500 mt-1 flex-shrink-0" />
              <div>
                <p className="font-medium mb-2">From Downtown Maryville:</p>
                <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2 mt-1">
                  <li>Head east on E. Broadway Avenue</li>
                  <li>Take Big Springs Road north for approximately 3 miles</li>
                  <li>The community center will be on your right</li>
                </ol>
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h4 className="font-semibold mb-3 flex items-center">
              <Clock className="h-4 w-4 mr-2 text-primary" />
              Travel Time
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-gray-100 p-3 rounded">
                <p className="font-medium mb-1">From Downtown:</p>
                <p>15 minutes</p>
              </div>
              <div className="bg-gray-100 p-3 rounded">
                <p className="font-medium mb-1">From Airport:</p>
                <p>25 minutes</p>
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold mb-3 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Hours of Operation
            </h4>
            <p className="text-sm bg-gray-100 p-3 rounded">
              <span className="font-medium">Monday - Sunday:</span> 9:00 AM - 10:00 PM
            </p>
          </div>
        </div>

        <div className="p-4 bg-primary text-white text-sm">
          <p className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Public transportation available via Blount County Bus Route #4
          </p>
        </div>
      </div>
    </div>
  );
};

export default StaticMap;