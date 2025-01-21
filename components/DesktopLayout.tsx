import type { Note } from "@/types"
import NoteList from "./NoteList"
import NoteEditor from "./NoteEditor"

interface DesktopLayoutProps {
  notes: Note[]
  selectedNote: Note | null
  setSelectedNote: (note: Note | null) => void
  addNote: () => void
  updateNote: (note: Note) => void
  deleteNote: (id: number) => void
}

export default function DesktopLayout({
  notes,
  selectedNote,
  setSelectedNote,
  addNote,
  updateNote,
  deleteNote,
}: DesktopLayoutProps) {
  return (
    <div className="flex h-screen bg-white">
      <div className="w-64 border-r">
        <NoteList
          notes={notes}
          selectedNote={selectedNote}
          setSelectedNote={setSelectedNote}
          addNote={addNote}
          deleteNote={deleteNote}
        />
      </div>
      <div className="flex-1">
        {selectedNote ? (
          <NoteEditor note={selectedNote} updateNote={updateNote} />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">Select a note or create a new one</div>
        )}
      </div>
    </div>
  )
}

