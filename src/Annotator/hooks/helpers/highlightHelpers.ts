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
 * Tạo một span highlight với màu nền và uid
 *
 * @param color - Màu nền highlight (ví dụ: '#ff0')
 * @param uid - Định danh duy nhất cho highlight
 * @param underline - Có gạch chân hay không (mặc định là false)
 * @param strikethrough - Có gạch ngang hay không (mặc định là false)
 * @returns HTMLSpanElement đã cấu hình highlight
 */
export function createHighlightSpan(
    backgroundColor: string,
    uid: string,
    underline: boolean = false,
    strikethrough: boolean = false,
): HTMLSpanElement {
    const highlightSpan = document.createElement("span");
    highlightSpan.style.backgroundColor = backgroundColor;
    highlightSpan.className = "highlighted-text";
    if (underline) {
        highlightSpan.style.backgroundColor = "transparent";
        highlightSpan.style.borderBottom = "2px solid red";
        highlightSpan.style.display = "inline";
        highlightSpan.style.textDecoration = "none";
    }
    if (strikethrough) {
        highlightSpan.style.textDecoration = "line-through";
        highlightSpan.style.backgroundColor = "transparent";
        highlightSpan.style.borderBottom = "none";
    }
    highlightSpan.setAttribute("data-uid", uid);
    return highlightSpan;
}

/**
 * Hàm tạo một span note với nội dung và sự kiện xóa
 *
 * @param note - Nội dung note để hiển thị
 * @param onDelete - Hàm callback khi xóa note hoặc đáp án đã sửa
 * @param uid - Định danh note (nếu có)
 * @param correctedAnswerUid - Định danh đáp án đã sửa (nếu có)
 * @returns HTMLSpanElement chứa note và nút xóa
 */
export function createNoteBox(
    note: string,
    onDelete: (uid: string | null, correctedAnswerUid: string | null) => void,
    noteUid: string | null,
    highlightUid: string,
    correctedAnswerUid: string | null,
    deleteNoteButtonVisible: boolean = true,
): HTMLSpanElement {
    console.log("createNoteBox called with noteUid:", noteUid);
    console.log(
        "createNoteBox called with correctedAnswerUid:",
        correctedAnswerUid,
    );
    console.log("createNoteBox called with highlightUid:", highlightUid);
    console.log("createNoteBox called with note:", note);
    console.log(
        "createNoteBox called with deleteNoteButtonVisible:",
        deleteNoteButtonVisible,
    );

    const noteBox = document.createElement("span");
    noteBox.className = "highlight-note";
    noteBox.setAttribute("data-uid", highlightUid);

    if (noteUid) {
        noteBox.setAttribute("note-uid", noteUid);
    }
    if (correctedAnswerUid) {
        noteBox.setAttribute("corrected-answer-uid", correctedAnswerUid);
    }
    const noteTextElement = document.createElement("span");
    noteTextElement.textContent = note;
    const deleteIcon = document.createElement("span");
    if (deleteNoteButtonVisible) {
        console.log("deleteNoteButtonVisible", deleteNoteButtonVisible);
        deleteIcon.className = "delete-icon";
        deleteIcon.textContent = "✖";
        deleteIcon.onclick = (event) => {
            event.stopPropagation();
            if (noteUid) {
                onDelete(noteUid, null);
                const notes = JSON.parse(
                    localStorage.getItem("noteUid") || "{}",
                );
                if (notes[noteUid]) {
                    delete notes[noteUid];
                    localStorage.setItem("noteUid", JSON.stringify(notes));
                }
            }
            if (correctedAnswerUid) {
                onDelete(null, correctedAnswerUid);
                const corrected = JSON.parse(
                    localStorage.getItem("correctedAnswersUid") || "{}",
                );
                if (corrected[correctedAnswerUid]) {
                    delete corrected[correctedAnswerUid];
                    localStorage.setItem(
                        "correctedAnswersUid",
                        JSON.stringify(corrected),
                    );
                }
            }
        };
    }

    noteBox.appendChild(noteTextElement);
    noteBox.appendChild(deleteIcon);
    return noteBox;
}

/**
 * Cập nhật nội dung note trong noteBox
 *
 * @param noteBox - Phần tử NoteBox cần cập nhật
 * @param note - Nội dung note mới
 */
export function updateNoteText(noteBox: HTMLElement, note: string) {
    const noteTextElement = noteBox.querySelector("span");
    if (noteTextElement) {
        noteTextElement.textContent = note;
    }
}

/**
 * Hàm xóa highlight và note dựa trên uid
 *
 * @param noteUid - Định danh note cần xóa
 * @param correctedAnswerUid - Định danh đáp án đã sửa cần xóa
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
    // If range is only within 1 text node, wrap normally
    if (
        range.startContainer === range.endContainer &&
        range.startContainer.nodeType === Node.TEXT_NODE
    ) {
        const contents = range.extractContents();
        highlightSpan.appendChild(contents);
        range.insertNode(highlightSpan);
        return;
    }

    const workingRange = range.cloneRange();

    // Collect all text nodes that need to be highlighted
    const textNodesToWrap: {
        node: Text;
        startOffset?: number;
        endOffset?: number;
    }[] = [];

    const walker = document.createTreeWalker(
        workingRange.commonAncestorContainer,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: (node) => {
                // Check if text node intersects with range
                if (workingRange.intersectsNode(node)) {
                    return NodeFilter.FILTER_ACCEPT;
                }
                return NodeFilter.FILTER_REJECT;
            },
        },
    );

    let currentNode = walker.nextNode();
    while (currentNode) {
        const textNode = currentNode as Text;
        if (textNode.textContent && textNode.textContent.trim() !== "") {
            let startOffset = 0;
            let endOffset = textNode.textContent.length;

            // If this is start container, use startOffset
            if (textNode === workingRange.startContainer) {
                startOffset = workingRange.startOffset;
            }

            // If this is end container, use endOffset
            if (textNode === workingRange.endContainer) {
                endOffset = workingRange.endOffset;
            }

            textNodesToWrap.push({
                node: textNode,
                startOffset,
                endOffset,
            });
        }
        currentNode = walker.nextNode();
    }

    // Wrap text nodes from end to beginning to avoid changing DOM structure
    for (let i = textNodesToWrap.length - 1; i >= 0; i--) {
        const { node: textNode, startOffset, endOffset } = textNodesToWrap[i];
        if (
            startOffset !== undefined &&
            endOffset !== undefined &&
            startOffset < endOffset
        ) {
            // Create range for text part that needs highlighting
            const nodeRange = document.createRange();
            nodeRange.setStart(textNode, startOffset);
            nodeRange.setEnd(textNode, endOffset);

            // Extract content and wrap with span
            const span = highlightSpan.cloneNode(false) as HTMLElement;
            const extractedContent = nodeRange.extractContents();
            span.appendChild(extractedContent);
            nodeRange.insertNode(span);
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
