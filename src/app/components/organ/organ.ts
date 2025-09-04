import { KeyValuePair } from "../../commons/shared/common-topics"

export interface Organ {
    id: number
    name: string
    note: string
    content: string
    attributes: KeyValuePair[]
}