'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/lib/supabase/client';
import {
    Property,
    PropertyFormData,
    DEFAULT_PROPERTY_FORM,
    PROPERTY_TYPE_LABELS,
    OPERATION_TYPE_LABELS,
    PROPERTY_STATUS_LABELS,
    AMENITIES_OPTIONS,
    MEXICO_STATES,
    PropertyType,
    OperationType,
    PropertyStatus,
} from '@/types/property';
import { ArrowLeft, ArrowRight, Save, Check, Home, DollarSign, Ruler, MapPin, Grid3X3, Users, Image } from 'lucide-react';

const STEPS = [
    { id: 1, title: 'Información Básica', icon: Home },
    { id: 2, title: 'Precios', icon: DollarSign },
    { id: 3, title: 'Características', icon: Ruler },
    { id: 4, title: 'Ubicación', icon: MapPin },
    { id: 5, title: 'Amenidades', icon: Grid3X3 },
    { id: 6, title: 'Colaboración', icon: Users },
    { id: 7, title: 'Imágenes', icon: Image },
];

export default function EditPropertyPage() {
    const router = useRouter();
    const params = useParams();
    const propertyId = params.id as string;

    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<PropertyFormData>(DEFAULT_PROPERTY_FORM);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchProperty();
    }, [propertyId]);

    const fetchProperty = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('properties')
                .select('*')
                .eq('id', propertyId)
                .single();

            if (error) throw error;

            if (data) {
                setFormData({
                    title: data.title || '',
                    property_type: data.property_type,
                    operation_type: data.operation_type,
                    description: data.description || '',
                    status: data.status,
                    price_mxn: data.price_mxn?.toString() || '',
                    price_usd: data.price_usd?.toString() || '',
                    show_price: data.show_price ?? true,
                    commission_percentage: data.commission_percentage?.toString() || '',
                    bedrooms: data.bedrooms?.toString() || '',
                    bathrooms: data.bathrooms?.toString() || '',
                    half_bathrooms: data.half_bathrooms?.toString() || '',
                    parking_spaces: data.parking_spaces?.toString() || '',
                    construction_m2: data.construction_m2?.toString() || '',
                    land_m2: data.land_m2?.toString() || '',
                    year_built: data.year_built?.toString() || '',
                    country: data.country || 'México',
                    state: data.state || '',
                    city: data.city || '',
                    neighborhood: data.neighborhood || '',
                    street: data.street || '',
                    postal_code: data.postal_code || '',
                    show_exact_location: data.show_exact_location ?? false,
                    amenities: data.amenities || [],
                    is_exclusive: data.is_exclusive ?? false,
                    shared_commission: data.shared_commission ?? true,
                    commission_split_percentage: data.commission_split_percentage?.toString() || '50',
                    images: data.images || [],
                    video_url: data.video_url || '',
                    internal_key: data.internal_key || '',
                });
            }
        } catch (error: any) {
            console.error('Error fetching property:', error.message);
            setErrors({ fetch: 'Error al cargar la propiedad' });
        } finally {
            setLoading(false);
        }
    };

    const updateField = (field: keyof PropertyFormData, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const toggleAmenity = (amenity: string) => {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const validateStep = (step: number): boolean => {
        const newErrors: Record<string, string> = {};

        if (step === 1) {
            if (!formData.title.trim()) newErrors.title = 'El título es requerido';
        }
        if (step === 2) {
            if (!formData.price_mxn || parseFloat(formData.price_mxn) <= 0) {
                newErrors.price_mxn = 'El precio debe ser mayor a 0';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const nextStep = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
        }
    };

    const prevStep = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSubmit = async () => {
        if (!validateStep(currentStep)) return;

        setSaving(true);
        try {
            const propertyData = {
                title: formData.title,
                property_type: formData.property_type,
                operation_type: formData.operation_type,
                description: formData.description || null,
                status: formData.status,
                price_mxn: parseFloat(formData.price_mxn),
                price_usd: formData.price_usd ? parseFloat(formData.price_usd) : null,
                show_price: formData.show_price,
                commission_percentage: formData.commission_percentage ? parseFloat(formData.commission_percentage) : null,
                bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
                bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
                half_bathrooms: formData.half_bathrooms ? parseInt(formData.half_bathrooms) : null,
                parking_spaces: formData.parking_spaces ? parseInt(formData.parking_spaces) : null,
                construction_m2: formData.construction_m2 ? parseFloat(formData.construction_m2) : null,
                land_m2: formData.land_m2 ? parseFloat(formData.land_m2) : null,
                year_built: formData.year_built ? parseInt(formData.year_built) : null,
                country: formData.country,
                state: formData.state || null,
                city: formData.city || null,
                neighborhood: formData.neighborhood || null,
                street: formData.street || null,
                postal_code: formData.postal_code || null,
                show_exact_location: formData.show_exact_location,
                amenities: formData.amenities,
                is_exclusive: formData.is_exclusive,
                shared_commission: formData.shared_commission,
                commission_split_percentage: formData.commission_split_percentage ? parseFloat(formData.commission_split_percentage) : 50,
                images: formData.images,
                video_url: formData.video_url || null,
                internal_key: formData.internal_key || null,
            };

            const { error } = await supabase
                .from('properties')
                .update(propertyData)
                .eq('id', propertyId);

            if (error) throw error;

            setSuccessMessage('¡Propiedad actualizada exitosamente!');
            setTimeout(() => {
                router.push(`/propiedades/${propertyId}`);
            }, 1500);
        } catch (error: any) {
            console.error('Error updating property:', error);
            setErrors({ submit: error.message || 'Error al actualizar la propiedad' });
        } finally {
            setSaving(false);
        }
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">Información Básica</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título de la Propiedad *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => updateField('title', e.target.value)}
                                placeholder="Ej: Casa en Playa del Carmen con vista al mar"
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
                            />
                            {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipo de Propiedad *
                                </label>
                                <select
                                    value={formData.property_type}
                                    onChange={(e) => updateField('property_type', e.target.value as PropertyType)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tipo de Operación *
                                </label>
                                <select
                                    value={formData.operation_type}
                                    onChange={(e) => updateField('operation_type', e.target.value as OperationType)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    {Object.entries(OPERATION_TYPE_LABELS).map(([value, label]) => (
                                        <option key={value} value={value}>{label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Estado de la Propiedad
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => updateField('status', e.target.value as PropertyStatus)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {Object.entries(PROPERTY_STATUS_LABELS).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => updateField('description', e.target.value)}
                                rows={5}
                                placeholder="Describe las características y ventajas de la propiedad..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Clave Interna (opcional)
                            </label>
                            <input
                                type="text"
                                value={formData.internal_key}
                                onChange={(e) => updateField('internal_key', e.target.value)}
                                placeholder="Ej: GLR-001"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">Precios y Comisiones</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Precio MXN *
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        value={formData.price_mxn}
                                        onChange={(e) => updateField('price_mxn', e.target.value)}
                                        placeholder="0"
                                        min="0"
                                        className={`w-full pl-8 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${errors.price_mxn ? 'border-red-500' : 'border-gray-300'}`}
                                    />
                                </div>
                                {errors.price_mxn && <p className="mt-1 text-sm text-red-500">{errors.price_mxn}</p>}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Precio USD (opcional)
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        value={formData.price_usd}
                                        onChange={(e) => updateField('price_usd', e.target.value)}
                                        placeholder="0"
                                        min="0"
                                        className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="show_price"
                                checked={formData.show_price}
                                onChange={(e) => updateField('show_price', e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="show_price" className="text-sm text-gray-700">
                                Mostrar precio públicamente
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Comisión (%)
                            </label>
                            <input
                                type="number"
                                value={formData.commission_percentage}
                                onChange={(e) => updateField('commission_percentage', e.target.value)}
                                placeholder="0"
                                min="0"
                                max="100"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">Características</h3>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Recámaras</label>
                                <input
                                    type="number"
                                    value={formData.bedrooms}
                                    onChange={(e) => updateField('bedrooms', e.target.value)}
                                    min="0"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Baños Completos</label>
                                <input
                                    type="number"
                                    value={formData.bathrooms}
                                    onChange={(e) => updateField('bathrooms', e.target.value)}
                                    min="0"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Medios Baños</label>
                                <input
                                    type="number"
                                    value={formData.half_bathrooms}
                                    onChange={(e) => updateField('half_bathrooms', e.target.value)}
                                    min="0"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Estacionamientos</label>
                                <input
                                    type="number"
                                    value={formData.parking_spaces}
                                    onChange={(e) => updateField('parking_spaces', e.target.value)}
                                    min="0"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">m² Construcción</label>
                                <input
                                    type="number"
                                    value={formData.construction_m2}
                                    onChange={(e) => updateField('construction_m2', e.target.value)}
                                    min="0"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">m² Terreno</label>
                                <input
                                    type="number"
                                    value={formData.land_m2}
                                    onChange={(e) => updateField('land_m2', e.target.value)}
                                    min="0"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Año de Construcción</label>
                                <input
                                    type="number"
                                    value={formData.year_built}
                                    onChange={(e) => updateField('year_built', e.target.value)}
                                    min="1800"
                                    max={new Date().getFullYear() + 5}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">Ubicación</h3>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
                                <input
                                    type="text"
                                    value={formData.country}
                                    onChange={(e) => updateField('country', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                                <select
                                    value={formData.state}
                                    onChange={(e) => updateField('state', e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                >
                                    <option value="">Seleccionar estado...</option>
                                    {MEXICO_STATES.map(state => (
                                        <option key={state} value={state}>{state}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => updateField('city', e.target.value)}
                                    placeholder="Ej: Playa del Carmen"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Colonia</label>
                                <input
                                    type="text"
                                    value={formData.neighborhood}
                                    onChange={(e) => updateField('neighborhood', e.target.value)}
                                    placeholder="Ej: Playacar"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Calle y Número</label>
                            <input
                                type="text"
                                value={formData.street}
                                onChange={(e) => updateField('street', e.target.value)}
                                placeholder="Ej: Av. 10 Norte #123"
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Código Postal</label>
                            <input
                                type="text"
                                value={formData.postal_code}
                                onChange={(e) => updateField('postal_code', e.target.value)}
                                placeholder="77710"
                                className="w-full max-w-xs px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <input
                                type="checkbox"
                                id="show_exact_location"
                                checked={formData.show_exact_location}
                                onChange={(e) => updateField('show_exact_location', e.target.checked)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor="show_exact_location" className="text-sm text-gray-700">
                                Mostrar ubicación exacta públicamente
                            </label>
                        </div>
                    </div>
                );

            case 5:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">Amenidades</h3>
                        <p className="text-sm text-gray-500">Selecciona las amenidades que incluye la propiedad</p>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {AMENITIES_OPTIONS.map((amenity) => (
                                <label
                                    key={amenity.value}
                                    className={`flex items-center gap-2 p-3 border rounded-lg cursor-pointer transition-colors ${formData.amenities.includes(amenity.value)
                                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                                            : 'border-gray-300 hover:border-gray-400'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={formData.amenities.includes(amenity.value)}
                                        onChange={() => toggleAmenity(amenity.value)}
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <span className="text-sm">{amenity.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                );

            case 6:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">Colaboración</h3>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="is_exclusive"
                                    checked={formData.is_exclusive}
                                    onChange={(e) => updateField('is_exclusive', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="is_exclusive" className="text-sm text-gray-700">
                                    Esta es una propiedad exclusiva
                                </label>
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="shared_commission"
                                    checked={formData.shared_commission}
                                    onChange={(e) => updateField('shared_commission', e.target.checked)}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor="shared_commission" className="text-sm text-gray-700">
                                    Compartir comisión con otros agentes
                                </label>
                            </div>

                            {formData.shared_commission && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Porcentaje de comisión compartida (%)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.commission_split_percentage}
                                        onChange={(e) => updateField('commission_split_percentage', e.target.value)}
                                        min="0"
                                        max="100"
                                        className="w-full max-w-xs px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                    <p className="mt-1 text-sm text-gray-500">
                                        Porcentaje que recibirá el agente colaborador
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 7:
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900">Imágenes y Video</h3>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                URL de Video (opcional)
                            </label>
                            <input
                                type="url"
                                value={formData.video_url}
                                onChange={(e) => updateField('video_url', e.target.value)}
                                placeholder="https://www.youtube.com/watch?v=..."
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>

                        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
                            <Image className="mx-auto h-12 w-12 text-gray-400" />
                            <h4 className="mt-4 text-lg font-medium text-gray-900">Subir imágenes</h4>
                            <p className="mt-2 text-sm text-gray-500">
                                La subida de imágenes se habilitará próximamente
                            </p>
                            <p className="mt-1 text-xs text-gray-400">
                                Formatos: JPG, PNG, WEBP • Máximo 10 imágenes
                            </p>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Editar Propiedad</h1>
                        <p className="text-gray-500">Paso {currentStep} de {STEPS.length}</p>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                    <div className="flex items-center justify-between overflow-x-auto gap-2">
                        {STEPS.map((step) => {
                            const StepIcon = step.icon;
                            const isActive = currentStep === step.id;
                            const isCompleted = currentStep > step.id;
                            return (
                                <button
                                    key={step.id}
                                    onClick={() => setCurrentStep(step.id)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors whitespace-nowrap ${isActive
                                            ? 'bg-blue-100 text-blue-700'
                                            : isCompleted
                                                ? 'text-green-600 hover:bg-green-50'
                                                : 'text-gray-400 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className={`h-6 w-6 flex items-center justify-center rounded-full ${isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-blue-600 text-white' : 'bg-gray-200'
                                        }`}>
                                        {isCompleted ? <Check className="h-4 w-4" /> : <StepIcon className="h-3 w-3" />}
                                    </div>
                                    <span className="hidden md:inline text-sm font-medium">{step.title}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Form Content */}
                <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
                    {errors.submit && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-600">{errors.submit}</p>
                        </div>
                    )}

                    {successMessage && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-600">{successMessage}</p>
                        </div>
                    )}

                    {renderStepContent()}
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ArrowLeft className="h-5 w-5" />
                        Anterior
                    </button>

                    {currentStep === STEPS.length ? (
                        <button
                            onClick={handleSubmit}
                            disabled={saving}
                            className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-md disabled:opacity-50"
                        >
                            {saving ? (
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            ) : (
                                <Save className="h-5 w-5" />
                            )}
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    ) : (
                        <button
                            onClick={nextStep}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                        >
                            Siguiente
                            <ArrowRight className="h-5 w-5" />
                        </button>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
