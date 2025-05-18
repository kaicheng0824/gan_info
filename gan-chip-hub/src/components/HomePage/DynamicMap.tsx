"use client";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Pin {
  id: string;
  type: "research" | "company";
  name: string;
  description: string;
  lat: number;
  lng: number;
}

export default function MapClient() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [icons, setIcons] = useState<{
    researchIcon: L.Icon;
    companyIcon: L.Icon;
  } | null>(null);

  // Initialize Leaflet and icons
  useEffect(() => {
    // Fix for default marker icons
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/icons/marker-icon-2x.png',
      iconUrl: '/icons/marker-icon.png',
      shadowUrl: '/icons/marker-shadow.png',
    });

    // Initialize custom icons
    setIcons({
      researchIcon: new L.Icon({
        iconUrl: "/icons/research.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      }),
      companyIcon: new L.Icon({
        iconUrl: "/icons/company.png",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
      })
    });
  }, []);

  // Fetch pins data
  useEffect(() => {
    async function fetchPins() {
      try {
        const res = await fetch("/data/pins.json");
        const data = await res.json();
        setPins(data);
      } catch (error) {
        console.error("Error loading pins:", error);
      }
    }

    fetchPins();
  }, []);

  // Wait until icons are loaded
  if (!icons) {
    return (
      <div className="h-[70vh] w-full rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        Initializing map...
      </div>
    );
  }

  return (
    <div className="h-[70vh] w-full rounded-lg overflow-hidden">
      <MapContainer 
        style={{ height: "100%", width: "100%" }}
        center={[20, 0] as [number, number]} 
        zoom={2}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {pins.map((pin) => (
          <Marker
            key={pin.id}
            position={[pin.lat, pin.lng] as [number, number]}
            icon={pin.type === "research" ? icons.researchIcon : icons.companyIcon}
          >
            <Popup>
              <strong>{pin.name}</strong>
              <p>{pin.description}</p>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}