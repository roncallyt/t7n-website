<script setup lang="ts">
const props = defineProps<{ error: unknown }>();

interface ApplicationError {
  statusCode?: number;
  statusMessage?: string;
  message?: string;
}

const applicationError = computed<ApplicationError>(() => {
  if (typeof props.error !== "object" || props.error === null) {
    return {};
  }

  return props.error as ApplicationError;
});

const statusCode = computed(() => applicationError.value.statusCode || 500);
const errorMessage = computed(
  () =>
    applicationError.value.statusMessage ||
    applicationError.value.message ||
    "An unexpected error occurred",
);

const returnHome = () => clearError({ redirect: "/" });
</script>

<template>
  <NuxtMaintenanceError
    v-if="isMaintenanceError(props.error)"
    :error="props.error"
  >
    <NuxtLayout name="default">
      <main
        class="flex w-full flex-1 items-center overflow-hidden py-16 sm:py-24"
      >
        <div class="mx-auto w-full max-w-7xl">
          <div
            class="grid grid-cols-1 items-center gap-x-8 gap-y-16 sm:gap-y-20 lg:grid-cols-2"
          >
            <div class="px-6 md:px-0 lg:pr-4">
              <div
                class="mx-auto max-w-2xl space-y-8 text-woodsmoke-900 lg:mx-0 lg:max-w-lg dark:text-woodsmoke-50"
              >
                <Icon name="tabler:terminal" class="text-6xl" />

                <NuxtMaintenanceErrorTitle>
                  <h1 class="text-4xl sm:text-5xl leading-14">
                    Building a new version of my space on the web.
                  </h1>
                </NuxtMaintenanceErrorTitle>

                <NuxtMaintenanceErrorMessage>
                  <p class="text-xl sm:text-3xl leading-tight">
                    Projects, articles, experiments, and a few things I learn
                    along the way.
                  </p>
                </NuxtMaintenanceErrorMessage>

                <div class="space-y-2">
                  <p>Let me know when it’s live.</p>

                  <MaintenanceSubscribeForm />
                </div>
              </div>
            </div>

            <div class="px-6 md:px-0">
              <div
                class="relative isolate mx-auto max-w-2xl overflow-hidden rounded-3xl bg-fuchsia-blue-600 pt-8 pl-6 sm:pt-16 sm:pl-16 lg:-mr-16 lg:ml-0 lg:max-w-none xl:-mr-24 dark:bg-fuchsia-blue-700"
              >
                <div
                  aria-hidden="true"
                  class="absolute -inset-y-px -left-3 z-0 w-full origin-bottom-left skew-x-[-24deg] bg-fuchsia-blue-200/25 ring-1 ring-white/30 ring-inset dark:bg-fuchsia-blue-300/20"
                />

                <div
                  class="relative z-10 flex max-w-2xl justify-end sm:ml-auto"
                >
                  <WorkspaceTerminal />
                </div>

                <div
                  aria-hidden="true"
                  class="pointer-events-none absolute inset-0 z-20 rounded-3xl ring-1 ring-black/10 ring-inset dark:ring-white/10"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </NuxtLayout>
  </NuxtMaintenanceError>

  <NuxtLayout v-else name="default">
    <main class="flex flex-1 items-center justify-center px-6 py-16">
      <div
        class="max-w-xl space-y-6 text-center text-woodsmoke-900 dark:text-woodsmoke-50"
      >
        <p
          class="font-mono text-sm text-fuchsia-blue-600 dark:text-fuchsia-blue-400"
        >
          Error {{ statusCode }}
        </p>

        <h1 class="text-4xl sm:text-5xl">
          {{ errorMessage }}
        </h1>

        <button
          type="button"
          class="cursor-pointer rounded-lg bg-fuchsia-blue-600 px-5 py-3 text-woodsmoke-50 hover:bg-fuchsia-blue-700"
          @click="returnHome"
        >
          Return home
        </button>
      </div>
    </main>
  </NuxtLayout>
</template>
