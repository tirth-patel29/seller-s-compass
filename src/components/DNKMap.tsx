import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { DNKLocation } from '@/lib/types'

// Fix for default Leaflet markers missing in some bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom Icons
const verifiedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const unverifiedIcon = new L.Icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Component to handle map centering when selection changes
function MapSync({ selectedDNK, locations }: { selectedDNK: DNKLocation | null, locations: DNKLocation[] }) {
  const map = useMap();

  useEffect(() => {
    if (selectedDNK && selectedDNK.latitude && selectedDNK.longitude) {
      map.flyTo([selectedDNK.latitude, selectedDNK.longitude], 13, {
        duration: 1.5
      });
    } else if (locations.length > 0) {
      // Find bounds of all visible locations
      const lats = locations.map(l => l.latitude).filter(Boolean) as number[];
      const lngs = locations.map(l => l.longitude).filter(Boolean) as number[];
      if (lats.length > 0 && lngs.length > 0) {
        const bounds = L.latLngBounds(
          L.latLng(Math.min(...lats), Math.min(...lngs)),
          L.latLng(Math.max(...lats), Math.max(...lngs))
        );
        map.flyToBounds(bounds, { padding: [50, 50], duration: 1.5 });
      }
    } else {
      // Default Gujarat Center
      map.flyTo([22.2587, 71.1924], 7, { duration: 1.5 });
    }
  }, [selectedDNK, locations, map]);

  return null;
}

interface DNKMapProps {
  locations: DNKLocation[];
  selectedDNK: DNKLocation | null;
  onSelect: (dnk: DNKLocation) => void;
}

export function DNKMap({ locations, selectedDNK, onSelect }: DNKMapProps) {
  const mappedLocations = locations.filter(l => l.latitude && l.longitude);

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer 
        center={[22.2587, 71.1924]} 
        zoom={7} 
        style={{ height: '100%', width: '100%', borderRadius: '0.75rem', zIndex: 0 }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapSync selectedDNK={selectedDNK} locations={mappedLocations} />

        <MarkerClusterGroup 
          chunkedLoading 
          maxClusterRadius={40}
        >
          {mappedLocations.map(loc => (
            <Marker 
              key={loc.id}
              position={[loc.latitude!, loc.longitude!]}
              icon={loc.verificationStatus === 'verified' ? verifiedIcon : unverifiedIcon}
              eventHandlers={{
                click: () => onSelect(loc)
              }}
            >
              <Popup>
                <div className="font-sans min-w-[200px]">
                  <h4 className="font-semibold text-base m-0">{loc.name}</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">{loc.city}, {loc.district}</p>
                  
                  <div className="my-2 border-b border-border" />
                  
                  <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                    <div>
                      <span className="text-muted-foreground block">Type</span>
                      <span className="font-medium">{loc.postOfficeType}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground block">FPO</span>
                      <span className="font-medium">{loc.mappedFpo}</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => onSelect(loc)}
                    className="w-full bg-primary text-primary-foreground py-1.5 rounded-md text-xs font-medium hover:bg-primary/90 transition-colors"
                  >
                    View Details
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  )
}
