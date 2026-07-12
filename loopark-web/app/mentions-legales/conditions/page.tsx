import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

export const metadata = {
  title: 'Conditions d’utilisation – Loopark',
  description: 'Conditions générales d’utilisation du service Loopark.',
};

export default function ConditionsPage() {
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
          Conditions d’utilisation
        </h1>
        <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-600 dark:text-slate-300">
          <p className="text-lg">
            Les présentes conditions générales d’utilisation (ci-après « CGU ») régissent votre accès et votre utilisation du service Loopark.
          </p>
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Accès au Service</h2>
            <p>
              Le service Loopark est accessible aux personnes physiques majeures possédant un compte valide. L’inscription requiert la fourniture d’informations exactes et à jour.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4">2. Utilisation du Service</h2>
            <ul>
              <li>Vous vous engagez à respecter les lois en vigueur et les présentes CGU.</li>
              <li>Il est interdit de diffuser des contenus illicites, diffamatoires ou contraires aux bonnes mœurs.</li>
              <li>Vous êtes responsable de la sauvegarde de vos identifiants de connexion.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4">3. Paiement et Facturation</h2>
            <p>
              Les réservations payantes sont facturées à l’usage via le prestataire Stripe. Aucun frais n’est engagé avant la confirmation du paiement.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4">4. Propriété Intellectuelle</h2>
            <p>
              Tous les éléments du site (design, code, contenus) sont la propriété exclusive de Loopark ou de ses partenaires. Toute reproduction est strictement interdite sans autorisation préalable.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4">5. Responsabilité</h2>
            <p>
              Loopark met tout en œuvre pour assurer la disponibilité et la fiabilité du service mais ne saurait être tenu responsable des interruptions, pertes de données ou dommages indirects.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4">6. Modification des CGU</h2>
            <p>
              Loopark se réserve le droit de modifier à tout moment les présentes CGU. Les modifications seront publiées sur cette page et entreront en vigueur dès leur mise en ligne.
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-bold mb-4">7. Droit applicable et juridiction</h2>
            <p>
              Les présentes CGU sont soumises au droit français. Tout litige sera porté devant les tribunaux compétents de Paris.
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
