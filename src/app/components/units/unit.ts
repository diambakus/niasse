import { Organ } from "../organ/organ"

export interface Unit {
    id?: number
    organDto: Organ
    name: string
    description: string
}