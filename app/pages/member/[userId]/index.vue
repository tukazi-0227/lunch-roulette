<script setup lang="ts">
import type { Result } from "@/@types/outlet";
import type { Timestamp } from "firebase/firestore";
definePageMeta({
  middleware: "auth",
  layout: "header",
});

const thisMonthRoulettes = ref<Result[]>();

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

const formattedTimestamp = (time: Timestamp) => {
  const timestampMs = (time as any) * 1000 + Math.floor(time.nanoseconds / 1_000_000);
  const date = new Date(timestampMs);
  return `${date.getMonth() + 1}月${date.getDate()}日${date.getHours()}時${date.getMinutes()}分`
}
onMounted(async () => {
  thisMonthRoulettes.value = await getAllResultRoulette(userId.value);
  restRouletteNum.value = 50 - thisMonthRoulettes.value.length;
})
</script>

<template>
  <div>
    <div>
      <p class="text-center font-bold text-xl p-2">今月のルーレット記録</p>
      <div v-if="thisMonthRoulettes?.length === 0" class="flex items-center justify-center p-2">
        <div class="flex items-center justify-center text-lg font-bold bg-gray-500 text-white w-full h-40 rounded-xl">
          <p>今月はまだルーレットが行われていません</p>
        </div>
      </div>
      <div class="flex overflow-x-auto flex-nowrap">
      <div v-for="result in thisMonthRoulettes" class="flex-shrink-0">
        <div class="p-2">
          <img v-if="result.outlet.imageUrl" :src="result.outlet.imageUrl" alt="プレビュー画像" class="size-36 object-cover rounded-lg" />
          <img v-else-if="result.outlet.imageUrl" :src="result.outlet.imageUrl" alt="登録済画像" class="size-36 object-cover rounded-lg" />
          <div v-else class="flex size-36 items-center justify-center text-center rounded-lg bg-gray-400 text-white">
            No image
          </div>
          <p class="text-center p-2 font-semibold">{{ result.outlet.name }}</p>
          <p class="text-center p-2 font-semibold">{{ formattedTimestamp(result.roulettedAt) }}</p>
        </div>
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
