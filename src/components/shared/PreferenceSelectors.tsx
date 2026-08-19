import { usePreferences, setLanguage, setCurrency, SupportedLanguage, SupportedCurrency } from "@/hooks/usePreferences";
import { Globe, Coins } from "lucide-react";

export function LanguageSelector() {
  const { language } = usePreferences();

  const labels: Record<SupportedLanguage, string> = {
    en: "English",
    hi: "हिन्दी",
    gu: "ગુજરાતી",
    fr: "Français",
  };

  return (
    <div className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors focus-within:ring-2 focus-within:ring-slate-900 focus-within:ring-offset-1">
      <Globe className="size-3.5 text-slate-500" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as SupportedLanguage)}
        className="bg-transparent outline-none cursor-pointer text-slate-700 font-medium text-sm w-[75px]"
        aria-label="Select Language"
      >
        <option value="en">{labels.en}</option>
        <option value="hi">{labels.hi}</option>
        <option value="gu">{labels.gu}</option>
        <option value="fr">{labels.fr}</option>
      </select>
    </div>
  );
}

export function CurrencySelector() {
  const { currency } = usePreferences();

  const labels: Record<SupportedCurrency, string> = {
    USD: "USD — $",
    INR: "INR — ₹",
    EUR: "EUR — €",
    GBP: "GBP — £",
  };

  return (
    <div className="flex items-center gap-1.5 rounded-md border border-border px-2 py-1 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors focus-within:ring-2 focus-within:ring-slate-900 focus-within:ring-offset-1">
      <Coins className="size-3.5 text-slate-500" />
      <select
        value={currency}
        onChange={(e) => setCurrency(e.target.value as SupportedCurrency)}
        className="bg-transparent outline-none cursor-pointer text-slate-700 font-medium text-sm w-[75px]"
        aria-label="Select Currency"
      >
        <option value="USD">{labels.USD}</option>
        <option value="INR">{labels.INR}</option>
        <option value="EUR">{labels.EUR}</option>
        <option value="GBP">{labels.GBP}</option>
      </select>
    </div>
  );
}
