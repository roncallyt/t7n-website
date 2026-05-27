<script lang="ts" setup>
const route = useRoute();
const collection = useLocalizedCollection("projects");

const { data: project } = await useAsyncData(
  `project-${collection.value}-${route.params.slug}`,
  () =>
    queryCollection(collection.value as any)
      .path(route.path)
      .first(),
  { watch: [collection] },
);

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: "Project not found" });
}

useSeoMeta({
  title: () => project.value?.title,
  description: () => project.value?.description,
  ogTitle: () => project.value?.title,
  ogDescription: () => project.value?.description,
  ogImage: () => project.value?.image,
  ogType: "article",
});
</script>

<template>
  <section v-if="project" class="py-10 md:py-16">
    <div class="container max-w-7xl mx-auto px-4">
      <header class="mb-10">
        <h1 class="font-medium text-3xl md:text-5xl mb-4">
          {{ project.title }}
        </h1>

        <p class="text-shark-500 dark:text-shark-400 text-lg">
          {{ project.description }}
        </p>
      </header>

      <div
        v-if="project.image"
        class="aspect-video bg-shark-200 dark:bg-shark-800 rounded-lg overflow-hidden mb-10"
      >
        <img
          :src="project.image"
          :alt="project.title"
          class="w-full h-full object-cover"
        />
      </div>

      <article class="prose prose-lg dark:prose-invert max-w-none">
        <ContentRenderer :value="project" />
      </article>
    </div>
  </section>
</template>
