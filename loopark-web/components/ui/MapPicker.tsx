'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapPickerProps {
    latitude: number | null;
    longitude: number | null;
    onChange: (lat: number, lng: number) => void;
}

export default function MapPicker({ latitude, longitude, onChange }: MapPickerProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);

    // Initialisation de la carte
    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        const defaultLat = latitude ?? 48.8566;
        const defaultLng = longitude ?? 2.3522;

        const map = L.map(mapContainerRef.current, {
            center: [defaultLat, defaultLng],
            zoom: latitude && longitude ? 15 : 12,
            zoomControl: false,
        });

        L.control.zoom({ position: 'bottomright' }).addTo(map);

        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 20,
        }).addTo(map);

        mapRef.current = map;

        // Événement clic sur la carte pour déplacer le pin
        map.on('click', (e: L.LeafletMouseEvent) => {
            const { lat, lng } = e.latlng;
            onChange(lat, lng);
        });

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // Synchronisation du marqueur et du centre de la carte
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        const hasCoords = latitude !== null && longitude !== null;
        const lat = latitude ?? 48.8566;
        const lng = longitude ?? 2.3522;
        const latLng = L.latLng(lat, lng);

        // Icone personnalisée rouge
        const pickerIcon = L.divIcon({
            html: `
                <div style="display:flex;flex-direction:column;align-items:center;">
                    <div style="width:32px;height:32px;border-radius:50%;background:#ef4444;border:2px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 6px rgba(0,0,0,0.3);color:white;">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
                    </div>
                    <div style="width:10px;height:10px;background:#ef4444;transform:rotate(45deg);margin-top:-6px;border-right:2px solid white;border-bottom:2px solid white;"></div>
                </div>
            `,
            className: '',
            iconSize: [32, 40],
            iconAnchor: [16, 40]
        });

        if (hasCoords) {
            if (markerRef.current) {
                markerRef.current.setLatLng(latLng);
            } else {
                const marker = L.marker(latLng, { icon: pickerIcon, draggable: true })
                    .addTo(map)
                    .on('dragend', () => {
                        if (markerRef.current) {
                            const newLatLng = markerRef.current.getLatLng();
                            onChange(newLatLng.lat, newLatLng.lng);
                        }
                    });
                markerRef.current = marker;
            }

            // Recentre la carte si le point a été modifié
            map.panTo(latLng);
        } else {
            // Nettoyage si les coordonnées sont nulles
            if (markerRef.current) {
                markerRef.current.remove();
                markerRef.current = null;
            }
        }
    }, [latitude, longitude, onChange]);

    return (
        <div className="w-full h-full relative rounded-lg overflow-hidden border border-[var(--border)] shadow-sm">
            <div ref={mapContainerRef} className="w-full h-full z-0" />
            <div className="absolute top-2 left-2 bg-white/95 dark:bg-black/95 text-[10px] px-2 py-1 rounded border border-[var(--border)] shadow-sm z-[1000] font-medium">
                🖱️ Cliquez sur la carte ou glissez le pin rouge
            </div>
        </div>
    );
}
