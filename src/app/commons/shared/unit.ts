export interface UnitData {
    id?: number
    name: string
    organId?: number
    description: string
}

export type UnitSimplifiedView = Pick<UnitData, 'id'|'name'>

export const EMPTY_UNIT: UnitData = {
    id: -1,
    name: '',
    organId: -1,
    description: ''
}