import type { Outlet } from "@/@types/outlet";
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

// ルーレット一覧取得
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
