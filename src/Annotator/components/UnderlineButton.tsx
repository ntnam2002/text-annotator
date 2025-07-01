import { UnderlineButtonProps } from "../types/button.interface";
import styles from "../styles/button.module.css";
import { Underline } from "lucide-react";
/**
 * @description Underline button to apply to highlighted text
 * @param params
 * @param params.lastUid - UID of the last selected highlight area
 * @param params.setDialogVisible - Function to close dialog
 * @returns
 */
const UnderlineButton = ({
    lastUid,
    setDialogVisible,
}: UnderlineButtonProps) => (
    <div
        role="button"
        tabIndex={0}
        className={styles["underline-button"]}
        title="Underline"
        onClick={(e) => {
            e.stopPropagation();
            if (lastUid) {
                const el = document.querySelectorAll(
                    `.highlighted-text[data-uid='${lastUid}']`,
                );
                el.forEach((element) => {
                    if (element) {
                        const htmlElement = element as HTMLElement;
                        htmlElement.style.backgroundColor = "transparent";
                        htmlElement.style.borderBottom =
                            htmlElement.style.borderBottom === "2px solid red"
                                ? "none"
                                : "2px solid red";
                        htmlElement.style.display = "inline";
                        htmlElement.style.textDecoration = "none";
                    }
                });
            }
            setDialogVisible(false);
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
                            htmlElement.style.backgroundColor = "transparent";
                            htmlElement.style.borderBottom =
                                htmlElement.style.borderBottom ===
                                "2px solid red"
                                    ? "none"
                                    : "2px solid red";
                            htmlElement.style.display = "inline";
                            htmlElement.style.textDecoration = "none";
                        }
                    });
                }
                setDialogVisible(false);
            }
        }}
    >
        <Underline />
    </div>
);
export default UnderlineButton;
