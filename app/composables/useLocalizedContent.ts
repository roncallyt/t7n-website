export function useLocalizedCollection(baseName: string) {
  const { locale } = useI18n();

  const collectionName = computed(() => {
    const suffix = locale.value.replace("-", "_");
    return `${baseName}_${suffix}`;
  });

  return collectionName;
}
