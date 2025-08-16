export interface Application {
    id?: number
    commodityId: number
    walletId: number
    status: String
    requestDate: Date,
    assignedCode: string
}

export enum ApplicationStatus {
    CREATED = "SUBMETIDO", ONGOING = "EM ANDAMENTO", PENDING = "PENDENTE", PROCESSED = "PROCESSADO", PAID = "PAGO", 
    APPROVED = "APROVADO", FAILED = "FALHA", DONE = "FINALIZADO"
}

export interface ApplicationItem {
    commodityId: number
    quantity: number
}