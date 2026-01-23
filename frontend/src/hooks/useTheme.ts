import { useCallback, useEffect, useState } from "react";

type ThemeMode = "light" | "dark";

const STORAGE_KEY = "rbac-theme";

const getPreferredTheme = (): ThemeMode => {
    if (typeof window === "undefined") {
        return "dark";
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "light" || stored === "dark") {
        return stored;
    }

    return "dark";
};

export const useTheme = () => {
    const [theme, setTheme] = useState<ThemeMode>(getPreferredTheme);

    useEffect(() => {
        const root = document.documentElement;
        root.classList.toggle("dark", theme === "dark");
        localStorage.setItem(STORAGE_KEY, theme);
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    }, []);

    return { theme, toggleTheme };
};

export type { ThemeMode };
