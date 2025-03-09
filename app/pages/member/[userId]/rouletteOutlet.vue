<template>
  <div>
    <p class="font-bold text-center text-3xl p-3">ルーレット画面</p>
    <div class="grid items-center justify-center my-5">
      <img v-if=slideImgaeURL :src="slideImgaeURL" alt="プレビュー画像" class="size-64 object-cover" />
      <img v-else-if="slideImgaeURL" :src="slideImgaeURL" alt="登録済画像" class="size-64 object-cover" />
      <div v-else class="flex size-64 items-center justify-center text-center rounded-lg bg-gray-400 text-white">
        No image
      </div>
      <div class="flex items-center justify-between p-5">
        <div @click="moveSlide(`left`)">
          <svg class="size-8 fill-current -rotate-90" viewBox="0 0 16 16">
            <path fill-rule="evenodd"
              d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767z" />
          </svg>
        </div>
        <div class="text-center font-semibold">{{ slideName }}</div>
        <div @click="moveSlide(`right`)">
          <svg class="size-8 fill-current rotate-90" viewBox="0 0 16 16">
            <path fill-rule="evenodd"
              d="M7.022 1.566a1.13 1.13 0 0 1 1.96 0l6.857 11.667c.457.778-.092 1.767-.98 1.767H1.144c-.889 0-1.437-.99-.98-1.767z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- ルーレット後は結果表示 -->
    <div v-if="isLouletted" class="grid items-center justify-center my-8">
      <div class="grid items-center justify-center">
        <img v-if=resultOutlet?.imageUrl :src="resultOutlet?.imageUrl" alt="プレビュー画像" class="size-32 object-cover" />
        <img v-else-if="resultOutlet?.imageUrl" :src="resultOutlet?.imageUrl" alt="登録済画像" class="size-32 object-cover" />
        <div v-else class="flex size-32 items-center justify-center text-center rounded-lg bg-gray-400 text-white">
          No image
        </div>
      </div>
      <p class="py-5">あなたのお昼は{{ resultOutlet?.name }}</p>
      <div class="bg-black text-white font-semi-bold text-xl text-center p-2 px-4 rounded-2xl" @click="goHome">最初から</div>
    </div>
    <div v-else class="flex items-center justify-center my-32">
      <div class="bg-black text-white rounded-2xl text-3xl p-4 px-4 text-center" @click="roulettingOutlet">ルーレットスタート!!</div>
    </div>

    <!-- ローディング -->
    <SharedLoading :is-loading="isLoading" />
    <!-- 抽選中 -->
    <SharedLottering :show="isLotterying" />
    <!-- 結果モーダル画面 -->
    <div v-if="isModal" class="relative">
      <div class="fixed inset-0 bg-gray-500/75"></div>
      <div class="fixed inset-0 flex items-center justify-center">
        <div class="m-2 max-h-full rounded-2xl border-2 border-gray-400 bg-white">
          <p class="text-3xl text-center font-bold p-3">あなたの今日のお昼</p>
          <div class="grid items-center justify-center my-5">
            <img v-if=resultOutlet?.imageUrl :src="resultOutlet?.imageUrl" alt="プレビュー画像" class="size-96 object-cover" />
            <img v-else-if="resultOutlet?.imageUrl" :src="resultOutlet?.imageUrl" alt="登録済画像" class="size-96 object-cover" />
            <div v-else class="flex size-96 items-center justify-center text-center rounded-lg bg-gray-400 text-white">
              No image
            </div>
            <p class="text-xl text-center font-bold p-3">{{ resultOutlet?.name }}</p>
          </div>
          <div class="flex items-center justify-center py-6">
            <div class="bg-black text-white font-semi-bold text-xl text-center p-2 px-4 rounded-2xl" @click="closeModal">閉じる</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAuth, onAuthStateChanged, } from "firebase/auth";
import type { Outlet } from "@/@types/outlet";
// @ts-ignore
import { getAllSelectedOutlet } from "~/composables/outletRoulette";
definePageMeta({
  middleware: "auth",
});

const auth = getAuth();
const router = useRouter();
const route = useRoute();

const userId = route.params.userId;
const rouletteId = route.query.roulette_id;
const rouletteOutlets = ref<Outlet[]>([]);
const resultOutlet = ref<Outlet>();

const isLoading = ref<boolean>(false);
const isLotterying = ref<boolean>(false);
const isLouletted = ref<boolean>(false);
const isModal = ref<boolean>(false);

const closeModal = () => {
  isModal.value = false;
}

// スライドショー
const slideName = ref<string>("No image");
const slideImgaeURL = ref<string>("");
const currentSlide = ref<number>(0);

const statusSlide = () => {
  slideName.value = rouletteOutlets.value[currentSlide.value]?.name as string;
  slideImgaeURL.value = rouletteOutlets.value[currentSlide.value]?.imageUrl as string;
}

// スライドを移動する
const moveSlide = (direct: string) => {
  if (direct === "right" && currentSlide.value < rouletteOutlets.value.length - 1) {
    currentSlide.value++;
  } else if (direct === "left" && currentSlide.value > 0) {
    currentSlide.value--;
  };
  statusSlide();
};

// ルーレットを実行
const roulettingOutlet = () => {
  isLotterying.value = true;
  setTimeout(() => {
    const randomIndex = Math.floor(Math.random() * rouletteOutlets.value.length);
    resultOutlet.value = rouletteOutlets.value[randomIndex];
    isLotterying.value = false;
    isModal.value = true;
    isLouletted.value = true;
  }, 5000);
}

const goHome = () => {
  router.push(`/member/${userId}/`);
};

onMounted(async () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      rouletteOutlets.value = await getAllSelectedOutlet(rouletteId, userId);
    }
  });
  statusSlide();
});
</script>
