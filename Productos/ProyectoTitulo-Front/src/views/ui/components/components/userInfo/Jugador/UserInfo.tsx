import { useState, useEffect } from "react";
import { AxiosError } from "axios";
import api from "../../../../../../api/axios";

import "./UserInfo.css";

interface UserData {
  id: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  fecha_nacimiento: string;
  altura: number;
  peso: number;
  sexo: string;
  nivelUsuario: string;
  correo: string;
  fotoPerfil?: string;
}

const calcularEdad = (fechaNacimiento: string): number => {
  const hoy = new Date();
  const nacimiento = new Date(fechaNacimiento);
  let edad = hoy.getFullYear() - nacimiento.getFullYear();
  const cumpleEsteAnio = new Date(hoy.getFullYear(), nacimiento.getMonth(), nacimiento.getDate());
  if (hoy < cumpleEsteAnio) edad--;
  return edad;
};

export const UserProfile = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Obtener el usuario del sessionStorage
        const usuarioJson = sessionStorage.getItem('usuario');
        if (!usuarioJson) {
          setError("No hay sesión activa");
          setIsLoading(false);
          return;
        }

        const usuario = JSON.parse(usuarioJson);
        const userId = usuario.id;

        // Hacer la llamada con el usuario autenticado
        const response = await api.get<UserData>(`/usuarios/${userId}/`);
        
        // Intentar obtener fotoPerfil en este orden:
        // 1. Del usuario en sessionStorage
        // 2. De sessionStorage.userProfileImage (guardada al registrarse)
        // 3. De la respuesta del API
        const fotoPerfil = usuario.fotoPerfil || sessionStorage.getItem('userProfileImage') || response.data.fotoPerfil;
        
        setUserData({
          ...response.data,
          fotoPerfil
        });
      } catch (err: unknown) {
        const errorMessage = 
          (err instanceof AxiosError) 
            ? err.response?.data?.message || err.message 
            : err instanceof Error 
            ? err.message
            : "Error al obtener la información del usuario";
        setError(errorMessage);
        console.error("Error fetching user data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (isLoading) return <div className="user-card">Cargando perfil...</div>;
  if (error) return <div className="user-card">Error: {error}</div>;
  if (!userData) return null;

  const { nombre, apellidoPaterno, fecha_nacimiento, peso, nivelUsuario, fotoPerfil } = userData;
  const edad = calcularEdad(fecha_nacimiento);

  return (
    <div className="user-card">
      {/* Avatar */}
      <div className="user-card__avatar">
        <div className="avatar-box">
          {fotoPerfil ? (
            <img 
              src={fotoPerfil} 
              alt={`${nombre} ${apellidoPaterno}`}
              className="avatar-image"
            />
          ) : (
            <span className="material-symbols-outlined">person</span>
          )}
        </div>
        {nivelUsuario === "Profesional" && <div className="pro-badge">🏆 PRO</div>}
      </div>

      {/* Name */}
      <h1 className="user-card__name">{nombre} {apellidoPaterno}</h1>

      {/* Stats */}
      <div className="user-card__stats">
        <div className="stat">
          <span className="stat__value">{edad}</span>
          <span className="stat__label">EDAD</span>
        </div>
    
        <div className="stat">
          <span className="stat__value">{peso}</span>
          <span className="stat__label">PESO</span>
        </div>
      </div>

      {/* Coach Info */}
      <div className="user-card__coach">
        {nivelUsuario === "Entrenador" ? (
          <>
            <span className="coach__name">{nombre} {apellidoPaterno}</span>
            <span className="coach__label">ENTRENADOR</span>
          </>
        ) : (
          <>
            <span className="coach__name">{nivelUsuario}</span>
            <span className="coach__label">ROL</span>
          </>
        )}
      </div>

    </div>
  );
};

export default UserProfile;