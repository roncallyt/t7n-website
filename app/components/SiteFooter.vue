<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer
    class="border-t border-woodsmoke-200 px-6 py-2.5 text-[11px] leading-4 text-woodsmoke-600 dark:border-white/10 dark:text-woodsmoke-400"
  >
    <div
      class="mx-auto flex w-full max-w-7xl flex-col sm:flex-row sm:items-center sm:justify-between"
    >
      <p class="shrink-0">
        Made with
        <Icon
          name="ri:heart-fill"
          class="inline-block align-[-0.125em]"
          aria-hidden="true"
        />
        by T7n. © 2024–{{ currentYear }}. All rights reserved.
      </p>

      <p class="sm:text-right">
        This site is protected by reCAPTCHA and the Google
        <a
          class="underline transition hover:text-woodsmoke-900 dark:hover:text-woodsmoke-100"
          href="https://policies.google.com/privacy"
          rel="noopener noreferrer"
          target="_blank"
          >Privacy Policy</a
        >
        and
        <a
          class="underline transition hover:text-woodsmoke-900 dark:hover:text-woodsmoke-100"
          href="https://policies.google.com/terms"
          rel="noopener noreferrer"
          target="_blank"
          >Terms of Service</a
        >
        apply.
      </p>
    </div>
  </footer>
</template>
