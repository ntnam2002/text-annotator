import styles from "../styles/button.module.css";
import flashCardIcon from "../../assets/flash-cards_icon.png";

const FlashCardButton = () => {
    return (
        <div
            role="button"
            tabIndex={0}
            style={{ cursor: "pointer" }}
            className={styles["flashcard-button"]}
            title="Add FlashCard"
            onClick={(e) => {
                e.stopPropagation();
            }}
        >
            <img src={flashCardIcon} width={18} height={18} />
        </div>
    );
};

export default FlashCardButton;
