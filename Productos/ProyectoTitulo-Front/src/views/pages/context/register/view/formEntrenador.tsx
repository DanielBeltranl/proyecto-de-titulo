import { type SubmitHandler, useForm } from "react-hook-form";
import { type UserInfo, userInfoSchema } from "../model/userDataValidator.ts";
import styles from "./formValidator.module.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

// Componentes personalizados
import { CustomInput } from "../components/customInput/customInput.tsx";
import { SubmitButtonComponent } from "../components/submitButtomComponent/submitButtomComponent.tsx";

// Servicio de conexión con Django
import { registrarUsuario } from "../../../../../services/usuarioService.js";

export const FormEntrenador = () => {
    const navigate = useNavigate();

    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<UserInfo>({
        resolver: zodResolver(userInfoSchema) as any,
        defaultValues: {
            nombre: "",
            apellidoP: "",
            apellidoM: "",
            correo: "",
            password: "",
            confirmPassword: "",
            role: "Entrenador",
            fecha_nacimiento: "",
            profileImage: ""
        }
    });

    const onSubmit: SubmitHandler<UserInfo> = async (data) => {
        try {
            // Preparar datos para Django - Entrenador
            const dataParaDjango = {
                nombre: data.nombre,
                apellidoPaterno: data.apellidoP,
                apellidoMaterno: data.apellidoM,
                correo: data.correo,
                password: data.password,
                rol: "Entrenador",
                fecha_nacimiento: data.fecha_nacimiento
                // NO enviar: sexo, altura, peso
            };

            const response = await registrarUsuario(dataParaDjango);            
            console.log("Entrenador creado:", response.data);
            
            alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
            navigate("/login");

        } catch (error: any) {
            const errorData = error.response?.data;
            console.error("Error en registro de Entrenador:", errorData);
            
            // Manejo de errores específicos por campo
            if (errorData?.correo) {
                alert("Ese correo ya está registrado.");
            } else if (errorData?.fecha_nacimiento) {
                alert("Fecha de nacimiento inválida.");
            } else if (errorData?.rol) {
                alert("Rol inválido. Por favor, intenta nuevamente.");
            } else {
                alert("Hubo un error en el registro. Revisa los datos e intenta nuevamente.");
            }
        }
    };

    return (
        <div className={styles.formContainer}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <h2 style={{ color: '#ffc174', fontSize: '1.5rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                        Registro de Entrenador
                    </h2>
                    <p style={{ color: '#a08e7a', fontSize: '0.875rem' }}>
                        Completa tus datos para comenzar a entrenar con TennisApp
                    </p>
                </div>
                
                <div className={styles.formGrid}>
                    <CustomInput name="nombre" control={control} label="Nombre" placeholder="Nombre" type="string" error={errors.nombre} />
                    <CustomInput name="apellidoP" control={control} label="Apellido paterno" placeholder="Apellido paterno" type="string" error={errors.apellidoP} />
                </div>

                <div className={styles.formGrid}>
                    <CustomInput name="apellidoM" control={control} label="Apellido Materno" placeholder="Apellido materno" type="string" error={errors.apellidoM} />
                    <CustomInput name="correo" control={control} label="Correo" placeholder="Correo" type="email" error={errors.correo} />
                </div>

                <div className={styles.formGrid}>
                    <CustomInput name="password" control={control} label="Contraseña" placeholder="Contraseña" type="password" error={errors.password} />
                    <CustomInput name="confirmPassword" control={control} label="Repita su contraseña" placeholder="Repita su contraseña" type="password" error={errors.confirmPassword} />
                </div>

                <div className={styles.formGrid}>
                    <CustomInput name="fecha_nacimiento" control={control} label="Fecha de nacimiento" placeholder="YYYY-MM-DD" type="date" error={errors.fecha_nacimiento} />
                </div>

                <div className={styles.backButtonWrapper}>
                    <button
                        type="button"
                        className={styles.backButton}
                        onClick={() => window.history.back()}
                    >
                        ← Atrás
                    </button>
                    <div className={styles.submitWrapper}>
                        <SubmitButtonComponent 
                            text={isSubmitting ? "Registrando..." : "Registrarse como Entrenador"} 
                            onClick={handleSubmit(onSubmit)} 
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};
