import { useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { type UserInfo, userInfoSchema } from "../model/userDataValidator.ts";
import styles from "./formValidator.module.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { CustomInput } from "../components/customInput/customInput.tsx";
import { SubmitButtonComponent } from "../components/submitButtomComponent/submitButtomComponent.tsx";
import { SuccessModal } from "../components/successModal/SuccessModal.tsx";
import { registrarUsuario } from "../../../../../services/usuarioService.js";

export const FormEntrenador = () => {
    const [apiError, setApiError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const { control, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<UserInfo>({
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
            profileImage: "",
        },
    });

    const onSubmit: SubmitHandler<UserInfo> = async (data) => {
        setApiError(null);
        try {
            const payload = {
                nombre: data.nombre,
                apellidoPaterno: data.apellidoP,
                apellidoMaterno: data.apellidoM,
                correo: data.correo,
                password: data.password,
                rol: "Entrenador",
                fecha_nacimiento: data.fecha_nacimiento,
            };

            const response = await registrarUsuario(payload);
            console.log("Entrenador creado:", response.data);
            setShowSuccess(true);
        } catch (error: any) {
            const errorData = error.response?.data;
            console.error("Error en registro de entrenador:", errorData);

            if (errorData?.correo) {
                setError("correo", {
                    message: Array.isArray(errorData.correo) ? errorData.correo[0] : errorData.correo,
                });
            } else if (errorData?.fecha_nacimiento) {
                setError("fecha_nacimiento", { message: "Fecha de nacimiento inválida." });
            } else {
                setApiError("Hubo un error en el registro. Revisá los datos e intentá nuevamente.");
            }
        }
    };

    return (
        <>
        <SuccessModal open={showSuccess} />
        <div className={styles.formContainer}>
            <div className={styles.formHeader}>
                <span className={styles.formHeaderBadge}>
                    <span className="material-symbols-outlined">school</span>
                    Entrenador
                </span>
                <h2 className={styles.formTitle}>Crea tu cuenta</h2>
                <p className={styles.formSubtitle}>
                    Completa tus datos para empezar a gestionar el rendimiento de tus jugadores en Double Fault.
                </p>
            </div>

            {apiError && (
                <div className={styles.errorBanner}>
                    <span className="material-symbols-outlined">error</span>
                    {apiError}
                </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
                <p className={styles.formSectionLabel}>Datos personales</p>
                <div className={styles.formGrid}>
                    <CustomInput name="nombre" control={control} label="Nombre" placeholder="Nombre" type="string" error={errors.nombre} />
                    <CustomInput name="apellidoP" control={control} label="Apellido paterno" placeholder="Apellido paterno" type="string" error={errors.apellidoP} />
                </div>
                <div className={styles.formGrid}>
                    <CustomInput name="apellidoM" control={control} label="Apellido materno" placeholder="Apellido materno" type="string" error={errors.apellidoM} />
                    <CustomInput name="fecha_nacimiento" control={control} label="Fecha de nacimiento" placeholder="YYYY-MM-DD" type="date" error={errors.fecha_nacimiento} />
                </div>

                <p className={styles.formSectionLabel}>Acceso</p>
                <div className={styles.formGrid}>
                    <CustomInput name="correo" control={control} label="Correo" placeholder="correo@ejemplo.com" type="email" error={errors.correo} />
                </div>
                <div className={styles.formGrid}>
                    <CustomInput name="password" control={control} label="Contraseña" placeholder="Contraseña" type="password" error={errors.password} />
                    <CustomInput name="confirmPassword" control={control} label="Repetir contraseña" placeholder="Repetir contraseña" type="password" error={errors.confirmPassword} />
                </div>

                <div className={styles.backButtonWrapper}>
                    <button type="button" className={styles.backButton} onClick={() => window.history.back()}>
                        ← Atrás
                    </button>
                    <div className={styles.submitWrapper}>
                        <SubmitButtonComponent
                            text={isSubmitting ? "Registrando..." : "Crear cuenta"}
                            onClick={handleSubmit(onSubmit)}
                        />
                    </div>
                </div>
            </form>
        </div>
        </>
    );
};
