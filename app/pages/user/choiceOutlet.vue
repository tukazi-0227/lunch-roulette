<template>
  <div>
    <h2 class="text-2xl text-center font-bold p-3">ゲーム画面</h2>
    <p class="text-2xl text-center font-bold p-3">設定</p>
    <div>
      <div>
        <p class="p-4 text-lg font-semibold">遊ぶ人数</p>
        <div class="text-center text-6xl font-bold">{{ playerNumber }}</div>
        <div class="flex items-center justify-center p-4">
          <div class="cursor-pointer w-1/3 rounded-full bg-black text-center text-white text-5xl mx-5"
          @click="decrementNum">
          -
        </div>
        <div class="cursor-pointer w-1/3 rounded-full bg-black text-center text-white text-5xl mx-5"
          @click="incrementNum">
          +
        </div>
        </div>
      </div>
      <div>
        <p class="p-4 text-lg font-semibold">登録エリア</p>
        <div class="flex items-center justify-center">
          <div class="relative w-[90%]">
            <div class="rounded-lg border-2 border-gray-200 px-2 py-1.5" @click="togglePlace">{{ place }}</div>
            <div v-if="isPlace" class="absolute w-full bg-white rounded-lg border-2 border-gray-200">
              <div v-for="place in placeDropdown" class="px-2 py-1.5" @click="selectPlace(place)">{{ place }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="flex items-center justify-center">
        <button class="absolute bottom-0 w-[95%] rounded-lg bg-black text-white p-2 my-4" @click="goSelectOutlet">スタート</button>
      </div>
    <!-- モーダル画面 -->
    <div v-if="isModalOpen" class="relative">
      <div class="fixed inset-0 bg-gray-500/75"></div>
      <div class="fixed inset-0 flex items-center justify-center">
        <div class="min-w-64 max-h-screen overflow-y-auto rounded-lg border-2 border-gray-400 bg-white">
          <p class="font-bold text-xl text-center p-2">
          </p>
          <!-- 登録名 -->
          <div class="p-2">
            <div class="flex items-center">
              <p class="font-bold mr-1">登録名</p>
              <div class="rounded-lg bg-red-500 px-1.5 py-0.5 text-center text-xs font-semibold text-white">
                必須
              </div>
            </div>
            <input id="name" type="text" v-model="name"
              class="w-full rounded-lg border-2 border-gray-200 px-2 py-1.5" />
          </div>
        </div>
      </div>
    </div>
    <!-- ローディング -->
    <div v-if="isLoading" class="relative z-10 mt-10">
      <div class="fixed inset-0 bg-gray-500/75"></div>
      <div class="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div class="flex min-h-full justify-center">
          <div class="mt-[10%]">
            <div class="mx-auto my-10 size-24 animate-spin rounded-full border-4 border-black border-t-transparent">
            </div>
            <p class="text-center text-2xl font-bold">Loading ...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getAuth } from "firebase/auth";
// @ts-ignore
import { getAllOutlet } from "~/composables/outletManagement";
const auth = getAuth();
const router = useRouter(); 
const user = auth.currentUser;

const outletData = ref<any[]>([]);
const outletId = ref<string>(crypto.randomUUID());

const isModalOpen = ref<boolean>(false);
const isEditingMode = ref<boolean>(false);
const isLoading = ref<boolean>(false);

const playerNumber = ref<number>(0);
const incrementNum = () => {
  if (playerNumber.value >= 4) {
    return;
  }
  playerNumber.value++;
}

const decrementNum = () => {
  if (playerNumber.value <= 0) return;
  playerNumber.value--;
}

// ドロップダウン
const name = ref<string>("");
const detail = ref<string>("");
const place = ref<string>("選択する");

const isPlace = ref<boolean>(false);
const placeDropdown = ref<string[]>([
  "神田",
  "上尾",
  "全て",
]);
const togglePlace = () => {
  isPlace.value = !isPlace.value;
}
const selectPlace = (item: string) => {
  place.value = item;
  togglePlace();
}

const goSelectOutlet = () => {
  router.push({ path: '/user/gameOutlet', query: { num: playerNumber.value, place: place.value }});
}

onMounted(async () => {
  outletData.value = await getAllOutlet();
});
</script>
