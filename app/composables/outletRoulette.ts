import type { Outlet } from "@/@types/outlet";
import type { Roulette } from "@/@types/roulette";
import { collection, doc, getDoc, getDocs, getFirestore, setDoc } from "firebase/firestore";

// ルーレットするお店をfiresotreに保存
export const addSelectedOutlets = async (selectedOutlets: Outlet[], userId: string) => {
    try {
        // ルーレット用の一意なID
        const rouletteId: string = crypto.randomUUID();

        const db = getFirestore();
        const rouletteDocRef = doc(db, `users/${userId}/roulette`, rouletteId);
        const data = {
            outlets: selectedOutlets,
            createdAt: new Date(),
        };

        await setDoc(rouletteDocRef, data);

        return rouletteId;
    } catch (error) {
        console.log(error);
        throw new Error("ルーレット情報が登録できませんでした");
    }
};

// 該当ルーレット取得
export const getAllSelectedOutlet = async (rouletteId: string, userId: string) => {
    try {
        const db = getFirestore();
        const rouletteDocRef = doc(db, `users/${userId}/roulette`, rouletteId);
        const docSnap = await getDoc(rouletteDocRef);


        if (docSnap.exists()) {
            const data = docSnap.data();
            const outlets = data.outlets as Outlet[];
            return outlets;
        } else {
            console.error("ルーレットドキュメントが存在しません");
            return [];
        }
    } catch (error) {
        console.log(error, "ルーレット情報を取得できませんでした");
    }
};

// 今月のルーレット取得
export const getAllRoulette = async (userId: string) => {
    try {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, `users/${userId}/roulette`));
        const data = querySnapshot.docs.map((doc) => doc.data() as Roulette);

        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const currentMonthData = data.filter(item => {
            const createdAtDate = item.createdAt.toDate();
            return createdAtDate.getMonth() === currentMonth && createdAtDate.getFullYear() === currentYear;
        });

        return currentMonthData;
    } catch (error) {
        console.log(error, "今月のルーレット情報を取得できませんでした");
        return [];
    };
};
