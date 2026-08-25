<script setup lang="ts">
const {
  link = false,
  href = undefined,
  target = undefined,
  type = "button",
  rectangle = false,
  rounded = false,
  borders = false,
} = defineProps<{
  link?: boolean;
  href?: string;
  target?: string;
  type?: "button" | "submit" | "reset";
  rectangle?: boolean;
  rounded?: boolean;
  borders?: boolean;
}>();

const classes = [
  "inline-flex items-center justify-center",
  {
    "rounded-full": rounded,
    "rounded-md": !rounded,
  },
  {
    "px-3 py-2": rectangle,
    "p-2": !rectangle,
  },
  "hover:bg-shark-400/5 text-shark-900 transition ease-linear duration-500",
  "dark:hover:bg-white/5 dark:text-shark-300",
  {
    "border dark:border-white/5 dark:hover:border-shark-300": borders,
  },
];
</script>

<template>
  <a v-if="link" :href="href" :target="target" :class="classes">
    <slot />
  </a>

  <button v-else :type="type" :class="classes">
    <slot />
  </button>
</template>
