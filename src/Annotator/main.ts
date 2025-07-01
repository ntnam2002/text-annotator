import AnnotatorComponent from "./index";

export { importHighlightsData, exportHighlightsData } from "./utils";

export type {
    ImportExportData,
    ExportHighlightResult,
} from "./types/importExport.interface";

export type { HighlightDialogProps } from "./types/annotator.interface";

export const Annotator = AnnotatorComponent;
