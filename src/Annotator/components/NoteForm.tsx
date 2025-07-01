import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { NoteFormProps } from "../types/note.interface";
import styles from "../styles/note.module.css";

/**
 * @description Form ghi chú để thêm mới hoặc chỉnh sửa ghi chú
 * @param params
 * @param params.noteUid - UID của ghi chú
 * @param params.dialogPos - Vị trí hộp thoại
 * @param params.handleAddNote - Hàm thêm ghi chú mới
 * @param params.setNoteVisible - Hàm hiển thị/ẩn form ghi chú
 * @param params.enableAnswerCheck - Kiểm tra tính năng kiểm tra đáp án có được bật không
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
                    placeholder="Correct answer..."
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
