import Background from './views/ui/components/components/background/Background'
import Navbar from './views/ui/components/components/navbar/Navbar'
import './App.css'
import {BrowserRouter} from "react-router";
import {AppRouter} from "./router.tsx";


function App() {
  return (
<Background>
  <BrowserRouter>
    <Navbar/>
    <AppRouter/>
  </BrowserRouter>
</Background>
  )
}

export default App