<template>
  <div>
    <div class="relative">
      <p class="text-2xl text-center font-bold p-2.5">登録画面</p>
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
        <div class="w-full overflow-y-auto mb-10">
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
          <button class="w-[95%] rounded-lg bg-black text-white p-2 my-4" @click="openNew">追加する</button>
        </div>
      </div>
    </div>

    <!-- モーダル画面 -->
    <div v-if="isModalOpen" class="relative">
      <div class="fixed inset-0 bg-gray-500/75"></div>
      <div class="fixed inset-0 flex items-center justify-center">
        <!-- お店CRUD -->
        <div class="relative min-w-80 h-full-screen overflow-y-auto rounded-lg border-2 border-gray-400 bg-white">
          <div class="font-bold text-xl text-center p-2">
            {{ isEditingMode ? "編集" : "新規追加" }}
          </div>
          <div v-if="!isEditingMode" class="absolute top-0 right-0">
            <!-- Googleモード -->
            <div class="flex items-center justify-between p-2">
              <label class="inline-flex items-center cursor-pointer">
                <div class="">
                  <svg class="fill-current size-4 m-2" viewBox="0 0 16 16">
                    <path
                      d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z" />
                  </svg>
                </div>
                <input type="checkbox" v-model="isGoogle" value="true" class="sr-only peer">
                <div
                  class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600 dark:peer-checked:bg-blue-600">
                </div>
              </label>
            </div>
          </div>
          <div v-if="isGoogle" class="flex items-center justify-center">
            <div class="w-full ">
              <div class="p-2">
                <p class="font-bold mr-1">Google検索</p>
                <input ref="autocompleteInput" type="text" placeholder="お店の名前を検索"
                  class="w-full rounded-lg border-2 border-gray-200 px-2 py-1.5" />
              </div>
              <img v-if="imageUrl" :src="imageUrl" alt="登録済画像" class="max-h-36 min-w-full object-cover" />
            </div>
          </div>
          <div v-else>
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
              <div class="absolute top-0 right-0 bg-red-500 rounded-full m-2 p-2"
                @click.stop="deleteImageFile(outletId)">
                <svg width="16" height="16" class="fill-white" viewBox="0 0 16 16">
                  <path
                    d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                  <path
                    d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                </svg>
              </div>
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
                <div v-for="place in placeDropdown" class="px-2 py-1.5" @click="selectPlace(place.name)">{{ place.name
                }}</div>
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
    <SharedLoading :is-loading="isLoading" />
    <SharedPlace :is-place-modal="isPlaceModal" :user-id="userId" @close="togglePlaceModal(false)" />
  </div>
</template>

<script setup lang="ts">
import { Timestamp } from "firebase/firestore";
import type { Outlet, Place } from "@/@types/outlet";
import { getAuth, onAuthStateChanged, } from "firebase/auth";
// @ts-ignore
import { addNewOutlet, deleteOutlet, deleteOutletImageUrl, getAllOutlet, getOutlet, updateOutlet } from "~/composables/outletManagement";

definePageMeta({
  middleware: "auth",
});

const auth = getAuth();
const route = useRoute();
const userId = ref<string>("");
userId.value = route.params.userId as string;

const outletData = ref<any[]>(await getAllOutlet(userId.value));
const outletId = ref<string>(crypto.randomUUID());

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

const isPlace = ref<boolean>(false);
const isTerm = ref<boolean>(false);
const placeDropdown = ref<Place[]>([]);
const termDropdown = ref<string[]>();

const togglePlace = () => {
  isPlace.value = !isPlace.value;
}
const selectPlace = (item: string) => {
  place.value = item;
  togglePlace();
}

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

// Google API関連
const isGoogle = ref<boolean>(false);
const autocompleteInput = ref<HTMLInputElement | null>(null);
const selectedPlaceId = ref<string>("");
const shortName = (fullName: string) => {
  const parts = fullName.split(" ");
  if (parts.length > 2) {
    return parts.slice(2).join(" ");
  } else {
    return fullName;
  }
};

const getPlaceDetails = (placeId: string) => {
  const service = new (window as any).google.maps.places.PlacesService(document.createElement("div"));
  const request = {
    placeId: placeId,
    fields: ["name", "rating", "photos", "formatted_address"],
  };
  service.getDetails(request, (placeResult: any, status: any) => {
    if (status === (window as any).google.maps.places.PlacesServiceStatus.OK && placeResult) {
      name.value = shortName(placeResult.name);
      detail.value = placeResult.rating ? `評価: ${placeResult.rating} / 5` : "詳細情報はありません。";
      if (placeResult.photos && placeResult.photos.length > 0) {
        imageUrl.value = placeResult.photos[0].getUrl({ maxWidth: 400 });
      } else {
        imageUrl.value = "";
      }
    } else {
      console.error("Place Details の取得に失敗しました。status:", status);
    }
  });
};

watch(
  () => isGoogle.value,
  async (val) => {
    if (val) {
      await nextTick();
      if (!(window as any).google || !(window as any).google.maps) {
        console.error("Google Maps JS SDK が読み込まれていません。");
        return;
      }
      if (!autocompleteInput.value) {
        console.error("autocompleteInput が見つかりません。");
        return;
      }
      const autocomplete = new (window as any).google.maps.places.Autocomplete(
        autocompleteInput.value,
        {
          fields: ["place_id", "name", "formatted_address"],
        }
      );
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place?.place_id) {
          console.error("place_id がありません。");
          return;
        }
        // ここでユーザーが選択した placeId を保持
        selectedPlaceId.value = place.place_id;
        if (place.name) {
          autocompleteInput.value = place.name;
        }

        name.value = shortName(place.name) as string;
        getPlaceDetails(selectedPlaceId.value);
      });
    }
  }
);

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

    const data = await getOutlet(id, userId.value);
    const decodedUrl = decodeURIComponent(data.outlet.value.imageUrl);
    const regex = /\/o\/(.*?)\?/;
    const match = decodedUrl.match(regex);

    // @ts-ignore
    const resultStorage = await useNuxtApp().$deleteImage(match[1]);
    if (!resultStorage) {
      console.error("Storage削除に失敗しました");
      return;
    }

    await deleteOutletImageUrl(id, userId.value);
    outletData.value = await getAllOutlet(userId.value);

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
  isGoogle.value = false;
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
      const path = `users/${userId.value}/outletImages/${filename}`;
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
      await updateOutlet(outlet, userId.value);
      alert("更新に成功しました!");
    } else {
      await addNewOutlet(outlet, userId.value);
      alert("登録に成功しました!");
    }
    // 一覧更新
    outletData.value = await getAllOutlet(userId.value);
    closeModal();
  } catch (error) {
    console.error("お店情報を登録できませんでした", error);
  } finally {
    isLoading.value = false;
  };
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
