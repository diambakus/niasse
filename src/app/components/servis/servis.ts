import { Unit } from "../units/unit"

export interface Servis {
    id?: number
    unitsDto: Unit[]
    name: string
    price: number
    description: string
    servisType: ServisType
}

export enum ServisType {
    SERVICE, GOODS, FINE, INVALID
}

export const ServisTypeTranslation: Record<ServisType, string> = {
    [ServisType.SERVICE]: 'servisType.service',
    [ServisType.GOODS]: 'servisType.goods',
    [ServisType.FINE]: 'servisType.fine',
    [ServisType.INVALID]: 'servisType.invalid',
};