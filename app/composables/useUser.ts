import type { User } from "@/@types/user";
import { doc, getDoc, getFirestore, setDoc } from "firebase/firestore";

// 景品新規追加
export const addUserInfo = async (user: User) => {
    try {
        const db = getFirestore();
        await setDoc(doc(db, "users", user.userId), user);
    } catch (error) {
        console.log(error);
        throw new Error("お店情報が登録できませんでした");
    }
};

// 該当ユーザー情報取得
export const getUserInfo = async (userId: string) => {

    const user = ref<User>();
    try {
        const db = getFirestore();
        const userRef = doc(db, `users/${userId}`);
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
            console.log("Document data is nothing:", userSnap.data());
        }
        user.value = userSnap.data() as User;
        return { user }
    } catch (error) {
        console.log(error);
        throw new Error("ユーザー情報を取得できませんでした");
    }
};

// // 景品更新
// export const updateOutlet = async (item: Outlet) => {
//     try {
//         const db = getFirestore();
//         await setDoc(doc(db, "outlet", item.id), item);
//     } catch (error) {
//         console.log(error);
//         throw new Error("お店情報が登録できませんでした");
//     }
// };

// // 削除処理
// export const deleteOutlet = async (id: string) => {
//     try {
//         const db = getFirestore();
//         await deleteDoc(doc(db, "outlet", id));
//     } catch (error) {
//         console.log(error);
//         throw new Error("お店情報の削除に失敗しました");
//     }
// };
