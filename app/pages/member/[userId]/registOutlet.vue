<template>
  <div>
    <p class="text-2xl text-center font-bold p-2">お店登録画面</p>
    <div class="p-3">
      <div>
        <div class="sticky flex items-center justify-center w-full bg-gray-200 rounded-lg py-2">
          <p class="w-[20%] text-center font-semibold">登録名</p>
          <p class="w-[20%] text-center font-semibold">画像</p>
          <p class="w-[30%] text-center font-semibold">アクセスURL</p>
          <p class="w-[30%] text-center font-semibold"></p>
        </div>

        <div class="w-fulloverflow-y-auto">
          <div v-for="(item, index) in outletData" :key="index"
            class="flex items-center justify-center max-w-full rounded-lg border-2 border-gray-200 my-2">
            <p class="w-[20%] text-center">{{ item.name }}</p>
            <div class="w-[20%]">
              <img v-if="item.imageUrl" :src="item.imageUrl" alt="プレビュー画像" class="size-16 object-cover" />
              <img v-else-if="imageUrl" :src="imageUrl" alt="登録済画像" class="size-16 object-cover" />
              <div v-else
                class="flex size-16 items-center justify-center text-center rounded-lg bg-gray-400 text-white">
                No image
              </div>
            </div>
            <p class="w-[30%] text-center">{{ item.place }}</p>
            <div class="w-[30%] flex items-ceter justify-center">
              <div class="p-2">
                <div class="bg-black rounded-lg text-xs text-white text-center p-1 px4 my-2" @click="openEdit(item)">
                  編集する
                </div>
                <div class="bg-red-500 rounded-lg text-xs text-white text-center p-1 px-4 my-2"
                  @click="removeOutlet(item)">
                  削除する
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="fixed left-0 right-0 bottom-0 flex items-center justify-center">
          <button class="w-[95%] rounded-lg bg-black text-white p-2 my-4" @click="openNew">追加する</button>
        </div>
      </div>
    </div>

    <!-- モーダル画面 -->
    <div v-if="isModalOpen" class="relative">
      <div class="fixed inset-0 bg-gray-500/75"></div>
      <div class="fixed inset-0 flex items-center justify-center">
        <div class="min-w-80 h-full-screen overflow-y-auto rounded-lg border-2 border-gray-400 bg-white">
          <p class="font-bold text-xl text-center p-2">
            {{ isEditingMode ? "編集" : "新規追加" }}
          </p>
          <!-- 画像アップロード -->
          <div class="relative flex cursor-pointer items-center justify-center" title="画像を変更する"
            @click="triggerFileInput">
            <img v-if="_imagePreview" :src="_imagePreview" alt="プレビュー画像" class="max-h-36 min-w-full object-cover" />
            <img v-else-if="imageUrl" :src="imageUrl" alt="登録済画像" class="max-h-36 min-w-full object-cover" />
            <div v-else class="flex min-h-24 min-w-24 items-center justify-center rounded-lg bg-gray-400 text-white">
              No image
            </div>
            <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="onImageFileChange" />
            <!-- 画像削除ボタン -->
            <div class="absolute top-0 right-0 bg-red-500 rounded-full m-2 p-2" @click.stop="deleteImageFile(outletId)">
              <svg width="16" height="16" class="fill-white" viewBox="0 0 16 16">
                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
              </svg>
            </div>
          </div>
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
          <!-- 場所 -->
          <div class="p-2">
            <div class="flex items-center">
              <p class="font-bold mr-1">場所</p>
              <div class="rounded-lg bg-red-500 px-1.5 py-0.5 text-center text-xs font-semibold text-white">
                必須
              </div>
            </div>
            <div class="relative w-full">
              <div class="rounded-lg border-2 border-gray-200 px-2 py-1.5" @click="togglePlace">{{ place }}</div>
              <div v-if="isPlace" class="absolute w-full bg-white rounded-lg border-2 border-gray-200">
                <div v-for="place in placeDropdown" class="px-2 py-1.5" @click="selectPlace(place)">{{ place }}</div>
              </div>
            </div>
          </div>
          <!-- 詳細 -->
          <div class="p-2">
            <p class="font-bold">詳細</p>
            <textarea id="description" type="text" placeholder="詳細" v-model="detail"
              class="w-full min-h-20 rounded-lg border-2 border-gray-200 px-2 py-1.5"></textarea>
          </div>
          <!-- ボタン -->
          <div class="bg-gray-100">
            <div class="flex items-center justify-between p-2">
              <div class="cursor-pointer p-2 text-center font-semibold" @click="closeModal">
                キャンセル
              </div>
              <div class="cursor-pointer rounded-full bg-black p-2 px-4 text-center font-semibold text-white"
                @click="registOutlet()">
                保存する
              </div>
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
import { Timestamp } from "firebase/firestore";
// @ts-ignore
import { addNewOutlet, getAllOutlet, getOutlet, updateOutlet, deleteOutlet, deleteOutletImageUrl } from "~/composables/outletManagement";
import type { Outlet } from "@/@types/outlet";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";

definePageMeta({
  middleware: "auth-client",
});

const auth = getAuth();
const route = useRoute();
const userId = route.params.userId;

const outletData = ref<any[]>( await getAllOutlet(userId));
const outletId = ref<string>(crypto.randomUUID());

const isModalOpen = ref<boolean>(false);
const isEditingMode = ref<boolean>(false);
const isLoading = ref<boolean>(false);

// ドロップダウン
const name = ref<string>("");
const detail = ref<string>("");
const place = ref<string>("選択する");

const isPlace = ref<boolean>(false);
const placeDropdown = ref<string[]>([
  "神田",
  "上尾",
]);
const togglePlace = () => {
  isPlace.value = !isPlace.value;
}
const selectPlace = (item: string) => {
  place.value = item;
  togglePlace();
}

// 画像関連
const imageUrl = ref<string>("");
const _imageFile = ref<File | null>(null);
const _imagePreview = ref<string | undefined>(undefined);

const onImageFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (!input.files || !input.files[0]) return;

  const file = input.files[0];
  _imageFile.value = file;
  const reader = new FileReader();
  reader.onload = () => {
    _imagePreview.value = reader.result as string;
  };
  reader.readAsDataURL(file);
};

const triggerFileInput = (event: MouseEvent) => {
  const div = event.currentTarget as HTMLDivElement;
  const input = div.querySelector(
    "input[type='file']",
  ) as HTMLInputElement | null;
  input?.click();
};

// 画像削除処理
const deleteImageFile = async (id: string) => {
  try {
    isLoading.value = true;

    if (!confirm("画像を削除してよろしいですか?")) return;
    
    const data = await getOutlet(id, userId);
    const decodedUrl = decodeURIComponent(data.outlet.value.imageUrl);
    const regex = /\/o\/(.*?)\?/;
    const match = decodedUrl.match(regex);

    // @ts-ignore
    const resultStorage = await useNuxtApp().$deleteImage(match[1]);
    if (!resultStorage) {
      console.error("Storage削除に失敗しました");
      return;
    }

    await deleteOutletImageUrl(id, userId);
    outletData.value = await getAllOutlet(userId);
    
    alert("画像を削除しました");
    closeModal();
  } catch (error) {
    console.error("Failed to delete file, try again!!");
  } finally {
    isLoading.value = false;
  }
};

const selectedOutlet = ref<Outlet | null>(null);

// モーダル関連
// 新規・更新: モーダル画面表示
const openNew = () => {
  isModalOpen.value = true;
  isEditingMode.value = false;

  outletId.value = crypto.randomUUID();
  // フォームクリア
  name.value = "";
  detail.value = "";
  place.value = "選択する";
  imageUrl.value = "";
  _imagePreview.value = undefined;
  selectedOutlet.value = null;
};

const openEdit = (item: Outlet) => {
  isModalOpen.value = true;
  isEditingMode.value = true;
  selectedOutlet.value = item;
  outletId.value = item.id;
  name.value = item.name;
  detail.value = item.detail;
  place.value = item.place;
  imageUrl.value = item.imageUrl;
  _imagePreview.value = item.imageUrl;
};

const closeModal = () => {
  isModalOpen.value = false;
  clearInput();
};

const clearInput = () => {
  name.value = "";
  place.value = "";
  detail.value = "";
  imageUrl.value = "";
  _imagePreview.value = "";
}

// 新規追加
const registOutlet = async () => {
  try {
    isLoading.value = true;

    let finalImageUrl = imageUrl.value;
    if (_imageFile.value) {
      const filename = encodeURIComponent(_imageFile.value.name);
      const path = `outletImage/${userId}/${filename}`;
      // @ts-ignore
      const url = await useNuxtApp().$uploadImage(_imageFile.value, path);
      finalImageUrl = url;
    }

    const outlet: Outlet = {
      id: outletId.value,
      name: name.value,
      detail: detail.value,
      place: place.value,
      imageUrl: finalImageUrl,
      createdAt: Timestamp.now(),
    };

    if (isEditingMode.value) {
      await updateOutlet(outlet, userId);
      alert("更新に成功しました!");
    } else {
      await addNewOutlet(outlet, userId);
      alert("登録に成功しました!");
    }
    // 一覧更新
    outletData.value = await getAllOutlet(userId);
    closeModal();
  } catch (error) {
    console.error("お店情報を登録できませんでした", error);
  } finally {
    isLoading.value = false;
  }
}

// 削除処理
const removeOutlet = async (item: Outlet) => {
  if (!confirm(`${item.name} を削除してよろしいですか？`)) return;
  try {
    isLoading.value = true;
    await deleteOutlet(item.id, userId);
    outletData.value = await getAllOutlet(userId);
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
});
</script>
