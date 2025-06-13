import { UnderlineButtonProps } from "../types/button.interface";
import styles from "../styles/button.module.css";
import { Underline } from "lucide-react";

/**
 * @description Underline button to apply to highlighted text
 * @param params
 * @param params.lastUid - UID of the last selected highlight
 * @param params.setDialogVisible - Function to close the dialog
 * @returns
 */
const UnderlineButton = ({
    lastUid,
    setDialogVisible,
}: UnderlineButtonProps) => (
    <button
        type="button"
        className={styles["underline-button"]}
        onClick={(e) => {
            e.stopPropagation();
            if (lastUid) {
                const el = document.querySelector(
                    `.highlighted-text[data-uid='${lastUid}']`,
                ) as HTMLElement | null;
                if (el) {
                    el.style.backgroundColor = "transparent";
                    el.style.borderBottom = "2px solid red";
                    el.style.display = "inline";
                    el.style.textDecoration = "none";
                }
            }
            setDialogVisible(false);
        }}
    >
        {" "}
        <Underline size={16} />
    </button>
);
export default UnderlineButton;
