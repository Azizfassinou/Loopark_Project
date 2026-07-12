'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface Spot {
    id: string;
    title: string;
    address: string;
    price: number;
    latitude: number | null;
    longitude: number | null;
    type: 'BIKE' | 'SCOOTER' | 'BOTH';
}

interface MapViewProps {
    spots: Spot[];
    hoveredSpotId?: string | null;
    onSelectSpot?: (spotId: string) => void;
}

export default function MapView({ spots, hoveredSpotId, onSelectSpot }: MapViewProps) {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<L.Map | null>(null);
    const markersRef = useRef<{ [key: string]: L.Marker }>({});

    useEffect(() => {
        if (!mapContainerRef.current || mapRef.current) return;

        // Initialisation de la carte Leaflet
        const map = L.map(mapContainerRef.current, {
            center: [48.8566, 2.3522], // Centré par défaut sur Paris
            zoom: 12,
            zoomControl: false,
        });

        // Contrôle de zoom discret en bas à droite
        L.control.zoom({ position: 'bottomright' }).addTo(map);

        // Tuiles géographiques légères style "Voyager" adaptées aux UIs modernes
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
            subdomains: 'abcd',
            maxZoom: 20,
        }).addTo(map);

        mapRef.current = map;

        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    // Synchronisation des marqueurs lors du chargement des spots
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        // Nettoyage des anciens marqueurs
        Object.values(markersRef.current).forEach(marker => marker.remove());
        markersRef.current = {};

        const validSpots = spots.filter(s => s.latitude !== null && s.longitude !== null);
        if (validSpots.length === 0) return;

        const bounds = L.latLngBounds([]);

        validSpots.forEach(spot => {
            const lat = spot.latitude!;
            const lng = spot.longitude!;
            const latLng = L.latLng(lat, lng);
            bounds.extend(latLng);

            // Icone dynamique représentant le prix du spot
            const priceLabel = spot.price === 0 ? 'Gratuit' : `${spot.price.toFixed(1)}€`;

            const icon = L.divIcon({
                html: `
                    <div style="display:flex;flex-direction:column;align-items:center;cursor:pointer;">
                        <div style="padding:3px 7px;border-radius:6px;font-size:10px;font-weight:700;color:white;background:#16a34a;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.25);white-space:nowrap;">
                            ${priceLabel}
                        </div>
                        <div style="width:8px;height:8px;background:#16a34a;transform:rotate(45deg);margin-top:-5px;border-right:2px solid white;border-bottom:2px solid white;"></div>
                    </div>
                `,
                className: '',
                iconSize: [52, 30],
                iconAnchor: [26, 30],
                popupAnchor: [0, -32]
            });

            const marker = L.marker(latLng, { icon })
                .addTo(map)
                .on('click', () => {
                    if (onSelectSpot) {
                        onSelectSpot(spot.id);
                    }
                });

            // Popup de détails au clic
            marker.bindPopup(`
                <div class="p-1 space-y-1 font-sans">
                    <h4 class="text-sm font-semibold text-gray-900 leading-snug">${spot.title}</h4>
                    <p class="text-xs text-gray-500 truncate" style="max-width: 150px;">${spot.address}</p>
                    <p class="text-xs font-bold text-brand-green mt-1">${spot.price === 0 ? 'Gratuit' : `${spot.price.toFixed(2)} €/h`}</p>
                </div>
            `, { closeButton: false });

            markersRef.current[spot.id] = marker;
        });

        // Ajuster le cadre géographique pour contenir tous les pins
        if (validSpots.length > 0) {
            map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
        }
    }, [spots, onSelectSpot]);

    // Focus sur le spot survolé
    useEffect(() => {
        const map = mapRef.current;
        if (!map || !hoveredSpotId) return;

        const marker = markersRef.current[hoveredSpotId];
        if (marker) {
            marker.openPopup();
            map.panTo(marker.getLatLng());
        }
    }, [hoveredSpotId]);

    return (
        <div className="w-full h-full relative rounded-lg overflow-hidden border border-[var(--border)] shadow-sm">
            <div ref={mapContainerRef} className="w-full h-full z-0" />
        </div>
    );
}
