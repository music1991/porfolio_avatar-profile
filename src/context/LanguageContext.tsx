import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export type Language = "en" | "es" | "de";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>("en");
  const [translations, setTranslations] = useState<Record<string, string>>({});

  // Cargar traducciones dinámicamente
  const loadTranslations = async (lang: Language) => {
    try {
      const translationModule = await import(`../locales/${lang}.json`);
      setTranslations(translationModule.default || translationModule);
    } catch (error) {
      console.error("Error loading translations:", error);
      // Si falla, cargar un objeto vacío para evitar errores
      setTranslations({});
    }
  };

  // Cambia idioma, guarda en localStorage y carga traducciones
  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
    loadTranslations(lang);
  };

  // Inicializar idioma desde localStorage
  useEffect(() => {
    const storedLang = localStorage.getItem("language") as Language | null;
    const initialLang = storedLang || "en";
    changeLanguage(initialLang);
  }, []);

  // Función de traducción
  const t = (key: string): string => translations[key] || key;

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};