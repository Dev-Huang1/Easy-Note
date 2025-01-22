import { useState, useEffect } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Markdown from "@tiptap/extension-markdown"
import type { Note } from "@/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface NoteEditorProps {
  note: Note
  updateNote: (note: Note) => void
  onBack?: () => void
}

export default function NoteEditor({ note, updateNote, onBack }: NoteEditorProps) {
  const [title, setTitle] = useState(note.title)
  const [tag, setTag] = useState(note.tag || "")
  const [isMarkdown, setIsMarkdown] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit,
      Markdown.configure({
        html: false,
        transformPastedText: true,
      }),
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
  })

  useEffect(() => {
    if (editor && note.content !== editor.getHTML()) {
      editor.commands.setContent(note.content)
    }
    setTitle(note.title)
    setTag(note.tag || "")
  }, [note, editor])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value)
    updateNote({ ...note, title: e.target.value })
  }

  const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTag(e.target.value)
    updateNote({ ...note, tag: e.target.value })
  }

  const toggleMarkdown = () => {
    setIsMarkdown(!isMarkdown)
    if (editor) {
      editor.setOptions({
        extensions: [
          StarterKit,
          ...(isMarkdown ? [] : [Markdown.configure({ html: false, transformPastedText: true })]),
        ],
      })
    }
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
        <div className="flex items-center space-x-2">
          <Checkbox id="markdown" checked={isMarkdown} onCheckedChange={toggleMarkdown} />
          <label
            htmlFor="markdown"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Use Markdown
          </label>
        </div>
      </div>
      {isMarkdown ? (
        <Tabs defaultValue="edit" className="flex-1 flex flex-col">
          <TabsList>
            <TabsTrigger value="edit">Edit</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>
          <TabsContent value="edit" className="flex-1">
            <EditorContent editor={editor} className="h-full overflow-y-auto p-4" />
          </TabsContent>
          <TabsContent value="preview" className="flex-1">
            <div
              className="prose max-w-none h-full overflow-y-auto p-4"
              dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
            />
          </TabsContent>
        </Tabs>
      ) : (
        <EditorContent editor={editor} className="flex-1 overflow-y-auto p-4" />
      )}
    </div>
  )
}

