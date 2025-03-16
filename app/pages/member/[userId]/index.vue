<script setup lang="ts">
import type { Roulette } from "@/@types/roulette";
definePageMeta({
  middleware: "auth",
});

const thisMonthRoulettes = ref<Roulette[]>();

const route = useRoute();
const router = useRouter();
const userId = ref<string>("");
userId.value = route.params.userId as string;

const restRouletteNum = ref<number>(0);

const startMultiGame = () => {
  return router.push(`/member/${userId}/choiceOutlet`);
};

onMounted(async () => {
  thisMonthRoulettes.value = await getAllRoulette(userId.value);
  restRouletteNum.value = 50 - thisMonthRoulettes.value.length;
})
</script>

<template>
  <div>
    <div class="flex items-end p-5">
      <p class="font-bold">今月残り</p>
      <p class="font-bold px-2">{{ restRouletteNum }}ルーレット</p>
    </div>
    <p class="font-bold p-5">ステータス</p>
    <div class="flex items-center justify-start p-5">
      <div class="size-32 overflow-hidden rounded-full">
        <img :src="'/images/icon/iconme.JPG'" alt="ロゴ画像" />
      </div>
      <div class="">
        <p class="text-xl text-start px-2">Level.99</p>
        <p class="w-48 bg-green-500 border-2 boerder-gray-700 rounded-full p-1"></p>
      </div>
    </div>
    <div class="flex items-center justify-center space-x-10">
      <button
        class="size-32 grid items-center bg-gray-500 text-center text-white font-semibold p-2 rounded-full hover:bg-gray-800"
        :class="{'pointer-events-none bg-gray-700': restRouletteNum <= 0}"
      >
        一人で遊ぶ
      </button>
      <button
        class="size-32 grid items-center bg-gray-500 text-center text-white font-semibold p-2 rounded-full hover:bg-gray-800"
        :class="{'pointer-events-none bg-gray-700': restRouletteNum <= 0}"
        @click="startMultiGame">
        みんなで遊ぶ
      </button>
    </div>
  </div>
</template>
