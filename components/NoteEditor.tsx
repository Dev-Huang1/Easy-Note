import { useState, useEffect, useRef } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import TextStyle from "@tiptap/extension-text-style"
import Color from "@tiptap/extension-color"
import Link from "@tiptap/extension-link"
import type { Note } from "@/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronLeft, Bold, Italic, UnderlineIcon, LinkIcon } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface NoteEditorProps {
  note: Note
  updateNote: (note: Note) => void
  onBack?: () => void
}

export default function NoteEditor({ note, updateNote, onBack }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title)
  const [tag, setTag] = useState(note.tag || "")
  const editorRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        paragraph: {
          HTMLAttributes: {
            class: "inline",
          },
        },
      }),
      Underline,
      TextStyle,
      Color,
      Link,
    ],
    content: note.content,
    onUpdate: ({ editor }) => {
      updateNote({
        ...note,
        title,
        content: editor.getHTML(),
        tag,
      })
    },
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl focus:outline-none",
      },
    },
  })

  useEffect(() => {
    if (editor && note.content !== editor.getHTML()) {
      editor.commands.setContent(note.content)
    }
    setTitle(note.title)
    setTag(note.tag || "")
  }, [note, editor])

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      event.preventDefault()
      const text = event.clipboardData?.getData("text/plain")
      if (text && editor) {
        editor.commands.insertContent(text)
      }
    }

    const editorElement = editorRef.current
    if (editorElement) {
      editorElement.addEventListener("paste", handlePaste)
    }

    return () => {
      if (editorElement) {
        editorElement.removeEventListener("paste", handlePaste)
      }
    }
  }, [editor])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    updateNote({ ...note, title: e.target.value })
  }

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTag(e.target.value)
    updateNote({ ...note, tag: e.target.value })
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
        <Input
          type="text"
          value={tag}
          onChange={handleTagChange}
          placeholder="Add a tag"
          className="bg-transparent border-none focus:outline-none focus:ring-0"
        />
      </div>
      <div className="border-b p-1 flex items-center space-x-1 flex-wrap">
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
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Color</Button>
          </PopoverTrigger>
          <PopoverContent className="w-40">
            <div className="flex flex-wrap gap-1">
              {["#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"].map((color) => (
                <button
                  key={color}
                  className="w-6 h-6 rounded"
                  style={{ backgroundColor: color }}
                  onClick={() => editor.chain().focus().setColor(color).run()}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon">
              <LinkIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <div className="flex flex-col gap-2">
              <Input
                placeholder="https://example.com"
                onChange={(e) => {
                  if (e.target.value) {
                    editor.chain().focus().extendMarkRange("link").setLink({ href: e.target.value }).run()
                  } else {
                    editor.chain().focus().extendMarkRange("link").unsetLink().run()
                  }
                }}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
      <div ref={editorRef} className="flex-1 overflow-y-auto p-4">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}

