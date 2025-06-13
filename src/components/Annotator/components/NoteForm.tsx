import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { NoteFormProps } from "../types/note.interface";
import styles from "../styles/note.module.css";

/**
 * @description Note form to add new notes or edit existing notes
 * @param params
 * @param params.noteUid - UID of the note
 * @param params.dialogPos - Dialog position
 * @param params.handleAddNote - Function to add new note
 * @param params.setNoteVisible - Function to show/hide note form
 * @param params.enableAnswerCheck - Check if answer checking feature is enabled
 * @returns
 */
const NoteForm = ({
    noteUid,
    dialogPos,
    handleAddNote,
    setNoteVisible,
    enableAnswerCheck,
}: NoteFormProps) => {
    const [selectedAnswer, setSelectedAnswer] = useState<string>("");

    useEffect(() => {
        const noteInput = document.querySelector(
            "textarea[name='note']",
        ) as HTMLTextAreaElement | null;
        if (noteInput && noteUid) {
            noteInput.focus();
            const notes = JSON.parse(localStorage.getItem("noteUid") || "{}");
            // Get note by uid
            const note = notes[noteUid];
            if (note) {
                noteInput.value = note;
            } else {
                noteInput.value = "";
            }
        }
    }, [noteUid]);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const noteInput = e.target as HTMLFormElement;
        const checkedAnswer = noteInput.elements.namedItem(
            "answer",
        ) as HTMLInputElement;
        const correctAnswerInput = noteInput.elements.namedItem(
            "correctedAnswer",
        ) as HTMLTextAreaElement;
        const note = noteInput.elements.namedItem("note") as HTMLInputElement;

        handleAddNote(
            note?.value,
            checkedAnswer?.value,
            correctAnswerInput?.value,
        );
        note.value = "";
        setNoteVisible(false);
    };

    return (
        <form
            onSubmit={handleSubmit}
            style={{
                top: dialogPos.top + 50,
                left: dialogPos.left,
            }}
            className={styles["note-form"]}
        >
            <textarea
                name="note"
                placeholder="Add note..."
                className={styles["note-textarea"]}
                autoFocus
            />
            {enableAnswerCheck && (
                <div className={styles["answer-check"]}>
                    <div className={styles["answer-check-options"]}>
                        <input
                            type="radio"
                            id="correctAnswer"
                            name="answer"
                            value="correct"
                            checked={selectedAnswer === "correct"}
                            onChange={() =>
                                setSelectedAnswer(
                                    selectedAnswer === "correct"
                                        ? ""
                                        : "correct",
                                )
                            }
                        />
                        <label htmlFor="correctAnswer">Correct</label>
                    </div>

                    <div className={styles["answer-check-options"]}>
                        <input
                            type="radio"
                            id="wrongAnswer"
                            name="answer"
                            value="wrong"
                            checked={selectedAnswer === "wrong"}
                            onChange={() =>
                                setSelectedAnswer(
                                    selectedAnswer === "wrong" ? "" : "wrong",
                                )
                            }
                        />
                        <label htmlFor="wrongAnswer">Wrong</label>
                    </div>
                </div>
            )}

            {selectedAnswer === "wrong" && (
                <textarea
                    name="correctedAnswer"
                    placeholder="Corrected answer..."
                    className={styles["note-textarea"]}
                />
            )}
            <button type="submit" className={styles["note-submit-button"]}>
                <Check size={18} />
            </button>
        </form>
    );
};
export default NoteForm;
