import { getFunctions, httpsCallable } from "firebase/functions";
import { defineNuxtRouteMiddleware } from "nuxt/app";
import { getApp } from "firebase/app";

// 有効期限が切れていたらホーム画面に遷移する
export default defineNuxtRouteMiddleware(async (to) => {
    const route = useRoute();

    const userId = route.params.userId;
  if (!userId) {
    console.error("No userId found in URL params.");
    return;
  }

  try {
    const functions = getFunctions(getApp());
    const checkStandardExpiration = httpsCallable(
      functions,
      "api_validate_rouletteSum-check_rouletteSum",
    );

    const response = await checkStandardExpiration(userId);

    if (response.data) {
      alert("今月のルーレット上限です");
      return navigateTo("/");
    }
  } catch (error) {
    console.error("Error calling checkRoulette:", error);
  }
});
