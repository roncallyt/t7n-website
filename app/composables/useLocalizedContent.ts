type LocalizedCollectionName =
  | "articles_en"
  | "articles_pt_br"
  | "projects_en"
  | "projects_pt_br";

export function useLocalizedCollection(baseName: "articles" | "projects") {
  const { locale } = useI18n();

  const collectionName = computed<LocalizedCollectionName>(() => {
    const suffix = locale.value === "pt-br" ? "pt_br" : "en";
    return `${baseName}_${suffix}`;
  });

  return collectionName;
}
