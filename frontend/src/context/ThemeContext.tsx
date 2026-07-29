import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'light' | 'dark' | 'system'

interface ThemeContextType {
    theme: Theme
    setTheme: (t: Theme) => void
}

const ThemeContext = createContext<ThemeContextType>({
    theme: 'light',
    setTheme: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setThemeState] = useState<Theme>(
        () => (localStorage.getItem('theme') as Theme) ?? 'light'
    )

    useEffect(() => {
        const root = document.documentElement

        const apply = (t: Theme) => {
            if (t === 'dark') {
                root.classList.add('dark')
            } else if (t === 'light') {
                root.classList.remove('dark')
            } else {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
                root.classList.toggle('dark', prefersDark)
            }
        }

        apply(theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    const setTheme = (t: Theme) => setThemeState(t)

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme = () => useContext(ThemeContext)