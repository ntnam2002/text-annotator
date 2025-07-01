import { ColorButtonProps } from "../types/button.interface";
import styles from "../styles/button.module.css";

/**
 * @description Color selection button to choose highlight color
 * @param params
 * @param params.color - Button color
 * @param params.lastUid - UID of the last selected highlight area
 * @param params.selectedColorRef - Reference to the selected color
 * @returns JSX.Element
 */
const ColorButton = ({
    color,
    lastUid,
    selectedColorRef,
}: ColorButtonProps) => {
    return (
        <button
            type="button"
            style={{
                backgroundColor: color.code,
            }}
            className={styles["highlight-color-button"]}
            onClick={(e) => {
                e.stopPropagation();
                if (lastUid) {
                    const el = document.querySelectorAll(
                        `.highlighted-text[data-uid='${lastUid}']`,
                    );
                    el.forEach((element) => {
                        if (element) {
                            (element as HTMLElement).style.backgroundColor =
                                color.code;
                        }
                    });

                    const note = document.querySelectorAll(
                        `.highlight-note[data-uid='${lastUid}']`,
                    );
                    if (note.length > 0) {
                        note.forEach((n) => {
                            (n as HTMLElement).style.backgroundColor =
                                color.code;
                        });
                    }
                }
                if (selectedColorRef && selectedColorRef.current) {
                    selectedColorRef.current.color = color.code;
                }
            }}
        />
    );
};
export default ColorButton;
