import { z } from "zod";

// Validación para login - más simple que registro
export const loginSchema = z.object({
    email: z.email("Por favor ingresa un correo válido").trim(),
    password: z.string()
        .min(1, "La contraseña es requerida")
        .min(6, "La contraseña debe tener al menos 8 caracteres"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Función auxiliar para validar
export const validateLoginForm = (data: unknown) => {
    try {
        return loginSchema.parse(data);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                errors: error.flatten().fieldErrors,
                success: false,
            };
        }
        throw error;
    }
};