import { Pencil } from "lucide-react";
import NoteForm from "./NoteForm";
import ColorButton from "./ColorButton";
import UnderlineButton from "./UnderlineButton";
import StrikethroughButton from "./StrikethroughButton";
import DeleteButton from "./DeleteButton";
import { colors } from "../constant";
import { AnnotatorMenuProps } from "../types/annotator.interface";
import styles from "../styles/highlight.module.css";
import buttonStyles from "../styles/button.module.css";

/**
 * @description Component that displays dialog menu for highlight operations
 * @param params
 * @param params.noteUid - UID of the note
 * @param params.dialogPos - Dialog menu position
 * @param params.lastUid - UID of the last selected highlight
 * @param params.dialogRef - Reference to the dialog menu
 * @param params.setDialogVisible - Function to close the dialog menu
 * @param params.setNoteVisible - Function to show/hide note form
 * @param params.noteVisible - Note form visibility state
 * @param params.handleAddNote - Function to add new note
 * @param params.selectedColorRef - Reference to the selected color
 * @param params.showDelete - Whether to show delete button
 * @param params.showNote - Whether to show note button
 * @param params.showColor - Whether to show color selection buttons
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
                {/* Highlight color selection buttons */}
                <div className={buttonStyles["highlight-color-buttons"]}>
                    {showColor &&
                        colors.map((color) => (
                            <ColorButton
                                key={color.name}
                                color={color}
                                lastUid={lastUid}
                                selectedColorRef={selectedColorRef}
                                setDialogVisible={setDialogVisible}
                            />
                        ))}
                </div>

                {/* Note button */}
                {showNote && (
                    <Pencil
                        size={14}
                        className={buttonStyles["note-button"]}
                        onClick={() => setNoteVisible(!noteVisible)}
                    />
                )}

                {/* Underline and strikethrough buttons */}
                {showUnderline && (
                    <UnderlineButton
                        lastUid={lastUid}
                        setDialogVisible={setDialogVisible}
                    />
                )}
                {showStrikethrough && (
                    <StrikethroughButton
                        lastUid={lastUid}
                        setDialogVisible={setDialogVisible}
                    />
                )}
                {/* Delete highlight button */}
                {showDelete && (
                    <DeleteButton
                        lastUid={lastUid}
                        setDialogVisible={setDialogVisible}
                    />
                )}
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
