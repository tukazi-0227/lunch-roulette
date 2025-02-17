import { Timestamp } from "firebase/firestore";

export interface Outlet {
    name: string,
    place: string,
    detail: string,
    createdAt: Timestamp,
};