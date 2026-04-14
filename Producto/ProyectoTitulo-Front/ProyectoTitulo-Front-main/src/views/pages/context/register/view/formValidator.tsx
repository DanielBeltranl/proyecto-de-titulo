import {type SubmitHandler, useForm} from "react-hook-form";
import {type UserInfo, userInfoSchema} from "../model/userDataValidator.ts";
import styles from "./formValidator.module.css"
// @ts-ignore
import {zodResolver} from "@hookform/resolvers/zod/src";
import {CustomInput} from "../components/customInput/customInput.tsx";



export const FormValidator = () =>{
    const {control, handleSubmit, formState: {errors}} = useForm<UserInfo>({
        resolver: zodResolver(userInfoSchema),
        defaultValues:{
            name:"",
            apellidoP: "",
            apellidoM: "",
            correo:"",
            password:  "",
            confirmPassword: "",
        }

    })

    const onSubmit: SubmitHandler<UserInfo> = (data) =>{
        console.log("data", data)
    }

    return (

        <div className={`${styles.formContainer}` }>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={`${styles.formGrid}`}>
                    <CustomInput name={"name"} control={control} label={"Nombre"} placeholder={"Nombre"} type={"string"} error = {errors.name}/>
                    <CustomInput name={"apellidoP"} control={control} label={"Apellido paterno"} placeholder={"Apellido paterno"} type={"string"} error = {errors.apellidoP}/>
                </div>
                <div className={`${styles.formGrid}`}>
                    <CustomInput name={"apellidoM"} control={control} label={"Apellido Materno"} placeholder={"Apellido materno"} type={"string"} error = {errors.apellidoM}/>
                    <CustomInput name={"correo"} control={control} label={"Correo"} placeholder={"Correo"} type={"email"} error = {errors.correo}/>
                </div>
                <div className={`${styles.formGrid}`}>
                <CustomInput name={"password"} control={control} label={"Contraseña"} placeholder={"Contraseña"} type={"password"} error = {errors.password}/>
                <CustomInput name={"confirmPassword"} control={control} label={"Repita su contraseña"} placeholder={"Repita su contraseña"} type={"password"} error = {errors.confirmPassword}/>
                </div>

                <button type={"submit"}>Submit</button>
            </form>
        </div>
    )

 }