import styles from "./submitButtonComponent.module.css"

interface SubmitButtonComponentProps {
    text: string;
    onClick: () => void;
}

export const SubmitButtonComponent = ({ text, onClick }: SubmitButtonComponentProps) => {
    return (
        <button
            className={styles.submitBtn}
            onClick={onClick}
            type="button"
        >
            {text}
        </button>
    );
};