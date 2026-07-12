import Link from 'next/link';
import { Logo } from '@/components/ui/Logo';

export const metadata = {
  title: 'Mentions Légales - Loopark',
  description: 'Mentions légales de la plateforme Loopark.',
};

export default function MentionsLegalesPage() {
  return (
      <div className="min-h-screen bg-[var(--background)] flex flex-col selection:bg-brand-green/30">
          <header className="border-b border-[var(--border)] bg-white/80 dark:bg-slate-950/80 backdrop-blur-md sticky top-0 z-50">
              <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                  <Link href="/" className="hover:scale-105 transition-transform"><Logo /></Link>
              </div>
          </header>

          <main className="flex-1 max-w-3xl mx-auto px-6 py-16">
              <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white mb-8">
                  Mentions Légales
              </h1>
              <div className="prose prose-slate dark:prose-invert max-w-none space-y-8 text-slate-600 dark:text-slate-300">
                  <p className="text-lg">Les présentes mentions légales fixent les conditions d'utilisation du site web Loopark.</p>

                  <section>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">1. Éditeur du site</h2>
                      <p>Le site Loopark est édité par la société Loopark SAS, société par actions simplifiée au capital de 10 000 euros, dont le siège social est situé à Paris (France), immatriculée au Registre du Commerce et des Sociétés sous le numéro [En cours d'immatriculation].</p>
                      <p>Directeur de la publication : Équipe Fondatrice Loopark.</p>
                  </section>

                  <section>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">2. Hébergement</h2>
                      <p>Le site est hébergé par la société Vercel Inc., située 340 S Lemon Ave #4133 Walnut, CA 91789, États-Unis.</p>
                      <p>Les données applicatives et bases de données sont hébergées sur des serveurs sécurisés situés en Europe (Francfort) via Prisma Data Platform.</p>
                  </section>

                  <section>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">3. Propriété intellectuelle</h2>
                      <p>L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables, le code source, le design "Loopark Green" et les représentations iconographiques. La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse.</p>
                  </section>

                  <section>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">4. Responsabilité</h2>
                      <p>Loopark met tout en œuvre pour offrir aux utilisateurs des informations et/ou outils disponibles et vérifiés (notamment concernant les emplacements de stationnement vélo/trottinette), mais ne saurait être tenu pour responsable des erreurs, d'une absence de disponibilité des informations, de changements de voirie, ou de la présence de virus sur son site.</p>
                  </section>

                  <section>
                      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">5. Contact</h2>
                      <p>Pour toute question ou demande d'information concernant le site, ou tout signalement de contenu illicite, l'utilisateur peut contacter l'éditeur à l'adresse e-mail : <a href="mailto:contact@loopark.com" className="text-brand-green hover:underline">contact@loopark.com</a>.</p>
                  </section>
              </div>
          </main>

          <footer className="border-t border-[var(--border)] py-8 text-center text-sm text-[var(--muted)]">
              <p>© {new Date().getFullYear()} Loopark Technologies. Tous droits réservés.</p>
          </footer>
      </div>
  );
}
