import { LatLngExpression } from "leaflet";

// Types
export enum DType {
    None,
    Earthquake,
    Hurricane,
    Volcano,
    Flood,
    Tsunami,
}


export interface Item {
    id: string;
    name: string;
    completed: boolean;
}

export interface Checklist {
    id: string;
    name: string;
    progress: number;
    items: Item[];
    disasterType: DType;
}


export interface Location {
    id: string;
    type: string;
    name: string;
    location: LatLngExpression;
    iconURL: string
}

