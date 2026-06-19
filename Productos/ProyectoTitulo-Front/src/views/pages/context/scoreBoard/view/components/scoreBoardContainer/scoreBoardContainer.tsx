import type {ReactNode} from 'react';
import styles from "./scoreBoardContainer.module.css"

interface ScoreboardContainerProps {
    children: ReactNode;
    variant?: "gapOn"
}

export const ScoreboardContainer = ({ children, variant }: ScoreboardContainerProps) => {

    const gap = variant === "gapOn" ? styles.gap : ""

    return (
        <div className={`${styles.container} ${gap}`}>
            {children}
        </div>
    );
};