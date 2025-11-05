// En un proyecto real, estas variables vendrían de un archivo .env
// y no deberían estar hardcodeadas.
const SUPABASE_URL = 'https://tu-proyecto-url.supabase.co'; // REEMPLAZA CON TU URL
const SUPABASE_ANON_KEY = 'tu-anon-key'; // REEMPLAZA CON TU ANON KEY

// La librería de Supabase se carga desde el CDN en index.html
// por lo que 'supabase' estará disponible en el objeto window.
const { createClient } = (window as any).supabase;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || SUPABASE_URL.includes('tu-proyecto-url')) {
    console.warn("Advertencia: Las credenciales de Supabase no están configuradas. El guardado de turnos no funcionará. Reemplaza los valores en services/supabaseClient.ts");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
