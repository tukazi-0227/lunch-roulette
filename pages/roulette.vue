<script setup lang="ts">

const hello = ref<string>("Hello");
const shopList = ref<string[]>(["中華", "ラーメン", "焼き肉"]);
const goShop = ref<string>("");

const rouletteAction = async (items: string[]) => {
  try {
    const response = await fetch('/api/rouletteAct', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rouletteItems: items
      }),
    });
    const data = await response.json();
    
    // タスクの追加
    if (data.error) {
      console.error(data.error);
    } else {
      goShop.value = data;
    }
  } catch (error) {
    console.log('ルーレットにおいて予期せぬエラーが発生しました', error);
  }
}

const startRoulette = (list: string[]) => {
  rouletteAction(list);
}

</script>

<template>
  <div>
    <button @click="startRoulette(shopList)"  class="boder boder-black">
      ルーレットスタート！
    </button>

    <div v-if="goShop">
      {{ goShop }}
    </div>
  </div>
</template>
