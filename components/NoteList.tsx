import { useState } from "react"
import Image from "next/image"
import type { Note } from "@/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { PlusCircle, Search, Trash2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface NoteListProps {
  notes: Note[]
  selectedNote: Note | null
  setSelectedNote: (note: Note) => void
  addNote: () => void
  deleteNote: (id: number) => void
}

export default function NoteList({ notes, selectedNote, setSelectedNote, addNote, deleteNote }: NoteListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (note.tag && note.tag.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getPreview = (content: string) => {
    const stripped = content.replace(/<[^>]+>/g, "")
    return stripped.length > 100 ? stripped.slice(0, 100) + "..." : stripped
  }

  const formatDate = (date: number) => {
    return new Date(date).toLocaleString()
  }

  return (
    <div className="h-full flex flex-col bg-gray-50 border-r">
      <div className="p-4 flex items-center space-x-2 border-b">
        <Image src="/logo.svg" alt="Easy Note Logo" width={24} height={24} />
        <span className="font-semibold text-lg">Easy Note</span>
      </div>
      <div className="p-4 flex items-center space-x-2">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8 bg-white"
          />
        </div>
        <Button onClick={addNote} variant="ghost" size="icon">
          <PlusCircle className="h-5 w-5" />
        </Button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {filteredNotes.map((note) => (
          <div
            key={note.id}
            className={`p-3 border-b cursor-pointer hover:bg-gray-100 transition-colors duration-200 ${
              selectedNote?.id === note.id ? "bg-gray-100" : ""
            }`}
            onClick={() => setSelectedNote(note)}
          >
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-sm truncate">{note.title}</h3>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => e.stopPropagation()}
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  >
                    <Trash2 className="h-4 w-4 text-gray-400" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete your note.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteNote(note.id)}>Delete</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {note.tag && <span className="mr-2">#{note.tag}</span>}
              <span>{formatDate(note.lastEdited)}</span>
            </div>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{getPreview(note.content)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

