import { useLanguage, type Language } from "../context/LanguageContext";

export const LanguageSelector = () => {
    const { language, setLanguage } = useLanguage();

    const languages = ["es", "en", "de"];

    return (
        <div
            style={{
                position: "absolute",
                top: 16,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 1000,
            }}
        >
            {languages.map((lang, index) => (
                <span key={lang} style={{ cursor: "pointer" }}>
                    <span
                        onClick={() => setLanguage(lang as Language)}
                        style={{
                            fontWeight: language === lang ? "bold" : "normal",
                            color: "#000",
                            padding: "0 4px",
                        }}
                    >
                        {lang.toUpperCase()}
                    </span>
                    {index < languages.length - 1 && <span> | </span>}
                </span>
            ))}
        </div>
    );
};
