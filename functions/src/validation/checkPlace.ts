import { getAllPlaces } from "../utils/firestore"
import { onCall } from "firebase-functions/v2/https";

export const check_placeSum = onCall(async (request) => {

  const userId = request.data as string;
  console.log("userId", userId);

  try {
    const outlets = await getAllPlaces(userId);

    if (outlets.length >= 4) {
      return true;
    }

    console.log("問題なし");
    return false;
  } catch (error) {
    console.error(error, "Can't place validation");
    return false;
  }
});