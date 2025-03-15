import * as functions from "firebase-functions";
import { defineSecret } from "firebase-functions/params";
import { onCall } from "firebase-functions/v2/https";

const GOOGLE_CLOUD_APIKEY = defineSecret("GOOGLE_CLOUD_APIKEY");

export const addOutlet_ByGoogle = onCall(
  {
    secrets: [GOOGLE_CLOUD_APIKEY],
  },
  async (request) => {

    const placeId = request.data?.placeId || "";
    console.log("placeId", placeId);

    const apiKey = GOOGLE_CLOUD_APIKEY.value();

    const fields = [
      "name",
      "rating",
      "photos",
      "formatted_address",
      "place_id",
      "geometry"
    ].join(",");
    const requestUrl = `https://maps.googleapis.com/maps/api/place/details/json?key=${apiKey}&place_id=${encodeURIComponent(
      placeId
    )}&fields=${fields}`;

    let responseData: any;
    try {
      const response = await fetch(requestUrl);
      if (!response.ok) {
        throw new Error("Failed to fetch place details");
      }
      responseData = await response.json();
    } catch (error) {
      throw new functions.https.HttpsError("unknown", error as string);
    };

    const placeResult = responseData?.result ?? {};
    return {
      status: responseData.status,
      place: placeResult
    };
  },
);