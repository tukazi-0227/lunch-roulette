<template>
  <!-- ローディング -->
  <div v-if="isLoading" class="relative z-10 mt-10">
    <div class="fixed inset-0 bg-gray-500/75"></div>
    <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
      <div class="flex min-h-full justify-center">
        <div class="mt-[10%]">
          <div
            class="mx-auto my-10 size-24 animate-spin rounded-full border-4 border-black border-t-transparent"
          ></div>
          <p class="text-center text-2xl font-bold">Loading ...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  isLoading: {
    type: Boolean,
    default: false,
  },
});
</script>
