import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from './Amigos.module.css';
import { UserSearch } from '../userSearch';
import { useAmigos } from './controller/useAmigos';
import CoachingRequests from './components/coachingRequests/CoachingRequests';
import {
  aceptarSolicitudAmistad,
  rechazarSolicitudAmistad,
  obtenerSolicitudesAmistad,
  obtenerSolicitudesEnviadas,
  obtenerSolicitudesCoachingEnviadas,
  obtenerSolicitudesRecibidas,
} from '../../../../../services/usuarioService';
import type { SolicitudCoaching } from '../../../../../services/usuarioService';

interface FriendshipRequest {
  id: number;
  user: {
    id: number;
    nombre: string;
    apellidoPaterno: string;
    correo: string;
    nivelUsuario: string;
  };
  friend: {
    id: number;
    nombre: string;
    apellidoPaterno: string;
    correo: string;
    nivelUsuario: string;
  };
  status: 'PENDIENTE' | 'ACEPTADO';
  created_at: string;
}

const Amigos: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { amigos, alumnos, isCoach, loading: loadingFriends, refresh: refreshAmigos } = useAmigos();
  const [searchTerm, setSearchTerm] = useState('');
  const tabParam = searchParams.get('tab');
  const initialTab = tabParam === 'solicitudes' ? 'solicitudes' : 'friends';
  const [activeTab, setActiveTab] = useState<'friends' | 'solicitudes'>(initialTab);
  const [solicitudesRecibidas, setSolicitudesRecibidas] = useState<FriendshipRequest[]>([]);
  const [solicitudesEnviadas, setSolicitudesEnviadas] = useState<FriendshipRequest[]>([]);
  const [solicitudesCoaching, setSolicitudesCoaching] = useState<SolicitudCoaching[]>([]);
  const [solicitudesCoachingRecibidas, setSolicitudesCoachingRecibidas] = useState<SolicitudCoaching[]>([]);

  const cargarSolicitudes = useCallback(async () => {
    try {
      if (isCoach) {
        const recibidas = await obtenerSolicitudesRecibidas();
        setSolicitudesCoachingRecibidas(
          Array.isArray(recibidas.data)
            ? recibidas.data.filter(s => s.status === 'PENDIENTE')
            : []
        );
      } else {
        const [recibidas, enviadas, coaching] = await Promise.all([
          obtenerSolicitudesAmistad(),
          obtenerSolicitudesEnviadas(),
          obtenerSolicitudesCoachingEnviadas(),
        ]);
        const recibidasData = Array.isArray(recibidas.data)
          ? recibidas.data
          : recibidas.data.solicitudes || [];
        const enviadasData = Array.isArray(enviadas.data)
          ? enviadas.data
          : enviadas.data.solicitudes || [];
        setSolicitudesRecibidas(recibidasData);
        setSolicitudesEnviadas(enviadasData);
        setSolicitudesCoaching(Array.isArray(coaching.data) ? coaching.data : []);
      }
    } catch (err) {
      console.error('Error al cargar solicitudes:', err);
    }
  }, [isCoach]);

  useEffect(() => {
    cargarSolicitudes();
  }, [cargarSolicitudes]);


  const getLevelColor = (level: string): string => {
    switch (level) {
      case 'Pro':
      case 'Profesional':
        return styles.levelPro;
      case 'Semi-Pro':
        return styles.levelSemiPro;
      case 'Amateur':
        return styles.levelAmateur;
      default:
        return '';
    }
  };

  const getNombreCompleto = (nombre: string, apellidoPaterno: string): string => {
    return `${nombre} ${apellidoPaterno}`.trim();
  };


  const handleAceptarSolicitud = async (solicitudId: number) => {
    try {
      await aceptarSolicitudAmistad(solicitudId);
      setSolicitudesRecibidas(solicitudesRecibidas.filter(s => s.id !== solicitudId));
      await refreshAmigos();
    } catch (error: any) {
      console.error('Error al aceptar solicitud:', error);
      alert(error.response?.data?.error || 'Error al aceptar solicitud');
    }
  };

  const handleRechazarSolicitud = async (solicitudId: number) => {
    try {
      await rechazarSolicitudAmistad(solicitudId);
      setSolicitudesRecibidas(solicitudesRecibidas.filter(s => s.id !== solicitudId));
    } catch (error: any) {
      console.error('Error al rechazar solicitud:', error);
      alert(error.response?.data?.error || 'Error al rechazar solicitud');
    }
  };


  const filteredAmigos = amigos.filter(amistad => {
    const matchesSearch =
      amistad.friend.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      amistad.friend.apellidoPaterno.toLowerCase().includes(searchTerm.toLowerCase()) ||
      amistad.friend.correo.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const filteredAlumnos = alumnos.filter(alumno =>
    alumno.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    alumno.apellidoPaterno.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className={styles.mainContainer}>
      <div className={styles.contentWrapper}>
        <div className={styles.pageHeader}>
          <div className={styles.headerLeft}>
            <h1 className={styles.pageTitle}>Amigos</h1>
            <p className={styles.pageSubtitle}></p>
          </div>

          <div className={styles.tabsContainer}>
            <button
              className={`${styles.tab} ${activeTab === 'friends' ? styles.tabActive : ''}`}
              onClick={() => { setActiveTab('friends'); setSearchTerm(''); }}
            >
              {isCoach ? 'Mis Alumnos' : `Mis Amigos (${amigos.length})`}
            </button>
            <button
              className={`${styles.tab} ${activeTab === 'solicitudes' ? styles.tabActive : ''}`}
              onClick={() => { setActiveTab('solicitudes'); setSearchTerm(''); cargarSolicitudes(); }}
            >
              Solicitudes
              {(isCoach ? solicitudesCoachingRecibidas.length : solicitudesRecibidas.length) > 0 && (
                <span className={styles.tabBadge}>
                  ({isCoach ? solicitudesCoachingRecibidas.length : solicitudesRecibidas.length})
                </span>
              )}
            </button>
          </div>
        </div>

        <section className={styles.searchSection}>
          {activeTab === 'friends' && (
            <UserSearch
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder={activeTab === 'all' ? "Nombre de usuario o correo" : isCoach ? "Filtrar por nombre" : "Buscar en mis amigos"}
            />
          )}

          <div className={styles.playersGrid}>
            {activeTab === 'solicitudes' && isCoach ? (
              <CoachingRequests
                solicitudes={solicitudesCoachingRecibidas}
                onHandled={(id) =>
                  setSolicitudesCoachingRecibidas(prev => prev.filter(s => s.id !== id))
                }
              />
            ) : activeTab === 'solicitudes' ? (
              <div className={styles.solicitudesWrapper}>
                <div className={styles.solicitudesSection}>
                  <h3 className={styles.sectionHeader}>Recibidas</h3>
                  {solicitudesRecibidas.length === 0 ? (
                    <div className={styles.emptyMessage}>Sin solicitudes recibidas</div>
                  ) : (
                    <div className={styles.playersGrid}>
                      {solicitudesRecibidas.map((solicitud) => (
                        <div
                          key={solicitud.id}
                          className={`${styles.playerCard} ${styles.playerCardActive}`}
                        >
                          <div className={styles.playerMain}>
                            <div className={styles.avatarContainer}>
                              <div className={styles.avatarPlaceholder}>
                                <span className="material-symbols-outlined">person</span>
                              </div>
                            </div>
                            <div className={styles.playerInfo}>
                              <span className={`${styles.levelBadge} ${getLevelColor(solicitud.user.nivelUsuario)}`}>
                                {solicitud.user.nivelUsuario}
                              </span>
                              <h3 className={styles.playerName}>
                                {getNombreCompleto(solicitud.user.nombre, solicitud.user.apellidoPaterno)}
                              </h3>
                            </div>
                          </div>
                          <div className={styles.buttonPendingContainer}>
                            <button
                              className={styles.buttonAccept}
                              onClick={() => handleAceptarSolicitud(solicitud.id)}
                              title="Aceptar solicitud"
                            >
                              <span className="material-symbols-outlined">check</span>
                              <span>Aceptar</span>
                            </button>
                            <button
                              className={styles.buttonReject}
                              onClick={() => handleRechazarSolicitud(solicitud.id)}
                              title="Rechazar solicitud"
                            >
                              <span className="material-symbols-outlined">close</span>
                              <span>Rechazar</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.solicitudesSection}>
                  <h3 className={styles.sectionHeader}>Enviadas</h3>
                  {solicitudesEnviadas.length === 0 ? (
                    <div className={styles.emptyMessage}>Sin solicitudes enviadas</div>
                  ) : (
                    <div className={styles.playersGrid}>
                      {solicitudesEnviadas.map((solicitud) => (
                        <div
                          key={solicitud.id}
                          className={`${styles.playerCard} ${styles.playerCardPending}`}
                        >
                          <div className={styles.playerMain}>
                            <div className={styles.avatarContainer}>
                              <div className={styles.avatarPlaceholder}>
                                <span className="material-symbols-outlined">person</span>
                              </div>
                            </div>
                            <div className={styles.playerInfo}>
                              <span className={`${styles.levelBadge} ${getLevelColor(solicitud.friend.nivelUsuario)}`}>
                                {solicitud.friend.nivelUsuario}
                              </span>
                              <h3 className={styles.playerName}>
                                {getNombreCompleto(solicitud.friend.nombre, solicitud.friend.apellidoPaterno)}
                              </h3>
                            </div>
                          </div>
                          <div className={styles.buttonPendingSent}>
                            <span className="material-symbols-outlined">schedule</span>
                            <span>Pendiente</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className={styles.solicitudesSection}>
                  <h3 className={styles.sectionHeader}>Solicitud de entrenador</h3>
                  {solicitudesCoaching.length === 0 ? (
                    <div className={styles.emptyMessage}>Sin solicitudes a entrenadores</div>
                  ) : (
                    <div className={styles.playersGrid}>
                      {solicitudesCoaching.map((solicitud) => (
                        <div
                          key={solicitud.id}
                          className={`${styles.playerCard} ${styles.playerCardPending}`}
                        >
                          <div className={styles.playerMain}>
                            <div className={styles.avatarContainer}>
                              <div className={styles.avatarPlaceholder}>
                                <span className="material-symbols-outlined">school</span>
                              </div>
                            </div>
                            <div className={styles.playerInfo}>
                              <span className={`${styles.levelBadge} ${styles.roleCoachBadge}`}>
                                Entrenador
                              </span>
                              <h3 className={styles.playerName}>
                                {getNombreCompleto(solicitud.entrenador.nombre, solicitud.entrenador.apellidoPaterno)}
                              </h3>
                            </div>
                          </div>
                          <div className={styles.buttonPendingSent}>
                            <span className="material-symbols-outlined">schedule</span>
                            <span>Pendiente</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : activeTab === 'friends' && isCoach ? (
              <>
                {loadingFriends && <div className={styles.loadingMessage}>Cargando alumnos...</div>}
                {!loadingFriends && alumnos.length === 0 && (
                  <div className={styles.emptyMessage}>No tienes alumnos asociados aún</div>
                )}
                {!loadingFriends && alumnos.length > 0 && filteredAlumnos.length === 0 && (
                  <div className={styles.emptyMessage}>No se encontraron alumnos con ese nombre</div>
                )}
                {filteredAlumnos.map((alumno) => (
                  <div
                    key={alumno.id}
                    className={`${styles.playerCard} ${styles.playerCardFriend}`}
                    onClick={() => navigate(`/estadisticas-globales?player_id=${alumno.id}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className={styles.playerMain}>
                      <div className={styles.avatarContainer}>
                        <div className={styles.avatarPlaceholder}>
                          <span className="material-symbols-outlined">person</span>
                        </div>
                      </div>
                      <div className={styles.playerInfo}>
                        <h3 className={styles.playerName}>
                          {getNombreCompleto(alumno.nombre, alumno.apellidoPaterno)}
                        </h3>
                        {alumno.nivelUsuario && (
                          <span className={`${styles.alumnoLevelBadge} ${getLevelColor(alumno.nivelUsuario)}`}>
                            {alumno.nivelUsuario}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className={styles.statsLabel}>
                      <span className="material-symbols-outlined">bar_chart</span>
                      Ver estadísticas globales
                    </span>
                  </div>
                ))}
              </>
            ) : activeTab === 'friends' ? (
              <>
                {loadingFriends && <div className={styles.loadingMessage}>Cargando amigos...</div>}
                {!loadingFriends && filteredAmigos.length === 0 && (
                  <div className={styles.emptyMessage}>
                    {searchTerm ? 'No se encontraron amigos' : 'No tienes amigos aún'}
                  </div>
                )}
                {filteredAmigos.map((amistad) => (
                  <div key={amistad.id} className={`${styles.playerCard} ${styles.playerCardFriend}`}>
                    <div className={styles.playerMain}>
                      <div className={styles.avatarContainer}>
                        <div className={styles.avatarPlaceholder}>
                          <span className="material-symbols-outlined">person</span>
                        </div>
                      </div>
                      <div className={styles.playerInfo}>
                        <span className={`${styles.levelBadge} ${getLevelColor(amistad.friend.nivelUsuario)}`}>
                          {amistad.friend.nivelUsuario}
                        </span>
                        <h3 className={styles.playerName}>
                          {getNombreCompleto(amistad.friend.nombre, amistad.friend.apellidoPaterno)}
                        </h3>
                      </div>
                    </div>
                  </div>
                ))}
              </>
            ) : null}
          </div>
        </section>
      </div>
    </main>
  );
};

export default Amigos;
