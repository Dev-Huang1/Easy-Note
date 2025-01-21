"use client"

import { useState } from "react"
import { Button } from "./ui/button"

export default function FileUpload({ userId }: { userId: string | null }) {
  const [file, setFile] = useState<File | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleUpload = async () => {
    if (file) {
      const url = await uploadFile(userId, file)
      console.log("File uploaded:", url)
      // Here you can add the file URL to your note content
    }
  }

  return (
    <div className="mt-4">
      <input type="file" onChange={handleFileChange} className="mb-2" />
      <Button onClick={handleUpload} disabled={!file}>
        Upload File
      </Button>
    </div>
  )
}

