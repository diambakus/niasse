import { Organ } from "../../components/organ/organ"

export interface OrganData extends Organ {
}

export const EMPTY_ORGAN = {
    id: -1,
    name: '',
    description: ''
}