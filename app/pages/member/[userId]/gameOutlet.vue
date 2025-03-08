<template>
  <div>
    <div v-if="isSelected">
      <div class="p-4 text-2xl font-semibold">
        <p>お店が全てそろいました</p>
        <p>ルーレットを開始してください</p>
        <p>お店は以下です</p>
      </div>
      <div v-for="item in selectedOutlets" :key="item.id">
        <div class="flex items-center m-2">
          <div class="w-full flex items-center border-2 border-gray-300 rounded-lg">
            <div class="w-[30%]">
              <img v-if="item.imageUrl" :src="item.imageUrl" alt="プレビュー画像" class="size-16 object-cover" />
              <img v-else-if="item.imageUrl" :src="item.imageUrl" alt="登録済画像" class="size-16 object-cover" />
              <div v-else
                class="flex size-16 items-center justify-center text-center rounded-lg bg-gray-400 text-white">
                No image
              </div>
            </div>
            <p class="text-center">{{ item.name }}</p>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-center">
        <button class="absolute bottom-0 w-[95%] rounded-lg bg-black text-white p-4 my-4 font-semibold"
          @click="startRoulette">ルーレット画面へ</button>
      </div>
    </div>
    <!-- モーダル画面 -->
    <div v-if="isModalOpen" class="relative">
      <div class="fixed inset-0 bg-gray-500/75"></div>
      <div class="fixed inset-0 flex items-center justify-center">
        <div class="min-w-96 max-h-screen overflow-y-auto rounded-lg border-2 border-gray-400 bg-white">
          <!-- お店選択画面 -->
          <div v-if="isSelecting">
            <p class="font-bold text-center p-3">お店を選んでください</p>
            <div v-for="item in outletsData" :key="item.id">
              <div class="flex items-center mx-2 my-2">
                <input v-model="selectedId" type="radio" name="outlet" :value="item.id"
                  class="size-6 accent-pink-500 mx-3" />
                <div class="w-full flex items-center border-2 border-gray-300 rounded-lg"
                  :class="{ 'border-2 border-pink-500 rounded-lg': selectedId === item.id }">
                  <div class="w-[30%]">
                    <img v-if="item.imageUrl" :src="item.imageUrl" alt="プレビュー画像" class="size-16 object-cover" />
                    <img v-else-if="item.imageUrl" :src="item.imageUrl" alt="登録済画像" class="size-16 object-cover" />
                    <div v-else
                      class="flex size-16 items-center justify-center text-center rounded-lg bg-gray-400 text-white">
                      No image
                    </div>
                  </div>
                  <p class="text-center">{{ item.name }}</p>
                </div>
              </div>
            </div>

            <!-- ボタン -->
            <div class="flex items-center justify-center">
              <button class="bg-black text-white font-semibold px-4 py-1 rounded-2xl m-2"
                @click="pushOutlet(selectedId)">選択する</button>
            </div>
          </div>

          <!-- 次の人に渡す画面 or 完了画面でルーレット回す画面 -->
          <div v-else>
            <p class="font-bold text-center p-3">お店選択が完了しました！！</p>
            <p class="font-semibold p-3">次の人に渡してください</p>
            <div class="flex items-center justify-center">
              <div class="size-16 text-center text-5xl font-bold">{{ selectedOutlets.length + 1 }}</div>
              <p class="text-end">人目</p>
            </div>
            <!-- ボタン -->
            <div class="flex items-center justify-center">
              <button class="bg-black text-white font-semibold px-4 py-1 rounded-2xl m-2"
                @click="checkAddCount">次の人へ</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- ローディング -->
    <SharedLoading :is-loading="isLoading"/>
  </div>
</template>

<script setup lang="ts">
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import type { Outlet } from "@/@types/outlet";
// @ts-ignore
import { getOutletsByPlace } from "~/composables/outletManagement";
// @ts-ignore
import { addSelectedOutlets } from "~/composables/outletRoulette";

definePageMeta({
  middleware: "auth",
});

const auth = getAuth();
const route = useRoute();
const userId = route.params.userId;
const router = useRouter();

const selectedPlace = route.query.place;
const selectedNumber = Number(route.query.num) || 0;
const selectedId = ref<string>("");


const outletsData = ref<Outlet[]>([]);
const selectedOutlets = ref<Outlet[]>([]);

const isModalOpen = ref<boolean>(false);
const isSelecting = ref<boolean>(false);
const isSelected = ref<boolean>(false);
const isLoading = ref<boolean>(false);

const playerNumber = ref<number>(0);

const init = () => {
  isModalOpen.value = true;
  isSelecting.value = true;
}
const checkAddCount = () => {
  if (selectedOutlets.value.length >= selectedNumber) {
    isModalOpen.value = false;
    isSelected.value = true;
  } else if (isSelecting.value) {
    // まだ終わっていない場合は次の人画面へ
    isSelecting.value = false;
    selectedId.value = "";
  } else {
    // 次の人画面から選択画面へ
    isSelecting.value = true;
  }
};

const pushOutlet = (outletId: string) => {
  const outlet = outletsData.value.find((item) => item.id === outletId) as Outlet;
  if (!outlet) {
    console.error("No outlet item");
    return;
  }
  selectedOutlets.value.push(outlet);
  checkAddCount();
};

// ルーレット開始ページへ
const startRoulette = async () => {
  try {
    isLoading.value = true;

    const rouletteId = await addSelectedOutlets(selectedOutlets.value, userId);
    return router.push({ path: `/member/${userId}/rouletteOutlet`, query: {roulette_id: rouletteId} });
  } catch (error) {
    console.error(error, "ルーレットを始められません")
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const data = await getAllOutlet(user.uid);
      outletsData.value = data;
    } else {
      // ユーザーが未認証の場合の処理
      outletsData.value = [];
    }
  });
  init();
});
</script>
