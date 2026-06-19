import { useParams } from 'react-router';
import { useMatchStats } from '../controller/useMatchStats';
import { useExportPdf } from '../controller/useExportPdf';
import { MatchStatsHeader } from './components/matchStatsHeader/matchStatsHeader';
import { PhysicalMetrics } from './components/physicalMetrics/physicalMetrics';
import { PointPerformance } from './components/pointPerformance/pointPerformance';
import { TrendChart } from './components/trendChart/trendChart';
import { PointDuration } from './components/pointDuration/pointDuration';
import styles from './MatchStats.module.css';

export const MatchStats = () => {
  const { uuid = '' } = useParams<{ uuid: string }>();
  const { data, loading, error, isCoachView, playerIndex, playerCount, playerNames, setPlayerIndex, detail } = useMatchStats(uuid);
  const { exporting, exportPdf } = useExportPdf(data ?? null, detail);

  if (loading) return (
    <div className={styles.feedback}>
      <span className="material-symbols-outlined">hourglass_top</span>
      <p>Cargando estadísticas…</p>
    </div>
  );

  if (error || !data) return (
    <div className={styles.feedback}>
      <span className="material-symbols-outlined">error</span>
      <p>{error ?? 'No se pudieron cargar las estadísticas.'}</p>
    </div>
  );

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <MatchStatsHeader
          player1={data.player1}
          player2={data.player2}
          onExport={exportPdf}
          exporting={exporting}
          detail={detail}
        />
        {isCoachView && playerCount === 2 && (
          <div className={styles.playerToggleWrap}>
            <div className={styles.playerToggle}>
              {playerNames.map((name, i) => (
                <button
                  key={i}
                  className={`${styles.togglePill} ${i === playerIndex ? styles.togglePillActive : ''}`}
                  onClick={() => setPlayerIndex(i)}
                >
                  {name}
                </button>
              ))}
            </div>
          </div>
        )}
        <div className={styles.bentoGrid}>
          <div className={styles.colSmall}>
            <PhysicalMetrics
              matchDuration={data.matchDuration}
              distanceKm={data.distanceKm}
            />
          </div>
          <div className={styles.colLarge}>
            <PointPerformance
              pointsWon={data.pointsWon}
              pointsLost={data.pointsLost}
              effectivenessPct={data.effectivenessPct}
              breakPointsFavorable={data.breakPointsFavorable}
              breakPointsAgainst={data.breakPointsAgainst}
            />
          </div>
          <div className={styles.colFull}>
            <TrendChart trend={data.trend} />
          </div>
          <div className={styles.colFull}>
            <PointDuration stats={data.pointDuration} />
          </div>
        </div>
      </main>
      <footer className={styles.footer}>
        <p className={styles.footerBrand}>DOUBLE FAULT</p>
        <p className={styles.footerSub}>Elite Tennis Performance Analysis — 2024</p>
      </footer>
    </div>
  );
};
