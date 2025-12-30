-- GLOR CRM Database Schema
-- Created for Gloria & Anthony Morales - GLOR Bienes Raíces

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- CONTACTS TABLE
-- =====================================================
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic Information
  nombre_completo VARCHAR(255) NOT NULL,
  telefono VARCHAR(50) NOT NULL,
  email VARCHAR(255),
  empresa VARCHAR(255),
  direccion_actual TEXT,
  
  -- Classification
  etiqueta VARCHAR(50) NOT NULL CHECK (etiqueta IN ('Comprador', 'Inquilino', 'Vendedor', 'Inversionista', 'Propietario')),
  status VARCHAR(50) DEFAULT 'Activo' CHECK (status IN ('Activo', 'En proceso', 'Cerrado', 'Frío')),
  
  -- Important Dates
  fecha_cumpleanos DATE,
  fecha_aniversario DATE,
  
  -- Preferences & Requirements
  presupuesto_min DECIMAL(15, 2),
  presupuesto_max DECIMAL(15, 2),
  moneda VARCHAR(3) DEFAULT 'MXN' CHECK (moneda IN ('MXN', 'USD')),
  zona_interes TEXT,
  tipo_propiedad_buscando VARCHAR(100),
  tipo_financiamiento VARCHAR(100),
  timeline_compra VARCHAR(100),
  propiedades_que_tiene TEXT,
  
  -- Lead Source
  origen_lead VARCHAR(100) DEFAULT 'WhatsApp' CHECK (origen_lead IN ('Facebook', 'Instagram', 'WhatsApp', 'Referido', 'Website', 'Otro')),
  
  -- Notes
  notas TEXT,
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  
  -- Indexes
  CONSTRAINT unique_telefono UNIQUE(telefono)
);

CREATE INDEX idx_contacts_etiqueta ON contacts(etiqueta);
CREATE INDEX idx_contacts_status ON contacts(status);
CREATE INDEX idx_contacts_origen ON contacts(origen_lead);
CREATE INDEX idx_contacts_nombre ON contacts(nombre_completo);
CREATE INDEX idx_contacts_email ON contacts(email);
CREATE INDEX idx_contacts_deleted ON contacts(deleted_at);

-- =====================================================
-- ACTIVITIES TABLE
-- =====================================================
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES deals(id) ON DELETE SET NULL,
  
  -- Activity Details
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('Llamada', 'Email', 'WhatsApp', 'Reunión', 'Showing', 'Otro')),
  descripcion TEXT NOT NULL,
  resultado VARCHAR(50) CHECK (resultado IN ('Positivo', 'Neutral', 'Negativo', 'Cerrado')),
  
  -- Scheduling
  fecha_hora TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  proximo_seguimiento DATE,
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_activities_contact ON activities(contact_id);
CREATE INDEX idx_activities_deal ON activities(deal_id);
CREATE INDEX idx_activities_tipo ON activities(tipo);
CREATE INDEX idx_activities_fecha ON activities(fecha_hora);
CREATE INDEX idx_activities_seguimiento ON activities(proximo_seguimiento);

-- =====================================================
-- PROPERTIES TABLE
-- =====================================================
CREATE TABLE properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Basic Information
  direccion TEXT NOT NULL,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('Casa', 'Departamento', 'Terreno', 'Comercial', 'Otro')),
  operacion VARCHAR(50) NOT NULL CHECK (operacion IN ('Venta', 'Renta', 'Ambas')),
  
  -- Pricing
  precio DECIMAL(15, 2) NOT NULL,
  moneda VARCHAR(3) DEFAULT 'MXN' CHECK (moneda IN ('MXN', 'USD')),
  comision_porcentaje DECIMAL(5, 2) DEFAULT 5.00,
  
  -- Owner/Developer
  propietario_nombre VARCHAR(255) NOT NULL,
  propietario_telefono VARCHAR(50),
  propietario_email VARCHAR(255),
  
  -- Property Details
  recamaras INTEGER,
  banos DECIMAL(3, 1),
  m2_construccion DECIMAL(10, 2),
  m2_terreno DECIMAL(10, 2),
  descripcion TEXT,
  amenidades TEXT[], -- Array of amenities
  
  -- Media
  fotos TEXT[], -- Array of image URLs
  video_tour_url TEXT,
  planos TEXT[], -- Array of floor plan URLs
  
  -- External Listings
  easybroker_url TEXT,
  omnimls_url TEXT,
  
  -- Status
  status VARCHAR(50) DEFAULT 'Disponible' CHECK (status IN ('Disponible', 'Rentado', 'Vendido', 'Apartado')),
  fecha_disponibilidad DATE,
  
  -- Rental Contract Tracking
  contrato_vencimiento DATE,
  inquilino_actual UUID REFERENCES contacts(id),
  
  -- Metadata
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_properties_tipo ON properties(tipo);
CREATE INDEX idx_properties_operacion ON properties(operacion);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_vencimiento ON properties(contrato_vencimiento);
CREATE INDEX idx_properties_deleted ON properties(deleted_at);

-- =====================================================
-- DEALS TABLE
-- =====================================================
CREATE TABLE deals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE NOT NULL,
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  
  -- Deal Information
  titulo VARCHAR(255) NOT NULL,
  valor_estimado DECIMAL(15, 2),
  moneda VARCHAR(3) DEFAULT 'MXN',
  
  -- Pipeline Stage
  stage VARCHAR(50) DEFAULT 'Contacto Inicial' CHECK (stage IN (
    'Contacto Inicial',
    'Calificado',
    'Mostrando Propiedades',
    'Apartado',
    'Fecha de Firma',
    'Cerrado',
    'Perdido'
  )),
  stage_entered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Commission
  comision_porcentaje DECIMAL(5, 2) DEFAULT 5.00,
  comision_total DECIMAL(15, 2),
  split_con_broker BOOLEAN DEFAULT FALSE,
  comision_anthony DECIMAL(15, 2),
  comision_gloria DECIMAL(15, 2),
  
  -- Documents Checklist
  doc_contrato_firmado BOOLEAN DEFAULT FALSE,
  doc_identificacion BOOLEAN DEFAULT FALSE,
  doc_comprobante_ingresos BOOLEAN DEFAULT FALSE,
  doc_escrituras BOOLEAN DEFAULT FALSE,
  doc_avaluo BOOLEAN DEFAULT FALSE,
  
  -- Dates
  fecha_estimada_cierre DATE,
  fecha_cierre_real DATE,
  
  -- Metadata
  assigned_to UUID REFERENCES auth.users(id),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_deals_contact ON deals(contact_id);
CREATE INDEX idx_deals_property ON deals(property_id);
CREATE INDEX idx_deals_stage ON deals(stage);
CREATE INDEX idx_deals_assigned ON deals(assigned_to);

-- =====================================================
-- EMAIL TEMPLATES TABLE
-- =====================================================
CREATE TABLE email_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  nombre VARCHAR(100) NOT NULL UNIQUE,
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('Cumpleaños', 'Aniversario', 'Seguimiento', 'Renovación Renta')),
  
  asunto TEXT NOT NULL,
  cuerpo TEXT NOT NULL,
  
  -- Automation Settings
  activo BOOLEAN DEFAULT TRUE,
  hora_envio TIME DEFAULT '09:00:00',
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- EMAIL HISTORY TABLE
-- =====================================================
CREATE TABLE email_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  template_id UUID REFERENCES email_templates(id) ON DELETE SET NULL,
  
  asunto TEXT NOT NULL,
  cuerpo TEXT NOT NULL,
  destinatario_email VARCHAR(255) NOT NULL,
  
  -- Tracking
  enviado_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  abierto_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  
  -- Status
  status VARCHAR(50) DEFAULT 'Enviado' CHECK (status IN ('Enviado', 'Entregado', 'Abierto', 'Clicked', 'Rebotado', 'Error')),
  error_mensaje TEXT
);

CREATE INDEX idx_email_history_contact ON email_history(contact_id);
CREATE INDEX idx_email_history_template ON email_history(template_id);
CREATE INDEX idx_email_history_status ON email_history(status);

-- =====================================================
-- NOTIFICATIONS TABLE
-- =====================================================
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  tipo VARCHAR(50) NOT NULL CHECK (tipo IN ('Cumpleaños', 'Aniversario', 'Renovación Renta', 'Seguimiento Pendiente', 'Deal Estancado')),
  titulo VARCHAR(255) NOT NULL,
  mensaje TEXT NOT NULL,
  
  -- Related Entities
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  deal_id UUID REFERENCES deals(id) ON DELETE CASCADE,
  property_id UUID REFERENCES properties(id) ON DELETE CASCADE,
  
  -- Status
  leida BOOLEAN DEFAULT FALSE,
  leida_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_leida ON notifications(leida);
CREATE INDEX idx_notifications_created ON notifications(created_at);

-- =====================================================
-- ACTIVITY LOGS (Audit Trail)
-- =====================================================
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  user_id UUID REFERENCES auth.users(id),
  
  accion VARCHAR(100) NOT NULL,
  entidad VARCHAR(50) NOT NULL,
  entidad_id UUID,
  detalles JSONB,
  
  ip_address INET,
  user_agent TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_user ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_entidad ON activity_logs(entidad, entidad_id);
CREATE INDEX idx_activity_logs_created ON activity_logs(created_at);

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contacts_updated_at BEFORE UPDATE ON contacts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_activities_updated_at BEFORE UPDATE ON activities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_properties_updated_at BEFORE UPDATE ON properties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deals_updated_at BEFORE UPDATE ON deals
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_templates_updated_at BEFORE UPDATE ON email_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-calculate deal commissions
CREATE OR REPLACE FUNCTION calculate_deal_commission()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.valor_estimado IS NOT NULL AND NEW.comision_porcentaje IS NOT NULL THEN
        NEW.comision_total := NEW.valor_estimado * (NEW.comision_porcentaje / 100);
        
        IF NEW.split_con_broker THEN
            -- 50% split with broker first, then Anthony/Gloria split
            NEW.comision_anthony := (NEW.comision_total / 2) * 0.30;
            NEW.comision_gloria := (NEW.comision_total / 2) * 0.70;
        ELSE
            -- Direct 30/70 split
            NEW.comision_anthony := NEW.comision_total * 0.30;
            NEW.comision_gloria := NEW.comision_total * 0.70;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_deal_commission_trigger BEFORE INSERT OR UPDATE ON deals
    FOR EACH ROW EXECUTE FUNCTION calculate_deal_commission();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Policies: Allow authenticated users to access all data
-- (Gloria & Anthony can see everything)

CREATE POLICY "Users can view all contacts" ON contacts
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert contacts" ON contacts
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update contacts" ON contacts
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete contacts" ON contacts
    FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view all activities" ON activities
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert activities" ON activities
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update activities" ON activities
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete activities" ON activities
    FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view all properties" ON properties
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert properties" ON properties
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update properties" ON properties
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete properties" ON properties
    FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view all deals" ON deals
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can insert deals" ON deals
    FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Users can update deals" ON deals
    FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can delete deals" ON deals
    FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view all email templates" ON email_templates
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can manage email templates" ON email_templates
    FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view all email history" ON email_history
    FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can view their notifications" ON notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their notifications" ON notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view all activity logs" ON activity_logs
    FOR SELECT USING (auth.role() = 'authenticated');

-- =====================================================
-- SEED DATA: Default Email Templates
-- =====================================================

INSERT INTO email_templates (nombre, tipo, asunto, cuerpo) VALUES
('Cumpleaños Default', 'Cumpleaños', '¡Feliz cumpleaños {{nombre}}! 🎉', 
'Hola {{nombre}},

¡Feliz cumpleaños! 🎂🎉

Desde GLOR Bienes Raíces queremos desearte un día lleno de alegría y éxitos. Gracias por confiar en nosotros.

¡Que tengas un excelente día!

Con cariño,
Gloria Morales
GLOR Bienes Raíces'),

('Aniversario Default', 'Aniversario', '¡Feliz aniversario de tu hogar! 🏠',
'Hola {{nombre}},

¡Felicidades! Hoy celebramos un año más desde que encontraste tu hogar ideal con nosotros. 🏠✨

Ha sido un placer acompañarte en este importante paso de tu vida. Esperamos que tu nuevo hogar siga llenándose de felicidad y hermosos recuerdos.

Si necesitas algo, siempre estamos aquí para ti.

Con cariño,
Gloria Morales
GLOR Bienes Raíces'),

('Seguimiento 90 días', 'Seguimiento', '{{nombre}}, ¿seguimos en contacto?',
'Hola {{nombre}},

Hace un tiempo hablamos sobre tus planes inmobiliarios y quería saber cómo van las cosas.

En GLOR Bienes Raíces siempre estamos buscando las mejores oportunidades para nuestros clientes. ¿Te gustaría que revisáramos juntos las opciones actuales en el mercado?

Quedo al pendiente de tu respuesta.

Saludos,
Gloria Morales
GLOR Bienes Raíces'),

('Renovación Renta 60 días', 'Renovación Renta', 'Tu contrato vence en 60 días - Opciones de renovación',
'Hola {{nombre}},

Te escribo para recordarte que tu contrato de renta en {{propiedad}} vence en aproximadamente 60 días.

Opciones que tienes:
1️⃣ Renovar tu contrato actual
2️⃣ Explorar otras propiedades disponibles
3️⃣ Buscar una propiedad para compra

Me encantaría ayudarte a encontrar la mejor solución. ¿Cuándo podemos hablar?

Saludos,
Gloria Morales
GLOR Bienes Raíces');

-- =====================================================
-- VIEWS FOR ANALYTICS
-- =====================================================

CREATE VIEW dashboard_metrics AS
SELECT
    (SELECT COUNT(*) FROM contacts WHERE deleted_at IS NULL) as total_contactos,
    (SELECT COUNT(*) FROM deals WHERE stage NOT IN ('Cerrado', 'Perdido')) as deals_activos,
    (SELECT COALESCE(SUM(valor_estimado), 0) FROM deals WHERE stage = 'Cerrado' AND DATE_TRUNC('month', fecha_cierre_real) = DATE_TRUNC('month', CURRENT_DATE)) as revenue_mes,
    (SELECT COUNT(*) FROM activities WHERE proximo_seguimiento < CURRENT_DATE AND proximo_seguimiento IS NOT NULL) as seguimientos_pendientes;

CREATE VIEW pipeline_summary AS
SELECT
    stage,
    COUNT(*) as deal_count,
    COALESCE(SUM(valor_estimado), 0) as total_value,
    ROUND(AVG(EXTRACT(DAY FROM (NOW() - stage_entered_at)))) as avg_days_in_stage
FROM deals
WHERE stage NOT IN ('Cerrado', 'Perdido')
GROUP BY stage
ORDER BY 
    CASE stage
        WHEN 'Contacto Inicial' THEN 1
        WHEN 'Calificado' THEN 2
        WHEN 'Mostrando Propiedades' THEN 3
        WHEN 'Apartado' THEN 4
        WHEN 'Fecha de Firma' THEN 5
    END;

CREATE VIEW upcoming_events AS
SELECT
    'Cumpleaños' as tipo,
    id as contact_id,
    nombre_completo,
    fecha_cumpleanos as fecha,
    (fecha_cumpleanos - CURRENT_DATE) as dias_hasta
FROM contacts
WHERE fecha_cumpleanos BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
    AND deleted_at IS NULL
UNION ALL
SELECT
    'Aniversario' as tipo,
    id as contact_id,
    nombre_completo,
    fecha_aniversario as fecha,
    (fecha_aniversario - CURRENT_DATE) as dias_hasta
FROM contacts
WHERE fecha_aniversario BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '30 days'
    AND deleted_at IS NULL
UNION ALL
SELECT
    'Renovación Renta' as tipo,
    p.inquilino_actual as contact_id,
    c.nombre_completo,
    p.contrato_vencimiento as fecha,
    (p.contrato_vencimiento - CURRENT_DATE) as dias_hasta
FROM properties p
JOIN contacts c ON p.inquilino_actual = c.id
WHERE p.contrato_vencimiento BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '60 days'
    AND p.status = 'Rentado'
    AND p.deleted_at IS NULL
ORDER BY dias_hasta ASC;
