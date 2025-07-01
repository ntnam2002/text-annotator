import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import {
    createHighlightSpan,
    createNoteBox,
    getEventTarget,
    onDelete,
    unwrapHighlightsInRange,
    updateNoteText,
    wrapTextNodesInRange,
} from "./helpers/highlightHelpers";
import {
    expandRangeToWordBoundaries,
    genUid,
    getCorrectedAnswersFromLocalStorage,
    getNotesFromLocalStorage,
    setCorrectedAnswersToLocalStorage,
    setNotesToLocalStorage,
} from "../utils/highlightUtils";
import { dialogManager } from "../utils/DialogManager";
import {
    BACKGROUND_COLORS,
    CORRECTED_ANSWER_STYLES,
    DIALOG_OFFSET_Y,
    DIALOG_OFFSET_Y_CLICK,
    FORBIDDEN_TAGS,
} from "../constant";

type UseHighlightDialogReturn = {
    noteUid: string | undefined;
    selectedColorRef: React.MutableRefObject<{ color: string }>;
    dialogVisible: boolean;
    setDialogVisible: React.Dispatch<React.SetStateAction<boolean>>;
    dialogPos: { top: number; left: number };
    setDialogPos: React.Dispatch<
        React.SetStateAction<{ top: number; left: number }>
    >;
    lastUid: string | null;
    setLastUid: React.Dispatch<React.SetStateAction<string | null>>;
    noteVisible: boolean;
    setNoteVisible: React.Dispatch<React.SetStateAction<boolean>>;
    dialogRef: React.RefObject<HTMLDivElement>;
    handleAddNote: (
        note: string,
        checkedAnswer: string,
        correctAnswerInput: string,
    ) => void;
    setCurrentNoteUid: React.Dispatch<React.SetStateAction<string | undefined>>;
    currentNoteUid: string | undefined;
    cleanupNoteListener: (noteUid: string) => void;
    cleanupAllNoteListeners: () => void;
};

/**
 * Hook managing highlight dialog and operations related to notes and correct/incorrect answers.
 * @param enableHighlight - Enable/disable highlight feature.
 * @returns Object managing highlight dialog and related operations
 */
export function useHighlightDialog(
    enableHighlight: boolean = true,
    deleteNoteButtonVisible: boolean = true,
): UseHighlightDialogReturn {
    const selectedColorRef = useRef({ color: "#ffeb3b" });
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogPos, setDialogPos] = useState<{ top: number; left: number }>({
        top: 0,
        left: 0,
    });
    const [lastSelectedHighlightUid, setLastHighlightUid] = useState<
        string | null
    >(null);
    const [currentNoteUid, setCurrentNoteUid] = useState<string | undefined>(
        undefined,
    );
    const [noteVisible, setNoteVisible] = useState(false);
    const dialogRef = useRef<HTMLDivElement>(null);

    // Map to track event listeners for cleanup
    const noteEventListeners = useRef<Map<string, () => void>>(new Map());

    const forbiddenTagsSet = useMemo(() => new Set(FORBIDDEN_TAGS), []);

    const containsForbiddenElements = useCallback(
        (range: Range): boolean => {
            const walker = document.createTreeWalker(
                range.commonAncestorContainer,
                NodeFilter.SHOW_ELEMENT,
                {
                    acceptNode: (node) => {
                        if (range.intersectsNode(node)) {
                            const element = node as Element;
                            if (forbiddenTagsSet.has(element.tagName)) {
                                return NodeFilter.FILTER_ACCEPT;
                            }
                        }
                        return NodeFilter.FILTER_SKIP;
                    },
                },
            );

            return walker.nextNode() !== null;
        },
        [forbiddenTagsSet],
    );

    useEffect(() => {
        const handlePointerUp = (event: MouseEvent | TouchEvent) => {
            if (!enableHighlight) return;

            const selector = window.getSelection();
            if (selector && selector.rangeCount > 0 && !selector.isCollapsed) {
                const range = selector.getRangeAt(0);

                const selectedText = range.toString().trim();
                if (!selectedText) {
                    selector.removeAllRanges();
                    return;
                }

                if (containsForbiddenElements(range)) {
                    selector.removeAllRanges();
                    return;
                }

                try {
                    expandRangeToWordBoundaries(range);

                    const rect = range.getBoundingClientRect();
                    unwrapHighlightsInRange(range);

                    // Normalize container after unwrapping
                    const container = range.commonAncestorContainer;
                    if (container.nodeType === Node.ELEMENT_NODE) {
                        (container as Element).normalize();
                    } else if (container.parentElement) {
                        container.parentElement.normalize();
                    }

                    const uid = genUid();
                    const highlightSpan = createHighlightSpan(
                        selectedColorRef.current.color,
                        uid,
                    );

                    // Wrap text nodes in range
                    wrapTextNodesInRange(range, highlightSpan);

                    selector.removeAllRanges();
                    setDialogPos({
                        top: window.scrollY + rect.top - DIALOG_OFFSET_Y,
                        left: window.scrollX + rect.left,
                    });
                    setDialogVisible(true);
                    if (lastSelectedHighlightUid !== uid) {
                        setNoteVisible(false);
                    }
                    setLastHighlightUid(uid);
                    setCurrentNoteUid(undefined);
                } catch (error) {
                    console.warn("Cannot highlight selected text:", error);
                    selector.removeAllRanges();
                }
            } else {
                const targetNode = getEventTarget(event);
                if (
                    dialogRef.current &&
                    targetNode &&
                    dialogRef.current.contains(targetNode)
                ) {
                    return;
                }
                setDialogVisible(false);
            }
        };

        document.addEventListener("mouseup", handlePointerUp);
        document.addEventListener("touchend", handlePointerUp);
        return () => {
            document.removeEventListener("mouseup", handlePointerUp);
            document.removeEventListener("touchend", handlePointerUp);
        };
    }, [enableHighlight, containsForbiddenElements, lastSelectedHighlightUid]);

    const handleOpenDialog = useCallback((e: MouseEvent | TouchEvent) => {
        if (e instanceof MouseEvent && e.detail === 2) return;

        const target = getEventTarget(e) as HTMLElement | null;
        if (target && target.classList.contains("highlighted-text")) {
            const rect = target.getBoundingClientRect();
            setDialogPos({
                top: window.scrollY + rect.top - DIALOG_OFFSET_Y_CLICK,
                left: window.scrollX + rect.left,
            });
            setLastHighlightUid(target.dataset.uid || null);
            setDialogVisible(true);
        }
    }, []);

    useEffect(() => {
        document.addEventListener("click", handleOpenDialog);
        document.addEventListener("touchstart", handleOpenDialog);
        return () => {
            document.removeEventListener("click", handleOpenDialog);
            document.removeEventListener("touchstart", handleOpenDialog);
        };
    }, [handleOpenDialog]);

    useEffect(() => {
        dialogManager.registerHandlers({
            setDialogVisible,
            setDialogPos,
            setLastUid: setLastHighlightUid,
            setNoteVisible,
            setCurrentNoteUid,
        });

        return () => {
            dialogManager.unregisterHandlers();
        };
    }, [
        setDialogVisible,
        setDialogPos,
        setLastHighlightUid,
        setNoteVisible,
        setCurrentNoteUid,
    ]);

    const findHighlightElement = useCallback(
        (uid: string): HTMLElement | null => {
            return document.querySelector(
                `.highlighted-text[data-uid='${uid}']`,
            ) as HTMLElement | null;
        },
        [],
    );
    const createNoteBoxWithListener = useCallback(
        (
            note: string,
            uid: string,
            noteUid: string,
            highlightEl: HTMLElement,
        ) => {
            const noteBox = createNoteBox(
                note,
                onDelete,
                noteUid,
                uid,
                null,
                deleteNoteButtonVisible,
            );

            const handleNoteDoubleClick = (e: Event) => {
                setDialogVisible(true);
                setDialogPos({
                    top:
                        window.scrollY +
                        (e as MouseEvent).clientY -
                        DIALOG_OFFSET_Y_CLICK,
                    left: window.scrollX + (e as MouseEvent).clientX,
                });
                setLastHighlightUid(highlightEl.getAttribute("data-uid"));
                setNoteVisible(true);
                setCurrentNoteUid(noteUid);
            };

            noteBox.addEventListener("dblclick", handleNoteDoubleClick);

            // Save cleanup function
            const cleanup = () => {
                noteBox.removeEventListener("dblclick", handleNoteDoubleClick);
            };
            noteEventListeners.current.set(noteUid, cleanup);

            return noteBox;
        },
        [
            deleteNoteButtonVisible,
            setDialogVisible,
            setDialogPos,
            setLastHighlightUid,
            setNoteVisible,
            setCurrentNoteUid,
        ],
    );

    // Handle adding or updating notes/correct answers
    const handleAddNote = useCallback(
        (note: string, checkedAnswer: string, correctAnswerInput: string) => {
            if (!lastSelectedHighlightUid) {
                console.warn("No highlight UID available");
                return;
            }

            const highlightEl = findHighlightElement(lastSelectedHighlightUid);
            if (!highlightEl) {
                console.warn(
                    `Highlight element not found for UID: ${lastSelectedHighlightUid}`,
                );
                return;
            }
            try {
                // Ensure note elements are positioned correctly
                const noteElements =
                    highlightEl.querySelectorAll(".highlight-note");
                noteElements.forEach((noteEl) =>
                    highlightEl.appendChild(noteEl),
                );
                // Handle correct/incorrect answers
                if (checkedAnswer === "correct") {
                    highlightEl.style.backgroundColor =
                        BACKGROUND_COLORS.CORRECT;
                } else if (checkedAnswer === "wrong") {
                    highlightEl.style.backgroundColor = BACKGROUND_COLORS.WRONG;
                    highlightEl.style.textDecoration = "line-through";
                    highlightEl.style.fontWeight = "bold";

                    if (correctAnswerInput) {
                        const correctedAnswerUid = genUid();
                        const correctedBox = createNoteBox(
                            `Correct answer: ${correctAnswerInput}`,
                            () => {
                                const correctedElement = document.querySelector(
                                    `[corrected-answer-uid='${correctedAnswerUid}']`,
                                );
                                correctedElement?.remove();
                            },
                            null,
                            lastSelectedHighlightUid,
                            correctedAnswerUid,
                            deleteNoteButtonVisible,
                        );

                        Object.assign(
                            correctedBox.style,
                            CORRECTED_ANSWER_STYLES,
                        );
                        if (highlightEl.parentNode) {
                            highlightEl.parentNode.insertBefore(
                                correctedBox,
                                highlightEl.nextSibling,
                            );
                        }

                        const correctedAnswers = {
                            ...getCorrectedAnswersFromLocalStorage(),
                            [correctedAnswerUid]: correctAnswerInput,
                        };
                        setCorrectedAnswersToLocalStorage(correctedAnswers);
                    }
                }
                // Handle notes
                if (note) {
                    if (!currentNoteUid) {
                        const noteUid = genUid();
                        const noteBox = createNoteBoxWithListener(
                            note,
                            lastSelectedHighlightUid,
                            noteUid,
                            highlightEl,
                        );
                        noteBox.style.backgroundColor =
                            selectedColorRef.current.color;
                        noteBox.style.fontWeight = "bold";
                        noteBox.style.cursor = "pointer";
                        const notes = {
                            ...getNotesFromLocalStorage(),
                            [noteUid]: note,
                        };
                        setNotesToLocalStorage(notes);
                        if (highlightEl.parentNode) {
                            highlightEl.parentNode.insertBefore(
                                noteBox,
                                highlightEl.nextSibling,
                            );
                        }
                    } else {
                        const existingNoteBox = highlightEl.querySelector(
                            `.highlight-note[note-uid='${currentNoteUid}']`,
                        ) as HTMLElement | null;

                        if (existingNoteBox) {
                            updateNoteText(existingNoteBox, note);
                            const notes = getNotesFromLocalStorage();
                            notes[currentNoteUid] = note;
                            setNotesToLocalStorage(notes);
                        } else {
                            console.warn(
                                `Note element not found for UID: ${currentNoteUid}`,
                            );
                        }
                    }
                }
            } catch (error) {
                console.error("Error in handleAddNote:", error);
            }
        },
        [
            lastSelectedHighlightUid,
            currentNoteUid,
            findHighlightElement,
            createNoteBoxWithListener,
            deleteNoteButtonVisible,
        ],
    );

    const cleanupNoteListener = useCallback((noteUid: string) => {
        const cleanup = noteEventListeners.current.get(noteUid);
        if (cleanup) {
            cleanup();
            noteEventListeners.current.delete(noteUid);
        }
    }, []);

    const cleanupAllNoteListeners = useCallback(() => {
        noteEventListeners.current.forEach((cleanup) => cleanup());
        noteEventListeners.current.clear();
    }, []);

    useEffect(() => {
        return () => {
            cleanupAllNoteListeners();
        };
    }, [cleanupAllNoteListeners]);

    return {
        noteUid: currentNoteUid,
        selectedColorRef,
        dialogVisible,
        setDialogVisible,
        dialogPos,
        setDialogPos,
        lastUid: lastSelectedHighlightUid,
        setLastUid: setLastHighlightUid,
        setCurrentNoteUid,
        currentNoteUid,
        noteVisible,
        setNoteVisible,
        dialogRef,
        handleAddNote,
        cleanupNoteListener,
        cleanupAllNoteListeners,
    };
}
