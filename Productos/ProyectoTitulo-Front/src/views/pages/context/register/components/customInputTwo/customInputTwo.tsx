import {type Control, Controller, type FieldError} from "react-hook-form";
import styles from "./customInputTwo.module.css"
import type {UserInfo} from "../../model/userDataValidator.ts";

interface CustomInputTwoProps {
    name: any,
    control: Control<UserInfo>,
    label: string,
    type?: string,
    error?: FieldError,
    placeholder?: string,
}


export const CustomInputTwo = ({name, control, label, type, error, placeholder}: CustomInputTwoProps) => {

    return (
        <div className={styles.inputContainer}>
            <label className={styles.label}>
                {label} <span className={styles.required}>*</span>
            </label>
            <Controller  name={name}
                         control ={control}
                         render={({field})=>
                             <input
                                 {...field}
                                 id = {name}
                                 type = {type}
                                 className={`${styles.inputField} ${error ? styles.inputError : ''}`}

                                 name={name}
                                 placeholder={placeholder}
                             />
                         }
            />
            {error && <span className={styles.errorMessage}>{error.message}</span>}
        </div>

    )

}