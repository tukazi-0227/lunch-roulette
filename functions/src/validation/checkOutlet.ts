import { getAllOutlet } from "../utils/firestore"
import { onCall } from "firebase-functions/v2/https";

export const check_outletSum = onCall(async (request) => {

  const userId = request.data as string;
  console.log("userId", userId);

  try {
    const outlets = await getAllOutlet(userId);

    if (outlets.length >= 40) {
      return true;
    }

    console.log("問題なし");
    return false;
  } catch (error) {
    console.error(error, "Can't outlet validation");
    return false;
  }
});