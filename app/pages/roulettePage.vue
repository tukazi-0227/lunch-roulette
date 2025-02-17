<template>
  <div>
   <button class="p-10 bg-blue-500" @click="test">押す</button>
  </div>
</template>

<script setup lang="ts">
import { getApp } from "firebase/app"
import { getFunctions, httpsCallable } from "firebase/functions";

const test = async () => {
  const functions = getFunctions(getApp());
  // httpsCallable で関数オブジェクトを取得
  const callHelloWorld = httpsCallable(functions, "api_sample_index-helloWorld");
  
  try {
    // 実際に関数を呼び出す（引数は空のオブジェクトでもOK）
    const result = await callHelloWorld({});
    alert(result.data); // 結果のデータ部分を表示
  } catch (error) {
    console.error("Error calling function:", error);
    alert("エラーが発生しました");
  }
};

</script>
