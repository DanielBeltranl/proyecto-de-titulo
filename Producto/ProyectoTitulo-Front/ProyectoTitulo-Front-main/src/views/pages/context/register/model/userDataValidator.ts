import {z} from "zod";

const onlyLettersRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ]+$/;

export const userInfoSchema = z.object({
    name: z.string()
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

    confirmPassword: z.string().min(8, "La contraseñas no coinciden en largo"),

    sex: z.enum(['Masculino', 'Femenino', 'Otro']),

    age: z.coerce.number().int().gt(0, "La edad debe ser mayor a 0"),

    height: z.coerce.number().gt(0, "La altura debe ser mayor a 0"),

    weight: z.coerce.number().gt(0, "El peso debe ser mayor a 0"),

    role: z.enum(['entrenador', 'amateur', 'semi-pro', 'pro'])
}).refine (data => data.password === data.password,{
    message: "La" +
        "contraseñas no coinciden",
    path: ['confirmPassword'],
});



export type UserInfo = z.infer<typeof userInfoSchema>;