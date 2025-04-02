<script setup lang="ts">
import type { Outlet, Place, ToComPonentForm } from "@/@types/outlet";
import { getAuth, onAuthStateChanged, } from "firebase/auth";

definePageMeta({
  middleware: "auth",
  layout: "header",
});

const auth = getAuth();
const route = useRoute();
const userId = ref<string>("");
userId.value = route.params.userId as string;

const outletData = ref<any[]>(await getAllOutlet(userId.value));
const toModalData = ref<ToComPonentForm>();
const restAddOutlet = ref<number>((40 - outletData.value.length) || 0);

const isModalOpen = ref<boolean>(false);
const isEditingMode = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const isPlaceModal = ref<boolean>(false);
const togglePlaceModal = (isPlace: boolean) => {
  isPlace ? isPlaceModal.value = true : isPlaceModal.value = false;
};

// ドロップダウン
const name = ref<string>("");
const detail = ref<string>("");
const place = ref<string>("選択する");
const term = ref<string>("");

const isTerm = ref<boolean>(false);
const placeDropdown = ref<Place[]>([]);
const termDropdown = ref<string[]>();

// 条件付き表示
const toggleTerm = () => {
  isTerm.value = !isTerm.value;
}
const selectTerm = (item: string) => {
  term.value = item;
  toggleTerm();
}

const filteredOutletData = computed(() => {
  if (term.value === "全て" || term.value === "") {
    return outletData.value;
  }
  return outletData.value.filter(item => item.place === term.value);
});

// 画像関連
const imageUrl = ref<string>("");
const _imagePreview = ref<string | undefined>(undefined);

// モーダル関連
// 新規・更新: モーダル画面表示
const openNew = () => {
  isModalOpen.value = true;
  isEditingMode.value = false;

  toModalData.value = {
    selectedOutlet: null,
    outletId: crypto.randomUUID(),
    name: "",
    detail: "",
    place: "選択する",
    imageUrl: "",
    _imagePreview: "",
  };
};

const openEdit = async (item: Outlet) => {
  isModalOpen.value = true;
  isEditingMode.value = true;

  toModalData.value = {
    selectedOutlet: item,
    outletId: item.id,
    name: item.name,
    detail: item.detail,
    place: item.place,
    imageUrl: item.imageUrl,
    _imagePreview: item.imageUrl,
  };
  placeDropdown.value = await getAllPlaces(userId.value);
};

const closeModal = async () => {
  isModalOpen.value = false;
  outletData.value = await getAllOutlet(userId.value);
  restAddOutlet.value = 40 - outletData.value.length;
  clearInput();
  placeDropdown.value = await getAllPlaces(userId.value);

};

const clearInput = () => {
  name.value = "";
  place.value = "";
  detail.value = "";
  imageUrl.value = "";
  _imagePreview.value = "";
};

// 削除処理
const removeOutlet = async (item: Outlet) => {
  if (!confirm(`${item.name} を削除してよろしいですか？`)) return;
  try {
    isLoading.value = true;
    await deleteOutlet(item.id, userId.value);
    outletData.value = await getAllOutlet(userId.value);
    alert("削除しました！");
  } catch (error) {
    console.error("削除に失敗しました", error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  onAuthStateChanged(auth, async (user) => {
    if (user) {
      const data = await getAllOutlet(user.uid);
      outletData.value = data;
    } else {
      // ユーザーが未認証の場合の処理
      outletData.value = [];
    }
  });
  placeDropdown.value = await getAllPlaces(userId.value);
  termDropdown.value = ["全て", ...placeDropdown.value.map(place => place.name)];
  term.value = termDropdown.value[0]!;
});
</script>

<template>
  <div>
    <div class="relative">
      <p class="text-2xl text-center font-bold p-2.5">登録画面</p>
      <!-- 残り追加可能店舗数 -->
      <div class="absolute top-0 left-0 flex pt-10 pl-4 font-semibold">
        <p>残り</p>
        <p>{{ restAddOutlet }}</p>
      </div>
      <button
        class="absolute top-0 right-0 w-20 flex justify-center items-center bg-gray-500 rounded-full text-sm p-2 space-x-2 px-2 m-2"
        @click="togglePlaceModal(true)">
        <svg class="size-5 fill-current" viewBox="0 0 16 16">
          <path
            d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v3h-3a.5.5 0 0 0 0 1h3v3a.5.5 0 0 0 1 0v-3h3a.5.5 0 0 0 0-1h-3z" />
        </svg>
        <p>場所</p>
      </button>
    </div>
    <!-- 表示画面 -->
    <div class="p-3">
      <div>
        <!-- 表示タイトル -->
        <div class="sticky flex items-center w-full bg-gray-200 rounded-lg py-2">
          <p class="w-[30%] text-center font-semibold">登録名</p>
          <p class="w-[30%] text-center font-semibold">画像</p>
          <p class="w-[20%] text-center font-semibold">場所</p>
          <!-- 条件ドロップダウン -->
          <div class="relative bg-gray-400 rounded-lg font-semibold grid items-center mx-auto">
            <div class="flex items-center" @click="toggleTerm">
              <p class="p-1 px-2 text-sm">{{ term }}</p>
              <div class="px-1">
                <div v-if="isTerm">
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
            <div v-if="isTerm" class="absolute top-full w-full bg-gray-400 rounded-lg font-semibold">
              <div v-for="termItem in termDropdown">
                <p class="p-1 px-2 hover:bg-gray-500 text-sm" @click="selectTerm(termItem)">{{ termItem }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 表示アイテム一覧 -->
        <div class="w-full overflow-y-auto mb-[70px]">
          <div v-for="(item, index) in filteredOutletData" :key="index"
            class="flex items-center justify-center max-w-full rounded-lg border-2 border-gray-200 my-2">
            <p class="w-[30%] text-center">{{ item.name }}</p>
            <div class="w-[30%] grid items-center justify-center">
              <img v-if="item.imageUrl" :src="item.imageUrl" alt="プレビュー画像" class="size-20 object-cover" />
              <img v-else-if="imageUrl" :src="imageUrl" alt="登録済画像" class="size-20 object-cover" />
              <div v-else
                class="grid size-20 items-center justify-center text-center rounded-lg bg-gray-400 text-white">
                No image
              </div>
            </div>
            <p class="w-[20%] text-center">{{ item.place }}</p>
            <div class="w-[20%] flex items-ceter justify-center">
              <div class="p-2">
                <div class="bg-black rounded-lg text-xs text-white text-center p-1 px-3 my-2" @click="openEdit(item)">
                  編集
                </div>
                <div class="bg-red-500 rounded-lg text-xs text-white text-center p-1 px-3 my-2"
                  @click="removeOutlet(item)">
                  削除
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="fixed left-0 right-0 bottom-0 flex items-center justify-center">
          <button class="w-[95%] rounded-lg bg-black text-white p-4 my-4" :class="{'pointer-events-none bg-gray-600' : restAddOutlet <= 0}" @click="openNew">追加する</button>
        </div>
      </div>
    </div>
    <!-- モーダル画面 registModal.vue -->
    <ManagementRegistModal :user-id="userId" :is-modal-open="isModalOpen" :is-editing-mode="isEditingMode"
      :to-modal-data="toModalData" @close="closeModal" />
    <!-- ローディング -->
    <SharedLoading :is-loading="isLoading" />
    <SharedPlace :is-place-modal="isPlaceModal" :user-id="userId" @close="togglePlaceModal(false)" />
  </div>
</template>
