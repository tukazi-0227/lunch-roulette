import type { Outlet } from "@/@types/outlet";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, getFirestore, query, setDoc, updateDoc, where } from "firebase/firestore";

// 景品新規追加
export const addNewOutlet = async (item: Outlet, userId: string) => {
    try {
        const db = getFirestore();
        await setDoc(doc(db, `users/${userId}/outlet`, item.id), item);
    } catch (error) {
        console.log(error);
        throw new Error("お店情報が登録できませんでした");
    }
};

// 景品一覧取得
export const getAllOutlet = async (userId: string) => {
    try {
        const db = getFirestore();
        const querySnapshot = await getDocs(collection(db, `users/${userId}/outlet`));
        const data = querySnapshot.docs.map((doc) => doc.data() as Outlet);

        return data;
    } catch (error) {
        console.log(error);
        throw new Error("お店情報を取得できませんでした");
    }
};

// 該当景品単一取得
export const getOutlet = async (id: string, userId: string) => {

    const outlet = ref<Outlet>();
    try {
        const db = getFirestore();
        const outletRef = doc(db, `users/${userId}/outlet/${id}`);
        const outletSnap = await getDoc(outletRef);

        if (!outletSnap.exists()) {
            console.log("Document data is nothing:", outletSnap.data());
        }
        outlet.value = outletSnap.data() as Outlet;
        return { outlet }
    } catch (error) {
        console.log(error);
        throw new Error("お店情報を取得できませんでした");
    }
};


//　該当景品一覧取得
export const getOutletsByPlace = async (place: string, userId: string) => {
    try {
        const db = getFirestore();
        const q = query(collection(db, `users/${userId}/outlet`), where("place", "==", place));
        const querySnapshot = await getDocs(q);

        const data = querySnapshot.docs.map((doc) => doc.data() as Outlet);
        return data;
    } catch (error) {
        console.log(error);
        throw new Error("該当するお店情報を取得できませんでした");
    }
};

// 景品更新
export const updateOutlet = async (item: Outlet, userId: string) => {
    try {
        const db = getFirestore();
        await setDoc(doc(db, `users/${userId}/outlet`, item.id), item);
    } catch (error) {
        console.log(error);
        throw new Error("お店情報が登録できませんでした");
    }
};

// 削除処理
export const deleteOutlet = async (id: string, userId: string) => {
    try {
        const db = getFirestore();
        await deleteDoc(doc(db, `users/${userId}/outlet`, id));
    } catch (error) {
        console.log(error);
        throw new Error("お店情報の削除に失敗しました");
    }
};

// 画像のみ削除処理
export const deleteOutletImageUrl = async (id: string, userId: string) => {
    try {
        const db = getFirestore();
        const outletRef = doc(db, `users/${userId}/outlet/${id}`);
        await updateDoc(outletRef, { imageUrl: "" });
    } catch (error) {
        console.log(error);
        throw new Error("お店情報の削除に失敗しました");
    }
};