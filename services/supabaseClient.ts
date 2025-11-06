// En un proyecto real, estas variables vendrían de un archivo .env
// y no deberían estar hardcodeadas.
const SUPABASE_URL = 'https://zezkwpvxldwxjwsthfmc.supabase.co'; // Esta URL parece correcta para tu proyecto.

// ============================= ¡ACCIÓN REQUERIDA! ===============================
//
// Pega tu clave "anon" (pública) de Supabase aquí abajo.
//
// CÓMO OBTENERLA:
// 1. Ve a la página de "API Settings" de tu proyecto en Supabase (la de tu captura de pantalla).
// 2. DESPLÁZATE HACIA ABAJO (haz scroll).
// 3. Busca la sección "Project API keys".
// 4. Copia la clave que dice "anon" y "public".
//
// =================================================================================
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inplemt3cHZ4bGR3eGp3c3RoZm1jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIzNDI3NjYsImV4cCI6MjA3NzkxODc2Nn0.cuFxot5x-6Za90nPjql1292iZV0GrEH0oLpcRO8X4Ec'; // <-- ¡REEMPLAZA ESTO!

// La librería de Supabase se carga desde el CDN en index.html
// por lo que 'supabase' estará disponible en el objeto window.
const { createClient } = (window as any).supabase;

// Verificación de configuración de Supabase
if (!SUPABASE_URL || !SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.includes('Pega_aqui')) {
    const warningBanner = document.getElementById('supabase-warning');
    if (warningBanner) {
        warningBanner.style.display = 'block';
    }
    console.error("Error Crítico: Las credenciales de Supabase no están configuradas en services/supabaseClient.ts. La aplicación no funcionará correctamente.");
}


export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);