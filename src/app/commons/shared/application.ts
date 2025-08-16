export interface Application {
    id?: number
    title: string
    price: number
    assignedCode: string
    requestDate: Date
}

export interface ApplicationData {
}

export interface ProcessingApplication {
    id?: number
    assignedCode: string
    employee_handler: string
    status: ApplicationStatus
}

export enum ApplicationStatus {
    AVAILABLE="DISPONIVEL", PROCESSING="EM ANDAMENTO", PENDING="PENDENTE", APPROVED="APROVADO", DONE="PRONTO PARA RETIRAR"
}