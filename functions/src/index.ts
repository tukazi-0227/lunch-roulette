import admin from "firebase-admin";
import {setGlobalOptions} from "firebase-functions/v2";
import serviceAccount from "../config/serviceAccountKey.json";

// firebase-adminを初期化
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

setGlobalOptions({region: "asia-northeast1"});

process.env.TZ = "Asia/Tokyo";

interface FunctionsObj {
  [key: string]: string;
}

// ここに定義を追加していく
const funcs: FunctionsObj = {
  api_sample_index: "./sample/index",
  api_google_addOutlet: "./google/add-newOutlet",
  api_validate_outletSum: "./validation/checkOutlet",
  api_validate_placeSum: "./validation/checkPlace",
  api_validate_rouletteSum: "./validation/checkRoulette",
};

const loadFunctions = (functionsObj: FunctionsObj) => {
  for (const functionName in functionsObj) {
    if (
      !process.env.FUNCTION_NAME ||
      process.env.FUNCTION_NAME.startsWith(functionName)
    ) {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      module.exports[functionName] = require(functionsObj[functionName]);
    }
  }
};

loadFunctions(funcs);
