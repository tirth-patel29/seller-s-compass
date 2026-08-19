import { usePreferences, setLanguage, setCurrency, SupportedLanguage, SupportedCurrency } from "@/hooks/usePreferences";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LanguageSelector() {
  const { language } = usePreferences();

  const labels: Record<SupportedLanguage, string> = {
    en: "English",
    hi: "हिन्दी",
    gu: "ગુજરાતી",
    fr: "Français",
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-slate-700 bg-transparent hover:bg-slate-100 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-1">
        <span className="text-lg leading-none" aria-hidden="true">🌐</span>
        <span>{labels[language]}</span>
        <span className="text-xs opacity-50 ml-0.5">▾</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setLanguage("en")}>English</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("hi")}>हिन्दी</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("gu")}>ગુજરાતી</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setLanguage("fr")}>Français</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function CurrencySelector() {
  const { currency } = usePreferences();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-slate-700 bg-transparent hover:bg-slate-100 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-slate-900 focus-visible:ring-offset-1">
        <span className="text-slate-500 font-bold">$</span>
        <span>{currency}</span>
        <span className="text-xs opacity-50 ml-0.5">▾</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setCurrency("USD")}>$ USD — US Dollar</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setCurrency("INR")}>₹ INR — Indian Rupee</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setCurrency("EUR")}>€ EUR — Euro</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setCurrency("GBP")}>£ GBP — British Pound</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
