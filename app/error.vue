<script setup lang="ts">
const props = defineProps<{ error: unknown }>();
</script>

<template>
  <NuxtMaintenanceError
    v-if="isMaintenanceError(props.error)"
    :error="props.error"
  >
    <NuxtLayout name="default">
      <main
        class="flex min-h-screen w-full items-center overflow-hidden py-16 sm:py-24"
      >
        <div class="mx-auto w-full max-w-7xl md:px-6 lg:px-8">
          <div
            class="grid grid-cols-1 items-center gap-x-8 gap-y-16 sm:gap-y-20 lg:grid-cols-2"
          >
            <div class="px-6 md:px-0 lg:pr-4">
              <div
                class="mx-auto max-w-2xl space-y-8 text-woodsmoke-900 lg:mx-0 lg:max-w-lg dark:text-woodsmoke-50"
              >
                <Icon name="tabler:terminal" class="text-6xl" />

                <NuxtMaintenanceErrorTitle>
                  <h1 class="text-4xl sm:text-5xl">
                    Building a new version of my space on the web.
                  </h1>
                </NuxtMaintenanceErrorTitle>

                <NuxtMaintenanceErrorMessage>
                  <p class="text-xl sm:text-3xl">
                    Projects, articles, experiments, and a few things I learn
                    along the way.
                  </p>
                </NuxtMaintenanceErrorMessage>

                <div class="space-y-4">
                  <div class="space-y-2">
                    <p>Let me know when it’s live.</p>

                    <ListmonkForm
                      class="flex w-fit items-center space-x-3 rounded-lg bg-woodsmoke-50 px-3 py-1 text-woodsmoke-900"
                    >
                      <ListmonkInput
                        field="email"
                        type="email"
                        placeholder="E-mail"
                        required
                        class="w-60 placeholder-woodsmoke-900 outline-none"
                      />

                      <ListmonkButton class="inline-flex cursor-pointer">
                        <Icon name="iconamoon:send-fill" class="text-xl" />
                      </ListmonkButton>
                    </ListmonkForm>
                  </div>

                  <p>Made with <Icon name="ri:heart-fill" /> by T7n.</p>
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
</template>
