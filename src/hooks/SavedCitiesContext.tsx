import React, { createContext, useContext } from 'react';
import { useSavedCities } from './useSavedCities';

const SavedCitiesContext = createContext<ReturnType<typeof useSavedCities> | null>(null);

export function SavedCitiesProvider({ children }: { children: React.ReactNode }) {
  const value = useSavedCities();
  return (
    <SavedCitiesContext.Provider value={value}>
      {children}
    </SavedCitiesContext.Provider>
  );
}

export function useSavedCitiesContext() {
  const ctx = useContext(SavedCitiesContext);
  if (!ctx) throw new Error('useSavedCitiesContext must be used within a SavedCitiesProvider');
  return ctx;
} 