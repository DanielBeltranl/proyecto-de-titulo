import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../../../../../../context/AuthContext';
import { useRoleNavigate } from '../../../../../../context/roleUtils';
import { loginUsuario, type LoginData } from '../../../../../../services/usuarioService';
import { loginSchema, type LoginFormData } from '../../model/LoginValidator';
import { z } from 'zod';
import Background from '../../../../../ui/components/components/background/Background';
import styles from './formLogin.module.css';

interface FormErrors {
    email?: string[];
    password?: string[];
    submit?: string;
}

export default function FormLogin() {
    const navigateToHome = useRoleNavigate();
    const { refreshAuth } = useAuth();

    const [formData, setFormData] = useState<LoginFormData>({ email: '', password: '' });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e: FormEvent<HTMLInputElement>) => {
        const { name, value } = e.currentTarget;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: undefined, submit: undefined }));
    };

    const validateForm = (): boolean => {
        try {
            loginSchema.parse(formData);
            setErrors({});
            return true;
        } catch (error) {
            if (error instanceof z.ZodError) {
                setErrors(error.flatten().fieldErrors);
            }
            return false;
        }
    };

    const handleLogin = async () => {
        if (!validateForm()) return;

        setIsLoading(true);
        setErrors({});

        try {
            const loginData: LoginData = {
                correo: formData.email,
                password: formData.password,
            };

            await loginUsuario(loginData);
            refreshAuth();
            navigateToHome({ replace: true });
        } catch (error: any) {
            const isNetworkError = error.message === 'Network Error';
            setErrors({
                submit: isNetworkError
                    ? 'Error de conexión. Intenta nuevamente.'
                    : 'La contraseña o el email son erróneos.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Background>
            <div className={styles.loginContainer}>
                <div className={styles.formContainer}>
                    <h1 className={styles.title}>Iniciar Sesión</h1>

                    <div>
                        <div className={styles.formGroup}>
                            <label htmlFor="email" className={styles.label}>
                                Correo Electrónico
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="tu@correo.com"
                                className={`${styles.input} ${errors.email ? styles.inputError : ''}`}
                                disabled={isLoading}
                                autoComplete="email"
                            />
                            {errors.email && (
                                <p className={styles.errorText}>{errors.email[0]}</p>
                            )}
                        </div>

                        <div className={styles.formGroup}>
                            <label htmlFor="password" className={styles.label}>
                                Contraseña
                            </label>
                            <div className={styles.passwordContainer}>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Ingresa tu contraseña"
                                    className={`${styles.input} ${errors.password ? styles.inputError : ''}`}
                                    disabled={isLoading}
                                    autoComplete="current-password"
                                />
                                <button
                                    type="button"
                                    className={styles.togglePassword}
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                    title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                                >
                                    {showPassword ? '👁️' : '👁️‍🗨️'}
                                </button>
                            </div>
                            {errors.password && (
                                <p className={styles.errorText}>{errors.password[0]}</p>
                            )}
                        </div>

                        <button
                            type="button"
                            className={styles.submitButton}
                            onClick={handleLogin}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </button>

                        {errors.submit && (
                            <div className={styles.errorAlert}>
                                <span className={styles.errorIcon}>⚠</span>
                                {errors.submit}
                            </div>
                        )}
                    </div>

                    <div className={styles.footerLinks}>
                        <a href="/register" className={styles.link}>
                            Registrarse
                        </a>
                    </div>
                </div>
            </div>
        </Background>
    );
}
