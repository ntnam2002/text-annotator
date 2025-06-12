import { StrikethroughButtonProps } from "../types/button.interface";
import styles from "../styles/button.module.css";

/**
 * @description Strikethrough button to apply to highlighted text
 * @param params
 * @param params.lastUid - UID of the last selected highlight
 * @param params.setDialogVisible - Function to close the dialog
 * @returns JSX.Element
 */
const StrikethroughButton = ({
    lastUid,
    setDialogVisible,
}: StrikethroughButtonProps) => (
    <button
        type="button"
        className={styles["strikethrough-button"]}
        onClick={(e) => {
            e.stopPropagation();
            if (lastUid) {
                const el = document.querySelector(
                    `.highlighted-text[data-uid='${lastUid}']`,
                ) as HTMLElement | null;
                if (el) {
                    el.style.textDecoration =
                        el.style.textDecoration === "line-through"
                            ? "none"
                            : "line-through";
                    el.style.backgroundColor = "transparent";
                }
            }
            setDialogVisible(false);
        }}
    >
        abc
    </button>
);
export default StrikethroughButton;
