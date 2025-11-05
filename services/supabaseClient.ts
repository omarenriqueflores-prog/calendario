// En un proyecto real, estas variables vendrían de un archivo .env
// y no deberían estar hardcodeadas.
const SUPABASE_URL = 'https://zezkwpvxldwxjwsthfmc.supabase.co'; // REEMPLAZA CON TU URL
const SUPABASE_ANON_KEY = 'sb_publishable_3rc-4XwPZ9DA8mbXTDNqXA_oqQu4n2u'; // REEMPLAZA CON TU ANON KEY

// La librería de Supabase se carga desde el CDN en index.html
// por lo que 'supabase' estará disponible en el objeto window.
const { createClient } = (window as any).supabase;

// Verificación de configuración de Supabase
if (!SUPABASE_URL || !SUPABASE_ANON_KEY || SUPABASE_URL.includes('tu-proyecto-url')) {
    const warningBanner = document.getElementById('supabase-warning');
    if (warningBanner) {
        warningBanner.style.display = 'block';
    }
    console.error("Error Crítico: Las credenciales de Supabase no están configuradas en services/supabaseClient.ts. La aplicación no funcionará correctamente.");
}


export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);