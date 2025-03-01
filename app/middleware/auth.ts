import { defineNuxtRouteMiddleware, navigateTo } from "nuxt/app";
import { getAuth } from "firebase/auth";

export default defineNuxtRouteMiddleware(async () => {
  const auth = await getAuth();
  const user = auth.currentUser;
  if (!user) {
    return navigateTo("/login");
  }
});
