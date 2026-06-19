import type {ReactNode} from 'react';
import styles from './scoreButtonContainer.module.css'

interface ScoreboardContainerProps {
    children: ReactNode;
    variant?: "gapOn"
}

export const ScoreButtonContainer = ({ children, variant }: ScoreboardContainerProps) => {

    return (
        <div className={`${styles.container} ${variant==="gapOn" ? styles.gapOn : ""}`}>
            {children}
        </div>
    );
};
