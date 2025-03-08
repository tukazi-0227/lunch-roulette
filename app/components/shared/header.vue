<template>
  <div class="relative z-10 w-full bg-black text-white p-4">
    <div class="absolute left-0 top-0 py-4">
      <div class="grid items-center justify-center px-4" @click="toggleMenu">
        <svg viewBox="0 0 50 50" class="size-6 fill-white">
          <path
            d="M 5 8 A 2.0002 2.0002 0 1 0 5 12 L 45 12 A 2.0002 2.0002 0 1 0 45 8 L 5 8 z M 5 23 A 2.0002 2.0002 0 1 0 5 27 L 45 27 A 2.0002 2.0002 0 1 0 45 23 L 5 23 z M 5 38 A 2.0002 2.0002 0 1 0 5 42 L 45 42 A 2.0002 2.0002 0 1 0 45 38 L 5 38 z">
          </path>
        </svg>
      </div>
      <div v-if="isMenu" class="absolute top-full w-32 bg-gray-700 rounded-b-lg">
        <div v-for="menu in menus">
          <p class="p-3" @click="goPageBySelectMenu(menu)">{{ menu }}</p>
        </div>
      </div>
    </div>
    <p class="font-semibold text-center">ランチルーレット</p>
  </div>
</template>

<script setup lang="ts">
import { getAuth, signOut, type User } from 'firebase/auth';

const auth = getAuth();
const route = useRoute();
const userId = route.params.userId;
const router = useRouter();

const menus = (["ホーム画面", "お店編集", "ログアウト"]);

const goPageBySelectMenu = (menuItem: string) => {

  if(menuItem === menus[0]) {
    // ホーム画面
    toggleMenu();
    router.push({ path: `/member/${userId}` });
  } else if (menuItem === menus[1]) {
    // お店編集画面
    toggleMenu();
    router.push({ path: `/member/${userId}/registOutlet` });
  } else if (menuItem === menus[2]) {
    // ログアウト
    signOut(auth);
    toggleMenu();
    router.push({ path: `/` });

    console.log("ログアウトしました");
  }
} 

const isMenu = ref<boolean>(false);
const toggleMenu = () => {
  isMenu.value = !isMenu.value;
}

onMounted(() => {
  
})
</script>
