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
						className={`lang-option ${language === lang ? 'active' : ''}`}
						onClick={() => setLanguage(lang as Language)}
					>
						{lang.toUpperCase()}
					</span>

					{index < languages.length - 1 && <span> | </span>}
				</span>
			))}
		</div>
	);
};
