export interface UnderlineButtonProps {
    lastUid: string | null;
    setDialogVisible: (v: boolean) => void;
}
export interface ColorButtonProps {
    color: { name: string; code: string };
    lastUid: string | null;
    selectedColorRef: React.RefObject<{ color: string }>;
    setDialogVisible: (v: boolean) => void;
}
export interface DeleteButtonProps {
    lastUid: string | null;
    setDialogVisible: (v: boolean) => void;
}

export interface StrikethroughButtonProps {
    lastUid: string | null;
    setDialogVisible: (v: boolean) => void;
}
