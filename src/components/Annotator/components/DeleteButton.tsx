import { Trash2 } from "lucide-react";
import { DeleteButtonProps } from "../types/button.interface";
import styles from "../styles/button.module.css";

/**
 * @description Delete button to remove highlighted text and related notes
 * @param params
 * @param params.lastUid - UID of the last selected highlight
 * @param params.setDialogVisible - Function to close the delete confirmation dialog
 * @returns JSX.Element | null
 */
const DeleteButton = ({ lastUid, setDialogVisible }: DeleteButtonProps) => {
    return (
        lastUid && (
            <Trash2
                size={14}
                className={styles["delete-button"]}
                onClick={(e) => {
                    e.stopPropagation();
                    if (lastUid) {
                        const el = document.querySelector(
                            `.highlighted-text[data-uid='${lastUid}']`,
                        ) as HTMLElement | null;
                        // Delete notes and answers when deleting highlighted text
                        if (el) {
                            const notes =
                                el.querySelectorAll(".highlight-note");
                            notes.forEach((note) => note.remove());

                            const correctedAnswers =
                                el.querySelectorAll(".corrected-answers");
                            correctedAnswers.forEach((corrected) =>
                                corrected.remove(),
                            );
                            el.outerHTML = el.innerHTML;
                        }
                    }
                    setDialogVisible(false);
                }}
                style={{ color: "red" }}
            />
        )
    );
};
export default DeleteButton;
