import { Timestamp } from "firebase/firestore";

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