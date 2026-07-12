"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon, Monitor } from "lucide-react"

export function ThemeToggle() {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)

    // Avoid hydration mismatch
    useEffect(() => setMounted(true), [])
    if (!mounted) return <div className="w-9 h-9" />

    const cycle = () => {
        if (theme === "system") setTheme("light")
        else if (theme === "light") setTheme("dark")
        else setTheme("system")
    }

    const icons = {
        light: <Sun className="h-4 w-4" />,
        dark: <Moon className="h-4 w-4" />,
        system: <Monitor className="h-4 w-4" />,
    }

    const labels = {
        light: "Clair",
        dark: "Sombre",
        system: "Système",
    }

    const current = (theme as keyof typeof icons) ?? "system"

    return (
        <button
            onClick={cycle}
            title={`Thème : ${labels[current]}`}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-sm text-[var(--muted)] hover:text-[var(--foreground)] rounded-md transition-colors border border-[var(--border)] hover:bg-[var(--surface)]"
        >
            {icons[current]}
            <span className="hidden sm:inline text-xs">{labels[current]}</span>
        </button>
    )
}
