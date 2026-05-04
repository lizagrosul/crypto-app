<script setup lang="ts">
defineProps<{
  name: string
  price: string
}>()
</script>
<template>
  <article class="bg-white overflow-hidden shadow rounded-lg border-solid cursor-pointer">
    <div class="px-4 py-5 sm:p-6 text-center">
      <h2 class="text-sm font-medium text-gray-500 truncate">{{ name }} - USD</h2>

      <p class="mt-1 text-3xl font-semibold text-gray-900">
        {{ price }}
      </p>
    </div>

    <div class="w-full border-t border-gray-200"></div>
    <slot />
  </article>
</template>
