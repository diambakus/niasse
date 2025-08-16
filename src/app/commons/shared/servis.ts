export interface ServisData {
    id?: number
    name: string
    price: number
    units: number[]
    description: string
}

export interface UnitIdNameData {
    id?: number
    name: string
}

export const EMPTY_SERVIS: ServisData = {
    description: '',
    name: '',
    price: 0.0,
    units: [],
}