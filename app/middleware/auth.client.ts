import type { User } from "firebase/auth";
import { defineNuxtRouteMiddleware } from "nuxt/app";

export default defineNuxtRouteMiddleware(async (to) => {
  // const authReady = useState("firebaseAuthReady");

  // await new Promise<void>((resolve) => {
  //   if (authReady.value) {
  //     return resolve();
  //   }
  //   const stop = watch(
  //     () => authReady.value,
  //     (val) => {
  //       if (val) {
  //         stop();
  //         resolve();
  //       }
  //     }
  //   );
  // });

  // const user = useState("firebaseUser").value as User;
  // if (user && to.path === "/") {
  //   return navigateTo(`/free`);
  // }
  // if (!user && to.path !== "/") {
  //   return navigateTo("/");
  // }
});
