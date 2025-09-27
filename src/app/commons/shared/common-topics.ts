
export interface CartItem {
    commodityId: number
    name: string
    price: number
    quantity: number,
    steps?: string[]
}

export interface KeyValuePair {
    [key: string]: string
}

export interface Address {
    id?: number
    street: string
    addressNumber: number
    city: string
    country: string
    postalCode: string
    state?: string
    addressType: string
}

export interface Contact {
   id?: number
   name: string
   phone: string
   email: string
   contactType: string
}