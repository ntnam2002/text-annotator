import { ReactNode } from "react";

export type HighlightUid = string;
export type NoteUid = string;

export interface AnnotatorMenuProps {
    noteUid?: string;
    dialogPos: { top: number; left: number };
    lastUid: string | null;
    dialogRef: React.RefObject<HTMLDivElement>;
    setDialogVisible: (v: boolean) => void;
    setNoteVisible: (v: boolean) => void;
    noteVisible: boolean;
    handleAddNote: (
        note: string,
        checkedAnswer: string,
        correctAnswerInput: string,
    ) => void;
    selectedColorRef: React.RefObject<{ color: string }>;
    setDialogPos: (pos: { top: number; left: number }) => void;
    setLastUid: (uid: string | null) => void;
    currentNote?: string;
    showDelete?: boolean;
    showNote?: boolean;
    showColor?: boolean;
    showUnderline?: boolean;
    showStrikethrough?: boolean;
    enableAnswerCheck?: boolean;
}

export interface HighlightDialogPosition {
    top: number;
    left: number;
}

export interface HighlightNoteExportData {
    uid: string;
    xpath: string;
    text: string;
    color: string;
    note?: string;
    isCorrect?: boolean;
    correctAnswer?: string;
}

export interface HighlightDialogProps {
    children: ReactNode;
    showDelete?: boolean;
    showNote?: boolean;
    showColor?: boolean;
    showUnderline?: boolean;
    showStrikethrough?: boolean;
    enableAnswerCheck?: boolean;
    enableHighlight?: boolean;
}
