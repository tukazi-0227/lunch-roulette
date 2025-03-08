import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig().public;
  if (!config) {
    throw new Error("Runtime config is not found.");
  }
  if (!config.apiKey) {
    throw new Error("Runtime config apiKey is not found.");
  }
  if (!config.authDomain) {
    throw new Error("Runtime config authDomain is not found.");
  }
  if (!config.projectId) {
    throw new Error("Runtime config projectId is not found.");
  }
  if (!config.storageBucket) {
    throw new Error("Runtime config storageBucket is not found.");
  }
  if (!config.databaseURL) {
    throw new Error("Runtime config databaseURL is not found.");
  }

  if (!getApps().length) {
    initializeApp({
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectId,
      storageBucket: config.storageBucket,
      databaseURL: config.databaseURL,
    });
  }

  const functions = getFunctions(getApp());
  functions.region = "asia-northeast1";

  const auth = getAuth();
  const userState = useState("firebaseUser", () => null) as any;
  const authReady = useState("firebaseAuthReady", () => false);

  onAuthStateChanged(auth, (user) => {
    userState.value = user as any;
    authReady.value = true;
  });
});
