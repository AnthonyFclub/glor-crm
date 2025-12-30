'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/lib/supabase/client';
import {
    Property,
    PROPERTY_TYPE_LABELS,
    OPERATION_TYPE_LABELS,
    PROPERTY_STATUS_LABELS,
    PROPERTY_STATUS_COLORS,
    AMENITIES_OPTIONS,
} from '@/types/property';
import {
    ArrowLeft, Edit, Trash2, MapPin, Bed, Bath, Car, Ruler, Calendar,
    Home, Building, DollarSign, Check, X, Share2, Phone, Mail
} from 'lucide-react';

export default function PropertyDetailPage() {
    const router = useRouter();
    const params = useParams();
    const propertyId = params.id as string;

    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState<string | null>(null);

    useEffect(() => {
        fetchProperty();
        getCurrentUser();
    }, [propertyId]);

    const getCurrentUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user?.id || null);
    };

    const fetchProperty = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('properties')
                .select('*')
                .eq('id', propertyId)
                .single();

            if (error) throw error;
            setProperty(data);
        } catch (error: any) {
            console.error('Error fetching property:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!property) return;

        try {
            const { error } = await supabase
                .from('properties')
                .delete()
                .eq('id', property.id);

            if (error) throw error;
            router.push('/propiedades');
        } catch (error: any) {
            console.error('Error deleting property:', error.message);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getAmenityLabel = (value: string) => {
        return AMENITIES_OPTIONS.find(a => a.value === value)?.label || value;
    };

    const isOwner = currentUser === property?.user_id;

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    if (!property) {
        return (
            <DashboardLayout>
                <div className="text-center py-12">
                    <Building className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Propiedad no encontrada</h3>
                    <button
                        onClick={() => router.push('/propiedades')}
                        className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Volver a propiedades
                    </button>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/propiedades')}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{property.title}</h1>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${PROPERTY_STATUS_COLORS[property.status]}`}>
                                    {PROPERTY_STATUS_LABELS[property.status]}
                                </span>
                                {property.internal_key && (
                                    <span className="text-sm text-gray-500">#{property.internal_key}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {isOwner && (
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => router.push(`/propiedades/${property.id}/editar`)}
                                className="inline-flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                            >
                                <Edit className="h-4 w-4" />
                                Editar
                            </button>
                            <button
                                onClick={() => setDeleteModalOpen(true)}
                                className="inline-flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                                Eliminar
                            </button>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column - Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Hero Image */}
                        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                            <div className="aspect-video bg-gray-100 flex items-center justify-center">
                                {property.images && property.images.length > 0 ? (
                                    <img
                                        src={property.images[0]}
                                        alt={property.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <Home className="h-12 w-12 mx-auto" />
                                        <p className="mt-2">Sin imagen</p>
                                    </div>
                                )}
                            </div>

                            {/* Image Gallery */}
                            {property.images && property.images.length > 1 && (
                                <div className="p-4 flex gap-2 overflow-x-auto">
                                    {property.images.map((img, idx) => (
                                        <img
                                            key={idx}
                                            src={img}
                                            alt={`${property.title} - ${idx + 1}`}
                                            className="h-20 w-20 object-cover rounded-lg flex-shrink-0"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        {property.description && (
                            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Descripción</h2>
                                <p className="text-gray-600 whitespace-pre-wrap">{property.description}</p>
                            </div>
                        )}

                        {/* Characteristics */}
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Características</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                {property.bedrooms !== null && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Bed className="h-5 w-5 text-blue-600" />
                                        <div>
                                            <p className="text-sm text-gray-500">Recámaras</p>
                                            <p className="font-semibold text-gray-900">{property.bedrooms}</p>
                                        </div>
                                    </div>
                                )}
                                {property.bathrooms !== null && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Bath className="h-5 w-5 text-blue-600" />
                                        <div>
                                            <p className="text-sm text-gray-500">Baños</p>
                                            <p className="font-semibold text-gray-900">{property.bathrooms}</p>
                                        </div>
                                    </div>
                                )}
                                {property.half_bathrooms !== null && property.half_bathrooms > 0 && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Bath className="h-5 w-5 text-blue-600" />
                                        <div>
                                            <p className="text-sm text-gray-500">Medios Baños</p>
                                            <p className="font-semibold text-gray-900">{property.half_bathrooms}</p>
                                        </div>
                                    </div>
                                )}
                                {property.parking_spaces !== null && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Car className="h-5 w-5 text-blue-600" />
                                        <div>
                                            <p className="text-sm text-gray-500">Estacionamientos</p>
                                            <p className="font-semibold text-gray-900">{property.parking_spaces}</p>
                                        </div>
                                    </div>
                                )}
                                {property.construction_m2 !== null && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Ruler className="h-5 w-5 text-blue-600" />
                                        <div>
                                            <p className="text-sm text-gray-500">Construcción</p>
                                            <p className="font-semibold text-gray-900">{property.construction_m2} m²</p>
                                        </div>
                                    </div>
                                )}
                                {property.land_m2 !== null && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Ruler className="h-5 w-5 text-blue-600" />
                                        <div>
                                            <p className="text-sm text-gray-500">Terreno</p>
                                            <p className="font-semibold text-gray-900">{property.land_m2} m²</p>
                                        </div>
                                    </div>
                                )}
                                {property.year_built !== null && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                        <Calendar className="h-5 w-5 text-blue-600" />
                                        <div>
                                            <p className="text-sm text-gray-500">Año</p>
                                            <p className="font-semibold text-gray-900">{property.year_built}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Amenities */}
                        {property.amenities && property.amenities.length > 0 && (
                            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900 mb-4">Amenidades</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {property.amenities.map((amenity) => (
                                        <div key={amenity} className="flex items-center gap-2 text-gray-600">
                                            <Check className="h-4 w-4 text-green-500" />
                                            <span>{getAmenityLabel(amenity)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Location */}
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">Ubicación</h2>
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-blue-600 mt-1 flex-shrink-0" />
                                <div>
                                    {property.show_exact_location && property.street && (
                                        <p className="text-gray-900">{property.street}</p>
                                    )}
                                    <p className="text-gray-600">
                                        {[property.neighborhood, property.city, property.state, property.country]
                                            .filter(Boolean)
                                            .join(', ')}
                                    </p>
                                    {property.postal_code && (
                                        <p className="text-gray-500">C.P. {property.postal_code}</p>
                                    )}
                                </div>
                            </div>

                            {/* Map Placeholder */}
                            <div className="mt-4 h-48 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                                <div className="text-center">
                                    <MapPin className="h-8 w-8 mx-auto" />
                                    <p className="mt-2">Mapa próximamente</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Sidebar */}
                    <div className="space-y-6">
                        {/* Price Card */}
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded font-medium">
                                    {OPERATION_TYPE_LABELS[property.operation_type]}
                                </span>
                                <span>{PROPERTY_TYPE_LABELS[property.property_type]}</span>
                            </div>

                            {property.show_price ? (
                                <div>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {formatPrice(property.price_mxn)}
                                    </p>
                                    {property.price_usd && (
                                        <p className="text-lg text-gray-500">
                                            USD ${property.price_usd.toLocaleString()}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <p className="text-xl font-medium text-gray-600 italic">Consultar precio</p>
                            )}
                        </div>

                        {/* Contact Card */}
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                            <h3 className="font-semibold text-gray-900 mb-4">Contactar Agente</h3>
                            <div className="space-y-3">
                                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors">
                                    <Phone className="h-5 w-5" />
                                    Llamar
                                </button>
                                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors">
                                    <Mail className="h-5 w-5" />
                                    Enviar Mensaje
                                </button>
                                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                                    <Share2 className="h-5 w-5" />
                                    Compartir
                                </button>
                            </div>
                        </div>

                        {/* Collaboration Info */}
                        {isOwner && (
                            <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                                <h3 className="font-semibold text-gray-900 mb-4">Información de Colaboración</h3>
                                <div className="space-y-3 text-sm">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Exclusiva</span>
                                        <span className={`flex items-center gap-1 ${property.is_exclusive ? 'text-green-600' : 'text-gray-400'}`}>
                                            {property.is_exclusive ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                                            {property.is_exclusive ? 'Sí' : 'No'}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-500">Compartir comisión</span>
                                        <span className={`flex items-center gap-1 ${property.shared_commission ? 'text-green-600' : 'text-gray-400'}`}>
                                            {property.shared_commission ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
                                            {property.shared_commission ? 'Sí' : 'No'}
                                        </span>
                                    </div>
                                    {property.commission_percentage !== null && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">Comisión</span>
                                            <span className="font-medium text-gray-900">{property.commission_percentage}%</span>
                                        </div>
                                    )}
                                    {property.shared_commission && property.commission_split_percentage !== null && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-500">Split comisión</span>
                                            <span className="font-medium text-gray-900">{property.commission_split_percentage}%</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Metadata */}
                        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                            <h3 className="font-semibold text-gray-900 mb-4">Información</h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Publicada</span>
                                    <span className="text-gray-900">{formatDate(property.created_at)}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500">Actualizada</span>
                                    <span className="text-gray-900">{formatDate(property.updated_at)}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteModalOpen(false)} />
                    <div className="relative bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Eliminar Propiedad</h3>
                        <p className="text-gray-600 mb-6">
                            ¿Estás seguro de que deseas eliminar &quot;{property.title}&quot;? Esta acción no se puede deshacer.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setDeleteModalOpen(false)}
                                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
}
