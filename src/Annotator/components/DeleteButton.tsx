import { Eraser } from "lucide-react";
import { DeleteButtonProps } from "../types/button.interface";
import styles from "../styles/button.module.css";
/**
 * @description Delete button to remove highlight area and related notes
 * @param params
 * @param params.lastUid - UID of the last selected highlight area
 * @param params.setDialogVisible - Function to close confirmation dialog
 * @returns JSX.Element | null
 */
const DeleteButton = ({ lastUid, setDialogVisible }: DeleteButtonProps) => {
    return (
        <div title="Delete highlight">
            {lastUid && (
                <Eraser
                    size={16}
                    className={styles["delete-button"]}
                    onClick={(e) => {
                        e.stopPropagation();
                        if (lastUid) {
                            const el = document.querySelector(
                                `.highlighted-text[data-uid='${lastUid}']`,
                            ) as HTMLElement | null;
                            // Delete notes and answers when deleting highlight area
                            if (el) {
                                const notes = document.querySelectorAll(
                                    `.highlight-note[data-uid='${lastUid}']`,
                                );
                                notes.forEach((note) => note.remove());
                                const correctedAnswers =
                                    document.querySelectorAll(
                                        `.corrected-answers[data-uid='${lastUid}']`,
                                    );
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
            )}
        </div>
    );
};
export default DeleteButton;
