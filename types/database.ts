// Database Types for GLOR CRM

export type Etiqueta = 'Comprador' | 'Inquilino' | 'Vendedor' | 'Inversionista' | 'Propietario';
export type ContactStatus = 'Activo' | 'En proceso' | 'Cerrado' | 'Frío';
export type OrigenLead = 'Facebook' | 'Instagram' | 'WhatsApp' | 'Referido' | 'Website' | 'Otro';
export type Moneda = 'MXN' | 'USD';

export interface Contact {
  id: string;
  nombre_completo: string;
  telefono: string;
  email?: string;
  empresa?: string;
  direccion_actual?: string;
  etiqueta: Etiqueta;
  status: ContactStatus;
  fecha_cumpleanos?: string;
  fecha_aniversario?: string;
  presupuesto_min?: number;
  presupuesto_max?: number;
  moneda: Moneda;
  zona_interes?: string;
  tipo_propiedad_buscando?: string;
  tipo_financiamiento?: string;
  timeline_compra?: string;
  propiedades_que_tiene?: string;
  origen_lead: OrigenLead;
  notas?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export type TipoActividad = 'Llamada' | 'Email' | 'WhatsApp' | 'Reunión' | 'Showing' | 'Otro';
export type ResultadoActividad = 'Positivo' | 'Neutral' | 'Negativo' | 'Cerrado';

export interface Activity {
  id: string;
  contact_id: string;
  deal_id?: string;
  tipo: TipoActividad;
  descripcion: string;
  resultado?: ResultadoActividad;
  fecha_hora: string;
  proximo_seguimiento?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export type TipoPropiedad = 'Casa' | 'Departamento' | 'Terreno' | 'Comercial' | 'Otro';
export type Operacion = 'Venta' | 'Renta' | 'Ambas';
export type PropertyStatus = 'Disponible' | 'Rentado' | 'Vendido' | 'Apartado';

export interface Property {
  id: string;
  direccion: string;
  tipo: TipoPropiedad;
  operacion: Operacion;
  precio: number;
  moneda: Moneda;
  comision_porcentaje: number;
  propietario_nombre: string;
  propietario_telefono?: string;
  propietario_email?: string;
  recamaras?: number;
  banos?: number;
  m2_construccion?: number;
  m2_terreno?: number;
  descripcion?: string;
  amenidades?: string[];
  fotos?: string[];
  video_tour_url?: string;
  planos?: string[];
  easybroker_url?: string;
  omnimls_url?: string;
  status: PropertyStatus;
  fecha_disponibilidad?: string;
  contrato_vencimiento?: string;
  inquilino_actual?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export type DealStage = 
  | 'Contacto Inicial'
  | 'Calificado'
  | 'Mostrando Propiedades'
  | 'Apartado'
  | 'Fecha de Firma'
  | 'Cerrado'
  | 'Perdido';

export interface Deal {
  id: string;
  contact_id: string;
  property_id?: string;
  titulo: string;
  valor_estimado?: number;
  moneda: Moneda;
  stage: DealStage;
  stage_entered_at: string;
  comision_porcentaje: number;
  comision_total?: number;
  split_con_broker: boolean;
  comision_anthony?: number;
  comision_gloria?: number;
  doc_contrato_firmado: boolean;
  doc_identificacion: boolean;
  doc_comprobante_ingresos: boolean;
  doc_escrituras: boolean;
  doc_avaluo: boolean;
  fecha_estimada_cierre?: string;
  fecha_cierre_real?: string;
  assigned_to?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export type TipoEmailTemplate = 'Cumpleaños' | 'Aniversario' | 'Seguimiento' | 'Renovación Renta';

export interface EmailTemplate {
  id: string;
  nombre: string;
  tipo: TipoEmailTemplate;
  asunto: string;
  cuerpo: string;
  activo: boolean;
  hora_envio: string;
  created_at: string;
  updated_at: string;
}

export type EmailStatus = 'Enviado' | 'Entregado' | 'Abierto' | 'Clicked' | 'Rebotado' | 'Error';

export interface EmailHistory {
  id: string;
  contact_id?: string;
  template_id?: string;
  asunto: string;
  cuerpo: string;
  destinatario_email: string;
  enviado_at: string;
  abierto_at?: string;
  clicked_at?: string;
  status: EmailStatus;
  error_mensaje?: string;
}

export type TipoNotificacion = 
  | 'Cumpleaños'
  | 'Aniversario'
  | 'Renovación Renta'
  | 'Seguimiento Pendiente'
  | 'Deal Estancado';

export interface Notification {
  id: string;
  user_id: string;
  tipo: TipoNotificacion;
  titulo: string;
  mensaje: string;
  contact_id?: string;
  deal_id?: string;
  property_id?: string;
  leida: boolean;
  leida_at?: string;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id?: string;
  accion: string;
  entidad: string;
  entidad_id?: string;
  detalles?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: string;
}

// Dashboard Types
export interface DashboardMetrics {
  total_contactos: number;
  deals_activos: number;
  revenue_mes: number;
  seguimientos_pendientes: number;
}

export interface PipelineSummary {
  stage: DealStage;
  deal_count: number;
  total_value: number;
  avg_days_in_stage: number;
}

export interface UpcomingEvent {
  tipo: 'Cumpleaños' | 'Aniversario' | 'Renovación Renta';
  contact_id: string;
  nombre_completo: string;
  fecha: string;
  dias_hasta: number;
}

// Form Types
export interface ContactFormData {
  nombre_completo: string;
  telefono: string;
  email?: string;
  empresa?: string;
  direccion_actual?: string;
  etiqueta: Etiqueta;
  status?: ContactStatus;
  fecha_cumpleanos?: string;
  fecha_aniversario?: string;
  presupuesto_min?: number;
  presupuesto_max?: number;
  moneda?: Moneda;
  zona_interes?: string;
  tipo_propiedad_buscando?: string;
  tipo_financiamiento?: string;
  timeline_compra?: string;
  propiedades_que_tiene?: string;
  origen_lead?: OrigenLead;
  notas?: string;
}

export interface ActivityFormData {
  contact_id: string;
  deal_id?: string;
  tipo: TipoActividad;
  descripcion: string;
  resultado?: ResultadoActividad;
  fecha_hora?: string;
  proximo_seguimiento?: string;
}

export interface PropertyFormData {
  direccion: string;
  tipo: TipoPropiedad;
  operacion: Operacion;
  precio: number;
  moneda?: Moneda;
  comision_porcentaje?: number;
  propietario_nombre: string;
  propietario_telefono?: string;
  propietario_email?: string;
  recamaras?: number;
  banos?: number;
  m2_construccion?: number;
  m2_terreno?: number;
  descripcion?: string;
  amenidades?: string[];
  video_tour_url?: string;
  easybroker_url?: string;
  omnimls_url?: string;
  status?: PropertyStatus;
  fecha_disponibilidad?: string;
  contrato_vencimiento?: string;
  inquilino_actual?: string;
}

export interface DealFormData {
  contact_id: string;
  property_id?: string;
  titulo: string;
  valor_estimado?: number;
  moneda?: Moneda;
  stage?: DealStage;
  comision_porcentaje?: number;
  split_con_broker?: boolean;
  fecha_estimada_cierre?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Filter Types
export interface ContactFilters {
  search?: string;
  etiqueta?: Etiqueta[];
  status?: ContactStatus[];
  origen_lead?: OrigenLead[];
  fecha_desde?: string;
  fecha_hasta?: string;
}

export interface ActivityFilters {
  contact_id?: string;
  deal_id?: string;
  tipo?: TipoActividad[];
  fecha_desde?: string;
  fecha_hasta?: string;
  user_id?: string;
}

export interface PropertyFilters {
  tipo?: TipoPropiedad[];
  operacion?: Operacion[];
  status?: PropertyStatus[];
  precio_min?: number;
  precio_max?: number;
}

export interface DealFilters {
  stage?: DealStage[];
  assigned_to?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
}
