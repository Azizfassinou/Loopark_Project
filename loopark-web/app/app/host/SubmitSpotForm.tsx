'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import dynamic from 'next/dynamic';

const MapPicker = dynamic(() => import('@/components/ui/MapPicker'), { ssr: false });

const MOBILITY_TYPES = [
    { value: 'BIKE', label: 'Vélo' },
    { value: 'SCOOTER', label: 'Trottinette' },
    { value: 'BOTH', label: 'Vélo et trottinette' },
];

export default function SubmitSpotForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // États pour l'adresse et l'autocomplétion
    const [address, setAddress] = useState('');
    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [latitude, setLatitude] = useState<number | null>(null);
    const [longitude, setLongitude] = useState<number | null>(null);

    // Mémoïser pour éviter la boucle infinie dans MapPicker (useEffect sur onChange)
    const handleMapChange = useCallback((lat: number, lng: number) => {
        setLatitude(lat);
        setLongitude(lng);
    }, []);

    // Fonction d'appel à l'API Photon
    const handleAddressChange = async (val: string) => {
        setAddress(val);
        if (val.length < 3) {
            setSuggestions([]);
            return;
        }

        try {
            const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(val)}&limit=5&lang=fr`);
            const data = await res.json();
            if (data.features) {
                setSuggestions(data.features);
                setShowSuggestions(true);
            }
        } catch (err) {
            console.error('Failed to fetch address suggestions:', err);
        }
    };

    // Sélection d'une adresse de suggestion
    const selectSuggestion = (feature: any, formattedLabel: string) => {
        const [lng, lat] = feature.geometry.coordinates;
        setAddress(formattedLabel);
        setLatitude(lat);
        setLongitude(lng);
        setSuggestions([]);
        setShowSuggestions(false);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const body = {
            title: formData.get('title'),
            description: formData.get('description'),
            address,
            type: formData.get('type'),
            price: formData.get('price'),
            capacity: formData.get('capacity'),
            latitude: latitude !== null ? latitude : null,
            longitude: longitude !== null ? longitude : null,
        };

        try {
            const response = await fetch('/api/spots', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Une erreur est survenue');
            }

            setSuccess(true);
            setAddress('');
            setLatitude(null);
            setLongitude(null);
            (e.target as HTMLFormElement).reset();
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    if (success) {
        return (
            <div className="border border-brand-green/30 bg-brand-green/5 rounded-lg p-6 text-sm text-brand-green">
                <p className="font-medium">Votre espace a été soumis avec succès.</p>
                <p className="text-brand-green/70 mt-1">Il sera visible dans la recherche dès validation par notre équipe.</p>
                <button
                    onClick={() => setSuccess(false)}
                    className="mt-4 text-xs text-brand-green hover:underline underline-offset-2 cursor-pointer"
                >
                    Soumettre un autre espace
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
                <div className="text-sm text-red-600 bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-900 rounded-md px-3 py-2">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-sm font-medium text-[var(--foreground)]">
                        Titre de l'espace <span className="text-red-500">*</span>
                    </label>
                    <input
                        name="title"
                        type="text"
                        placeholder="ex: Abri sécurisé résidence Voltaire"
                        required
                        className="flex h-9 w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-brand-green hover:border-[var(--muted-foreground)] transition-colors"
                    />
                </div>

                <div className="sm:col-span-2 space-y-1.5 relative">
                    <label className="text-sm font-medium text-[var(--foreground)]">Adresse complète <span className="text-red-500">*</span></label>
                    <input
                        name="address"
                        type="text"
                        placeholder="ex: 12 rue de la Paix, 75001 Paris"
                        value={address}
                        onChange={(e) => handleAddressChange(e.target.value)}
                        onFocus={() => setShowSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        required
                        autoComplete="off"
                        className="flex h-9 w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-brand-green hover:border-[var(--muted-foreground)] transition-colors"
                    />
                    {showSuggestions && suggestions.length > 0 && (
                        <ul className="absolute left-0 right-0 mt-1 bg-[var(--surface-raised)] border border-[var(--border)] rounded-md shadow-lg z-50 divide-y divide-[var(--border-subtle)] max-h-48 overflow-y-auto">
                            {suggestions.map((suggestion, idx) => {
                                const { properties } = suggestion;
                                const formatted = [
                                    properties.name !== properties.street ? properties.name : null,
                                    properties.street,
                                    properties.postcode,
                                    properties.city
                                ].filter(Boolean).join(', ');
                                
                                return (
                                    <li key={idx}>
                                        <button
                                            type="button"
                                            onClick={() => selectSuggestion(suggestion, formatted)}
                                            className="w-full text-left px-3 py-2 text-xs hover:bg-[var(--surface)] text-[var(--foreground)] transition-colors cursor-pointer"
                                        >
                                            {formatted}
                                        </button>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[var(--foreground)]">Type de véhicule <span className="text-red-500">*</span></label>
                    <select
                        name="type"
                        required
                        className="flex h-9 w-full rounded-md border border-[var(--border)] px-3 text-sm bg-[var(--background)] text-[var(--foreground)] focus:outline-none focus:ring-2 focus:ring-brand-green hover:border-[var(--muted-foreground)] transition-colors cursor-pointer"
                    >
                        {MOBILITY_TYPES.map(t => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[var(--foreground)]">Capacité (places) <span className="text-red-500">*</span></label>
                    <input
                        name="capacity"
                        type="number"
                        min="1"
                        placeholder="ex: 5"
                        required
                        className="flex h-9 w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-brand-green hover:border-[var(--muted-foreground)] transition-colors"
                    />
                </div>

                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-[var(--foreground)]">Prix par heure (€) <span className="text-red-500">*</span></label>
                    <input
                        name="price"
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="0.00 pour gratuit"
                        required
                        className="flex h-9 w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-brand-green hover:border-[var(--muted-foreground)] transition-colors"
                    />
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-sm font-medium text-[var(--foreground)]">Coordonnées GPS <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-2 gap-3">
                        <input
                            name="latitude"
                            type="number"
                            step="any"
                            placeholder="Latitude"
                            value={latitude !== null ? latitude : ''}
                            onChange={(e) => setLatitude(parseFloat(e.target.value) || null)}
                            required
                            className="flex h-9 w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-brand-green hover:border-[var(--muted-foreground)] transition-colors"
                        />
                        <input
                            name="longitude"
                            type="number"
                            step="any"
                            placeholder="Longitude"
                            value={longitude !== null ? longitude : ''}
                            onChange={(e) => setLongitude(parseFloat(e.target.value) || null)}
                            required
                            className="flex h-9 w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-brand-green hover:border-[var(--muted-foreground)] transition-colors"
                        />
                    </div>

                    <div className="h-64 mt-4">
                        <MapPicker
                            latitude={latitude}
                            longitude={longitude}
                            onChange={handleMapChange}
                        />
                    </div>
                </div>

                <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-sm font-medium text-[var(--foreground)]">Description</label>
                    <textarea
                        name="description"
                        rows={3}
                        placeholder="Décrivez votre espace : accès, équipements, conditions..."
                        className="flex w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-brand-green hover:border-[var(--muted-foreground)] transition-colors resize-none"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center gap-2 bg-brand-green text-white text-sm font-medium px-5 py-2 rounded-md hover:bg-brand-green-dark transition-colors disabled:opacity-50 cursor-pointer"
            >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                Soumettre pour validation
            </button>
        </form>
    );
}
