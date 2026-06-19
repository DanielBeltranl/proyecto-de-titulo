import { useNavigate } from 'react-router-dom';
import { useGlobalStats } from '../controller/useGlobalStats';
import { GlobalRecord } from './components/globalRecord/globalRecord';
import { GlobalBreakPoints } from './components/globalBreakPoints/globalBreakPoints';
import { GlobalTrend } from './components/globalTrend/globalTrend';
import { GlobalQuartiles } from './components/globalQuartiles/globalQuartiles';
import styles from './GlobalStats.module.css';

export const GlobalStats = () => {
  const navigate = useNavigate();
  const { data, loading, empty, error } = useGlobalStats();

  if (loading) {
    return (
      <div className={styles.feedback}>
        <span className="material-symbols-outlined">hourglass_empty</span>
        <p>Cargando estadísticas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.feedback}>
        <span className="material-symbols-outlined">error</span>
        <p>No se pudieron cargar las estadísticas. Intentalo más tarde.</p>
      </div>
    );
  }

  if (empty || !data) {
    return (
      <div className={styles.feedback}>
        <span className="material-symbols-outlined">sports_tennis</span>
        <p>Aún no hay partidos finalizados para mostrar estadísticas.</p>
        <button className={styles.btnBack} onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <button className={styles.btnBack} onClick={() => navigate(-1)}>
          <span className="material-symbols-outlined">arrow_back</span>
          Volver
        </button>
      </div>

      <div className={styles.main}>
        <header className={styles.header}>
          <span className={styles.headerLabel}>Jugador</span>
          <h1 className={styles.headerTitle}>Estadísticas Globales</h1>
        </header>

        <div className={styles.grid}>
          <div className={styles.colHalf}>
            <GlobalRecord
              record={data.record}
              lastResult={data.lastResult}
              pointsWinLoss={data.pointsWinLoss}
            />
          </div>

          <div className={styles.colHalf}>
            <GlobalBreakPoints
              bp={data.breakPoints}
              avgDurationWon={data.avgDurationWon}
              avgDurationLost={data.avgDurationLost}
            />
          </div>

          <div className={styles.colFull}>
            <GlobalTrend intervals={data.pointsPerInterval} />
          </div>

          <div className={styles.colFull}>
            <GlobalQuartiles quartiles={data.quartiles} />
          </div>
        </div>
      </div>
    </div>
  );
};
