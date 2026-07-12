'use client';

import { useState } from 'react';
import { Loader2, Pencil, Check, X } from 'lucide-react';

interface EditProfileFormProps {
    firstName: string | null | undefined;
    lastName: string | null | undefined;
    currentEmail: string | null | undefined;
}

export default function EditProfileForm({ firstName, lastName, currentEmail }: EditProfileFormProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [firstNameVal, setFirstNameVal] = useState(firstName ?? '');
    const [lastNameVal, setLastNameVal] = useState(lastName ?? '');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleSave = async () => {
        if (!firstNameVal.trim() || !lastNameVal.trim()) {
            setError('Prénom et nom sont obligatoires.');
            return;
        }
        if (newPassword && !currentPassword) {
            setError('Veuillez entrer votre mot de passe actuel pour le changer.');
            return;
        }
        if (newPassword && newPassword.length < 8) {
            setError('Le nouveau mot de passe doit contenir au moins 8 caractères.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName: firstNameVal.trim(),
                    lastName: lastNameVal.trim(),
                    currentPassword: currentPassword || undefined,
                    newPassword: newPassword || undefined,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Une erreur est survenue');

            setSuccess('Profil mis à jour avec succès.');
            setCurrentPassword('');
            setNewPassword('');
            setIsEditing(false);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        setFirstNameVal(firstName ?? '');
        setLastNameVal(lastName ?? '');
        setCurrentPassword('');
        setNewPassword('');
        setError(null);
        setIsEditing(false);
    };

    return (
        <div className="space-y-1">
            {/* Header with edit toggle */}
            <div className="flex items-center justify-between p-6 border-b border-[var(--border)]">
                <div>
                    <h2 className="text-base font-semibold">Informations du compte</h2>
                    {!isEditing && (
                        <p className="text-xs text-[var(--muted)] mt-0.5">Nom, email et mot de passe</p>
                    )}
                </div>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted)] hover:text-[var(--foreground)] border border-[var(--border)] px-3 py-1.5 rounded-md transition-colors"
                    >
                        <Pencil className="h-3.5 w-3.5" />
                        Modifier
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleCancel}
                            disabled={isLoading}
                            className="flex items-center gap-1.5 text-xs text-[var(--muted)] hover:text-[var(--foreground)] px-3 py-1.5 rounded-md transition-colors border border-[var(--border)]"
                        >
                            <X className="h-3.5 w-3.5" />
                            Annuler
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isLoading}
                            className="flex items-center gap-1.5 text-xs font-medium bg-brand-green text-white px-3 py-1.5 rounded-md hover:bg-brand-green-dark transition-colors disabled:opacity-50"
                        >
                            {isLoading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                            Enregistrer
                        </button>
                    </div>
                )}
            </div>

            {/* Fields */}
            <div className="p-6 space-y-5">
                {success && (
                    <p className="text-sm text-brand-green bg-brand-green/5 border border-brand-green/20 rounded-md px-3 py-2">
                        {success}
                    </p>
                )}
                {error && (
                    <p className="text-sm text-red-600 bg-red-50 border border-red-200 dark:bg-red-950/30 dark:border-red-900 rounded-md px-3 py-2">
                        {error}
                    </p>
                )}

                {/* Names — 2-column grid */}
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[var(--muted)]">Identité</label>
                    {isEditing ? (
                        <div className="grid grid-cols-2 gap-3 max-w-sm">
                            <input
                                type="text"
                                value={firstNameVal}
                                onChange={(e) => setFirstNameVal(e.target.value)}
                                placeholder="Prénom"
                                className="flex h-9 w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-brand-green transition-colors"
                            />
                            <input
                                type="text"
                                value={lastNameVal}
                                onChange={(e) => setLastNameVal(e.target.value)}
                                placeholder="Nom"
                                className="flex h-9 w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-brand-green transition-colors"
                            />
                        </div>
                    ) : (
                        <p className="text-sm font-medium text-[var(--foreground)]">
                            {firstName || lastName
                                ? `${firstName ?? ''} ${lastName ?? ''}`.trim()
                                : <span className="text-[var(--muted)] italic">Non renseigné</span>
                            }
                        </p>
                    )}
                </div>

                {/* Email (read-only) */}
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-[var(--muted)]">Adresse email</label>
                    <p className="text-sm font-medium text-[var(--foreground)]">{currentEmail}</p>
                    {isEditing && (
                        <p className="text-xs text-[var(--muted-foreground)]">L'email ne peut pas être modifié pour le moment.</p>
                    )}
                </div>

                {/* Password change — only in edit mode */}
                {isEditing && (
                    <div className="space-y-3 pt-2 border-t border-[var(--border)]">
                        <p className="text-xs font-medium text-[var(--muted)]">Changer de mot de passe <span className="font-normal">(optionnel)</span></p>
                        <div className="space-y-2 max-w-sm">
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Mot de passe actuel"
                                autoComplete="current-password"
                                className="flex h-9 w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-brand-green transition-colors"
                            />
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Nouveau mot de passe (min. 8 caractères)"
                                autoComplete="new-password"
                                className="flex h-9 w-full rounded-md border border-[var(--border)] px-3 py-2 text-sm bg-[var(--background)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-brand-green transition-colors"
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
