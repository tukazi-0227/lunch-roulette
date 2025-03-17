import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default defineNuxtRouteMiddleware(async (to) => {
  const auth = getAuth();
  const user = await new Promise((resolve) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    });
  });

  console.log("userId: ", auth.currentUser?.uid);
  if (user && to.path === "/") {
    return navigateTo(`/member/${auth.currentUser?.uid}`);
  }

  if (!user && to.path !== "/") {
    return navigateTo("/");
  }
});
