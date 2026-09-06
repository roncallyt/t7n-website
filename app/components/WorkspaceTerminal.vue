<script setup lang="ts">
const workspaceSteps = [
  { label: "domain connected", state: "complete", symbol: "✓" },
  { label: "workspace initialized", state: "complete", symbol: "✓" },
  { label: "portfolio under construction", state: "active", symbol: "●" },
  { label: "articles being prepared", state: "active", symbol: "●" },
  { label: "experiments queued", state: "queued", symbol: "○" },
] as const;

const workspaceDetails = [
  { label: "STATUS", value: "building" },
  { label: "RELEASE", value: "next" },
  { label: "LAUNCH", value: "soon" },
] as const;
</script>

<template>
  <section class="workspace-terminal" aria-label="t7n.dev workspace status">
    <p class="sr-only">
      The t7n.dev workspace is being built. The domain is connected and the
      workspace is initialized. The portfolio and articles are in progress, with
      experiments queued. The next release is coming soon.
    </p>

    <div class="workspace-terminal__visual" aria-hidden="true">
      <header class="workspace-terminal__chrome">
        <div class="workspace-terminal__controls">
          <span class="bg-red-400" />
          <span class="bg-amber-400" />
          <span class="bg-emerald-400" />
        </div>
        <span>workspace</span>
        <span aria-hidden="true" />
      </header>

      <div class="workspace-terminal__body">
        <p class="workspace-terminal__reveal" style="--terminal-delay: 100ms">
          <span class="text-emerald-400">$</span>
          pnpm workspace status
        </p>

        <p
          class="workspace-terminal__title workspace-terminal__reveal"
          style="--terminal-delay: 450ms"
        >
          <span class="text-woodsmoke-50">t7n.dev</span>
          <span class="text-woodsmoke-500">— workspace</span>
        </p>

        <ul class="space-y-2">
          <li
            v-for="(step, index) in workspaceSteps"
            :key="step.label"
            class="workspace-terminal__row workspace-terminal__reveal"
            :class="`workspace-terminal__row--${step.state}`"
            :data-state="step.state"
            :style="{ '--terminal-delay': `${750 + index * 220}ms` }"
          >
            <span class="workspace-terminal__symbol">{{ step.symbol }}</span>
            <span>{{ step.label }}</span>
          </li>
        </ul>

        <dl class="workspace-terminal__details">
          <div
            v-for="(detail, index) in workspaceDetails"
            :key="detail.label"
            class="workspace-terminal__detail workspace-terminal__reveal"
            :style="{ '--terminal-delay': `${2000 + index * 180}ms` }"
          >
            <dt>{{ detail.label }}</dt>
            <dd>
              {{ detail.value }}
              <span
                v-if="detail.label === 'LAUNCH'"
                class="workspace-terminal__cursor"
              />
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>

<style scoped>
.workspace-terminal {
  width: 100%;
  max-width: 38rem;
}

.workspace-terminal__visual {
  overflow: hidden;
  border: 1px solid var(--color-woodsmoke-700);
  border-radius: 1rem;
  background: var(--color-woodsmoke-950);
  box-shadow:
    0 1.5rem 4rem rgb(9 10 11 / 22%),
    inset 0 1px rgb(255 255 255 / 5%);
  color: var(--color-woodsmoke-300);
  font-family:
    "JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
    "Liberation Mono", "Courier New", monospace;
}

.workspace-terminal__chrome {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  min-height: 3rem;
  border-bottom: 1px solid var(--color-woodsmoke-800);
  padding: 0 1rem;
  background: var(--color-woodsmoke-900);
  color: var(--color-woodsmoke-400);
  font-size: 0.75rem;
}

.workspace-terminal__controls {
  display: flex;
  gap: 0.4rem;
}

.workspace-terminal__controls span {
  width: 0.65rem;
  height: 0.65rem;
  border-radius: 9999px;
}

.workspace-terminal__body {
  min-height: 26rem;
  padding: clamp(1.5rem, 5vw, 2.5rem);
  font-size: clamp(0.8rem, 2vw, 0.95rem);
  line-height: 1.6;
}

.workspace-terminal__title {
  display: flex;
  gap: 0.65rem;
  margin: 2rem 0 1.25rem;
  font-weight: 600;
}

.workspace-terminal__row {
  display: flex;
  gap: 0.75rem;
}

.workspace-terminal__symbol {
  width: 1rem;
  flex: none;
  text-align: center;
}

.workspace-terminal__row--complete .workspace-terminal__symbol {
  color: var(--color-emerald-400);
}

.workspace-terminal__row--active .workspace-terminal__symbol {
  color: var(--color-amber-400);
}

.workspace-terminal__row--queued {
  color: var(--color-woodsmoke-500);
}

.workspace-terminal__details {
  display: grid;
  gap: 0.25rem;
  margin-top: 2rem;
  border-top: 1px solid var(--color-woodsmoke-800);
  padding-top: 1.5rem;
}

.workspace-terminal__detail {
  display: grid;
  grid-template-columns: 6rem 1fr;
}

.workspace-terminal__detail dt {
  color: var(--color-woodsmoke-500);
}

.workspace-terminal__detail dd {
  color: var(--color-woodsmoke-100);
}

.workspace-terminal__cursor {
  display: inline-block;
  width: 0.5rem;
  height: 1em;
  margin-left: 0.35rem;
  translate: 0 0.15em;
  background: var(--color-emerald-400);
  animation: terminal-cursor 1s steps(1, end) 2.6s infinite;
}

.workspace-terminal__reveal {
  opacity: 0;
  transform: translateY(0.4rem);
  animation: terminal-reveal 320ms ease-out forwards;
  animation-delay: var(--terminal-delay);
}

@keyframes terminal-reveal {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes terminal-cursor {
  50% {
    opacity: 0;
  }
}

@media (min-width: 40rem) {
  .workspace-terminal__body {
    min-height: 29rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .workspace-terminal__reveal {
    opacity: 1;
    transform: none;
    animation: none;
  }

  .workspace-terminal__cursor {
    animation: none;
  }
}
</style>
