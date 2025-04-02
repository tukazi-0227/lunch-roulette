<script setup lang="ts">
import type { Roulette } from "@/@types/roulette";
definePageMeta({
  middleware: "auth",
  layout: "header",
});

const thisMonthRoulettes = ref<Roulette[]>();

const route = useRoute();
const router = useRouter();
const userId = ref<string>("");
userId.value = route.params.userId as string;

const restRouletteNum = ref<number>(0);

const startSoloGame = () => {
  return router.push(`/member/${userId.value}/rouletteOutletSolo`);
};

const startMultiGame = () => {
  return router.push(`/member/${userId.value}/choiceOutlet`);
};

onMounted(async () => {
  thisMonthRoulettes.value = await getAllRoulette(userId.value);
  restRouletteNum.value = 50 - thisMonthRoulettes.value.length;
})
</script>

<template>
  <div>
    <div>
      <p class="text-center font-bold text-xl p-2">今月のルーレット記録</p>
      <div class="flex items-center justify-center p-2">
        <div class="flex items-center justify-center text-2xl font-bold bg-gray-500 text-white w-full h-40 rounded-xl">
          <p>実装予定...</p>
        </div>
      </div>
    </div>
    <!-- 一人用 -->
    <div>
      <div class="flex items-end border-b-2 border-black m-2">
        <p class="font-semibold">何回でも遊べる</p>
      </div>
      <div class="flex items-center justify-between">
        <div class="p-2 font-semibold">
          <p>1人で行うルーレットです。</p>
          <p>地域から選べます。</p>
        </div>
        <button
          class="size-24 grid items-center bg-gray-500 text-center text-white font-semibold p-2 m-2 rounded-lg hover:bg-gray-800"
          :class="{'pointer-events-none bg-gray-700': restRouletteNum <= 0}"
          @click="startSoloGame"
        >
          1人で
        </button>
      </div>
    </div>
    <div>
      <div class="flex items-end border-b-2 border-black m-2">
        <p class="font-bold">今月残り</p>
        <p class="font-bold px-2">{{ restRouletteNum }}ルーレット</p>
      </div>
      <div class="flex items-center justify-between">
        <div class="p-2 font-semibold">
          <p>2 ~ 4人で行うルーレットです。</p>
          <p>地域から選べます。</p>
        </div>
        <button
          class="size-24 grid items-center bg-gray-500 text-center text-white font-semibold p-2 m-2 rounded-lg hover:bg-gray-800"
          :class="{'pointer-events-none bg-gray-700': restRouletteNum <= 0}"
          @click="startMultiGame">
          みんなで
        </button>
      </div>
    </div>
  
  </div>
</template>
