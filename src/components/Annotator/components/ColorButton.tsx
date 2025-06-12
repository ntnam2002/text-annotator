import { ColorButtonProps } from "../types/button.interface";
import styles from "../styles/button.module.css";

/**
 * @description Color button to select highlight color
 * @param params
 * @param params.color - Button color
 * @param params.lastUid - UID of the last selected highlight
 * @param params.selectedColorRef - Reference to the selected color
 * @param params.setDialogVisible - Function to open/close color selection dialog
 * @returns JSX.Element
 */
const ColorButton = ({
    color,
    lastUid,
    selectedColorRef,
    setDialogVisible,
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
                    const el = document.querySelector(
                        `.highlighted-text[data-uid='${lastUid}']`,
                    ) as HTMLElement | null;
                    if (el) {
                        el.style.backgroundColor = color.code;
                    }
                }
                if (selectedColorRef && selectedColorRef.current) {
                    selectedColorRef.current.color = color.code;
                }
                setDialogVisible(false);
            }}
        />
    );
};
export default ColorButton;
