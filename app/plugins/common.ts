import {
    deleteObject,
    getDownloadURL,
    getStorage,
    ref as storageRef,
    uploadBytes,
} from "firebase/storage";

export default defineNuxtPlugin(() => ({
    provide: {
        uploadImage: async (file: File, path: string): Promise<string> => {
            try {
                const storage = getStorage();
                const imageRef = storageRef(storage, path);

                // ファイルをアップロード
                await uploadBytes(imageRef, file);

                // アップロード後にダウンロードURLを取得
                const imageUrl = await getDownloadURL(imageRef);
                return imageUrl;
            } catch (error) {
                console.error("Failed to upload image:", error);
                throw error;
            }
        },

        deleteImage: async (path: string): Promise<boolean> => {

            try {
                const storage = getStorage();
                const desertRef = storageRef(storage, path);
    
                await deleteObject(desertRef);

                return true;
            } catch (error) {
                console.error("Failed to delete image:", error);
                return false;
            }
        }
    },
}));
