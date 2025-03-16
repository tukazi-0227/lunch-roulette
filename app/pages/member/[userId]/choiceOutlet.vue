<template>
  <div>
    <h2 class="text-2xl text-center font-bold p-3">ゲーム画面</h2>
    <p class="text-2xl text-center font-bold p-3">設定</p>
    <div>
      <div>
        <p class="p-4 text-lg font-semibold">遊ぶ人数 2～4人</p>
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
            <div v-if="isPlace" class="absolute w-full bg-white rounded-lg border-2 border-gray-200 h-24 overflow-y-auto z-10">
              <div v-for="place in placeDropdown" class="px-2 py-1.5" @click="selectPlace(place.name)">{{ place.name }}</div>
            </div>
          </div>
        </div>
        <p v-if="errors.place" class="text-red-500 pl-8 font-semibold">エリアを選択してください</p>
      </div>
    </div>
    <div class="flex items-center justify-center">
        <button class="absolute bottom-0 w-[95%] rounded-lg bg-black text-white p-2 my-4" @click="goSelectOutlet">スタート</button>
      </div>
  </div>
</template>

<script setup lang="ts">
import { getAuth } from "firebase/auth";
// @ts-ignore
import { getAllOutlet } from "~/composables/outletManagement";
import type { Place } from "@/@types/outlet"

definePageMeta({
  middleware: "auth",
});

const route = useRoute();
const userId = route.params.userId as string;

const router = useRouter(); 
const outletData = ref<any[]>([]);

const playerNumber = ref<number>(2);
const incrementNum = () => {
  if (playerNumber.value >= 4) {
    return;
  }
  playerNumber.value++;
}

const decrementNum = () => {
  if (playerNumber.value <= 2) return;
  playerNumber.value--;
}

// ドロップダウン
const place = ref<string>("選択する");

const isPlace = ref<boolean>(false);
const placeDropdown = ref<Place[]>([]);
const togglePlace = () => {
  isPlace.value = !isPlace.value;
}
const selectPlace = (item: string) => {
  place.value = item;
  togglePlace();
}

const errors = ref({
  place: false,
});

const validateReset = () => {
  errors.value.place = false;
}

const validateData = () => {
  if (place.value === "選択する") {
    errors.value.place = true;
  } else {
    errors.value.place = false;
  }

  if (errors.value.place) {
    return true;
  } else {
    return false;
  }
};

const goSelectOutlet = () => {
  if(validateData()) {
    return;
  }
  validateReset();

  router.push({ path: `/member/${userId}/gameOutlet`, query: { num: playerNumber.value, place: place.value }});
}

onMounted(async () => {
  getAuth();
  outletData.value = await getAllOutlet();
  placeDropdown.value = await getAllPlaces(userId);
  validateReset();
});
</script>
