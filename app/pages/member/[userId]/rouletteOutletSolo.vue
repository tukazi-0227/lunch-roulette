<script setup lang="ts">
import type { Outlet, Place } from "@/@types/outlet";
definePageMeta({
  middleware: ["auth"],
  layout: "header",
});

const router = useRouter();
const route = useRoute();

const userId = route.params.userId as string;
const outletData = ref<any[]>(await getAllOutlet(userId));
const rouletteOutlets = ref<Outlet[]>([]);
const resultOutlet = ref<Outlet>();

const isLoading = ref<boolean>(false);
const isLotterying = ref<boolean>(false);
const isLouletted = ref<boolean>(false);
const isModal = ref<boolean>(false);

// ドロップダウン
const isPlace = ref<boolean>(false);
const place = ref<string>("選択する");
const placeDropdown = ref<Place[]>([]);
const termDropdown = ref<string[]>();
const filteredOutletData = computed(() => {
  if (place.value === "全て" || place.value === "選択する") {
    return outletData.value;
  }
  return outletData.value.filter(item => item.place === place.value);
});

const toggleTerm = () => {
  isPlace.value = !isPlace.value;
}
const selectTerm = (item: string) => {
  place.value = item;
  toggleTerm();
  console.log(filteredOutletData.value)
}

const closeModal = () => {
  isModal.value = false;
};

// ルーレットを実行
const roulettingOutlet = () => {
  isLotterying.value = true;
  rouletteOutlets.value = filteredOutletData.value

  // 五秒間のアニメーション
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
  placeDropdown.value = await getAllPlaces(userId);
  termDropdown.value = ["全て", ...placeDropdown.value.map(place => place.name)];
});
</script>

<template>
  <div>
    <p class="font-bold text-center text-3xl p-3">ルーレット画面</p>
    <!-- 場所ドロップダウン -->
    <div class="flex items-center justify-center">
      <div class="relative w-1/2 bg-gray-400 rounded-lg font-semibold grid items-center p-2">
        <div class="flex items-center justify-between" @click="toggleTerm">
          <p class="p-1 px-2 text-center">{{ place }}</p>
          <div class="px-1">
            <div v-if="isPlace">
              <svg class="size-4 fill-current" viewBox="0 0 16 16">
                <path fill-rule="evenodd"
                  d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z" />
              </svg>
            </div>
            <div v-else>
              <svg class="size-4 fill-current" viewBox="0 0 16 16">
                <path fill-rule="evenodd"
                  d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708" />
              </svg>
            </div>
          </div>
        </div>
        <div v-if="isPlace" class="absolute top-full w-full bg-gray-400 rounded-lg font-semibold p-2">
          <div v-for="termItem in termDropdown">
            <p class="p-1 px-2 hover:bg-gray-500" @click="selectTerm(termItem)">{{ termItem }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 指定した場所のお店一覧 -->
    <div class="flex overflow-x-auto flex-nowrapflex items-center justify-center">
      <div v-for="outlet in filteredOutletData" class="flex-shrink-0">
        <div class="p-2">
          <img v-if="outlet.imageUrl" :src="outlet.imageUrl" alt="プレビュー画像" class="size-24 object-cover rounded-lg" />
          <img v-else-if="outlet.imageUrl" :src="outlet.imageUrl" alt="登録済画像" class="size-24 object-cover rounded-lg" />
          <div v-else class="flex size-24 items-center justify-center text-center rounded-lg bg-gray-400 text-white">
            No image
          </div>
          <p class="text-center p-2 font-semibold">{{ outlet.name }}</p>
        </div>
      </div>
      <!-- お店がない場合 -->
      <div v-if="filteredOutletData.length === 0">
        <div class="p-2">
          <p class="text-center p-2 font-semibold">お店がありません。他の場所を選択して下さい</p>
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
    <div v-else class="flex items-center justify-center my-32" >
      <div 
        class="bg-black text-white rounded-2xl text-3xl p-4 px-4 text-center" 
        :class="{'pointer-events-none invisible': filteredOutletData.length === 0}"
        @click="roulettingOutlet"
      >ルーレットスタート!!
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
