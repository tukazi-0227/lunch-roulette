// ~/plugins/vue3-roulette.client.ts
import { defineNuxtPlugin } from '#app'
import { Roulette } from 'vue3-roulette'

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component('Roulette', Roulette)
})