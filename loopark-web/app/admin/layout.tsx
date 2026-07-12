import { auth } from "@/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Logo } from "@/components/ui/Logo"
import { signOut } from "@/auth"
import { LogOut, Shield } from "lucide-react"
import { ThemeToggle } from "@/components/ui/ThemeToggle"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await auth()

    if (!session?.user?.id) redirect("/login")
    if (session.user.role !== 'ADMIN') redirect("/app/search")

    return (
        <div className="min-h-screen bg-[var(--background)] flex flex-col">
            <header className="border-b border-[var(--border)] bg-[var(--background)]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/admin">
                            <Logo />
                        </Link>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--muted)] bg-[var(--surface)] border border-[var(--border)] px-2.5 py-1 rounded-full">
                            <Shield className="h-3 w-3" />
                            Administration
                        </div>
                        <nav className="hidden md:flex items-center gap-1">
                            <Link
                                href="/admin"
                                className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] px-3 py-1.5 rounded-md transition-colors"
                            >
                                Tableau de bord
                            </Link>
                            <Link
                                href="/admin/spots"
                                className="text-sm text-[var(--muted)] hover:text-[var(--foreground)] px-3 py-1.5 rounded-md transition-colors"
                            >
                                Modération spots
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <span className="text-xs text-[var(--muted)] hidden sm:block">{session.user.email}</span>
                        <form action={async () => {
                            "use server"
                            await signOut({ redirectTo: "/" })
                        }}>
                            <button className="flex items-center gap-1.5 text-sm text-[var(--muted)] hover:text-red-500 transition-colors">
                                <LogOut className="h-4 w-4" />
                                <span className="hidden sm:inline">Déconnexion</span>
                            </button>
                        </form>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {children}
            </main>
        </div>
    )
}
