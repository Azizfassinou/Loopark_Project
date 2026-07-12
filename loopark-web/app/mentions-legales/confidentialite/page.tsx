import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

export const metadata = {
  title: 'Politique de confidentialité – Loopark',
  description: 'Politique de confidentialité du service Loopark.',
};

export default function ConfidentialitePage() {
  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col selection:bg-brand-green/30">
      <header className="border-b border-[var(--border)] bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" className="hover:scale-105 transition-transform">
            <Logo />
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-8">
          Politique de confidentialité
        </h1>
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-600 dark:text-slate-300">
          <p className="text-lg">
            Cette politique décrit la façon dont Loopark collecte, utilise, stocke et protège les données personnelles de ses utilisateurs.
          </p>
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Données collectées</h2>
            <ul>
              <li>Informations de compte : nom, prénom, adresse e‑mail, mot de passe (hashé).</li>
              <li>Données de paiement : informations nécessaires au traitement via Stripe, jamais stockées directement.</li>
              <li>Données de navigation : cookies et logs d’accès pour améliorer l’expérience utilisateur.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4">2. Utilisation des données</h2>
            <ul>
              <li>Gestion des comptes et authentification.</li>
              <li>Traitement des réservations et des paiements.</li>
              <li>Envoi d’e‑mails de confirmation, de réinitialisation de mot de passe et de communication marketing (avec consentement).</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4">3. Partage des données</h2>
            <p>
              Les données sont uniquement partagées avec les prestataires indispensables au service (ex. : Stripe pour les paiements, Resend pour les e‑mails). Aucun partage commercial avec des tiers n’est effectué.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4">4. Conservation & Sécurité</h2>
            <p>
              Les données sont conservées pendant la durée nécessaire à l’accomplissement des finalités, conformément aux exigences légales. Elles sont stockées sur des serveurs sécurisés hébergés en Europe (Vercel/Supabase).
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4">5. Droits des utilisateurs</h2>
            <p>
              Vous disposez d’un droit d’accès, de rectification, d’effacement, de limitation du traitement et de portabilité. Vous pouvez exercer ces droits en contactant <a href="mailto:contact@loopark.com" className="text-brand-green hover:underline">contact@loopark.com</a>.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4">6. Modifications de la politique</h2>
            <p>
              Loopark se réserve le droit de mettre à jour cette politique. Les modifications seront publiées ici et entreront en vigueur dès leur diffusion.
            </p>
          </section>
        </div>
      </main>

      <footer className="border-t border-[var(--border)] py-8 text-center text-sm text-[var(--muted)]">
        <p>© {new Date().getFullYear()} Loopark Technologies. Tous droits réservés.</p>
      </footer>
    </div>
  );
}
