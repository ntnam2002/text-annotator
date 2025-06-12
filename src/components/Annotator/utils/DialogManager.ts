class DialogManager {
    private dialogHandlers: {
        setDialogVisible?: (visible: boolean) => void;
        setDialogPos?: (pos: { top: number; left: number }) => void;
        setLastUid?: (uid: string) => void;
        setNoteVisible?: (visible: boolean) => void;
        setCurrentNoteUid?: (uid: string) => void;
    } = {};
    /**
     * Register handler functions from hook
     */
    registerHandlers(handlers: {
        setDialogVisible: (visible: boolean) => void;
        setDialogPos: (pos: { top: number; left: number }) => void;
        setLastUid: (uid: string) => void;
        setNoteVisible: (visible: boolean) => void;
        setCurrentNoteUid: (uid: string) => void;
    }) {
        this.dialogHandlers = handlers;
    }
    /**
     * Remove handler functions
     */
    unregisterHandlers() {
        this.dialogHandlers = {};
    }
    /**
     * Add event listener for note box
     */
    addNoteEventListener(noteBox: HTMLElement, noteUid: string) {
        noteBox.addEventListener("dblclick", (e) => {
            e.stopPropagation();

            // Find highlight element containing this note
            const highlightEl = noteBox.closest(
                ".highlighted-text",
            ) as HTMLElement;
            if (!highlightEl) {
                console.warn(
                    "Could not find highlight element containing note",
                );
                return;
            }

            if (this.dialogHandlers.setDialogVisible) {
                this.dialogHandlers.setDialogVisible(true);
            }
            if (this.dialogHandlers.setDialogPos) {
                this.dialogHandlers.setDialogPos({
                    top: window.scrollY + (e as MouseEvent).clientY - 50,
                    left: window.scrollX + (e as MouseEvent).clientX,
                });
            }
            if (this.dialogHandlers.setLastUid) {
                const highlightUid = highlightEl.getAttribute("data-uid");
                if (highlightUid) {
                    this.dialogHandlers.setLastUid(highlightUid);
                }
            }
            if (this.dialogHandlers.setNoteVisible) {
                this.dialogHandlers.setNoteVisible(true);
            }
            if (this.dialogHandlers.setCurrentNoteUid) {
                this.dialogHandlers.setCurrentNoteUid(noteUid);
            }
        });
    }
}

export const dialogManager = new DialogManager();
