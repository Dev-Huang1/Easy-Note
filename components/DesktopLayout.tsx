import type { Note } from "@/types"
import NoteList from "./NoteList"
import NoteEditor from "./NoteEditor"
import ResizablePanel from "./ResizablePanel"

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
    <div className="h-screen bg-white">
      <ResizablePanel
        left={
          <NoteList
            notes={notes}
            selectedNote={selectedNote}
            setSelectedNote={setSelectedNote}
            addNote={addNote}
            deleteNote={deleteNote}
          />
        }
        right={
          selectedNote ? (
            <NoteEditor note={selectedNote} updateNote={updateNote} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              Select a note or create a new one
            </div>
          )
        }
        initialLeftWidth={30}
      />
    </div>
  )
}

