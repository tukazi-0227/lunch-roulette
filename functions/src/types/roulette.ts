import { Timestamp } from "firebase/firestore";
import { Outlet } from "./outlet";

export interface Roulette {
    outlets: Array<Outlet>,
    createdAt: Timestamp,
};