import HighlightDialogMenu from "./components/HighlightDialogMenu";
import { useHighlightDialog } from "./hooks/useHighlightDialog";
import { HighlightDialogProps } from "./types/annotator.interface";

/**
 *
 * @param params
 * @param params.children - Child components to be displayed inside the dialog
 * @param params.showDelete - Whether to show delete highlight button
 * @param params.showNote - Whether to show note button
 * @param params.showColor - Whether to show color selection buttons
 * @param params.showUnderline - Whether to show underline button
 * @param params.showStrikethrough - Whether to show strikethrough button
 * @param params.enableAnswerCheck - Check if answer checking feature is enabled
 * @param params.enableHighlight - Whether to allow highlighting
 * @description Dialog that displays options for selected highlighted text
 * @returns
 */
const HighlightDialog = ({
    children,
    showDelete = true,
    showNote = true,
    showColor = true,
    showUnderline = true,
    showStrikethrough = true,
    enableAnswerCheck = true,
    enableHighlight = true,
}: HighlightDialogProps) => {
    const {
        selectedColorRef,
        dialogVisible,
        setDialogVisible,
        dialogPos,
        setDialogPos,
        lastUid,
        setLastUid,
        noteVisible,
        setNoteVisible,
        dialogRef,
        handleAddNote,
        noteUid,
    } = useHighlightDialog(enableHighlight);

    return (
        <>
            {dialogVisible && (
                <HighlightDialogMenu
                    noteUid={noteUid}
                    dialogPos={dialogPos}
                    lastUid={lastUid}
                    dialogRef={dialogRef}
                    setDialogVisible={setDialogVisible}
                    setNoteVisible={setNoteVisible}
                    noteVisible={noteVisible}
                    handleAddNote={handleAddNote}
                    selectedColorRef={selectedColorRef}
                    setDialogPos={setDialogPos}
                    setLastUid={setLastUid}
                    showDelete={showDelete}
                    showNote={showNote}
                    showColor={showColor}
                    showUnderline={showUnderline}
                    showStrikethrough={showStrikethrough}
                    enableAnswerCheck={enableAnswerCheck}
                />
            )}
            <div id="highlighted-area">{children}</div>
        </>
    );
};
export default HighlightDialog;
