import { AuthProvider } from './context/AuthContext'
import Navbar from './views/ui/components/components/navbar/Navbar'
import './App.css'
import { BrowserRouter } from "react-router"
import { AppRouter } from "./router.tsx"
import Background from "./views/ui/components/components/background/Background.tsx";

function App() {
  return (
    <BrowserRouter>
        <Background>
          <AuthProvider>
            <Navbar />
            <AppRouter />
          </AuthProvider>
        </Background>
    </BrowserRouter>
  )
}

export default App