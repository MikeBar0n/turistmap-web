export interface Usuario {
  id: string;
  nombre: string;
  email: string;
  rol: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  usuario: Usuario;
}

export interface Destino {
  _id?: string;
  nombre: string;
  descripcion: string;
  ubicacion: {
    ciudad: string;
    departamento: string;
    pais?: string;
  };
  categoria: string;
  calificacion?: number;
  activo?: boolean;
  creadoPor?: any;
}

export interface Actividad {
  _id?: string;
  nombre: string;
  descripcion: string;
  destino: any;
  tipo: string;
  duracion?: { horas: number };
  precio?: number;
  cupoMaximo?: number;
  fecha?: string;
  activo?: boolean;
  creadoPor?: any;
}

export interface Itinerario {
  _id?: string;
  titulo: string;
  descripcion?: string;
  usuario?: any;
  actividades?: {
    actividad: any;
    fechaAgendada?: string;
    notas?: string;
  }[];
  fechaInicio: string;
  fechaFin: string;
  activo?: boolean;
}