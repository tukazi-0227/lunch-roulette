import { Timestamp } from "firebase/firestore";

export interface Outlet {
    id: string,
    name: string,
    place: string,
    detail: string,
    imageUrl: string,
    createdAt: Timestamp,
};
export interface Result {
    outlet: Outlet,
    roulettedAt: Timestamp,
    rouletteId: string,
};

export interface Place {
    name: string,
    placeId: string,
};

export interface ToComPonentForm {
    selectedOutlet: any,
    outletId: string,
    name: string,
    detail: string,
    place: string,
    imageUrl: string,
    _imagePreview: string,
}