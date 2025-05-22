import React from 'react';
import GoogleMapReact from 'google-map-react';
import { MapPin } from 'lucide-react';

interface MapMarkerProps {
  lat: number;
  lng: number;
  text: string;
}

const MapMarker: React.FC<MapMarkerProps> = ({ text }) => (
  <div className="relative -translate-x-1/2 -translate-y-full">
    <MapPin className="h-8 w-8 text-primary" />
    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-full bg-white px-2 py-1 rounded shadow-md whitespace-nowrap text-sm font-medium">
      {text}
    </div>
  </div>
);

interface GoogleMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  markerText?: string;
}

const GoogleMapComponent: React.FC<GoogleMapProps> = ({
  center = { lat: 35.7595, lng: -83.9705 }, // Default to Maryville, TN
  zoom = 15,
  markerText = "Alnwick Community Center"
}) => {
  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-lg">
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.GOOGLE_MAPS_API_KEY || "" }}
        defaultCenter={center}
        defaultZoom={zoom}
        options={{
          fullscreenControl: false,
          zoomControl: true,
          mapTypeControl: false,
          streetViewControl: false
        }}
      >
        <MapMarker
          lat={center.lat}
          lng={center.lng}
          text={markerText}
        />
      </GoogleMapReact>
    </div>
  );
};

export default GoogleMapComponent;