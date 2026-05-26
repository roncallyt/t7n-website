<script setup lang="ts">
const mode = useColorMode();

const { state, next } = useCycleList(["dark", "light"] as const, {
  initialValue: mode.value,
});

watchEffect(() => (mode.preference = state.value));
</script>

<template>
  <CoreButton rounded @click="next()">
    <Icon
      v-if="$colorMode.value === 'light'"
      name="ri:sun-fill"
      class="w-8 h-8"
    />

    <Icon
      v-if="$colorMode.value === 'dark'"
      name="ri:moon-fill"
      class="w-8 h-8"
    />
  </CoreButton>
</template>
