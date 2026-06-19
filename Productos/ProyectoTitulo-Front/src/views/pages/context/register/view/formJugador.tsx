import { type SubmitHandler, useForm } from "react-hook-form";
import { type UserInfo, userInfoSchema } from "../model/userDataValidator.ts";
import styles from "./formValidator.module.css";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Componentes personalizados
import { CustomInput } from "../components/customInput/customInput.tsx";
import { CustomInputTwo } from "../components/customInputTwo/customInputTwo.tsx";
import { SubmitButtonComponent } from "../components/submitButtomComponent/submitButtomComponent.tsx";
import { ProfilePhotoSelector } from "../components/profilePhotoSelector/profilePhotoSelector.tsx";

// Servicio de conexión con Django
import { registrarUsuario } from "../../../../../services/usuarioService.js";

const derivarSexo = (imageUrl?: string): string => {
    if (imageUrl === '/woman.png') return 'Femenino';
    return 'Masculino';
};

export const FormJugador = () => {
    const navigate = useNavigate();
    const [selectedProfileImage, setSelectedProfileImage] = useState<string>();

    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<UserInfo>({
        resolver: zodResolver(userInfoSchema) as any,
        defaultValues: {
            nombre: "",
            apellidoP: "",
            apellidoM: "",
            correo: "",
            password: "",
            confirmPassword: "",
            height: 0,
            weight: 0,
            role: "Jugador",
            fecha_nacimiento: "",
            profileImage: ""
        }
    });

    const onSubmit: SubmitHandler<UserInfo> = async (data) => {
        try {
            // Preparar datos para Django - Jugador
            const dataParaDjango = {
                nombre: data.nombre,
                apellidoPaterno: data.apellidoP,
                apellidoMaterno: data.apellidoM,
                correo: data.correo,
                password: data.password,
                rol: "Jugador",
                sexo: derivarSexo(selectedProfileImage),
                fecha_nacimiento: data.fecha_nacimiento,
                altura: Math.floor((data as any).height),
                peso: Math.floor((data as any).weight),
                fotoPerfil: selectedProfileImage
            };

            const response = await registrarUsuario(dataParaDjango);            
            console.log("Jugador creado:", response.data);
            
            // Guardar la foto seleccionada en sessionStorage
            if (selectedProfileImage) {
              sessionStorage.setItem('userProfileImage', selectedProfileImage);
            }
            
            alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
            navigate("/login");

        } catch (error: any) {
            const errorData = error.response?.data;
            console.error("Error en registro de Jugador:", errorData);
            
            // Manejo de errores específicos por campo
            if (errorData?.correo) {
                alert("Ese correo ya está registrado.");
            } else if (errorData?.altura) {
                alert("Ingresa una altura válida.");
            } else if (errorData?.peso) {
                alert("Ingresa un peso válido.");
            } else if (errorData?.fecha_nacimiento) {
                alert("Fecha de nacimiento inválida.");
            } else {
                alert("Hubo un error en el registro. Revisa los datos e intenta nuevamente.");
            }
        }
    };

    return (
        <div className={styles.formContainer}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <ProfilePhotoSelector 
                    onSelect={setSelectedProfileImage}
                    selectedImage={selectedProfileImage}
                />
                
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

                <section className={styles.metricsSection}>
                    <h3 className={styles.metricsTitle}>Información de rendimiento</h3>
                    <div className={styles.metricsGrid}>
                        <CustomInputTwo name="height" control={control} label="Altura (cm)" type="number" error={errors.height} />
                        <CustomInputTwo name="weight" control={control} label="Peso (kg)" type="number" error={errors.weight} />
                    </div>
                </section>

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
                            text={isSubmitting ? "Registrando..." : "Registrarse como Jugador"} 
                            onClick={handleSubmit(onSubmit)} 
                        />
                    </div>
                </div>
            </form>
        </div>
    );
};
