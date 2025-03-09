import type { Place } from "@/@types/outlet";
import { collection, deleteDoc, doc, getDocs, getFirestore, setDoc } from "firebase/firestore";

// 景品新規追加
export const addNewPlace = async (place: Place, userId: string) => {
    try {
        const db = getFirestore();
        await setDoc(doc(db, `users/${userId}/place`, place.placeId), place);
    } catch (error) {
        console.log(error);
        throw new Error("場所が登録できませんでした");
    }
};

// 景品一覧取得
export const getAllPlaces = async (userId: string) => {
    try {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, `users/${userId}/place`));
        const data = querySnapshot.docs.map((doc) => doc.data() as Place);

        return data;
    } catch (error) {
        console.log(error);
        throw new Error("場所情報を取得できませんでした");
    }
};

// 削除処理
export const deletePlace = async (id: string, userId: string) => {
    try {
        const db = getFirestore();
        await deleteDoc(doc(db, `users/${userId}/place`, id));
    } catch (error) {
        console.log(error);
        throw new Error("場所情報の削除に失敗しました");
    }
};