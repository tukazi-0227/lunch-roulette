<script setup lang="ts">
import type { Outlet, Place, ToComPonentForm } from "@/@types/outlet";
import { getApp } from "firebase/app";
import { Timestamp } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

const props = defineProps({
  isModalOpen: {
    type: Boolean,
    default: false,
  },
  isEditingMode: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: String,
    default: "",
  },
  toModalData: {
    type: Object as PropType<ToComPonentForm>,
    default: () => ({}),
  },
});

const emit = defineEmits(["close"]);

// バリデーション
const errors = reactive({
  name: false,
  place: false,
});

const validateData = () => {
  errors.name = !name.value;
  errors.place = place.value === "選択する";

  return errors.name || errors.place;
};

// ドロップダウン
const name = ref<string>("");
const detail = ref<string>("");
const place = ref<string>("選択する");
const isLoading = ref<boolean>(false);
const isPlace = ref<boolean>(false);

const placeDropdown = ref<Place[]>([]);
const togglePlace = async () => {
  isPlace.value = !isPlace.value;
  placeDropdown.value = await getAllPlaces(props.userId);
};
const selectPlace = (item: string) => {
  place.value = item;
  togglePlace();
};

const outletId = ref<string>(crypto.randomUUID());

// 画像関連
const imageUrl = ref<string>("");
const _imageFile = ref<File | null>(null);
const _imagePreview = ref<string | undefined>(undefined);

// Google API関連
const isGoogle = ref<boolean>(false);
const isSearch = ref<boolean>(false);
const autocompleteInput = ref<HTMLInputElement | null>(null);
const selectedPlaceId = ref<string>("");
const shortName = (fullName: string) => {
  const parts = fullName.split(" ");
  if (parts.length > 2) {
    return parts.slice(2).join(" ");
  } else {
    return fullName;
  };
};

// Google APIから情報読み取り
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
    isSearch.value = true;
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
          isSearch.value = false;
        }

        name.value = shortName(place.name) as string;
        getPlaceDetails(selectedPlaceId.value);
      });
    }
  },
);

watch(
  () => props.toModalData,
  (newVal) => {
    if (!newVal) return
    outletId.value = newVal.outletId || ""
    name.value = newVal.name || ""
    detail.value = newVal.detail || ""
    place.value = newVal.place || "選択する"
    imageUrl.value = newVal.imageUrl || ""
    _imagePreview.value = newVal._imagePreview || ""
  },
  { immediate: true }
);

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

    const data = await getOutlet(id, props.userId);
    const decodedUrl = decodeURIComponent(data.outlet.value!.imageUrl);
    const regex = /\/o\/(.*?)\?/;
    const match = decodedUrl.match(regex);

    // @ts-ignore 型エラーが出るため
    const resultStorage = await useNuxtApp().$deleteImage(match![1]);
    if (!resultStorage) {
      console.error("Storage削除に失敗しました");
      return;
    }

    await deleteOutletImageUrl(id, props.userId);
    closeModal();
  } catch (error) {
    console.error("Failed to delete file, try again!!");
  } finally {
    isLoading.value = false;
  }
};

// 新規追加&更新
const registOutlet = async () => {
  try {
    isLoading.value = true;

    // バリデーション
    if (validateData()) return;

    let finalImageUrl = imageUrl.value;
    if (_imageFile.value) {
      // 以前の画像は削除 TODO: 制御できるようにする
      // deleteImageFile(outletId.value);

      const filename = encodeURIComponent(_imageFile.value.name);
      const path = `users/${props.userId}/outletImages/${filename}`;
      // @ts-ignore 型エラーが出るため
      const url = await useNuxtApp().$uploadImage(_imageFile.value, path);
      finalImageUrl = url;
    };

    const outlet: Outlet = {
      id: outletId.value,
      name: name.value,
      detail: detail.value,
      place: place.value,
      imageUrl: finalImageUrl,
      createdAt: Timestamp.now(),
    };

    if (props.isEditingMode) {
      await updateOutlet(outlet, props.userId);
      alert("更新に成功しました!");
    } else {
      // 新規追加時サーバーサイドでバリデーション
      const functions = getFunctions(getApp());
      const apply = httpsCallable(
        functions,
        "api_validate_outletSum-check_outletSum",
      );

      const response = await apply(props.userId);

      if (response.data) {
        alert("登録上限です.")
        return;
      };

      await addNewOutlet(outlet, props.userId);
      alert("登録に成功しました!");
    }
    closeModal();
  } catch (error) {
    console.error("お店情報を登録できませんでした", error);
  } finally {
    isLoading.value = false;
  };
};

const closeModal = () => {
  isGoogle.value = false;
  emit("close");
};

onMounted(async () => {
  placeDropdown.value = await getAllPlaces(props.userId);
});
</script>

<template>
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
          <div class="flex items-center justify-between pt-2 pr-2">
            <label class="inline-flex items-center cursor-pointer">
              <div class="px-2">
                <svg class="fill-current size-4" viewBox="0 0 16 16">
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
            <div v-if="isSearch" class="p-2">
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
            <div class="absolute top-0 right-0 bg-red-500 rounded-full m-2 p-2" @click.stop="deleteImageFile(outletId)">
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
          <input id="name" type="text" v-model="name" class="w-full rounded-lg border-2 border-gray-200 px-2 py-1.5" />
          <p v-if="errors.name" class="text-xs font-semibold text-red-500">名前を入力してください</p>
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
            <p v-if="errors.place && !isPlace" class="text-xs font-semibold text-red-500">場所を入力してください</p>
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
    <SharedLoading :is-loading="isLoading" class="z-50"/>
  </div>
</template>
