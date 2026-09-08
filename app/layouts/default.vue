<script lang="ts" setup>
useHead({
  bodyAttrs: {
    class: "bg-woodsmoke-100 dark:bg-woodsmoke-900",
  },
});
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <div class="flex flex-1 flex-col">
      <slot />
    </div>

    <SiteFooter />
  </div>
</template>
