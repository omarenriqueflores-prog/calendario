
import { supabase } from './supabaseClient';

/**
 * Verifica las credenciales de un administrador contra la base de datos.
 *
 * @param {string} usuario - El nombre de usuario del administrador.
 * @param {string} contrasena - La contraseña del administrador.
 * @returns {Promise<boolean>} - Resuelve a `true` si las credenciales son válidas.
 * @throws {Error} - Lanza un error si hay un problema con la consulta a la base de datos.
 */
export const loginAdmin = async (usuario: string, contrasena: string): Promise<boolean> => {
  console.log(`Intentando iniciar sesión como: ${usuario}`);

  // ADVERTENCIA: En una aplicación real, NUNCA guardes o compares contraseñas en texto plano.
  // Deberías usar un sistema de hashing como bcrypt. Esto es solo para fines de demostración.
  const { data, error } = await supabase
    .from('administradores') // Tu tabla de administradores
    .select('usuario')
    .eq('usuario', usuario)
    .eq('contrasena', contrasena)
    .single();

  // El código de error 'PGRST116' significa "No rows found", lo cual es un fallo de login esperado.
  // No queremos tratarlo como un error de la aplicación.
  if (error && error.code !== 'PGRST116') {
    console.error('Error en el proceso de login:', error);
    throw new Error('Ocurrió un error al intentar iniciar sesión.');
  }

  // Si 'data' no es nulo, significa que se encontró una coincidencia.
  const AcessoCorrecto = !!data;
  console.log(AcessoCorrecto ? 'Login exitoso.' : 'Credenciales incorrectas.');

  return AcessoCorrecto;
};
