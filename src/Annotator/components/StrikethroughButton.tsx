import { StrikethroughButtonProps } from "../types/button.interface";
import styles from "../styles/button.module.css";
import { Strikethrough } from "lucide-react";

/**
 * @description Strikethrough button to apply to highlighted text
 * @param params
 * @param params.lastUid - UID of the last selected highlight area
 * @param params.setDialogVisible - Function to close dialog
 * @returns JSX.Element
 */
const StrikethroughButton = ({ lastUid }: StrikethroughButtonProps) => (
    <div
        role="button"
        tabIndex={0}
        className={styles["strikethrough-icon"]}
        title="Strikethrough"
        onClick={(e) => {
            e.stopPropagation();
            if (lastUid) {
                const el = document.querySelectorAll(
                    `.highlighted-text[data-uid='${lastUid}']`,
                );
                el.forEach((element) => {
                    if (element) {
                        const htmlElement = element as HTMLElement;
                        htmlElement.style.textDecoration =
                            htmlElement.style.textDecoration === "line-through"
                                ? "none"
                                : "line-through";
                        htmlElement.style.backgroundColor = "transparent";
                        htmlElement.style.borderBottom = "none";
                    }
                });
            }
        }}
        onKeyDown={(e) => {
            if (e.key === "Enter") {
                e.stopPropagation();
                if (lastUid) {
                    const el = document.querySelectorAll(
                        `.highlighted-text[data-uid='${lastUid}']`,
                    );
                    el.forEach((element) => {
                        if (element) {
                            const htmlElement = element as HTMLElement;
                            htmlElement.style.textDecoration =
                                htmlElement.style.textDecoration ===
                                "line-through"
                                    ? "none"
                                    : "line-through";
                            htmlElement.style.backgroundColor = "transparent";
                            htmlElement.style.borderBottom = "none";
                        }
                    });
                }
            }
        }}
    >
        <Strikethrough />
    </div>
);
export default StrikethroughButton;
