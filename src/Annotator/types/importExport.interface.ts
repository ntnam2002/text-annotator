export interface ImportExportData {
    xpath: string;
    offsetStart: number;
    offsetEnd: number;
    offsetCount: number;
    underline: boolean;
    strikethrough: boolean;
    note: string[];
    highlightColor: string;
    noteMark: string[];
    parentText?: string;
    highlightText?: string;
    deleteNoteButtonVisible: boolean; // Optional field to indicate if the delete note button is visible
}
export interface ExportHighlightResult {
    xpath: string;
    offsetStart: number;
    offsetEnd: number;
    offsetCount: number;
    underline: boolean;
    strikethrough: boolean;
    note: string[];
    highlightColor: string;
    noteMark: string[];
    parentText?: string;
    highlightText: string;
}

/**
 * Import and restore highlights from saved data into the DOM
 *
 * Main functions:
 * 1. Remove all existing highlights on the page
 * 2. Iterate through each item in the data and recreate the highlights
 * 3. Restore notes and noteMarks related to the highlights
 *
 * @param data - Array containing highlight information to import
 * @param data[].xpath - XPath to element containing highlight
 * @param data[].offsetStart - Start position of highlighted text (not used in current version)
 * @param data[].offsetEnd - End position of highlighted text (not used in current version)
 * @param data[].offsetCount - Number of highlighted words (not used in current version)
 * @param data[].noteColor - Background color of highlight (default is first color in list)
 * @param data[].note - Array of regular text notes associated with highlight
 * @param data[].noteMark - Array of scoring/evaluation notes associated with highlight
 * @param data[].parentText - Full text of parent element (for validation, optional)
 * @param data[].highlightText - Exact text that was highlighted (required for positioning)
 */
export declare function importHighlightsData(
    data: Array<ImportExportData>,
): void;

/**
 * Export and collect information of all existing highlights on the page into storable data
 *
 * @returns Array containing detailed information of all highlights on the page
 * @returns Array[].xpath - XPath to element containing highlight
 * @returns Array[].offsetStart - Character start position of highlight in parent text (from beginning of text)
 * @returns Array[].offsetEnd - Character end position of highlight in parent text
 * @returns Array[].offsetCount - Number of highlighted words (separated by spaces)
 * @returns Array[].note - Array of regular text notes related to highlight
 * @returns Array[].noteMark - Array of scoring/evaluation notes related to highlight
 * @returns Array[].parentText - Full text of parent element (for validation during import)
 * @returns Array[].highlightText - Exact highlighted text (for positioning during import)
 */
export declare function exportHighlightsData(): Array<ExportHighlightResult>;
