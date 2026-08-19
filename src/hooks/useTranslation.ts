import { usePreferences } from "./usePreferences";
import { dictionary } from "@/lib/i18n";

export function useTranslation() {
  const { language } = usePreferences();

  const t = (key: string): string => {
    const langDict = dictionary[language] || dictionary["en"];
    const val = langDict[key] || dictionary["en"][key];
    if (val) return val;
    
    // Humanize the key as a last resort readable fallback
    // e.g., "landing.hero_title" -> "Hero title"
    const parts = key.split(".");
    const lastPart = parts[parts.length - 1];
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace(/_/g, " ");
  };

  return { t, language };
}
