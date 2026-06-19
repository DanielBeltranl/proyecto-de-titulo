import styles from "./profilePhotoComponent.module.css"

export const ProfilePhoto = () => {
    return (
        <div className={styles.container}>
            <div className={styles.avatarWrapper}>
                <div className={styles.avatarBox}>
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={styles.cameraIcon}
                    >
                        <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                        <circle cx="12" cy="13" r="4" />
                        <line x1="19" y1="9" x2="19.01" y2="9" />
                    </svg>
                </div>

                <div className={styles.editBadge}>

                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={styles.pencilIcon}
                    >
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                </div>
            </div>

            <h1 className={styles.title}>Crear Cuenta</h1>
            <p className={styles.subtitle}>¡Necesitamos saber un poco más de ti!</p>
        </div>
    );
};