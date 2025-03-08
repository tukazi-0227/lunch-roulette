import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  // const auth = getAuth();
  // const user = await new Promise((resolve) => {
  //   const unsubscribe = onAuthStateChanged(auth, (user) => {
  //     unsubscribe();
  //     resolve(user);
  //   });
  // });

  // if (!user && to.path !== "/") {
  //   return navigateTo("/");
  // }
});
