'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { supabase } from '@/lib/supabase/client';
import {
    Property,
    PROPERTY_TYPE_LABELS,
    OPERATION_TYPE_LABELS,
    PROPERTY_STATUS_LABELS,
    PROPERTY_STATUS_COLORS,
    PropertyType,
    OperationType,
    PropertyStatus
} from '@/types/property';
import { Plus, Search, Edit, Trash2, Eye, Home, Building, MapPin, Bed, Bath, Car, Ruler } from 'lucide-react';

export default function PropertiesPage() {
    const router = useRouter();
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<PropertyStatus | 'all'>('all');
    const [typeFilter, setTypeFilter] = useState<PropertyType | 'all'>('all');
    const [operationFilter, setOperationFilter] = useState<OperationType | 'all'>('all');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        fetchProperties();
    }, []);

    const fetchProperties = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('properties')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            setProperties(data || []);
        } catch (error: any) {
            console.error('Error fetching properties:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!propertyToDelete) return;

        try {
            const { error } = await supabase
                .from('properties')
                .delete()
                .eq('id', propertyToDelete.id);

            if (error) throw error;

            setProperties(properties.filter(p => p.id !== propertyToDelete.id));
            setDeleteModalOpen(false);
            setPropertyToDelete(null);
        } catch (error: any) {
            console.error('Error deleting property:', error.message);
        }
    };

    const filteredProperties = properties.filter(property => {
        const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (property.city?.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (property.neighborhood?.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
        const matchesType = typeFilter === 'all' || property.property_type === typeFilter;
        const matchesOperation = operationFilter === 'all' || property.operation_type === operationFilter;
        return matchesSearch && matchesStatus && matchesType && matchesOperation;
    });

    const paginatedProperties = filteredProperties.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(price);
    };

    const getPropertyIcon = (type: PropertyType) => {
        switch (type) {
            case 'casa':
                return <Home className="h-5 w-5" />;
            default:
                return <Building className="h-5 w-5" />;
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Propiedades</h1>
                        <p className="text-gray-500 mt-1">Gestiona tu inventario de propiedades</p>
                    </div>
                    <button
                        onClick={() => router.push('/propiedades/nueva')}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-md"
                    >
                        <Plus className="h-5 w-5" />
                        Nueva Propiedad
                    </button>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Search */}
                        <div className="lg:col-span-2">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Buscar por título, ciudad o colonia..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Status Filter */}
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value as PropertyStatus | 'all')}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Todos los Estados</option>
                            {Object.entries(PROPERTY_STATUS_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>

                        {/* Type Filter */}
                        <select
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value as PropertyType | 'all')}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Todos los Tipos</option>
                            {Object.entries(PROPERTY_TYPE_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>

                        {/* Operation Filter */}
                        <select
                            value={operationFilter}
                            onChange={(e) => setOperationFilter(e.target.value as OperationType | 'all')}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="all">Todas las Operaciones</option>
                            {Object.entries(OPERATION_TYPE_LABELS).map(([value, label]) => (
                                <option key={value} value={value}>{label}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Properties Table */}
                <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                    ) : paginatedProperties.length === 0 ? (
                        <div className="text-center py-12">
                            <Building className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">No hay propiedades</h3>
                            <p className="mt-2 text-gray-500">Comienza agregando tu primera propiedad</p>
                            <button
                                onClick={() => router.push('/propiedades/nueva')}
                                className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                            >
                                <Plus className="h-5 w-5" />
                                Nueva Propiedad
                            </button>
                        </div>
                    ) : (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Propiedad
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tipo / Operación
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Precio
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Ubicación
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Características
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Estado
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Acciones
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {paginatedProperties.map((property) => (
                                            <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400 flex-shrink-0 overflow-hidden">
                                                            {property.images && property.images.length > 0 ? (
                                                                <img
                                                                    src={property.images[0]}
                                                                    alt={property.title}
                                                                    className="h-full w-full object-cover"
                                                                />
                                                            ) : (
                                                                getPropertyIcon(property.property_type)
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900 line-clamp-1">{property.title}</p>
                                                            {property.internal_key && (
                                                                <p className="text-xs text-gray-500">#{property.internal_key}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-medium text-gray-900">
                                                        {PROPERTY_TYPE_LABELS[property.property_type]}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {OPERATION_TYPE_LABELS[property.operation_type]}
                                                    </p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {property.show_price ? (
                                                        <p className="text-sm font-semibold text-gray-900">
                                                            {formatPrice(property.price_mxn)}
                                                        </p>
                                                    ) : (
                                                        <p className="text-sm text-gray-500 italic">Consultar precio</p>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1 text-sm text-gray-600">
                                                        <MapPin className="h-4 w-4 flex-shrink-0" />
                                                        <span className="line-clamp-1">
                                                            {[property.neighborhood, property.city, property.state]
                                                                .filter(Boolean)
                                                                .join(', ') || 'Sin ubicación'}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                                        {property.bedrooms !== null && (
                                                            <span className="flex items-center gap-1" title="Recámaras">
                                                                <Bed className="h-4 w-4" /> {property.bedrooms}
                                                            </span>
                                                        )}
                                                        {property.bathrooms !== null && (
                                                            <span className="flex items-center gap-1" title="Baños">
                                                                <Bath className="h-4 w-4" /> {property.bathrooms}
                                                            </span>
                                                        )}
                                                        {property.parking_spaces !== null && (
                                                            <span className="flex items-center gap-1" title="Estacionamientos">
                                                                <Car className="h-4 w-4" /> {property.parking_spaces}
                                                            </span>
                                                        )}
                                                        {property.construction_m2 !== null && (
                                                            <span className="flex items-center gap-1" title="m² construcción">
                                                                <Ruler className="h-4 w-4" /> {property.construction_m2}m²
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${PROPERTY_STATUS_COLORS[property.status]}`}>
                                                        {PROPERTY_STATUS_LABELS[property.status]}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => router.push(`/propiedades/${property.id}`)}
                                                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Ver"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => router.push(`/propiedades/${property.id}/editar`)}
                                                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Editar"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => {
                                                                setPropertyToDelete(property);
                                                                setDeleteModalOpen(true);
                                                            }}
                                                            className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                                    <p className="text-sm text-gray-500">
                                        Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, filteredProperties.length)} de {filteredProperties.length} propiedades
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Anterior
                                        </button>
                                        <span className="text-sm text-gray-700">
                                            Página {currentPage} de {totalPages}
                                        </span>
                                        <button
                                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                            disabled={currentPage === totalPages}
                                            className="px-3 py-1 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Siguiente
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {deleteModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setDeleteModalOpen(false)} />
                    <div className="relative bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Eliminar Propiedad</h3>
                        <p className="text-gray-600 mb-6">
                            ¿Estás seguro de que deseas eliminar &quot;{propertyToDelete?.title}&quot;? Esta acción no se puede deshacer.
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
