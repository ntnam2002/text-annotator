import { ClipboardCopy } from "lucide-react";
import styles from "../styles/button.module.css";
const CopyButton = ({
    lastDataUidSelected,
}: {
    lastDataUidSelected: string | null;
}) => {
    const handleCopy = () => {
        if (!lastDataUidSelected) {
            alert("No text selected to copy");
            return;
        }
        const highlights = document.querySelectorAll(
            `[data-uid="${lastDataUidSelected}"]`,
        );
        let text = "";
        highlights.forEach((highlight) => {
            text = text + highlight.textContent + "\n";
        });
        if (text) {
            navigator.clipboard
                .writeText(text)
                .then(() => {
                    alert("Text copied to clipboard");
                })
                .catch((err) => {
                    console.error("Failed to copy text: ", err);
                });
        }
    };

    return (
        <div
            onClick={handleCopy}
            className={styles["copy-button"]}
            title="Copy text"
        >
            <ClipboardCopy className="copy-icon" />
        </div>
    );
};

export default CopyButton;
