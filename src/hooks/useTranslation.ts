import { usePreferences } from "./usePreferences";
import { dictionary } from "@/lib/i18n";

export function useTranslation() {
  const { language } = usePreferences();

  const t = (key: string): string => {
    const langDict = dictionary[language] || dictionary["en"];
    return langDict[key] || dictionary["en"][key] || key;
  };

  return { t, language };
}
