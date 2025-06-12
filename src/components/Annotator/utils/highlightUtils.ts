// Generate UID
export const genUid = () => crypto.randomUUID();

// Functions to store and retrieve data from localStorage
export const getNotesFromLocalStorage = () =>
    JSON.parse(localStorage.getItem("noteUid") || "{}") as Record<
        string,
        string
    >;
export const setNotesToLocalStorage = (notes: Record<string, string>) =>
    localStorage.setItem("noteUid", JSON.stringify(notes));

export const getCorrectedAnswersFromLocalStorage = () =>
    JSON.parse(localStorage.getItem("correctedAnswersUid") || "{}") as Record<
        string,
        string
    >;

export const setCorrectedAnswersToLocalStorage = (
    obj: Record<string, string>,
) => localStorage.setItem("correctedAnswersUid", JSON.stringify(obj));

/** Get xpath of a node
 * @param element - Node to get xpath from
 * @param rootContainerId - ID of container div as root (optional)
 * @return - Xpath of node as string
 * @description This function will return the xpath of a node, which can start from a specific container div with an id.
 */
export function getXpathFromElement(
    element: Element,
    rootContainerId?: string,
): string {
    // If there is rootContainerId, find container div and use as root
    if (rootContainerId) {
        const rootContainer = document.getElementById(rootContainerId);
        if (rootContainer && rootContainer.contains(element)) {
            // If element is the root container itself
            if (element === rootContainer) {
                return `//DIV[@id='${rootContainerId}']`;
            }

            // If element is a child of root container
            return getXpathFromElementRelativeToRoot(element, rootContainer);
        }
    }

    // Fallback to old method if no rootContainerId or container not found
    if (element.tagName === "HTML") return "/HTML[1]";
    if (element === document.body) return "/HTML[1]/BODY[1]";

    let ix = 0;
    const siblings = element.parentNode?.childNodes;
    if (!siblings) return "";

    for (let i = 0; i < siblings.length; i++) {
        const sibling = siblings[i];
        if (sibling === element)
            return (
                getXpathFromElement(
                    element.parentNode as Element,
                    rootContainerId,
                ) +
                "/" +
                element.tagName +
                "[" +
                (ix + 1) +
                "]"
            );
        if (
            sibling.nodeType === 1 &&
            (sibling as Element).tagName === element.tagName
        )
            ix++;
    }
    return "";
}

/** Get xpath of element relative to root container
 * @param element - Element to get xpath from
 * @param rootContainer - Container div as root
 * @return - Relative xpath from root container
 */
function getXpathFromElementRelativeToRoot(
    element: Element,
    rootContainer: Element,
): string {
    if (element === rootContainer) {
        return `//DIV[@id='${rootContainer.id}']`;
    }

    const path: string[] = [];
    let currentElement: Element | null = element;

    while (currentElement && currentElement !== rootContainer) {
        let ix = 0;
        const siblings: NodeListOf<ChildNode> | undefined = currentElement
            .parentNode?.childNodes as NodeListOf<ChildNode> | undefined;
        if (!siblings) break;

        for (let i = 0; i < siblings.length; i++) {
            const sibling = siblings[i];
            if (sibling === currentElement) {
                path.unshift(`${currentElement.tagName}[${ix + 1}]`);
                break;
            }
            if (
                sibling.nodeType === 1 &&
                (sibling as Element).tagName === currentElement.tagName
            ) {
                ix++;
            }
        }
        currentElement = currentElement.parentElement;
    }

    return `//DIV[@id='${rootContainer.id}']/${path.join("/")}`;
}

/** Get node from xpath
 * @param xpath - Xpath of node to get
 * @param root - Root node to start search from (default is document)
 * @param rootContainerId - ID of container div as root (optional)
 * @return - Found node or null if not found
 */
export function getElementByXPath(
    xpath: string,
    root: Document | Element = document,
    rootContainerId?: string,
): Node | null {
    try {
        // If there is rootContainerId and xpath starts with that container div
        if (rootContainerId && xpath.includes(`[@id='${rootContainerId}']`)) {
            const rootContainer = document.getElementById(rootContainerId);
            if (rootContainer) {
                // If xpath is just the container div
                if (xpath === `//DIV[@id='${rootContainerId}']`) {
                    return rootContainer;
                }

                // Create relative xpath from container
                const relativePath = xpath.replace(
                    `//DIV[@id='${rootContainerId}']/`,
                    "./",
                );
                const result = document.evaluate(
                    relativePath,
                    rootContainer,
                    null,
                    XPathResult.FIRST_ORDERED_NODE_TYPE,
                    null,
                );
                return result.singleNodeValue;
            }
        }

        // Fallback to old method
        const result = document.evaluate(
            xpath,
            root,
            null,
            XPathResult.FIRST_ORDERED_NODE_TYPE,
            null,
        );
        return result.singleNodeValue;
    } catch {
        return null;
    }
}
/**
 * Helper function to expand range to word boundaries
 * @param range - Range to expand
 * @description This function will expand the selected range to word boundaries, including special characters and Vietnamese language support.
 */
export function expandRangeToWordBoundaries(range: Range) {
    function isWordChar(char: string) {
        return /[\wÀ-ỹ]/.test(char); // Check if character is letter, number or Vietnamese character
    }
    // Expand start
    if (range.startContainer.nodeType === Node.TEXT_NODE) {
        const text = range.startContainer.textContent || "";
        let start = range.startOffset;
        while (start > 0 && isWordChar(text[start - 1])) {
            start--;
        }
        range.setStart(range.startContainer, start);
    }
    // Expand end
    if (range.endContainer.nodeType === Node.TEXT_NODE) {
        const text = range.endContainer.textContent || "";
        let end = range.endOffset;
        while (end < text.length && isWordChar(text[end])) {
            end++;
        }
        range.setEnd(range.endContainer, end);
    }
}
