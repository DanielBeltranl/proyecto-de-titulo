import { z } from "zod";

const onlyLettersRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/;
const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

export const userInfoSchema = z.object({
    nombre: z.string()
        .min(1, "El nombre es obligatorio")
        .regex(onlyLettersRegex, "El nombre no puede tener números, espacios ni caracteres especiales")
        .trim(),

    apellidoP: z.string()
        .min(1, "Apellido Paterno obligatorio")
        .regex(onlyLettersRegex, "Sin números, espacios ni caracteres especiales")
        .trim(),

    apellidoM: z.string()
        .min(1, "Apellido Materno obligatorio")
        .regex(onlyLettersRegex, "Sin números, espacios ni caracteres especiales")
        .trim(),

    correo: z.email("Formato de correo inválido").trim(),

    password: z.string()
        .min(8, "Mínimo 8 caracteres")
        .regex(/[A-Z]/, "Falta una mayúscula")
        .regex(/[0-9]/, "Falta un número")
        .regex(/^\S*$/, "No se permiten espacios"),

    confirmPassword: z.string().min(8, "Las contraseñas no coinciden en largo"),

    role: z.enum(['Jugador', 'Entrenador'], {
        message: "Debe elegir Jugador o Entrenador"
    }),

    fecha_nacimiento: z.string()
        .regex(dateRegex, "Formato incorrecto, debe ser YYYY-MM-DD")
        .refine((date) => {
            const birthDate = new Date(date);
            const today = new Date();
            const age = today.getFullYear() - birthDate.getFullYear();
            return age >= 16;
        }, "Debe ser mayor de 16 años"),

    profileImage: z.string().optional(),

    height: z.preprocess(
        (val) => {
            if (val === '' || val == null) return undefined;
            const n = typeof val === 'string' ? parseFloat(val) : Number(val);
            return isNaN(n) || n === 0 ? undefined : n;
        },
        z.number().positive("La altura debe ser mayor a 0").optional()
    ),

    weight: z.preprocess(
        (val) => {
            if (val === '' || val == null) return undefined;
            const n = typeof val === 'string' ? parseFloat(val) : Number(val);
            return isNaN(n) || n === 0 ? undefined : n;
        },
        z.number().positive("El peso debe ser mayor a 0").optional()
    ),
}).superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Las contraseñas no coinciden",
            path: ['confirmPassword'],
        });
    }
    if (data.role === 'Jugador') {
        if (!data.height) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "La altura es obligatoria y mayor a 0", path: ['height'] });
        }
        if (!data.weight) {
            ctx.addIssue({ code: z.ZodIssueCode.custom, message: "El peso es obligatorio y mayor a 0", path: ['weight'] });
        }
    }
});

export type UserInfo = z.infer<typeof userInfoSchema>;