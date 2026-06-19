import { type SubmitHandler, useForm } from "react-hook-form";
import { type UserInfo, userInfoSchema } from "../model/userDataValidator.ts";
import styles from "./formValidator.module.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import { CustomInput } from "../components/customInput/customInput.tsx";
import { CustomInputTwo } from "../components/customInputTwo/customInputTwo.tsx";
import { SubmitButtonComponent } from "../components/submitButtomComponent/submitButtomComponent.tsx";
import { ProfilePhotoSelector } from "../components/profilePhotoSelector/profilePhotoSelector.tsx";

import { registrarUsuario, enviarSolicitudCoaching } from "../../../../../services/usuarioService.js";
import type { EntrenadorResult } from "../../../../../services/usuarioService.ts";
import { EntrenadorSearch } from "../components/entrenadorSearch/EntrenadorSearch.tsx";

const derivarSexo = (imageUrl?: string): string => {
    if (imageUrl === '/woman.png') return 'Femenino';
    return 'Masculino';
};

export const FormValidator = () => {
    const navigate = useNavigate();
    const [selectedProfileImage, setSelectedProfileImage] = useState<string>();
    const [nivelBanner, setNivelBanner] = useState(false);
    const [selectedEntrenador, setSelectedEntrenador] = useState<EntrenadorResult | null>(null);

    const {
        control,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        setValue,
        setError,
    } = useForm<UserInfo>({
        resolver: zodResolver(userInfoSchema) as any,
        defaultValues: {
            nombre: "",
            apellidoP: "",
            apellidoM: "",
            correo: "",
            password: "",
            confirmPassword: "",
            fecha_nacimiento: "",
            profileImage: "",
            height: 0,
            weight: 0,
        } as any,
    });

    const role = watch("role") as "Jugador" | "Entrenador" | undefined;

    const handleSelectRole = (newRole: "Jugador" | "Entrenador") => {
        setValue("role", newRole);
    };

    const handleBack = () => {
        setValue("role", undefined as any);
    };

    const onSubmit: SubmitHandler<UserInfo> = async (data) => {
        try {
            const dataParaDjango: any = {
                nombre: data.nombre,
                apellidoPaterno: data.apellidoP,
                apellidoMaterno: data.apellidoM,
                correo: data.correo,
                password: data.password,
                rol: data.role,
                fecha_nacimiento: data.fecha_nacimiento,
            };

            if (data.role === "Jugador") {
                dataParaDjango.sexo = derivarSexo(selectedProfileImage);
                dataParaDjango.altura = Math.floor((data as any).height);
                dataParaDjango.peso = Math.floor((data as any).weight);
            }

            if (selectedProfileImage) {
                dataParaDjango.fotoPerfil = selectedProfileImage;
                sessionStorage.setItem("userProfileImage", selectedProfileImage);
            }

            const response = await registrarUsuario(dataParaDjango);
            console.log("Usuario creado:", response.data);

            // Guardar tokens para que la solicitud de coaching tenga autenticación
            sessionStorage.setItem("access_token", response.data.access);
            sessionStorage.setItem("refresh_token", response.data.refresh);

            if (selectedEntrenador) {
                try {
                    await enviarSolicitudCoaching(selectedEntrenador.id);
                    console.log("Solicitud enviada al entrenador:", selectedEntrenador.id);
                } catch (err) {
                    console.warn("No se pudo enviar la solicitud al entrenador:", err);
                }
            }

            if (response.data.usuario?.nivelUsuario === null) {
                setNivelBanner(true);
            } else {
                navigate("/login");
            }
        } catch (error: any) {
            const errorData = error.response?.data;
            console.error("Error de Django:", errorData);

            if (errorData?.correo) {
                setError("correo", {
                    message: Array.isArray(errorData.correo)
                        ? errorData.correo[0]
                        : errorData.correo,
                });
            }
            if (errorData?.altura) {
                setError("height" as any, { message: errorData.altura });
            }
            if (errorData?.peso) {
                setError("weight" as any, { message: errorData.peso });
            }
            if (errorData?.fecha_nacimiento) {
                setError("fecha_nacimiento", {
                    message: Array.isArray(errorData.fecha_nacimiento)
                        ? errorData.fecha_nacimiento[0]
                        : "Fecha de nacimiento inválida.",
                });
            }
        }
    };

    if (nivelBanner) {
        return (
            <div className={styles.formContainer}>
                <div className={styles.roleSelector}>
                    <div className={styles.roleHeader}>
                        <h2 className={styles.roleTitle}>Registro exitoso</h2>
                        <p className={styles.roleSubtitle}>
                            Tu entrenador aún no te ha asignado un nivel de juego.
                        </p>
                    </div>
                    <button
                        type="button"
                        className={styles.backButton}
                        onClick={() => navigate("/login")}
                    >
                        Ir al login
                    </button>
                </div>
            </div>
        );
    }

    if (!role) {
        return (
            <div className={styles.formContainer}>
                <div className={styles.roleSelector}>
                    <div className={styles.roleHeader}>
                        <h2 className={styles.roleTitle}>¿Qué tipo de usuario eres?</h2>
                        <p className={styles.roleSubtitle}>
                            Selecciona tu rol para continuar con el registro
                        </p>
                    </div>

                    <div className={styles.roleButtonsGrid}>
                        <button
                            className={styles.roleButton}
                            onClick={() => handleSelectRole("Jugador")}
                            type="button"
                        >
                            <span className={`${styles.roleIcon} material-symbols-outlined`}>
                                sports_tennis
                            </span>
                            <div className={styles.roleButtonText}>
                                <span className={styles.roleButtonLabel}>Soy Jugador</span>
                                <span className={styles.roleButtonDescription}>Competidor activo</span>
                            </div>
                        </button>

                        <button
                            className={styles.roleButton}
                            onClick={() => handleSelectRole("Entrenador")}
                            type="button"
                        >
                            <span className={`${styles.roleIcon} material-symbols-outlined`}>
                                school
                            </span>
                            <div className={styles.roleButtonText}>
                                <span className={styles.roleButtonLabel}>Soy Entrenador</span>
                                <span className={styles.roleButtonDescription}>Instructor profesional</span>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.formContainer}>
            <form onSubmit={handleSubmit(onSubmit)}>
                {role === "Jugador" && (
                    <ProfilePhotoSelector
                        onSelect={setSelectedProfileImage}
                        selectedImage={selectedProfileImage}
                    />
                )}

                <div className={styles.formGrid}>
                    <CustomInput
                        name="nombre"
                        control={control}
                        label="Nombre"
                        placeholder="Nombre"
                        type="string"
                        error={errors.nombre}
                    />
                    <CustomInput
                        name="apellidoP"
                        control={control}
                        label="Apellido paterno"
                        placeholder="Apellido paterno"
                        type="string"
                        error={errors.apellidoP}
                    />
                </div>

                <div className={styles.formGrid}>
                    <CustomInput
                        name="apellidoM"
                        control={control}
                        label="Apellido Materno"
                        placeholder="Apellido materno"
                        type="string"
                        error={errors.apellidoM}
                    />
                    <CustomInput
                        name="correo"
                        control={control}
                        label="Correo"
                        placeholder="Correo"
                        type="email"
                        error={errors.correo}
                    />
                </div>

                <div className={styles.formGrid}>
                    <CustomInput
                        name="password"
                        control={control}
                        label="Contraseña"
                        placeholder="Contraseña"
                        type="password"
                        error={errors.password}
                    />
                    <CustomInput
                        name="confirmPassword"
                        control={control}
                        label="Repita su contraseña"
                        placeholder="Repita su contraseña"
                        type="password"
                        error={errors.confirmPassword}
                    />
                </div>

                <div className={styles.formGrid}>
                    <CustomInput
                        name="fecha_nacimiento"
                        control={control}
                        label="Fecha de nacimiento"
                        placeholder="YYYY-MM-DD"
                        type="date"
                        error={errors.fecha_nacimiento}
                    />
                </div>

                {role === "Jugador" && (
                    <section className={styles.metricsSection}>
                        <h3 className={styles.metricsTitle}>Información de rendimiento</h3>
                        <div className={styles.metricsGrid}>
                            <CustomInputTwo
                                name="height"
                                control={control}
                                label="Altura (cm)"
                                type="number"
                                error={(errors as any).height}
                            />
                            <CustomInputTwo
                                name="weight"
                                control={control}
                                label="Peso (kg)"
                                type="number"
                                error={(errors as any).weight}
                            />
                        </div>
                    </section>
                )}

                {role === "Jugador" && (
                    <EntrenadorSearch
                        onSelect={setSelectedEntrenador}
                        selectedEntrenador={selectedEntrenador}
                        onClear={() => setSelectedEntrenador(null)}
                    />
                )}

                <div className={styles.backButtonWrapper}>
                    <button
                        type="button"
                        className={styles.backButton}
                        onClick={handleBack}
                    >
                        ← Atrás
                    </button>
                    <div className={styles.submitWrapper}>
                        <SubmitButtonComponent
                            text={isSubmitting ? "Registrando..." : "Registrarse"}
                            onClick={handleSubmit(onSubmit)}
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};
