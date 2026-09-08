<script setup lang="ts">
type SubmissionStatus = "idle" | "success" | "verification-error" | "rate-limit-error" | "service-error";

const RECAPTCHA_ACTION = "newsletter_subscribe";

const recaptcha = useRecaptcha();
const email = ref("");
const pending = ref(false);
const status = ref<SubmissionStatus>("idle");

const statusMessage = computed(() => {
  switch (status.value) {
    case "success":
      return "Thanks — I’ll let you know when it’s live.";
    case "verification-error":
      return "I couldn’t verify this submission. Please try again.";
    case "rate-limit-error":
      return "Too many attempts. Please wait a few minutes and try again.";
    case "service-error":
      return "Subscriptions are temporarily unavailable. Please try again later.";
    default:
      return "";
  }
});

function getErrorStatus(error: unknown): number | undefined {
  if (!error || typeof error !== "object") {
    return undefined;
  }

  if ("statusCode" in error && typeof error.statusCode === "number") {
    return error.statusCode;
  }

  if (
    "response" in error
    && error.response
    && typeof error.response === "object"
    && "status" in error.response
    && typeof error.response.status === "number"
  ) {
    return error.response.status;
  }

  return undefined;
}

async function submit() {
  if (pending.value) {
    return;
  }

  pending.value = true;
  status.value = "idle";

  try {
    const recaptchaToken = await recaptcha.execute(RECAPTCHA_ACTION);

    await useSubscribe({
      email: email.value.trim(),
      recaptchaToken,
    });

    email.value = "";
    status.value = "success";
  } catch (error) {
    const errorStatus = getErrorStatus(error);

    if (errorStatus === 429) {
      status.value = "rate-limit-error";
    } else if (errorStatus === 400 || errorStatus === 403) {
      status.value = "verification-error";
    } else {
      status.value = "service-error";
    }
  } finally {
    pending.value = false;
  }
}

onMounted(() => {
  void recaptcha.load().catch(() => {
    // A submit retries loading and presents a user-facing error if it still fails.
  });
});
</script>

<template>
  <div class="space-y-2">
    <form
      class="flex w-fit items-center space-x-3 rounded-lg bg-woodsmoke-50 px-3 py-1 text-woodsmoke-900"
      @submit.prevent="submit"
    >
      <label class="sr-only" for="maintenance-subscribe-email">
        Email address
      </label>
      <input
        id="maintenance-subscribe-email"
        v-model="email"
        autocomplete="email"
        class="w-60 placeholder-woodsmoke-900 outline-none disabled:cursor-wait disabled:opacity-60"
        :disabled="pending"
        inputmode="email"
        placeholder="E-mail"
        required
        type="email"
      >

      <button
        aria-label="Notify me"
        class="inline-flex cursor-pointer disabled:cursor-wait disabled:opacity-60"
        :disabled="pending"
        title="Notify me"
        type="submit"
      >
        <Icon name="iconamoon:send-fill" class="text-xl" />
      </button>
    </form>

    <p
      v-if="statusMessage"
      class="max-w-sm text-sm"
      role="status"
      aria-live="polite"
    >
      {{ statusMessage }}
    </p>
  </div>
</template>
