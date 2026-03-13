export interface Application {
    id?: number
    status: string
    requestedToUnitId: string
    assigneeId: string
    name: string,
    email: string,
    price: number,
    created: string
}

export enum ApplicationStatus {
    CREATED = "SUBMETIDO", ONGOING = "EM ANDAMENTO", PENDING = "PENDENTE", PROCESSED = "PROCESSADO", PAID = "PAGO", 
    APPROVED = "APROVADO", FAILED = "FALHA", DONE = "FINALIZADO"
}

export interface ApplicationItem {
    commodityId: number
    quantity: number
}