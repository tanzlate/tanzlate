<template>
  <div class="colored-label" :style="{ '--label-bg-color': color }">
    {{ label }}
    <slot />
  </div>
</template>

<script setup lang="ts">
const { color } = withDefaults(
  defineProps<{
    color: string;
    label: string;
  }>(),
  {
    color: '#ccc',
    label: 'Default Label',
  },
);
</script>

<style scoped>
.colored-label {
  display: inline-block;
  padding: 0.25em 0.5em;
  border-radius: 0.25em;
  font-family: monospace;
  font-size: 0.9rem;
  text-transform: uppercase;
  user-select: none;
  background-color: v-bind(color);
  color: #fff;
}
</style>
