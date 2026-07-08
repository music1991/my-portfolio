import { useLanguage, type Language } from "../context/Language";

export const LanguageSelector = () => {
    const { language, setLanguage } = useLanguage();

    const languages = ["en", "es"];

    return (
        <div className="flex flex-row items-center space-x-2">
            {languages.map((lang, index) => (
                <div key={lang} className="flex flex-row items-center">
                    <button
                        className={`text-sm md:text-base font-medium hover:text-accent cursor-pointer transition-colors ${
                            language === lang ? "font-bold text-accent" : "font-normal text-muted-foreground"
                        }`}
                        onClick={() => setLanguage(lang as Language)}
                    >
                        {lang.toUpperCase()}
                    </button>
                    {index < languages.length - 1 && (
                        <span className="text-border ml-1">|</span>
                    )}
                </div>
            ))}
        </div>
    );
};