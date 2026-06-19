import styles from './orientationOverlay.module.css';

export const OrientationOverlay = () => {
    return (
        <div className={styles.overlayContainer}>
            <div className={styles.content}>
                <span className={`material-symbols-outlined ${styles.icon}`}>
                    screen_rotation
                </span>

                <h2 className={styles.title}>
                    Gira tu dispositivo
                </h2>

                <p className={styles.subtitle}>
                    El panel de Umpire de <strong>ELITE COURT</strong> requiere vista horizontal para funcionar correctamente.
                </p>
            </div>
        </div>
    );
};