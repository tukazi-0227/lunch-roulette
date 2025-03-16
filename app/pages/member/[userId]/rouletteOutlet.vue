<script setup lang="ts">
import { getAuth, onAuthStateChanged, } from "firebase/auth";
import type { Outlet } from "@/@types/outlet";
// @ts-ignore
import { getAllSelectedOutlet } from "~/composables/outletRoulette";
definePageMeta({
  middleware: ["auth", "validate-roulette"],
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
});
</script>

<template>
  <div>
    <p class="font-bold text-center text-3xl p-3">ルーレット画面</p>
    <div class="flex overflow-x-auto flex-nowrap">
      <div v-for="outlet in rouletteOutlets" class="flex-shrink-0">
        <div class="p-2">
          <img v-if="outlet.imageUrl" :src="outlet.imageUrl" alt="プレビュー画像" class="size-48 object-cover rounded-lg" />
          <img v-else-if="outlet.imageUrl" :src="outlet.imageUrl" alt="登録済画像" class="size-48 object-cover rounded-lg" />
          <div v-else class="flex size-48 items-center justify-center text-center rounded-lg bg-gray-400 text-white">
            No image
          </div>
          <p class="text-center p-2 font-semibold">{{ outlet.name }}</p>
        </div>
      </div>
    </div>

    <!-- ルーレット後は結果表示 -->
    <div v-if="isLouletted" class="grid items-center justify-center my-5">
      <div class="grid items-center justify-center">
        <img v-if=resultOutlet?.imageUrl :src="resultOutlet?.imageUrl" alt="プレビュー画像" class="size-32 object-cover" />
        <img v-else-if="resultOutlet?.imageUrl" :src="resultOutlet?.imageUrl" alt="登録済画像"
          class="size-32 object-cover" />
        <div v-else class="flex size-32 items-center justify-center text-center rounded-lg bg-gray-400 text-white">
          No image
        </div>
      </div>
      <p class="py-2">あなたのお昼は{{ resultOutlet?.name }}</p>
      <div class="bg-black text-white font-semi-bold text-xl text-center p-2 px-4 rounded-2xl" @click="goHome">最初から
      </div>
    </div>
    <div v-else class="flex items-center justify-center my-32">
      <div class="bg-black text-white rounded-2xl text-3xl p-4 px-4 text-center" @click="roulettingOutlet">ルーレットスタート!!
      </div>
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
            <img v-if=resultOutlet?.imageUrl :src="resultOutlet?.imageUrl" alt="プレビュー画像" class="size-48 object-cover" />
            <img v-else-if="resultOutlet?.imageUrl" :src="resultOutlet?.imageUrl" alt="登録済画像"
              class="size-48 object-cover" />
            <div v-else class="flex size-48 items-center justify-center text-center rounded-lg bg-gray-400 text-white">
              No image
            </div>
            <p class="text-xl text-center font-bold p-3">{{ resultOutlet?.name }}</p>
          </div>
          <div class="flex items-center justify-center py-6">
            <div class="bg-black text-white font-semi-bold text-xl text-center p-2 px-4 rounded-2xl"
              @click="closeModal">閉じる</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
