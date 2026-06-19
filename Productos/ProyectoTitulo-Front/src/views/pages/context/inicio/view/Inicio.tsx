import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../context/AuthContext';
import VistaJugador from '../../../../ui/components/pages/VistaJugador/VistaJugador';
import VistaEntrenador from '../../../../ui/components/pages/VistaEntrenador/VistaEntrenador';
import styles from './Inicio.module.css';

const pillars = [
  {
    icon: 'scoreboard',
    title: 'Marcador en Vivo',
    description:
      'Sincronización instantánea en la nube para sesiones de entrenamiento y torneos de alta intensidad.',
  },
  {
    icon: 'monitoring',
    title: 'Análisis Táctico',
    description:
      'Métricas biomecánicas y patrones de movimiento transformados en ventajas competitivas reales.',
  },
  {
    icon: 'groups',
    title: 'Comunidad',
    description:
      'Conexión global con profesionales, entrenadores y entusiastas para compartir conocimientos y experiencias de élite.',
  },
];

function PillarCard({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <article className={styles.pillarCard}>
      <div className={styles.pillarIcon}>
        <span className="material-symbols-outlined">{icon}</span>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <a href="/" className={styles.pillarLink}>
        Explorar
        <span className="material-symbols-outlined">arrow_forward</span>
      </a>
    </article>
  );
}

export default function Inicio() {
  const navigate = useNavigate();
  const { isAuthenticated, usuario } = useAuth();

  if (isAuthenticated && usuario) {
    return usuario.rol === 'Entrenador' ? <VistaEntrenador /> : <VistaJugador />;
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.statusBadge}>
            <span>Para tus análisis profesionales</span>
          </div>

          <h1>
            Double<br />
            <span>Fault.</span>
          </h1>

          <p>
            Control total sobre el rendimiento técnico y estratégico. Dominio
            absoluto basado en datos de alta precisión.
          </p>

          <div className={styles.heroActions}>
            <button className={styles.primaryAction} onClick={() => navigate('/register')}>
              Registrarse
            </button>
            <button className={styles.secondaryAction} onClick={() => navigate('/login')}>
              Iniciar Sesión
            </button>
          </div>
        </div>

        <div className={styles.heroVisual}>
          <div className={styles.heroCard}>
            <img
              alt="Elite Analytics"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhqCnJbOPkG709_mGc5UgvnG0LnSPmYFSwIAZ1Utbmf_KBNDbEoxVX87bSh7kUfBVEzES9yc5EjN7Xq4XQOI11mSbp-1RufdU5Q5poDlzpQyVic_sk13wgtbygok03DaAO-JuFhcSqSQU1kRNL7KYUw3Q-R2aF-pVeRIVhsPFZ776ZKtJXEpdHyL2eFcKBZ2Gb6lkd31GgZlNc265ZqeJpLEv7uQzyciVFXQrvryRuTBOJ9dOGE1AcZt05UW5BY6ZDMlKJFLwK8os"
            />
            <div className={styles.heroOverlay} />
            <div className={styles.liveTag}>En Vivo</div>

            <div className={styles.heroStats}>
              <div>
                <p>Análisis de Sesión</p>
                <strong>Performance v4.2</strong>
              </div>
              <div className={styles.precisionBox}>
                <strong>98.4%</strong>
                <span>Precisión</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.pillarsSection}>
        <div className={styles.sectionInner}>
          <div className={styles.pillarsGrid}>
            {pillars.map((pillar) => (
              <PillarCard
                key={pillar.title}
                icon={pillar.icon}
                title={pillar.title}
                description={pillar.description}
              />
            ))}
          </div>
        </div>
      </section>

      <section className={styles.ctaSection}>
        <div className={styles.sectionInner}>
          <h2>
            ¿LISTO PARA EL <span>SIGUIENTE NIVEL?</span>
          </h2>
          <p className={styles.ctaNote}>
            Exclusivo para estándares competitivos profesionales.
          </p>
        </div>
      </section>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div>
            <span className={styles.footerBrand}>DOUBLE FAULT</span>
            <p>© 2026 DOUBLE FAULT. PRECISIÓN EN CADA SAQUE.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
