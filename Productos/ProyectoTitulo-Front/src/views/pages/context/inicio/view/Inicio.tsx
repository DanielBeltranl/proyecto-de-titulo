import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../../../context/AuthContext';
import VistaJugador from '../../../../ui/components/pages/VistaJugador/VistaJugador';
import VistaEntrenador from '../../../../ui/components/pages/VistaEntrenador/VistaEntrenador';
import HeroCarousel from './components/HeroCarousel/HeroCarousel';
import img0 from '../../../../../assets/photos/img.png';
import img1 from '../../../../../assets/photos/img_1.png';
import img2 from '../../../../../assets/photos/img_2.png';
import styles from './Inicio.module.css';

const heroImages = [img0, img1, img2];

const pillars = [
  {
    icon: 'edit_note',
    title: 'Registro Inteligente',
    description:
      'Registra tus datos de manera sencilla y obtén un análisis detallado de forma instantánea.',
  },
  {
    icon: 'group',
    title: 'Información Centralizada',
    description:
      'Olvida múltiples hojas de cálculo y centraliza la información de todos tus alumnos.',
  },
  {
    icon: 'biotech',
    title: 'Automatización basada en la ciencia',
    description:
      'Cálculos basados en documentación científica para darte resultados precisos sin el trabajo manual.',
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
            Pensada por y para entrenadores. Lleva a tus alumnos al siguiente nivel.
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
          <HeroCarousel images={heroImages} />
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
