import { Pencil } from "lucide-react";
import NoteForm from "./components/NoteForm";
import ColorButton from "./components/ColorButton";
import UnderlineButton from "./components/UnderlineButton";
import StrikethroughButton from "./components/StrikethroughButton";
import DeleteButton from "./components/DeleteButton";
import { colors } from "./constant";
import { AnnotatorMenuProps } from "./types/annotator.interface";
import styles from "./styles/highlight.module.css";
import buttonStyles from "./styles/button.module.css";
import TranslateButton from "./components/TranslateButton";
import FlashCardButton from "./components/FlashCardButton";
import CopyButton from "./components/CopyButton";
/**
 * @description Component displaying dialog menu for highlight operations
 * @param params
 * @param params.noteUid - UID of the note
 * @param params.dialogPos - Position of the dialog menu
 * @param params.lastUid - UID of the last selected highlight area
 * @param params.dialogRef - Reference to the dialog menu
 * @param params.setDialogVisible - Function to close the dialog menu
 * @param params.setNoteVisible - Function to show/hide note form
 * @param params.noteVisible - State of note form visibility
 * @param params.handleAddNote - Function to add new note
 * @param params.selectedColorRef - Reference to selected color
 * @param params.showDelete - Whether to show delete button
 * @param params.showNote - Whether to show note button
 * @param params.showColor - Whether to show color buttons
 * @param params.showUnderline - Whether to show underline button
 * @param params.showStrikethrough - Whether to show strikethrough button
 * @param params.enableAnswerCheck - Check if answer checking feature is enabled
 * @returns JSX.Element
 */
const HighlightDialogMenu = ({
    noteUid,
    dialogPos,
    lastUid,
    dialogRef,
    setDialogVisible,
    setNoteVisible,
    noteVisible,
    handleAddNote,
    selectedColorRef,
    showDelete,
    showNote,
    showColor,
    showUnderline,
    showStrikethrough,
    enableAnswerCheck,
    enableTranslate,
    enableFlashCard,
}: AnnotatorMenuProps) => {
    return (
        <div
            ref={dialogRef}
            style={{
                top: dialogPos.top,
                left: dialogPos.left,
            }}
            className={styles["highlight-dialog-menu"]}
        >
            <div className={styles["highlight-dialog-menu-buttons"]}>
                {/* Color selection buttons for highlighting */}
                <div className={buttonStyles["highlight-color-buttons"]}>
                    {showColor &&
                        colors.map((color) => (
                            <ColorButton
                                key={color.name}
                                color={color}
                                lastUid={lastUid}
                                selectedColorRef={selectedColorRef}
                            />
                        ))}
                </div>{" "}
                {/* Copy button */}
                <CopyButton lastDataUidSelected={lastUid} /> {/* Note button */}
                {showNote && (
                    <div
                        title="Add note"
                        className={buttonStyles["note-button"]}
                        onClick={() => setNoteVisible(!noteVisible)}
                        style={{ cursor: "pointer" }}
                    >
                        <Pencil size={14} />
                    </div>
                )}
                {/* Underline and strikethrough buttons */}
                {showUnderline && (
                    <UnderlineButton
                        lastUid={lastUid}
                        setDialogVisible={setDialogVisible}
                    />
                )}
                {showStrikethrough && <StrikethroughButton lastUid={lastUid} />}
                {/* Delete highlight area button */}
                {showDelete && (
                    <DeleteButton
                        lastUid={lastUid}
                        setDialogVisible={setDialogVisible}
                    />
                )}
                {/* Translate text button */}
                {enableTranslate && <TranslateButton lastUid={lastUid} />}
                {enableFlashCard && <FlashCardButton />}
            </div>
            {/* Display note form if noteVisible is true */}
            {noteVisible && (
                <NoteForm
                    noteUid={noteUid}
                    dialogPos={dialogPos}
                    handleAddNote={handleAddNote}
                    setNoteVisible={setNoteVisible}
                    enableAnswerCheck={enableAnswerCheck}
                />
            )}
        </div>
    );
};
export default HighlightDialogMenu;
