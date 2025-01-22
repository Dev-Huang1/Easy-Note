import type React from "react"
import { useState, useEffect, useCallback } from "react"

interface ResizablePanelProps {
  left: React.ReactNode
  right: React.ReactNode
  initialLeftWidth?: number
}

const ResizablePanel: React.FC<ResizablePanelProps> = ({ left, right, initialLeftWidth = 50 }) => {
  const [leftWidth, setLeftWidth] = useState(initialLeftWidth)
  const [isDragging, setIsDragging] = useState(false)

  const handleMouseDown = useCallback(() => {
    setIsDragging(true)
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        const container = document.getElementById("resizable-container")
        if (container) {
          const containerRect = container.getBoundingClientRect()
          const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100
          setLeftWidth(Math.max(20, Math.min(80, newLeftWidth)))
        }
      }
    },
    [isDragging],
  )

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  return (
    <div id="resizable-container" className="flex h-full">
      <div style={{ width: `${leftWidth}%` }} className="overflow-auto">
        {left}
      </div>
      <div className="w-1 bg-gray-200 hover:bg-gray-300 cursor-col-resize" onMouseDown={handleMouseDown} />
      <div style={{ width: `${100 - leftWidth}%` }} className="overflow-auto">
        {right}
      </div>
    </div>
  )
}

export default ResizablePanel

