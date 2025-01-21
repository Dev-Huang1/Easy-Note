import { useState, useEffect } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextStyle from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import type { Note } from "@/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Bold, Italic, UnderlineIcon, ChevronLeft } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface NoteEditorProps {
  note: Note
  updateNote: (note: Note) => void
  onBack?: () => void
}

export default function NoteEditor({ note, updateNote, onBack }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title)
  const [tags, setTags] = useState<string[]>(note.tags.slice(0, 3))

  const editor = useEditor({
    extensions: [StarterKit, Underline, TextStyle, Color],
    content: note.content,
    onUpdate: ({ editor }) => {
      updateNote({
        ...note,
        title,
        content: editor.getHTML(),
        tags,
      })
    },
  })

  useEffect(() => {
    if (editor && note.content !== editor.getHTML()) {
      editor.commands.setContent(note.content)
    }
    setTitle(note.title)
    setTags(note.tags.slice(0, 3))
  }, [note, editor])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    updateNote({ ...note, title: e.target.value })
  }

  const handleTagChange = (index: number, value: string) => {
    const newTags = [...tags]
    newTags[index] = value
    setTags(newTags)
    updateNote({ ...note, tags: newTags })
  }

  if (!editor) {
    return null
  }

  return (
    <div className="h-full flex flex-col bg-white">
      <div className="border-b p-2 flex items-center space-x-2">
        {onBack && (
          <Button onClick={onBack} variant="ghost" size="icon" className="mr-2">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        )}
        <Input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Untitled"
          className="text-xl font-semibold bg-transparent border-none focus:outline-none focus:ring-0"
        />
      </div>
      <div className="border-b p-2 flex items-center space-x-2">
        {[0, 1, 2].map((index) => (
          <Input
            key={index}
            type="text"
            value={tags[index] || ""}
            onChange={(e) => handleTagChange(index, e.target.value)}
            placeholder={`Tag ${index + 1}`}
            className="bg-transparent border-none focus:outline-none focus:ring-0"
          />
        ))}
      </div>
      <div className="border-b p-1 flex items-center space-x-1">
        <Button
          onClick={() => editor.chain().focus().toggleBold().run()}
          variant={editor.isActive("bold") ? "secondary" : "ghost"}
          size="icon"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          variant={editor.isActive("italic") ? "secondary" : "ghost"}
          size="icon"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          variant={editor.isActive("underline") ? "secondary" : "ghost"}
          size="icon"
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
        <Select onValueChange={(value) => editor.chain().focus().setColor(value).run()}>
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Color" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="#000000">Black</SelectItem>
            <SelectItem value="#FF0000">Red</SelectItem>
            <SelectItem value="#00FF00">Green</SelectItem>
            <SelectItem value="#0000FF">Blue</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <EditorContent editor={editor} className="flex-1 overflow-y-auto p-4 prose max-w-none" />
    </div>
  )
}

