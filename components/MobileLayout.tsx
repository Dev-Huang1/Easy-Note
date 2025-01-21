import type { Note } from "@/types"
import NoteList from "./NoteList"
import NoteEditor from "./NoteEditor"

interface MobileLayoutProps {
  notes: Note[]
  selectedNote: Note | null
  setSelectedNote: (note: Note | null) => void
  addNote: () => void
  updateNote: (note: Note) => void
  deleteNote: (id: number) => void
}

export default function MobileLayout({
  notes,
  selectedNote,
  setSelectedNote,
  addNote,
  updateNote,
  deleteNote,
}: MobileLayoutProps) {
  return (
    <div className="h-screen bg-white">
      {selectedNote ? (
        <NoteEditor note={selectedNote} updateNote={updateNote} onBack={() => setSelectedNote(null)} />
      ) : (
        <NoteList
          notes={notes}
          selectedNote={selectedNote}
          setSelectedNote={setSelectedNote}
          addNote={addNote}
          deleteNote={deleteNote}
        />
      )}
    </div>
  )
}

