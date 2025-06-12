/**
 * Function to wrap a text segment in a highlight span
 * @param range - Range object containing the text segment to highlight
 */
export function unwrapHighlightsInRange(range: Range) {
    const treeWalker = document.createTreeWalker(
        range.commonAncestorContainer,
        NodeFilter.SHOW_ELEMENT,
        {
            acceptNode: (node) => {
                if (
                    node instanceof HTMLElement &&
                    node.classList.contains("highlighted-text") &&
                    range.intersectsNode(node)
                ) {
                    return NodeFilter.FILTER_ACCEPT;
                }
                return NodeFilter.FILTER_SKIP;
            },
        },
    );
    const toUnwrap: HTMLElement[] = [];
    let currentNode = treeWalker.nextNode();
    while (currentNode) {
        toUnwrap.push(currentNode as HTMLElement);
        currentNode = treeWalker.nextNode();
    }
    toUnwrap.forEach((span) => {
        while (span.firstChild) {
            span.parentNode?.insertBefore(span.firstChild, span);
        }
        span.parentNode?.removeChild(span);
    });
}

/**
 * Create a highlight span with background color and uid
 *
 * @param color - Highlight background color (e.g.: '#ff0')
 * @param uid - Unique identifier for highlight
 * @param underline - Whether to have underline or not (default is false)
 * @param strikethrough - Whether to have strikethrough or not (default is false)
 * @returns HTMLSpanElement configured with highlight
 */
export function createHighlightSpan(
    color: string,
    uid: string,
    underline: boolean = false,
    strikethrough: boolean = false,
): HTMLSpanElement {
    const highlightSpan = document.createElement("span");
    highlightSpan.style.backgroundColor = color;
    highlightSpan.className = "highlighted-text";
    if (underline) {
        highlightSpan.style.backgroundColor = "transparent";
        highlightSpan.style.borderBottom = "2px solid red";
        highlightSpan.style.display = "inline";
        highlightSpan.style.textDecoration = "none";
    }
    if (strikethrough) {
        highlightSpan.style.textDecoration = "line-through";
    }
    highlightSpan.setAttribute("data-uid", uid);
    return highlightSpan;
}

/**
 * Function to create a note span with content and delete events
 *
 * @param note - Note content to display
 * @param onDelete - Callback function when deleting note or corrected answer
 * @param uid - Note identifier (if available)
 * @param correctedUid - Corrected answer identifier (if available)
 * @returns HTMLSpanElement containing note and delete button
 */
export function createNoteBox(
    note: string,
    onDelete: (uid: string | null, correctedAnswerUid: string | null) => void,
    uid: string | null,
    correctedUid: string | null,
): HTMLSpanElement {
    const noteBox = document.createElement("span");
    noteBox.className = "highlight-note";
    if (uid) {
        noteBox.setAttribute("note-uid", uid);
    }
    if (correctedUid) {
        noteBox.setAttribute("corrected-answer-uid", correctedUid);
    }
    const noteTextElement = document.createElement("span");
    noteTextElement.textContent = note;

    const deleteIcon = document.createElement("span");
    deleteIcon.className = "delete-icon";
    deleteIcon.textContent = "✖";
    deleteIcon.onclick = (event) => {
        event.stopPropagation();
        if (uid) {
            onDelete(uid, null);
            const notes = JSON.parse(localStorage.getItem("noteUid") || "{}");
            if (notes[uid]) {
                delete notes[uid];
                localStorage.setItem("noteUid", JSON.stringify(notes));
            }
        }
        if (correctedUid) {
            onDelete(null, correctedUid);
            const corrected = JSON.parse(
                localStorage.getItem("correctedAnswersUid") || "{}",
            );
            if (corrected[correctedUid]) {
                delete corrected[correctedUid];
                localStorage.setItem(
                    "correctedAnswersUid",
                    JSON.stringify(corrected),
                );
            }
        }
    };
    noteBox.appendChild(noteTextElement);
    noteBox.appendChild(deleteIcon);
    return noteBox;
}

/**
 * Update note content in noteBox
 *
 * @param noteBox - NoteBox element to update
 * @param note - New note content
 */
export function updateNoteText(noteBox: HTMLElement, note: string) {
    const noteTextElement = noteBox.querySelector("span");
    if (noteTextElement) {
        noteTextElement.textContent = note;
    }
}

/**
 * Function to delete highlight and note based on uid
 *
 * @param noteUid - Identifier of note to delete
 * @param correctedAnswerUid - Identifier of corrected answer to delete
 */
export const onDelete = (
    noteUid: string | null,
    correctedAnswerUid: string | null,
) => {
    if (correctedAnswerUid) {
        document
            .querySelector(`[corrected-answer-uid="${correctedAnswerUid}"]`)
            ?.remove();
    }
    if (noteUid) {
        document.querySelector(`[note-uid="${noteUid}"]`)?.remove();
    }
};

/**
 * Hàm bọc các text node trong một range bằng một span highlight
 * @param range
 * @param highlightSpan
 */
export const wrapTextNodesInRange = (
    range: Range,
    highlightSpan: HTMLElement,
) => {
    // If range is within 1 text node, wrap normally
    if (
        range.startContainer === range.endContainer &&
        range.startContainer.nodeType === Node.TEXT_NODE
    ) {
        const contents = range.extractContents();
        highlightSpan.appendChild(contents);
        range.insertNode(highlightSpan);
        return;
    }
    // If range spans multiple nodes, only wrap child text nodes
    const walker = document.createTreeWalker(
        range.commonAncestorContainer,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: (node) => {
                const nodeRange = document.createRange();
                nodeRange.selectNodeContents(node);
                return range.compareBoundaryPoints(
                    Range.END_TO_START,
                    nodeRange,
                ) < 0 &&
                    range.compareBoundaryPoints(Range.START_TO_END, nodeRange) >
                        0
                    ? NodeFilter.FILTER_ACCEPT
                    : NodeFilter.FILTER_REJECT;
            },
        },
    );
    let node;
    while ((node = walker.nextNode())) {
        const textNode = node as Text;
        if (textNode.textContent && textNode.textContent.trim() !== "") {
            const span = highlightSpan.cloneNode(false) as HTMLElement;
            const newText = document.createTextNode(textNode.textContent!);
            span.appendChild(newText);
            textNode.parentNode?.replaceChild(span, textNode);
        }
    }
};

/**
 * Hàm lấy target của sự kiện chuột hoặc cảm ứng
 * @param event
 * @returns Node | null
 */
export const getEventTarget = (event: MouseEvent | TouchEvent): Node | null => {
    if (event instanceof TouchEvent && event.targetTouches.length > 0) {
        return event.targetTouches[0].target as Node;
    } else if (event instanceof MouseEvent) {
        return event.target as Node;
    }
    return null;
};
