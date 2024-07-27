'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext<any>(null)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [mode, setMode] = useState<string>('')

    const handleThemeChange = () => {
        if (localStorage.theme === 'dark' || (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme:dark)").matches)) {
            setMode('dark');
            document.documentElement.classList.add('dark')
        } else {
            setMode('light')
            document.documentElement.classList.remove('dark')
        }
    }

    useEffect(() => {
        handleThemeChange()
    }, [mode])

    return <ThemeContext.Provider value={{ mode, setMode }}>
        {children}
    </ThemeContext.Provider>
}
export const useTheme = (): { mode: string; setMode: React.Dispatch<React.SetStateAction<string>> } => {
    const context = useContext(ThemeContext)

    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }

    return context
}