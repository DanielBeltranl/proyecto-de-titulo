import { Route, Routes } from "react-router"
import { FormValidator } from "./views/pages/context/register/view/formValidator.tsx"
import { FormJugador } from "./views/pages/context/register/view/formJugador.tsx"
import { FormEntrenador } from "./views/pages/context/register/view/formEntrenador.tsx"
import VistaJugador from "./views/ui/components/pages/VistaJugador/VistaJugador.tsx"
import VistaEntrenador from "./views/ui/components/pages/VistaEntrenador/VistaEntrenador.tsx"
import VistaSolicitudes from "./views/ui/components/pages/VistaSolicitudes/VistaSolicitudes.tsx"
import FormLogin from "./views/pages/context/register/view/login/formLogin.tsx"
import { PrivateRoute } from "./context/PrivateRoute.tsx"
import Background from "./views/ui/components/components/background/Background.tsx"
import {LiveScoreBoard} from "./views/pages/context/scoreBoard/view/liveScoreBoard.tsx";
import Amigos from "./views/ui/components/components/amigos/Amigos.tsx"
import Agendamiento from "./views/ui/components/components/agendamiento/Agendamiento.tsx"
import MatchDetail from "./views/ui/components/components/matchDetail/MatchDetail.tsx"
import Partidos from "./views/ui/components/components/partidos/Partidos.tsx"
import Inicio from "./views/pages/context/inicio/view/Inicio.tsx"
import { MatchStats } from "./views/pages/context/matchStats/view/MatchStats.tsx"
import { GlobalStats } from "./views/pages/context/globalStats/view/GlobalStats.tsx"
import VistaHistorial from "./views/ui/components/pages/VistaHistorial/VistaHistorial.tsx"
import UserProfile from "./views/ui/components/components/userInfo/Jugador/UserInfo.tsx"
import QrLogin from "./views/pages/context/qrLogin/view/QrLogin.tsx"

// Rutas públicas - con Background

const RegisterSelector = () => (
  <Background>
    <FormValidator />
  </Background>
)

const RegisterJugador = () => (
  <Background>
    <FormJugador />
  </Background>
)

const RegisterEntrenador = () => (
  <Background>
    <FormEntrenador />
  </Background>
)

const Login = () => (
  <Background>
    <FormLogin />
  </Background>
)

const Perfil = () => (
  <Background>
    <UserProfile />
  </Background>
)

export const AppRouter = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Inicio />} />
      <Route path="register" element={<RegisterSelector />} />
      <Route path="register/jugador" element={<RegisterJugador />} />
      <Route path="register/entrenador" element={<RegisterEntrenador />} />
      <Route path="login" element={<Login />} />
      <Route path="qr-login/:token" element={<QrLogin />} />

      {/* Rutas protegidas */}
      <Route
        path="perfil"
        element={
            <PrivateRoute>
            <Perfil />
            </PrivateRoute>
        }
        />

        <Route path="vista" element=
        {<PrivateRoute allowedRoles={['Jugador']}>
            <VistaJugador/>
        </PrivateRoute>
        } />

        <Route path="vista-entrenador" element=
        {<PrivateRoute allowedRoles={['Entrenador']}>
            <VistaEntrenador/>
        </PrivateRoute>
        } />

        <Route path="contactos" element=
        {<PrivateRoute>
            <Amigos/>
        </PrivateRoute>
        } />

        <Route path="marcador/:uuid" element=
        {<PrivateRoute>
          <LiveScoreBoard/>
        </PrivateRoute>
        } />

        <Route path="agendamiento" element=
        {<PrivateRoute allowedRoles={['Entrenador']}>
            <Agendamiento/>
        </PrivateRoute>
        } />

        <Route path="partidos" element=
        {<PrivateRoute>
            <Partidos/>
        </PrivateRoute>
        } />

        <Route path="match/:uuid" element=
        {<PrivateRoute>
            <MatchDetail/>
        </PrivateRoute>
        } />

        <Route path="match-stats/:uuid" element={<MatchStats />} />
        <Route path="estadisticas-globales" element={<PrivateRoute><GlobalStats /></PrivateRoute>} />

        <Route path="historial" element={
            <PrivateRoute>
                <VistaHistorial />
            </PrivateRoute>
        } />

        <Route path="solicitudes" element={
            <PrivateRoute>
                <VistaSolicitudes />
            </PrivateRoute>
        } />
    </Routes>

  )
}

