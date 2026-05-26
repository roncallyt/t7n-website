<script setup lang="ts">
useSchemaOrg([
  definePerson({
    name: "Thomerson Roncally",
    url: "https://t7n.dev",
  }),
  defineWebSite({
    name: "Thomerson Roncally",
    inLanguage: ["pt-BR", "en-US"],
  }),
]);
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
