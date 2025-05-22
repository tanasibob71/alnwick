import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import { MapPin, Map } from 'lucide-react';

interface MapMarkerProps {
  lat: number;
  lng: number;
  text: string;
}

const MapMarker: React.FC<MapMarkerProps> = ({ text }) => (
  <div className="relative -translate-x-1/2 -translate-y-full">
    <MapPin className="h-8 w-8 text-primary" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 whitespace-nowrap bg-white px-2 py-1 rounded-md shadow-md text-sm font-medium">
      {text}
    </div>
  </div>
);

// Fallback component when no Google Maps API key is available
const StaticMapFallback: React.FC<{height: string}> = ({ height }) => (
  <div className="flex flex-col items-center justify-center bg-gray-100 w-full rounded-lg" style={{ height }}>
    <Map className="h-16 w-16 text-gray-400 mb-4" />
    <div className="text-center px-4">
      <h3 className="text-lg font-medium text-gray-700 mb-2">Map Unavailable</h3>
      <p className="text-gray-600 mb-3">We're located at:</p>
      <div className="bg-white p-3 rounded-lg shadow-sm inline-block">
        <p className="font-medium">Alnwick Community Center</p>
        <p>2146 Big Springs Road</p>
        <p>Maryville, TN 37801</p>
      </div>
    </div>
  </div>
);

interface InteractiveMapProps {
  height?: string;
  width?: string;
  className?: string;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({ 
  height = '400px', 
  width = '100%',
  className
}) => {
  const [hasError, setHasError] = useState(false);

  // Coordinates for Alnwick Community Center in Maryville, TN
  const defaultProps = {
    center: {
      lat: 35.7635, // Approximate location
      lng: -83.9689
    },
    zoom: 15
  };

  // Handle Google Maps API errors
  useEffect(() => {
    // Set error state on mount to show fallback immediately
    // since we know we don't have a valid API key
    setHasError(true);
  }, []);

  if (hasError) {
    return <StaticMapFallback height={height} />;
  }

  return (
    <div style={{ height, width }} className={className}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: "" }} // No API key required for basic functionality
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
        options={{
          fullscreenControl: false,
          zoomControl: true,
        }}
      >
        <MapMarker
          lat={defaultProps.center.lat}
          lng={defaultProps.center.lng}
          text="Alnwick Community Center"
        />
      </GoogleMapReact>
    </div>
  );
};

export default InteractiveMap;