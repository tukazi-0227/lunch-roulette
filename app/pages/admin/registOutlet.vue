<template>
  <div>
    <p class="text-2xl text-center font-bold p-3">店舗管理画面</p>
    <div class="p-3">
      <div class="flex items-center justify-center w-full bg-gray-200 py-2">
        <p class="w-[30%]">登録名</p>
        <p class="w-[30%]">画像</p>
        <p class="w-[30%]">アクセスURL</p>
      </div>

      <button class="w-full rounded-lg bg-black text-white p-2" @click="openNew">追加する</button>
    </div>

    <!-- 追加モーダル画面 -->
    <div v-if="isModalOpen" class="relative">
      <div class="fixed inset-0 bg-gray-500/75"></div>
      <div class="fixed inset-0 flex items-center justify-center">
        <div class="min-w-64 max-h-screen overflow-y-auto rounded-lg border-2 border-gray-400 bg-white">
          <p class="font-bold text-xl text-center p-2">登録画面</p>
          <!-- 画像アップロード -->
          <div class="relative flex cursor-pointer items-center justify-center" title="画像を変更する"
              @click="triggerFileInput">
              <img v-if="_imagePreview" :src="_imagePreview" alt="プレビュー画像" class="max-h-36 min-w-full object-cover" />
              <img v-else-if="imageUrl" :src="imageUrl" alt="登録済画像" class="max-h-36 min-w-full object-cover" />
              <div v-else class="flex min-h-24 min-w-24 items-center justify-center rounded-lg bg-gray-400 text-white">
                No image
              </div>
              <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="onImageFileChange" />
            </div>
          <!-- 登録名 -->
          <div class="p-2">
            <div class="flex items-center">
              <p class="font-bold mr-1">登録名</p>
              <div class="rounded-lg bg-red-500 px-1.5 py-0.5 text-center text-xs font-semibold text-white">
                必須
              </div>
            </div>
            <input id="name" type="text" v-model="name" class="w-full rounded-lg border-2 border-gray-200 px-2 py-1.5"/>
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
                <div v-for="(place, index) in placeDropdown" class="px-2 py-1.5" @click="selectPlace(place)">{{ place }}</div>
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
                @click="registOutlet({
                  name: name,
                  place: place,
                  detail: detail,
                  imageUrl: imageUrl,
                  createdAt: Timestamp.now(),
                })">
                保存する
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// import { getApp } from "firebase/app"
// import { getFunctions, httpsCallable } from "firebase/functions";
import { Timestamp } from "firebase/firestore";
// @ts-ignore
import { addNewOutlet } from "~/composables/outletManagement";
import type { Outlet } from "@/@types/outlet";

// ドロップダウン
const isModalOpen = ref<boolean>(false);
const isEditingMode = ref<boolean>(false);
const name = ref<string>("");
const detail = ref<string>("");

const isPlace = ref<boolean>(false);
const place = ref<string>("選択する");
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

// 画像アップロード処理
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

// モーダル関連
// 新規・更新: モーダル画面表示
const openNew = () => {
  isModalOpen.value = true;
  isEditingMode.value = false;
  // clearInputs();
};

const openEdit = () => {
  isModalOpen.value = true;
  isEditingMode.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  // clearInputs();
};

const registOutlet = async (registData: Outlet) => {
  try {
    if (_imageFile.value) {
      const filename = encodeURIComponent(_imageFile.value.name);
      const path = `outletImage/${filename}`;

      // @ts-ignore
      const url = await useNuxtApp().$uploadImage(_imageFile.value, path);
      imageUrl.value = url;
      _imageFile.value = null;
    }
    await addNewOutlet(registData);
    alert("登録に成功しました!!")
  } catch (error) {
    console.error("お店情報を登録できませんでした", error);
  }
}
</script>
