// Property types and interfaces for GLOR CRM

export type PropertyType = 'casa' | 'departamento' | 'terreno' | 'local_comercial' | 'oficina';
export type OperationType = 'venta' | 'renta' | 'venta_renta';
export type PropertyStatus = 'disponible' | 'vendida' | 'rentada' | 'en_proceso';

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
    casa: 'Casa',
    departamento: 'Departamento',
    terreno: 'Terreno',
    local_comercial: 'Local Comercial',
    oficina: 'Oficina',
};

export const OPERATION_TYPE_LABELS: Record<OperationType, string> = {
    venta: 'Venta',
    renta: 'Renta',
    venta_renta: 'Venta o Renta',
};

export const PROPERTY_STATUS_LABELS: Record<PropertyStatus, string> = {
    disponible: 'Disponible',
    vendida: 'Vendida',
    rentada: 'Rentada',
    en_proceso: 'En Proceso',
};

export const PROPERTY_STATUS_COLORS: Record<PropertyStatus, string> = {
    disponible: 'bg-green-100 text-green-800',
    vendida: 'bg-blue-100 text-blue-800',
    rentada: 'bg-purple-100 text-purple-800',
    en_proceso: 'bg-yellow-100 text-yellow-800',
};

export const AMENITIES_OPTIONS = [
    { value: 'acceso_playa', label: 'Acceso a Playa' },
    { value: 'frente_agua', label: 'Frente al Agua' },
    { value: 'vista_agua', label: 'Vista al Agua' },
    { value: 'jardin', label: 'Jardín' },
    { value: 'aire_acondicionado', label: 'Aire Acondicionado' },
    { value: 'cocina_equipada', label: 'Cocina Equipada' },
    { value: 'mascotas_permitidas', label: 'Mascotas Permitidas' },
    { value: 'alberca', label: 'Alberca' },
    { value: 'gym', label: 'Gimnasio' },
    { value: 'seguridad_24h', label: 'Seguridad 24h' },
    { value: 'estacionamiento_techado', label: 'Estacionamiento Techado' },
    { value: 'cuarto_servicio', label: 'Cuarto de Servicio' },
    { value: 'terraza', label: 'Terraza' },
    { value: 'roof_garden', label: 'Roof Garden' },
    { value: 'bodega', label: 'Bodega' },
    { value: 'elevador', label: 'Elevador' },
];

export const MEXICO_STATES = [
    'Aguascalientes', 'Baja California', 'Baja California Sur', 'Campeche',
    'Chiapas', 'Chihuahua', 'Ciudad de México', 'Coahuila', 'Colima',
    'Durango', 'Estado de México', 'Guanajuato', 'Guerrero', 'Hidalgo',
    'Jalisco', 'Michoacán', 'Morelos', 'Nayarit', 'Nuevo León', 'Oaxaca',
    'Puebla', 'Querétaro', 'Quintana Roo', 'San Luis Potosí', 'Sinaloa',
    'Sonora', 'Tabasco', 'Tamaulipas', 'Tlaxcala', 'Veracruz', 'Yucatán', 'Zacatecas',
];

export interface Property {
    id: string;
    // Basic Info
    title: string;
    property_type: PropertyType;
    operation_type: OperationType;
    description: string | null;
    status: PropertyStatus;
    // Pricing
    price_mxn: number;
    price_usd: number | null;
    show_price: boolean;
    commission_percentage: number | null;
    // Characteristics
    bedrooms: number | null;
    bathrooms: number | null;
    half_bathrooms: number | null;
    parking_spaces: number | null;
    construction_m2: number | null;
    land_m2: number | null;
    year_built: number | null;
    // Location
    country: string;
    state: string | null;
    city: string | null;
    neighborhood: string | null;
    street: string | null;
    postal_code: string | null;
    show_exact_location: boolean;
    // Amenities
    amenities: string[];
    // Collaboration
    is_exclusive: boolean;
    shared_commission: boolean;
    commission_split_percentage: number | null;
    // Media
    images: string[];
    video_url: string | null;
    // Metadata
    internal_key: string | null;
    user_id: string;
    created_at: string;
    updated_at: string;
}

export interface PropertyFormData {
    // Basic Info
    title: string;
    property_type: PropertyType;
    operation_type: OperationType;
    description: string;
    status: PropertyStatus;
    // Pricing
    price_mxn: string;
    price_usd: string;
    show_price: boolean;
    commission_percentage: string;
    // Characteristics
    bedrooms: string;
    bathrooms: string;
    half_bathrooms: string;
    parking_spaces: string;
    construction_m2: string;
    land_m2: string;
    year_built: string;
    // Location
    country: string;
    state: string;
    city: string;
    neighborhood: string;
    street: string;
    postal_code: string;
    show_exact_location: boolean;
    // Amenities
    amenities: string[];
    // Collaboration
    is_exclusive: boolean;
    shared_commission: boolean;
    commission_split_percentage: string;
    // Media
    images: string[];
    video_url: string;
    // Metadata
    internal_key: string;
}

export const DEFAULT_PROPERTY_FORM: PropertyFormData = {
    title: '',
    property_type: 'casa',
    operation_type: 'venta',
    description: '',
    status: 'disponible',
    price_mxn: '',
    price_usd: '',
    show_price: true,
    commission_percentage: '',
    bedrooms: '',
    bathrooms: '',
    half_bathrooms: '',
    parking_spaces: '',
    construction_m2: '',
    land_m2: '',
    year_built: '',
    country: 'México',
    state: '',
    city: '',
    neighborhood: '',
    street: '',
    postal_code: '',
    show_exact_location: false,
    amenities: [],
    is_exclusive: false,
    shared_commission: true,
    commission_split_percentage: '50',
    images: [],
    video_url: '',
    internal_key: '',
};
