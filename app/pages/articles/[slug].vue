<script lang="ts" setup>
const route = useRoute();
const collection = useLocalizedCollection("articles");

const { data: page } = await useAsyncData(
  `article-${collection.value}-${route.params.slug}`,
  () =>
    queryCollection(collection.value)
      .path(route.path)
      .first(),
  { watch: [collection] },
);

if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: "Article not found" });
}

useSeoMeta({
  title: () => page.value?.title,
  description: () => page.value?.description,
  ogTitle: () => page.value?.title,
  ogDescription: () => page.value?.description,
  ogType: "article",
});

useSchemaOrg([
  defineArticle({
    headline: page.value?.title,
    description: page.value?.description,
    datePublished: page.value?.createdAt,
    dateModified: page.value?.updatedAt,
  }),
]);
</script>

<template>
  <div>
    <article v-if="page" class="prose prose-lg dark:prose-invert max-w-none">
      <ContentRenderer :value="page" />
    </article>
  </div>
</template>
