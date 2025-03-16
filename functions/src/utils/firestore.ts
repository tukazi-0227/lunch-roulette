import * as admin from "firebase-admin";
import { Outlet, Place } from "../types/outlet";
import { Roulette } from "../types/roulette";

const db = admin.firestore();

// 景品総数取得
export const getAllOutlet = async (userId: string): Promise<Outlet[]> => {
  try {
    const snapshot = await db.collection(`users/${userId}/outlet`).get();
    const data = snapshot.docs.map(doc => doc.data() as Outlet);
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("お店情報を取得できませんでした");
  }
};

// 今月のルーレット総数取得
export const getAllRoulette = async (userId: string): Promise<Roulette[]> => {
  try {
    const snapshot = await db.collection(`users/${userId}/roulette`).get();
    const data = snapshot.docs.map(doc => doc.data() as Roulette);

    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const currentMonthData = data.filter(item => {
      const createdAtDate = item.createdAt.toDate();
      return createdAtDate.getMonth() === currentMonth && createdAtDate.getFullYear() === currentYear;
    });

    return currentMonthData;
  } catch (error) {
    console.error(error, "今月のルーレット情報を取得できませんでした");
    throw new Error("ルーレット情報を取得できませんでした");
  }
};

// 場所情報取得
export const getAllPlaces = async (userId: string): Promise<Place[]> => {
  try {
    const snapshot = await db.collection(`users/${userId}/place`).get();
    const data = snapshot.docs.map(doc => doc.data() as Place);
    return data;
  } catch (error) {
    console.error(error);
    throw new Error("場所情報を取得できませんでした");
  }
};
