import styles from './physicalMetrics.module.css';

interface Props {
  matchDuration: string;
  distanceKm: number;
}

export const PhysicalMetrics = ({ matchDuration, distanceKm }: Props) => (
  <div className={styles.card}>
    <span className="material-symbols-outlined" aria-hidden>speed</span>
    <div className={styles.content}>
      <h3 className={styles.heading}>
        <span className={styles.dot} />
        RENDIMIENTO DE PUNTOS
      </h3>
      <div className={styles.metrics}>
        <div>
          <p className={styles.metricLabel}>Duración Total</p>
          <p className={styles.metricValuePrimary}>{matchDuration}</p>
        </div>
        <div>
          <p className={styles.metricLabel}>Distancia Recorrida</p>
          <p className={styles.metricValue}>
            {distanceKm.toFixed(2)} <span className={styles.metricUnit}>KM</span>
          </p>
        </div>
      </div>
    </div>
  </div>
);
