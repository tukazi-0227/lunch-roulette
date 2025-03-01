<script setup>
import { DotLottieVue } from "@lottiefiles/dotlottie-vue";

const props = defineProps({
  show: Boolean,
});
</script>
<template>
  <div
    v-if="props.show"
    class="fixed inset-0 z-40 flex size-full items-center justify-center bg-black/60"
  >
    <div
      class="z-50 m-8 w-full max-w-md overflow-hidden rounded-lg bg-white p-5 text-primary-950"
    >
      <div class="flex items-center justify-center font-bold">
        <SharedModalHeader title="抽選中" />
      </div>
      <SharedModalBody class="justify-center">
        <DotLottieVue src="/images/animation/lottery.lottie" autoplay loop />
        <p class="text-center text-sm text-gray-600">
          画面を閉じずに<br />
          そのままお待ちください
        </p>
      </SharedModalBody>
    </div>
  </div>
</template>
