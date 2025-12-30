import DashboardLayout from '@/components/layout/DashboardLayout';
import { Users, TrendingUp, DollarSign, AlertCircle, Calendar, Home as HomeIcon } from 'lucide-react';

export default function DashboardPage() {
    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Page Header */}
                <div>
                    <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                    <p className="text-muted mt-1">Bienvenido al CRM de GLOR Bienes Raíces</p>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Contacts */}
                    <div className="bg-white rounded-xl p-6 shadow-md border border-border hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted">Total Contactos</p>
                                <p className="text-3xl font-bold text-foreground mt-2">2,200</p>
                                <p className="text-xs text-success mt-1">↑ 12% vs mes pasado</p>
                            </div>
                            <div className="h-12 w-12 bg-primary-100 rounded-lg flex items-center justify-center">
                                <Users className="h-6 w-6 text-primary-600" />
                            </div>
                        </div>
                    </div>

                    {/* Active Deals */}
                    <div className="bg-white rounded-xl p-6 shadow-md border border-border hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted">Deals Activos</p>
                                <p className="text-3xl font-bold text-foreground mt-2">18</p>
                                <p className="text-xs text-success mt-1">↑ 3 nuevos esta semana</p>
                            </div>
                            <div className="h-12 w-12 bg-success/10 rounded-lg flex items-center justify-center">
                                <TrendingUp className="h-6 w-6 text-success" />
                            </div>
                        </div>
                    </div>

                    {/* Revenue This Month */}
                    <div className="bg-white rounded-xl p-6 shadow-md border border-border hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted">Revenue MTD</p>
                                <p className="text-3xl font-bold text-foreground mt-2">$125K</p>
                                <p className="text-xs text-muted mt-1">MXN · Diciembre 2025</p>
                            </div>
                            <div className="h-12 w-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                                <DollarSign className="h-6 w-6 text-secondary-600" />
                            </div>
                        </div>
                    </div>

                    {/* Pending Follow-ups */}
                    <div className="bg-white rounded-xl p-6 shadow-md border border-border hover:shadow-lg transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-muted">Seguimientos Pendientes</p>
                                <p className="text-3xl font-bold text-danger mt-2">7</p>
                                <p className="text-xs text-danger mt-1">⚠️ Requieren atención</p>
                            </div>
                            <div className="h-12 w-12 bg-danger/10 rounded-lg flex items-center justify-center">
                                <AlertCircle className="h-6 w-6 text-danger" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Middle Row: Activities & Events */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Today's Activities */}
                    <div className="bg-white rounded-xl p-6 shadow-md border border-border">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-foreground">Actividades de Hoy</h2>
                            <Calendar className="h-5 w-5 text-muted" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-background rounded-lg">
                                <div className="h-2 w-2 bg-success rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-foreground">Llamada con Juan Pérez</p>
                                    <p className="text-xs text-muted mt-1">10:30 AM · Seguimiento propiedad</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-background rounded-lg">
                                <div className="h-2 w-2 bg-primary-500 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-foreground">Showing en Playa del Carmen</p>
                                    <p className="text-xs text-muted mt-1">2:00 PM · María González</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-background rounded-lg">
                                <div className="h-2 w-2 bg-secondary-500 rounded-full mt-2"></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-foreground">Reunión cierre</p>
                                    <p className="text-xs text-muted mt-1">4:00 PM · Casa Tulum</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Upcoming Birthdays */}
                    <div className="bg-white rounded-xl p-6 shadow-md border border-border">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-foreground">Cumpleaños (7 días)</h2>
                            <span className="text-xs bg-secondary-100 text-secondary-800 px-2 py-1 rounded-full font-medium">
                                5 próximos
                            </span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                                <div>
                                    <p className="text-sm font-medium text-foreground">Carlos Ruiz</p>
                                    <p className="text-xs text-muted">31 de Diciembre</p>
                                </div>
                                <span className="text-xs text-success font-medium">Mañana</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                                <div>
                                    <p className="text-sm font-medium text-foreground">Ana Martínez</p>
                                    <p className="text-xs text-muted">2 de Enero</p>
                                </div>
                                <span className="text-xs text-muted font-medium">En 3 días</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-background rounded-lg">
                                <div>
                                    <p className="text-sm font-medium text-foreground">Roberto Silva</p>
                                    <p className="text-xs text-muted">5 de Enero</p>
                                </div>
                                <span className="text-xs text-muted font-medium">En 6 días</span>
                            </div>
                        </div>
                    </div>

                    {/* Rent Renewals */}
                    <div className="bg-white rounded-xl p-6 shadow-md border border-border">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-foreground">Renovaciones Renta</h2>
                            <HomeIcon className="h-5 w-5 text-muted" />
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-start gap-3 p-3 bg-warning/10 rounded-lg border border-warning/30">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-foreground">Depto. Playa del Carmen</p>
                                    <p className="text-xs text-muted mt-1">Ana López · Vence en 15 días</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-background rounded-lg">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-foreground">Casa Tulum</p>
                                    <p className="text-xs text-muted mt-1">Jorge Díaz · Vence en 45 días</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 bg-background rounded-lg">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-foreground">Local Comercial Centro</p>
                                    <p className="text-xs text-muted mt-1">Empresa XYZ · Vence en 58 días</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Row: Pipeline & Recent Contacts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Deal Pipeline */}
                    <div className="bg-white rounded-xl p-6 shadow-md border border-border">
                        <h2 className="text-lg font-semibold text-foreground mb-4">Pipeline de Ventas</h2>
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-foreground">Contacto Inicial</span>
                                    <span className="text-sm font-semibold text-primary-600">12</span>
                                </div>
                                <div className="w-full bg-background rounded-full h-2">
                                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-foreground">Calificado</span>
                                    <span className="text-sm font-semibold text-primary-600">8</span>
                                </div>
                                <div className="w-full bg-background rounded-full h-2">
                                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: '40%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-foreground">Mostrando Propiedades</span>
                                    <span className="text-sm font-semibold text-secondary-600">5</span>
                                </div>
                                <div className="w-full bg-background rounded-full h-2">
                                    <div className="bg-secondary-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-foreground">Apartado</span>
                                    <span className="text-sm font-semibold text-success">3</span>
                                </div>
                                <div className="w-full bg-background rounded-full h-2">
                                    <div className="bg-success h-2 rounded-full" style={{ width: '15%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recent Contacts */}
                    <div className="bg-white rounded-xl p-6 shadow-md border border-border">
                        <h2 className="text-lg font-semibold text-foreground mb-4">Contactos Recientes</h2>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-primary-50 transition-colors cursor-pointer">
                                <div className="h-10 w-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-white font-bold">
                                    MP
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-foreground">María Pérez</p>
                                    <p className="text-xs text-muted">Comprador · Hace 2 horas</p>
                                </div>
                                <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full font-medium">
                                    Activo
                                </span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-primary-50 transition-colors cursor-pointer">
                                <div className="h-10 w-10 bg-gradient-to-br from-secondary-500 to-secondary-700 rounded-full flex items-center justify-center text-white font-bold">
                                    JL
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-foreground">Jorge López</p>
                                    <p className="text-xs text-muted">Inversionista · Hace 5 horas</p>
                                </div>
                                <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full font-medium">
                                    Activo
                                </span>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-background rounded-lg hover:bg-primary-50 transition-colors cursor-pointer">
                                <div className="h-10 w-10 bg-gradient-to-br from-primary-600 to-secondary-500 rounded-full flex items-center justify-center text-white font-bold">
                                    CM
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-foreground">Carla Mendez</p>
                                    <p className="text-xs text-muted">Vendedor · Ayer</p>
                                </div>
                                <span className="text-xs bg-warning/10 text-warning px-2 py-1 rounded-full font-medium">
                                    En proceso
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
