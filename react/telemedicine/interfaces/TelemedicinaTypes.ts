export interface CitaTelemedicina {
    id: number;
    doctor: string;
    fecha: string;
    hora: string;
    paciente: string;
    telefono: string;
    correo: string;
    estado: string;
    stateKey: string;
    attentionType: string;
    patient: any;
    user_availability: any;
}

export interface SalaVideo {
    roomId: string;
    estado: "abierta" | "cerrada";
    apertura: string;
    doctor: string;
    paciente: string;
}
