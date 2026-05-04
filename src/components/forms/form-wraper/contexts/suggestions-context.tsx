"use client";

import React, { createContext, useContext, ReactNode } from "react";

interface SuggestionsContextValue {
    suggestionsEnabled: boolean;
}

const SuggestionsContext = createContext<SuggestionsContextValue>({
    suggestionsEnabled: false,
});

interface SuggestionsProviderProps {
    enabled?: boolean;
    children: ReactNode;
}

export function SuggestionsProvider({
    enabled = false,
    children,
}: SuggestionsProviderProps) {
    return (
        <SuggestionsContext.Provider value={{ suggestionsEnabled: enabled }}>
            {children}
        </SuggestionsContext.Provider>
    );
}

export function useSuggestions(): SuggestionsContextValue {
    return useContext(SuggestionsContext);
}
