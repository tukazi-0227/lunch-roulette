<script setup lang="ts">
  definePageMeta({
   layout: 'roulette'
  });

const router = useRouter();
 
onMounted(() => {
  router.replace('/user/choiceOutlet');
});
</script>

<template>
  <div>
    
  </div>
</template>
