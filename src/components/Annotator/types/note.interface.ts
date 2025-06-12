export interface NoteFormProps {
    noteUid?: string;
    dialogPos: { top: number; left: number };
    handleAddNote: (
        note: string,
        checkedAnswer: string,
        correctAnswerInput: string,
    ) => void;
    setNoteVisible: (v: boolean) => void;
    currentNote?: string | "";
    enableAnswerCheck?: boolean;
}
