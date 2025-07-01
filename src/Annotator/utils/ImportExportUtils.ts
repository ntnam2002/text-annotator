import { colors } from "../constant";
import {
    createHighlightSpan,
    createNoteBox,
    onDelete,
} from "../hooks/helpers/highlightHelpers";
import {
    ImportExportData,
    ExportHighlightResult,
} from "../types/importExport.interface";
import {
    genUid,
    getXpathFromElement,
    getNotesFromLocalStorage,
    setNotesToLocalStorage,
    getCorrectedAnswersFromLocalStorage,
    setCorrectedAnswersToLocalStorage,
} from "./highlightUtils";
import { dialogManager } from "./DialogManager";

declare global {
    interface Window {
        find(
            string: string,
            caseSensitive?: boolean,
            backwards?: boolean,
            wrap?: boolean,
            wholeWord?: boolean,
            searchInFrames?: boolean,
            showDialog?: boolean,
        ): boolean;
    }
}

/**
 * Remove the last segment from xpath to get the parent element's xpath
 * Example: "/html/body/div[1]/p[2]/span" → "/html/body/div[1]/p[2]"
 * Example: "//DIV[@id='root']/DIV[1]/SPAN[1]" → "//DIV[@id='root']/DIV[1]"
 * @param path - Full xpath of the element
 * @returns xpath of parent element (excluding the last segment)
 */
function removeLastSegment(path: string): string {
    // Check if xpath starts with //
    const isAbsolutePath = path.startsWith("//");

    const parts = path.split("/").filter(Boolean);
    parts.pop();

    if (isAbsolutePath) {
        return "//" + parts.join("/");
    } else {
        return "/" + parts.join("/");
    }
}

/**
 * Import and restore highlights from saved data into the DOM.
 *
 * Main functions:
 * 1. Remove all existing highlights on the page.
 * 2. Iterate through each item in the data and recreate the highlights.
 * 3. Restore notes and noteMarks related to the highlights.
 *
 * @param {Array<{
 *   xpath: string, // XPath of the element containing the highlighted text
 *   offsetStart: number, // Start position of the highlighted text within the parent element
 *   offsetEnd: number, // End position of the highlighted text within the parent element
 *   offsetCount: number, // Number of words in the highlighted text
 *   underline?: boolean, // Whether to underline the text
 *   strikethrough?: boolean, // Whether to strikethrough the text
 *   noteColor?: string, // Color of the note (if any)
 *   note?: string[], // Array containing notes related to the highlighted text
 *   noteMark?: string[], // Array containing noteMarks related to the highlighted text
 *   parentText?: string, // Text of the parent element containing the highlighted text
 *   highlightText: string // The highlighted text
 * }>} data - Array containing highlight information to import
 */
export function importHighlightsData(
    data: ImportExportData[],
    deleteNoteButtonVisible: boolean = true,
): void {
    // Clean up DOM - Remove all old highlights before importing new data
    document.querySelectorAll(".highlighted-text").forEach((span) => {
        const parent = span.parentNode;
        if (!parent) return;

        let textContent = "";
        span.childNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                textContent += node.textContent || "";
            }
        });

        if (textContent) {
            parent.replaceChild(document.createTextNode(textContent), span);
        } else {
            parent.removeChild(span);
        }

        if (parent.nodeType === Node.ELEMENT_NODE) {
            (parent as Element).normalize();
        }
    });

    // Iterate through each highlight data and recreate on DOM
    data.forEach((item) => {
        let parent: HTMLElement | null = null;
        try {
            const result = document.evaluate(
                removeLastSegment(item.xpath),
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null,
            );
            parent = result.singleNodeValue as HTMLElement;
        } catch (error) {
            console.warn(
                "Could not find element with xpath:",
                item.xpath,
                error,
            );
            return;
        }

        if (!parent) {
            console.warn("Parent does not exist for xpath:", item.xpath);
            return;
        }

        if (item.highlightText) {
            const success = findAndHighlightTextAcrossNodes(
                parent,
                item.highlightText,
                item,
                genUid(),
                deleteNoteButtonVisible,
            );
            if (!success) {
                console.warn(
                    "Could not find and highlight text:",
                    item.highlightText,
                    "in element:",
                    parent,
                );
            }
        } else {
            console.warn("No highlightText to import:", item);
        }
    });
}

/**
 * Find and highlight text spanning across multiple text nodes
 * @param parent - Parent element containing the text to highlight
 * @param targetText - Text to find and highlight
 * @param item - Highlight data from import
 * @param highlightUid - UID of the created highlight
 * @param deleteNoteButtonVisible - Whether to show delete note button
 * @returns boolean - Success or failure
 */
function findAndHighlightTextAcrossNodes(
    parent: HTMLElement,
    targetText: string,
    item: ImportExportData,
    highlightUid: string,
    deleteNoteButtonVisible: boolean,
): boolean {
    const range = document.createRange();
    range.selectNodeContents(parent);

    const selection = window.getSelection();
    if (!selection) return false;

    const savedRanges: Range[] = [];
    for (let i = 0; i < selection.rangeCount; i++) {
        savedRanges.push(selection.getRangeAt(i).cloneRange());
    }

    selection.removeAllRanges();
    selection.addRange(range);

    let found = false;
    try {
        range.collapse(true);
        selection.removeAllRanges();
        selection.addRange(range);

        found = window.find(
            targetText,
            false,
            false,
            false,
            false,
            false,
            false,
        );

        if (found && selection.rangeCount > 0) {
            const foundRange = selection.getRangeAt(0); // Check if range is within parent element
            if (parent.contains(foundRange.commonAncestorContainer)) {
                const span = createHighlightSpan(
                    item.highlightColor || colors[3].code,
                    highlightUid,
                    item.underline || false,
                    item.strikethrough || false,
                );
                span.className = "highlighted-text";

                try {
                    const contents = foundRange.extractContents();
                    span.appendChild(contents);
                    foundRange.insertNode(span);

                    addNotesToSpan(
                        span,
                        highlightUid,
                        item,
                        item.highlightColor || colors[3].code,
                        deleteNoteButtonVisible,
                    );

                    found = true;
                } catch (error) {
                    console.warn(
                        "Could not wrap content with highlight span:",
                        error,
                    );
                    found = false;
                }
            }
        }
    } catch (error) {
        console.warn("Error when searching text:", error);
        found = false;
    } finally {
        selection.removeAllRanges();
        savedRanges.forEach((savedRange) => {
            try {
                selection.addRange(savedRange);
            } catch (e) {
                console.warn(
                    "Could not restore selection range:",
                    savedRange,
                    e,
                );
            }
        });
    }
    console.log("Found highlight:", found, "for text:", targetText);
    // If window.find doesn't work, use TreeWalker method
    if (!found) {
        found = findAndHighlightTextWithTreeWalker(
            parent,
            targetText,
            item,
            highlightUid,
        );
    }

    return found;
}

/**
 * Alternative method using TreeWalker to find and highlight text
 * @param parent - Parent element containing the text to highlight
 * @param targetText - Text to find and highlight
 * @param item - Highlight data from import
 * @returns boolean - Success or failure
 */
function findAndHighlightTextWithTreeWalker(
    parent: HTMLElement,
    targetText: string,
    item: ImportExportData,
    lastSelectedHighlightUid: string,
): boolean {
    const walker = document.createTreeWalker(
        parent,
        NodeFilter.SHOW_TEXT,
        null,
    );

    const textNodes: Text[] = [];
    let node: Text | null;

    while ((node = walker.nextNode() as Text)) {
        textNodes.push(node);
    }

    let fullText = "";
    const nodePositions: Array<{ node: Text; start: number; end: number }> = [];

    textNodes.forEach((textNode) => {
        const text = textNode.textContent || "";
        nodePositions.push({
            node: textNode,
            start: fullText.length,
            end: fullText.length + text.length,
        });
        fullText += text;
    });

    const targetIndex = fullText.indexOf(targetText);
    if (targetIndex === -1) {
        return false;
    }

    const targetEnd = targetIndex + targetText.length;

    const affectedNodes = nodePositions.filter(
        (pos) => !(pos.end <= targetIndex || pos.start >= targetEnd),
    );

    if (affectedNodes.length === 0) {
        return false;
    }
    const span = createHighlightSpan(
        item.highlightColor || colors[3].code,
        lastSelectedHighlightUid,
        item.underline || false,
        item.strikethrough || false,
    );
    span.className = "highlighted-text";
    span.textContent = targetText;

    addNotesToSpan(
        span,
        lastSelectedHighlightUid,
        item,
        item.highlightColor,
        item.deleteNoteButtonVisible,
    );

    if (affectedNodes.length === 1) {
        const nodePos = affectedNodes[0];
        const node = nodePos.node;
        const nodeText = node.textContent || "";

        const relativeStart = targetIndex - nodePos.start;
        const relativeEnd = relativeStart + targetText.length;

        const before = nodeText.slice(0, relativeStart);
        const after = nodeText.slice(relativeEnd);

        const frag = document.createDocumentFragment();

        if (before) {
            frag.appendChild(document.createTextNode(before));
        }
        frag.appendChild(span);
        if (after) {
            frag.appendChild(document.createTextNode(after));
        }

        node.parentNode?.replaceChild(frag, node);
    } else {
        const firstNode = affectedNodes[0];
        const lastNode = affectedNodes[affectedNodes.length - 1];

        const firstNodeText = firstNode.node.textContent || "";
        const firstRelativeStart = targetIndex - firstNode.start;
        const before = firstNodeText.slice(0, firstRelativeStart);

        const lastNodeText = lastNode.node.textContent || "";
        const lastRelativeEnd = targetEnd - lastNode.start;
        const after = lastNodeText.slice(lastRelativeEnd);

        const frag = document.createDocumentFragment();

        if (before) {
            frag.appendChild(document.createTextNode(before));
        }
        frag.appendChild(span);
        if (after) {
            frag.appendChild(document.createTextNode(after));
        }

        firstNode.node.parentNode?.replaceChild(frag, firstNode.node);

        for (let i = 1; i < affectedNodes.length; i++) {
            const nodeToRemove = affectedNodes[i].node;
            nodeToRemove.parentNode?.removeChild(nodeToRemove);
        }
    }

    return true;
}

/**
 * Add notes and noteMarks to highlight span
 * @param span - Highlight span element
 * @param lastSelectedHighlightUid - UID of selected highlight
 * @param item - Highlight data from import
 */
function addNotesToSpan(
    span: HTMLElement,
    lastSelectedHighlightUid: string,
    item: ImportExportData,
    highlightColor: string = colors[3].code,
    deleteNoteButtonVisible: boolean,
): void {
    // Add note mark to highlight
    if (item.noteMark) {
        item.noteMark.forEach((noteMark) => {
            const correctedAnswerUid = genUid();
            const existingCorrectedAnswers =
                getCorrectedAnswersFromLocalStorage();
            const updatedCorrectedAnswers = {
                ...existingCorrectedAnswers,
                [correctedAnswerUid]: noteMark,
            };
            setCorrectedAnswersToLocalStorage(updatedCorrectedAnswers);
            const noteMarkBox = createNoteBox(
                noteMark,
                onDelete,
                null,
                lastSelectedHighlightUid,
                correctedAnswerUid,
                deleteNoteButtonVisible,
            );
            Object.assign(noteMarkBox.style, {
                background: highlightColor || colors[3].code,
                border: "1px solid #90caf9",
                display: "inline-block",
                fontSize: "0.95em",
                color: "#1976d2",
                userSelect: "none",
            });
            // noteMarkBox.textContent = noteMark;
            dialogManager.addNoteEventListener(noteMarkBox, correctedAnswerUid);

            if (span.parentNode) {
                span.parentNode.insertBefore(noteMarkBox, span.nextSibling);
            }
        });
    }

    // Add notes to highlight
    if (item.note.length > 0) {
        item.note.forEach((note) => {
            const noteUid = genUid();
            const existingNotes = getNotesFromLocalStorage();
            const updatedNotes = {
                ...existingNotes,
                [noteUid]: note,
            };
            setNotesToLocalStorage(updatedNotes);
            const noteBox = createNoteBox(
                note,
                onDelete,
                noteUid,
                lastSelectedHighlightUid,
                null,
                deleteNoteButtonVisible,
            );
            noteBox.style.background = highlightColor || colors[3].code;
            noteBox.style.fontWeight = "bold";
            noteBox.style.cursor = "pointer";
            dialogManager.addNoteEventListener(noteBox, noteUid);
            if (span.parentNode) {
                span.parentNode.insertBefore(noteBox, span.nextSibling);
            }
        });
    }
}

export function exportHighlightsData(): ExportHighlightResult[] {
    // Collect all highlight elements and data from localStorage
    const highlights =
        document.querySelectorAll<HTMLElement>(".highlighted-text");
    const notes = JSON.parse(localStorage.getItem("noteUid") || "{}");
    const correctedAnswers = JSON.parse(
        localStorage.getItem("correctedAnswersUid") || "{}",
    );

    const result: ExportHighlightResult[] = [];

    highlights.forEach((el) => {
        // Get xpath of highlight element
        const xpath = getXpathFromElement(el, "highlighted-area");
        const highlightUid = el.getAttribute("data-uid");
        const parent = el.parentNode;
        let parentText = "";
        if (parent && parent.nodeType === Node.ELEMENT_NODE) {
            parentText = (parent as Element).textContent || "";
        }

        let highlightText = "";
        el.childNodes.forEach((node) => {
            if (node.nodeType === Node.TEXT_NODE) {
                highlightText += node.textContent || "";
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const element = node as HTMLElement;
                if (!element.classList.contains("highlight-note")) {
                    highlightText += element.textContent || "";
                }
            }
        });

        if (!highlightText.trim()) return;

        // Calculate offset position of highlight within parent text
        let offsetStart = -1;
        let offsetEnd = -1;
        if (parentText && highlightText) {
            offsetStart = parentText.indexOf(highlightText);
            offsetEnd = offsetStart + highlightText.length;
        }

        const offsetCount = highlightText.trim().split(/\s+/).length;

        const note: string[] = [];
        const noteMark: string[] = [];
        const noteAndCorrectedSpans = document.querySelectorAll(
            ".highlight-note[data-uid='" + highlightUid + "']",
        );
        console.log("noteAndCorrectedSpans:", noteAndCorrectedSpans);
        if (noteAndCorrectedSpans) {
            noteAndCorrectedSpans.forEach((span) => {
                const noteUid = span.getAttribute("note-uid");
                const correctedAnswerUid = span.getAttribute(
                    "corrected-answer-uid",
                );
                if (noteUid && notes[noteUid]) {
                    note.push(notes[noteUid]);
                }
                if (
                    correctedAnswerUid &&
                    correctedAnswers[correctedAnswerUid]
                ) {
                    noteMark.push(correctedAnswers[correctedAnswerUid]);
                }
            });
        }

        const highlightColor = el.style.backgroundColor || colors[0].code;
        const computedStyle = window.getComputedStyle(el);
        const underline =
            el.style.borderBottom !== "" && el.style.borderBottom !== "none";
        const strikethrough =
            computedStyle.textDecorationLine.includes("line-through");

        result.push({
            xpath,
            offsetStart,
            offsetEnd,
            offsetCount,
            underline,
            strikethrough,
            note,
            highlightColor,
            noteMark,
            parentText,
            highlightText,
        });
    });

    return result;
}
