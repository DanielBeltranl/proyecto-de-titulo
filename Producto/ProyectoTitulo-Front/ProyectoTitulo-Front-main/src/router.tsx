import {Route, Routes} from "react-router";
import {FormValidator} from "./views/pages/context/register/view/formValidator.tsx";


export const AppRouter = () => {

    return (
        <Routes>
            <Route path = "registroTest" element={<FormValidator/>}/>
        </Routes>
    )

}