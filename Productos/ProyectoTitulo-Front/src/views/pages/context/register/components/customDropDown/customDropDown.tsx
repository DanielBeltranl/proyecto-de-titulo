import { type Control, Controller, type FieldError, type Path } from "react-hook-form";
import styles from "./customDropDown.module.css"
import type { UserInfo } from "../../model/userDataValidator.ts";

interface CustomSelectProps {
    name: Path<UserInfo>;
    control: Control<UserInfo>;
    label: string;
    error?: FieldError;
    options: string[];
}

export const CustomDropDown = ({ name, control, label, error, options }: CustomSelectProps) => {
    return (
        <div className={styles.container}>
            <label className={styles.label}>{label}</label>

            <div className={styles.selectWrapper}>
                <Controller
                    name={name}
                    control={control}
                    render={({ field }) => (
                        <select
                            {...field}
                            className={`${styles.selectField} ${error ? styles.errorBorder : ""}`}
                        >
                            {options.map((option) => (
                                <option key={option} value={option} className={styles.optionItem}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    )}
                />
                {/* Flecha personalizada */}
                <span className={styles.arrowIcon}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="6 9 12 15 18 9"></polyline>
                    </svg>
                </span>
            </div>

            {error && <span className={styles.errorMessage}>{error.message}</span>}
        </div>
    );
};