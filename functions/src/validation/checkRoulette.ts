import { getAllRoulette } from "../utils/firestore"
import { onCall } from "firebase-functions/v2/https";

export const check_rouletteSum = onCall(async (request) => {

  const userId = request.data as string;
  console.log("userId", userId);

  try {
    const outlets = await getAllRoulette(userId);

    if (outlets.length >= 50) {
      return true;
    }

    console.log("今月のルーレット数: ", outlets.length);
    return false;
  } catch (error) {
    console.error(error, "Can't roulette validation");
    return false;
  }
});