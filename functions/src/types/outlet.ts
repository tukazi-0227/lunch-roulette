import {Timestamp} from "firebase-admin/firestore";

export interface Outlet {
    id: string,
    name: string,
    place: string,
    detail: string,
    imageUrl: string,
    createdAt: Timestamp,
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