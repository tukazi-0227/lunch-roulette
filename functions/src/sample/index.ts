import * as functions from "firebase-functions/v2";
// サンプルのHTTP関数を作成
export const helloWorld = functions.https.onCall(() => {
    console.log("success");
  return "Hello from Firebase!";
});
