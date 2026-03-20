import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Locale } from "../types";
import {
  DEFAULT_LOCALE,
  LOCALE_STORAGE_KEY,
  UI_TEXT,
} from "../constants/i18n";

interface I18nContextValue {
  locale: Locale;
  setLocale: React.Dispatch<React.SetStateAction<Locale>>;
  ui: (typeof UI_TEXT)[Locale];
}

const I18nContext = createContext<I18nContextValue | null>(null);

const getInitialLocale = (): Locale => {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
  return stored === "en" || stored === "zh-CN" ? stored : DEFAULT_LOCALE;
};

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [locale, setLocale] = useState<Locale>(getInitialLocale);

  useEffect(() => {
    window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    document.documentElement.lang = locale;
    document.title = UI_TEXT[locale].appTitle;
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      ui: UI_TEXT[locale],
    }),
    [locale]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};

