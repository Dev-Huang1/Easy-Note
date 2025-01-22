"use client"

import { useState, useEffect } from "react"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import DesktopLayout from "@/components/DesktopLayout"
import MobileLayout from "@/components/MobileLayout"
import WaitingRoom from "@/components/WaitingRoom"
import type { Note } from "@/types"

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [isDesktop, isMediaQueryLoading] = useMediaQuery("(min-width: 768px)")
  const [isNotesLoading, setIsNotesLoading] = useState(true)

  useEffect(() => {
    const savedNotes = localStorage.getItem("notes")
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
    setIsNotesLoading(false)
  }, [])

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])

  const addNote = () => {
    const newNote: Note = {
      id: Date.now(),
      title: "New Note",
      content: "",
      tags: [],
    }
    setNotes([...notes, newNote])
    setSelectedNote(newNote)
  }

  const updateNote = (updatedNote: Note) => {
    const updatedNotes = notes.map((note) => (note.id === updatedNote.id ? updatedNote : note))
    setNotes(updatedNotes)
    setSelectedNote(updatedNote)
  }

  const deleteNote = (id: number) => {
    const updatedNotes = notes.filter((note) => note.id !== id)
    setNotes(updatedNotes)
    setSelectedNote(null)
  }

  if (isMediaQueryLoading || isNotesLoading) {
    return <WaitingRoom />
  }

  return isDesktop ? (
    <DesktopLayout
      notes={notes}
      selectedNote={selectedNote}
      setSelectedNote={setSelectedNote}
      addNote={addNote}
      updateNote={updateNote}
      deleteNote={deleteNote}
    />
  ) : (
    <MobileLayout
      notes={notes}
      selectedNote={selectedNote}
      setSelectedNote={setSelectedNote}
      addNote={addNote}
      updateNote={updateNote}
      deleteNote={deleteNote}
    />
  )
}

