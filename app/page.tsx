"use client"

import { useState, useEffect } from "react"
import { useMediaQuery } from "@/hooks/useMediaQuery"
import DesktopLayout from "@/components/DesktopLayout"
import MobileLayout from "@/components/MobileLayout"
import type { Note } from "@/types"

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  useEffect(() => {
    const savedNotes = localStorage.getItem("notes")
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])

  const addNote = () => {
    const newNote: Note = {
      id: Date.now(),
      title: "New Note",
      content: "",
      tag: "",
      lastEdited: Date.now(),
    }
    setNotes([...notes, newNote])
    setSelectedNote(newNote)
  }

  const updateNote = (updatedNote: Note) => {
    const updatedNotes = notes.map((note) =>
      note.id === updatedNote.id ? { ...updatedNote, lastEdited: Date.now() } : note,
    )
    setNotes(updatedNotes)
    setSelectedNote({ ...updatedNote, lastEdited: Date.now() })
  }

  const deleteNote = (id: number) => {
    const updatedNotes = notes.filter((note) => note.id !== id)
    setNotes(updatedNotes)
    setSelectedNote(null)
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

