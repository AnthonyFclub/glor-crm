import DashboardLayout from '@/components/layout/DashboardLayout';

export default function PipelinePage() {
    return (
        <DashboardLayout>
            <div>
                <h1 className="text-3xl font-bold text-foreground">Pipeline</h1>
                <p className="text-muted mt-2">Próximamente: Tablero Kanban de deals</p>
            </div>
        </DashboardLayout>
    );
}
