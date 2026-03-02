import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { Navbar } from "@/components/ui/Navbar"
import { User, Mail, LogOut, History, Settings, Bell, Shield, CreditCard, Sparkles } from 'lucide-react'
import { signOut } from "@/auth"

export default async function ProfilePage() {
    const session = await auth()

    if (!session?.user) {
        redirect("/login")
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <Navbar />

            <main className="max-w-7xl mx-auto p-4 md:p-8 lg:p-12 space-y-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-purple/10 text-brand-purple text-xs font-black uppercase tracking-widest border border-brand-purple/20">
                            <Sparkles className="h-3.5 w-3.5" />
                            Votre espace personnel
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">Bonjour, <span className="gradient-text">{session.user.name?.split(' ')[0] || "Voyageur"}</span></h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar Nav */}
                    <aside className="lg:col-span-1 space-y-4">
                        <nav className="flex flex-col gap-1 p-2 glass rounded-3xl border border-border-color">
                            <Button variant="ghost" className="justify-start gap-3 h-12 text-brand-purple bg-brand-purple/5">
                                <User className="h-5 w-5" /> Mon Profil
                            </Button>
                            <Button variant="ghost" className="justify-start gap-3 h-12">
                                <History className="h-5 w-5" /> Mes Réservations
                            </Button>
                            <Button variant="ghost" className="justify-start gap-3 h-12">
                                <CreditCard className="h-5 w-5" /> Paiements
                            </Button>
                            <Button variant="ghost" className="justify-start gap-3 h-12">
                                <Bell className="h-5 w-5" /> Notifications
                            </Button>
                            <Button variant="ghost" className="justify-start gap-3 h-12">
                                <Shield className="h-5 w-5" /> Sécurité
                            </Button>
                            <div className="h-px bg-slate-100 dark:bg-slate-800 my-2 mx-4" />
                            <form
                                action={async () => {
                                    "use server"
                                    await signOut({ redirectTo: "/login" })
                                }}
                            >
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start gap-3 h-12 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                                >
                                    <LogOut className="h-5 w-5" /> Se déconnecter
                                </Button>
                            </form>
                        </nav>
                    </aside>

                    {/* Main Content */}
                    <div className="lg:col-span-3 space-y-8">
                        <Card className="border-none shadow-2xl shadow-slate-200/50 dark:shadow-none bg-white dark:bg-slate-900">
                            <CardHeader className="flex flex-row items-center justify-between pb-4">
                                <CardTitle className="text-2xl font-black">Informations du compte</CardTitle>
                                <Button variant="outline" size="sm">Modifier</Button>
                            </CardHeader>
                            <CardContent className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                                    <div className="space-y-4 p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-brand-green/10 flex items-center justify-center">
                                                <User className="h-6 w-6 text-brand-green" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nom complet</p>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{session.user.name || "Non renseigné"}</h3>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4 p-6 rounded-3xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-800">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-2xl bg-brand-purple/10 flex items-center justify-center">
                                                <Mail className="h-6 w-6 text-brand-purple" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Adresse email</p>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{session.user.email}</h3>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <Card className="border-none shadow-xl shadow-slate-200/40 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden">
                                <div className="h-2 bg-brand-green w-full" />
                                <CardHeader>
                                    <CardTitle className="text-xl flex items-center gap-3">
                                        <History className="h-6 w-6 text-brand-green" />
                                        Dernière activité
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-slate-500 font-medium italic text-center py-8">
                                        Aucune réservation passée pour le moment.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-xl shadow-slate-200/40 dark:shadow-none bg-white dark:bg-slate-900 overflow-hidden">
                                <div className="h-2 bg-brand-purple w-full" />
                                <CardHeader>
                                    <CardTitle className="text-xl flex items-center gap-3">
                                        <Settings className="h-6 w-6 text-brand-purple" />
                                        Préférences
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <span className="text-sm font-bold">Notifications Email</span>
                                        <div className="h-6 w-10 rounded-full bg-brand-green relative cursor-pointer">
                                            <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full" />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                        <span className="text-sm font-bold">Mode Sombre Automatique</span>
                                        <div className="h-6 w-10 rounded-full bg-slate-200 relative cursor-pointer">
                                            <div className="absolute left-1 top-1 h-4 w-4 bg-white rounded-full" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
