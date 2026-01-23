import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider, type PersistedClient, type Persister } from "@tanstack/react-query-persist-client";
import type { ReactNode } from "react";

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 5,
            gcTime: 1000 * 60 * 30,
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

const persistKey = "rbac-admin-cache";

const persister: Persister = {
    persistClient: async (client) => {
        window.localStorage.setItem(persistKey, JSON.stringify(client));
    },
    restoreClient: async () => {
        const cached = window.localStorage.getItem(persistKey);

        if (!cached) return undefined;

        return JSON.parse(cached) as PersistedClient;
    },
    removeClient: async () => {
        window.localStorage.removeItem(persistKey);
    },
};

interface QueryProviderProps {
    children: ReactNode;
}

export const QueryProvider = ({ children }: QueryProviderProps) => (
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
        {children}
    </PersistQueryClientProvider>
);
