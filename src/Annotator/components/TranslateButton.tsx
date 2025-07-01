import { StrikethroughButtonProps } from "../types/button.interface";
import styles from "../styles/button.module.css";
import { LanguagesIcon } from "lucide-react";

/**
 * @description Button to translate highlighted text
 * @param params
 * @param params.lastUid - UID of the last selected highlight area
 * @returns JSX.Element
 */
const TranslateButton = ({ lastUid }: StrikethroughButtonProps) => {
    return (
        <div
            role="button"
            tabIndex={0}
            className={styles["translate-button"]}
            title="Translate"
            onClick={(e) => {
                e.stopPropagation();
                if (lastUid) {
                    const el = document.querySelectorAll(
                        `.highlighted-text[data-uid='${lastUid}']`,
                    );
                    let textContent = "";
                    el.forEach((element) => {
                        if (element instanceof HTMLElement) {
                            textContent += " " + element.textContent || "";
                        }
                    });
                    console.log("Selected text for translation:", textContent);
                }
            }}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    e.stopPropagation();
                    if (lastUid) {
                        const el = document.querySelectorAll(
                            `.highlighted-text[data-uid='${lastUid}']`,
                        );
                        let textContent = "";
                        el.forEach((element) => {
                            if (element instanceof HTMLElement) {
                                textContent += " " + element.textContent || "";
                            }
                        });
                        console.log(
                            "Selected text for translation:",
                            textContent,
                        );
                    }
                }
            }}
        >
            <LanguagesIcon />
        </div>
    );
};
export default TranslateButton;
