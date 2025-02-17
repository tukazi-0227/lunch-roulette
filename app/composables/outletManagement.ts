import type { Outlet } from "@/@types/outlet";
import { addDoc, collection, getFirestore } from "firebase/firestore";


export const addNewOutlet = async (item: Outlet) => {
    try {
        const db = getFirestore();
        await addDoc(collection(db, "outlet"), item);
    } catch (error) {
        console.log(error);
        throw new Error("お店情報が登録できませんでした");
    }
};