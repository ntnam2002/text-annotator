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
};

/**
 * Hook that manages highlight dialog and operations related to notes and correct/incorrect answers.
 * @param enableHighlight - Enable/disable highlight functionality.
 * @returns Object that manages highlight dialog and related operations
 */
export function useHighlightDialog(
    enableHighlight: boolean = true,
): UseHighlightDialogReturn {
    const selectedColorRef = useRef({ color: "#ffeb3b" });
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogPos, setDialogPos] = useState<{ top: number; left: number }>({
        top: 0,
        left: 0,
    });
    const [lastHighlightUid, setLastHighlightUid] = useState<string | null>(
        null,
    );
    const [currentNoteUid, setCurrentNoteUid] = useState<string | undefined>(
        undefined,
    );
    const [noteVisible, setNoteVisible] = useState(false);
    const dialogRef = useRef<HTMLDivElement>(null);

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

                    // Normalize the container after unwrapping
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
    }, [enableHighlight, containsForbiddenElements]);

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
        (note: string, noteUid: string, highlightEl: HTMLElement) => {
            const noteBox = createNoteBox(note, onDelete, noteUid, null);

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
            return noteBox;
        },
        [],
    );

    // Handle adding or updating note/correct answer
    const handleAddNote = useCallback(
        (note: string, checkedAnswer: string, correctAnswerInput: string) => {
            if (!lastHighlightUid) {
                console.warn("No highlight UID available");
                return;
            }

            const highlightEl = findHighlightElement(lastHighlightUid);
            if (!highlightEl) {
                console.warn(
                    `Highlight element not found for UID: ${lastHighlightUid}`,
                );
                return;
            }

            try {
                // Ensure note elements are properly positioned
                const noteElements =
                    highlightEl.querySelectorAll(".highlight-note");
                noteElements.forEach((noteEl) =>
                    highlightEl.appendChild(noteEl),
                );

                if (note) {
                    if (!currentNoteUid) {
                        const noteUid = genUid();
                        const noteBox = createNoteBoxWithListener(
                            note,
                            noteUid,
                            highlightEl,
                        );

                        const notes = {
                            ...getNotesFromLocalStorage(),
                            [noteUid]: note,
                        };
                        setNotesToLocalStorage(notes);
                        highlightEl.appendChild(noteBox);
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

                // Handle correct/incorrect answers
                if (checkedAnswer === "correct") {
                    highlightEl.style.backgroundColor =
                        BACKGROUND_COLORS.CORRECT;
                } else if (checkedAnswer === "wrong") {
                    highlightEl.style.backgroundColor = BACKGROUND_COLORS.WRONG;

                    if (correctAnswerInput) {
                        const correctedUid = genUid();
                        const correctedBox = createNoteBox(
                            `Đáp án đúng: ${correctAnswerInput}`,
                            () => {
                                const correctedElement = document.querySelector(
                                    `[corrected-answer-uid='${correctedUid}']`,
                                );
                                correctedElement?.remove();
                            },
                            null,
                            correctedUid,
                        );

                        Object.assign(
                            correctedBox.style,
                            CORRECTED_ANSWER_STYLES,
                        );
                        highlightEl.appendChild(correctedBox);

                        const correctedAnswers = {
                            ...getCorrectedAnswersFromLocalStorage(),
                            [correctedUid]: correctAnswerInput,
                        };
                        setCorrectedAnswersToLocalStorage(correctedAnswers);
                    }
                }
            } catch (error) {
                console.error("Error in handleAddNote:", error);
            }
        },
        [
            lastHighlightUid,
            currentNoteUid,
            findHighlightElement,
            createNoteBoxWithListener,
        ],
    );

    return {
        noteUid: currentNoteUid,
        selectedColorRef,
        dialogVisible,
        setDialogVisible,
        dialogPos,
        setDialogPos,
        lastUid: lastHighlightUid,
        setLastUid: setLastHighlightUid,
        setCurrentNoteUid,
        currentNoteUid,
        noteVisible,
        setNoteVisible,
        dialogRef,
        handleAddNote,
    };
}
