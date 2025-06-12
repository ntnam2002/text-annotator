import { colors } from "../constant";
import {
    createHighlightSpan,
    createNoteBox,
    onDelete,
} from "../hooks/helpers/highlightHelpers";
import { ImportExportData } from "../types/importExport.interface";
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
 * Remove last segment from xpath to get parent element xpath
 * Example: "/html/body/div[1]/p[2]/span" → "/html/body/div[1]/p[2]"
 * Example: "//DIV[@id='root']/DIV[1]/SPAN[1]" → "//DIV[@id='root']/DIV[1]"
 * @param path - Full xpath of element
 * @returns Parent element xpath (excluding last segment)
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
 * Import and restore highlights from saved data into DOM
 *
 * Main functions:
 * 1. Remove all existing highlights on the page
 * 2. Iterate through each item in data and recreate highlights
 * 3. Restore notes and noteMarks associated with highlights
 *
 * @param data - Array containing highlight information to import
 * @param data[].xpath - XPath to element containing highlight
 * @param data[].offsetStart - Start position of highlighted text
 * @param data[].offsetEnd - End position of highlighted text
 * @param data[].offsetCount - Number of words highlighted
 * @param data[].underline - Whether highlight has underline or not
 * @param data[].strikethrough - Whether highlight has strikethrough or not
 * @param data[].noteColor - Background color of highlight (default is first color in list)
 * @param data[].note - Array of regular text notes associated with highlight
 * @param data[].noteMark - Array of scoring/evaluation notes associated with highlight
 * @param data[].parentText - Full text of parent element (for validation, optional)
 * @param data[].highlightText - Exact text that was highlighted (required for positioning)
 */
export function importHighlightsData(data: Array<ImportExportData>) {
    // Clean DOM - Remove all old highlights before importing new data
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
            );
            if (!success) {
                console.warn(
                    "Could not find and highlight text:",
                    item.highlightText,
                    "trong element:",
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
 * @param parent - Parent element containing text to highlight
 * @param targetText - Text to find and highlight
 * @param item - Highlight data from import
 * @returns boolean - Success or failure
 */
function findAndHighlightTextAcrossNodes(
    parent: HTMLElement,
    targetText: string,
    item: ImportExportData,
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
            const foundRange = selection.getRangeAt(0);

            // Check if range is within parent
            if (parent.contains(foundRange.commonAncestorContainer)) {
                const span = createHighlightSpan(
                    item.noteColor || colors[3].code,
                    genUid(),
                    item.underline || false,
                    item.strikethrough || false,
                );
                span.className = "highlighted-text";

                try {
                    const contents = foundRange.extractContents();
                    span.appendChild(contents);
                    foundRange.insertNode(span);

                    addNotesToSpan(span, item);

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

    // Fallback: if window.find doesn't work, use TreeWalker method
    if (!found) {
        found = findAndHighlightTextWithTreeWalker(parent, targetText, item);
    }

    return found;
}

/**
 * Fallback method using TreeWalker to find and highlight text
 * @param parent - Parent element containing text to highlight
 * @param targetText - Text to find and highlight
 * @param item - Highlight data from import
 * @returns boolean - Success or failure
 */
function findAndHighlightTextWithTreeWalker(
    parent: HTMLElement,
    targetText: string,
    item: ImportExportData,
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
        item.noteColor || colors[3].code,
        genUid(),
        item.underline || false,
        item.strikethrough || false,
    );
    span.className = "highlighted-text";
    span.textContent = targetText;

    addNotesToSpan(span, item);

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
 * @param item - Highlight data from import
 */
function addNotesToSpan(span: HTMLElement, item: ImportExportData): void {
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

            const noteBox = createNoteBox(note, onDelete, noteUid, null);
            dialogManager.addNoteEventListener(noteBox, noteUid);
            span.appendChild(noteBox);
        });
    }

    // Add note marks to highlight
    if (item.noteMark) {
        item.noteMark.forEach((noteMark) => {
            const correctedUid = genUid();
            const existingCorrectedAnswers =
                getCorrectedAnswersFromLocalStorage();
            const updatedCorrectedAnswers = {
                ...existingCorrectedAnswers,
                [correctedUid]: noteMark,
            };
            setCorrectedAnswersToLocalStorage(updatedCorrectedAnswers);

            const noteMarkBox = createNoteBox(
                noteMark,
                onDelete,
                null,
                correctedUid,
            );
            Object.assign(noteMarkBox.style, {
                background: "#e3f2fd",
                border: "1px solid #90caf9",
                marginLeft: "8px",
                display: "inline-block",
                fontSize: "0.95em",
                color: "#1976d2",
                userSelect: "none",
            });
            noteMarkBox.textContent = noteMark;
            span.appendChild(noteMarkBox);
        });
    }
}

/**
 * Export and collect information of all existing highlights on the page into storable data
 * @returns Array containing detailed information of all highlights on the page
 * @returns Array[].xpath - XPath to element containing highlight
 * @returns Array[].offsetStart - Character start position of highlight in parent text (from beginning of text)
 * @returns Array[].offsetEnd - Character end position of highlight in parent text
 * @returns Array[].offsetCount - Number of words highlighted (separated by spaces)
 * @returns Array[].note - Array of regular text notes associated with highlight
 * @returns Array[].noteMark - Array of scoring/evaluation notes associated with highlight
 * @returns Array[].parentText - Full text of parent element (for validation during import)
 * @returns Array[].highlightText - Exact text that was highlighted (for positioning during import)
 */
export function exportHighlightsData() {
    // Collect all highlight elements and data from localStorage
    const highlights =
        document.querySelectorAll<HTMLElement>(".highlighted-text");
    const notes = JSON.parse(localStorage.getItem("noteUid") || "{}");
    const correctedAnswers = JSON.parse(
        localStorage.getItem("correctedAnswersUid") || "{}",
    );

    const result: Array<{
        xpath: string;
        offsetStart: number;
        offsetEnd: number;
        offsetCount: number;
        noteColor?: string;
        underline?: boolean;
        strikethrough?: boolean;
        note: string[];
        noteMark: string[];
        parentText?: string;
        highlightText?: string;
    }> = [];

    highlights.forEach((el) => {
        // Get xpath of highlight element
        const xpath = getXpathFromElement(el, "highlighted-area");
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

        // Calculate offset position of highlight in parent text
        let offsetStart = -1;
        let offsetEnd = -1;
        if (parentText && highlightText) {
            offsetStart = parentText.indexOf(highlightText);
            offsetEnd = offsetStart + highlightText.length;
        }

        const offsetCount = highlightText.trim().split(/\s+/).length;

        const note: string[] = [];
        const noteSpan = el.querySelectorAll(
            ".highlight-note[note-uid]",
        ) as NodeListOf<HTMLSpanElement>;
        if (noteSpan) {
            noteSpan.forEach((span) => {
                const noteUid = span.getAttribute("note-uid");
                if (noteUid && notes[noteUid]) {
                    note.push(notes[noteUid]);
                }
            });
        }

        const noteMark: string[] = [];
        const correctedSpan = el.querySelectorAll(
            ".highlight-note[corrected-answer-uid]",
        ) as NodeListOf<HTMLSpanElement>;
        if (correctedSpan) {
            correctedSpan.forEach((span) => {
                const correctedUid = span.getAttribute("corrected-answer-uid");
                if (correctedUid && correctedAnswers[correctedUid]) {
                    noteMark.push(correctedAnswers[correctedUid]);
                }
            });
        }

        const noteColor = el.style.backgroundColor || colors[0].code;
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
            noteColor,
            noteMark,
            parentText,
            highlightText,
        });
    });

    return result;
}
