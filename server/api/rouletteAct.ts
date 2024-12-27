import { defineEventHandler, readBody } from 'h3';

export default defineEventHandler(async (event) => {

    try {
        const body = await readBody(event);
        const rouletteItems: string[] = body.rouletteItems;

        const randomIndex = Math.floor(Math.random() * rouletteItems.length);
        const selectedItem = rouletteItems[randomIndex];
        
        return { selectedItem };
    } catch (error) {
        console.error(error);
        return { error: 'ルーレットを実行できませんでした' };
    }
});