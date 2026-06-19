import { Controller, type Control, type FieldError } from "react-hook-form";
import styles from "./roleButtomComponent.module.css";
import type { UserInfo } from "../../model/userDataValidator.ts";

interface RoleOption {
    id: 'Entrenador' | 'Amateur' | 'Semi-Pro' | 'Profesional';
    label: string;
    icon: string;
}

const ROLES: RoleOption[] = [
    { id: 'Entrenador', label: 'Entrenador', icon: 'school' },
    { id: 'Amateur', label: 'Amateur', icon: 'sports_tennis' },
    { id: 'Semi-Pro', label: 'Semi-Pro', icon: 'military_tech' },
    { id: 'Profesional', label: 'Profesional', icon: 'workspace_premium' },
];

interface RoleSelectorProps {
    name: keyof UserInfo;
    control: Control<UserInfo>;
    error?: FieldError;
    type: string
}

export const RoleSelector = ({ name, control, error }: RoleSelectorProps) => {
    return (
        <div className={styles.container}>
            <label className={styles.label}>
                Nivel de Perfil <span className={styles.required}>*</span>
            </label>

            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <div className={styles.grid}>
                        {ROLES.map((role) => {
                            const isSelected = field.value === role.id;

                            return (
                                <button
                                    key={role.id}
                                    type="button"
                                    onClick={() => field.onChange(role.id)}
                                    className={`${styles.roleButton} ${isSelected ? styles.selected : styles.unselected}`}
                                >
                                    <span
                                        className={`material-symbols-outlined ${styles.icon}`}
                                        style={isSelected ? { fontVariationSettings: "'FILL' 1" } : {}}
                                    >
                                        {role.icon}
                                    </span>
                                    <span className={styles.roleLabel}>{role.label}</span>
                                </button>
                            );
                        })}
                    </div>
                )}
            />
            {error && <span className={styles.errorMessage}>{error.message}</span>}
        </div>
    );
};