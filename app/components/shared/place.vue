<template>
  <div>
    <!-- モーダル画面 -->
    <div v-if="isPlaceModal" class="relative">
      <div class="fixed inset-0 bg-gray-500/75"></div>
      <div class="fixed inset-0 flex items-center justify-center">
        <!-- 場所CRUD -->
        <div class="relative w-80 h-80 h-full-screen overflow-y-auto rounded-lg border-2 border-gray-400 bg-white">
          <p class="text-center text-xl font-semibold p-2">場所登録</p>
          <button class="absolute top-0 right-0 p-3" @click="closePlaceModal">
            <svg class="fill-current size-5" viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path
                d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
            </svg>
          </button>
          <div class="flex items-center space-x-2 m-2">
            <!-- 場所 -->
            <input id="name" type="text" v-model="name" class="w-3/4 rounded-lg border-2 border-gray-200 px-2 py-1.5" />
            <!-- ボタン -->
            <button class="w-1/4 cursor-pointer rounded-full bg-black p-2 px-4 text-center font-semibold text-white"
              @click="addPlace">
              追加
            </button>
          </div>

          <div class="border-2 border-gray-500 rounded-xl m-2 mt-4 p-2 h-48 overflow-y-auto">
            <div v-for="place in places">
              <div class="flex items-center">
                <p class="p-1 bg-black rounded-full"></p>
                <p class="border-b border-gray-500 p-1 m-2 w-full px-2">{{ place.name }}</p>
                <button class="border border-red-500 rounded-full grid items-center justify-center p-1"
                  @click="handleDeletePlace(place)">
                  <svg class="size-5 fill-red-500" viewBox="0 0 16 16">
                    <path
                      d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                    <path
                      d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- ローディング -->
    <SharedLoading :is-loading="isLoading" />
  </div>
</template>

<script setup lang="ts">
import type { Place } from "@/@types/outlet";

const props = defineProps({
  isPlaceModal: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: String,
    default: "",
  },
});

const isLoading = ref<boolean>(false);
const emit = defineEmits(["close"]);
const closePlaceModal = () => emit("close");

const name = ref<string>("");
const placeId = ref<string>(crypto.randomUUID());
const places = ref<Place[]>([]);

const addPlace = async () => {
  try {
    isLoading.value = true;

    const placeData: Place = {
      name: name.value,
      placeId: placeId.value,
    };

    await addNewPlace(placeData, props.userId);

    places.value = await getAllPlaces(props.userId);
    placeId.value = crypto.randomUUID();
  } catch (error) {
    console.error("場所を追加できませんでした", error)
  } finally {
    isLoading.value = false;
  };
};

const handleDeletePlace = async (place: Place) => {
  try {
    isLoading.value = true;

    await deletePlace(place.placeId, props.userId);

    places.value = await getAllPlaces(props.userId);
  } catch (error) {
    console.error("場所を削除できませんでした", error)
  } finally {
    isLoading.value = false;
  }
}
onMounted(async () => {
  places.value = await getAllPlaces(props.userId);
})
</script>
