'use client'

import { useRef, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Pen, Eraser, Trash2, Download, Save, Undo2, Redo2 } from 'lucide-react'
import { toast } from 'sonner'
import { getCanvas, saveCanvas } from '@/actions/canvasActions'

export default function DrawingBoard() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState('#000000') // Default to black for light mode visibility
  const [brushSize, setBrushSize] = useState(3)
  const [mode, setMode] = useState<'draw' | 'erase'>('draw')
  
  const [undoStack, setUndoStack] = useState<string[]>([])
  const [redoStack, setRedoStack] = useState<string[]>([])

  useEffect(() => {
    const loadCanvas = async () => {
      const { data, error } = await getCanvas()

      if (data && canvasRef.current) {
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')
        const img = new Image()
        img.onload = () => {
          ctx?.drawImage(img, 0, 0)
          setUndoStack([data]) // Initial state
        }
        img.src = data
      }
    }
    loadCanvas()
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true)
    draw(e)
  }

  const stopDrawing = () => {
    if (!isDrawing) return
    setIsDrawing(false)
    const ctx = canvasRef.current?.getContext('2d')
    ctx?.beginPath()
    
    if (canvasRef.current) {
      const dataUrl = canvasRef.current.toDataURL()
      setUndoStack(prev => [...prev, dataUrl])
      setRedoStack([])
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const rect = canvas.getBoundingClientRect()
    const x = ('clientX' in e ? e.clientX : e.touches[0].clientX) - rect.left
    const y = ('clientY' in e ? e.clientY : e.touches[0].clientY) - rect.top

    ctx.lineWidth = brushSize
    ctx.lineCap = 'round'
    
    if (mode === 'erase') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineWidth = brushSize * 3 // Eraser is bigger
    } else {
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = color
    }

    ctx.lineTo(x, y)
    ctx.stroke()
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const handleUndo = () => {
    if (undoStack.length === 0) return
    const newUndoStack = [...undoStack]
    const currentState = newUndoStack.pop()
    const previousState = newUndoStack.length > 0 ? newUndoStack[newUndoStack.length - 1] : null
    
    if (currentState) {
      setRedoStack(prev => [...prev, currentState])
    }
    
    setUndoStack(newUndoStack)
    
    if (previousState && canvasRef.current) {
       const ctx = canvasRef.current.getContext('2d')
       const img = new Image()
       img.onload = () => {
         ctx?.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
         ctx?.drawImage(img, 0, 0)
       }
       img.src = previousState
    } else if (!previousState && canvasRef.current) {
       const ctx = canvasRef.current.getContext('2d')
       ctx?.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
    }
  }

  const handleRedo = () => {
    if (redoStack.length === 0) return
    const newRedoStack = [...redoStack]
    const nextState = newRedoStack.pop()
    
    if (nextState && canvasRef.current) {
      setUndoStack(prev => [...prev, nextState])
      setRedoStack(newRedoStack)
      
      const ctx = canvasRef.current.getContext('2d')
      const img = new Image()
      img.onload = () => {
        ctx?.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height)
        ctx?.drawImage(img, 0, 0)
      }
      img.src = nextState
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      setUndoStack([])
      setRedoStack([])
    }
  }

  const handleSaveCanvas = async () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dataUrl = canvas.toDataURL()
    
    const { error } = await saveCanvas(dataUrl)

    if (error) {
      toast.error('Failed to save canvas')
    } else {
      toast.success('Canvas saved securely to your workspace!')
    }
  }

  const downloadCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const dataUrl = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.download = 'syncboard-canvas.png'
    link.href = dataUrl
    link.click()
  }

  return (
    <div className="flex flex-col gap-4 h-full pb-8">
      <div className="flex justify-between items-center bg-white dark:bg-zinc-900/50 p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 backdrop-blur-xl shadow-sm">
        <div className="flex items-center gap-4">
          <Button 
            variant={mode === 'draw' ? 'default' : 'secondary'} 
            onClick={() => setMode('draw')}
            className={mode === 'draw' ? 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200' : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:text-white border border-zinc-200 dark:border-transparent'}
          >
            <Pen size={18} className="mr-2" /> Draw
          </Button>
          <Button 
            variant={mode === 'erase' ? 'default' : 'secondary'} 
            onClick={() => setMode('erase')}
            className={mode === 'erase' ? 'bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200' : 'bg-zinc-100 text-zinc-600 hover:text-zinc-900 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:text-white border border-zinc-200 dark:border-transparent'}
          >
            <Eraser size={18} className="mr-2" /> Erase
          </Button>
          
          <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800 mx-2"></div>
          
          <div className="flex items-center gap-2">
            <input 
              type="color" 
              value={color} 
              onChange={(e) => setColor(e.target.value)}
              className="w-8 h-8 rounded cursor-pointer bg-transparent border-0"
              disabled={mode === 'erase'}
            />
            <input 
              type="range" 
              min="1" max="20" 
              value={brushSize} 
              onChange={(e) => setBrushSize(parseInt(e.target.value))}
              className="w-24 accent-zinc-500"
            />
          </div>
          
          <div className="h-8 w-px bg-zinc-200 dark:bg-zinc-800 mx-2"></div>
          
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={handleUndo} disabled={undoStack.length === 0}>
              <Undo2 size={18} />
            </Button>
            <Button variant="ghost" size="icon" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={handleRedo} disabled={redoStack.length === 0}>
              <Redo2 size={18} />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={clearCanvas}>
            <Trash2 size={18} className="mr-2" /> Clear
          </Button>
          <Button variant="ghost" className="text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800" onClick={downloadCanvas}>
            <Download size={18} className="mr-2" /> Export
          </Button>
          <Button className="bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200" onClick={handleSaveCanvas}>
            <Save size={18} className="mr-2" /> Save
          </Button>
        </div>
      </div>
      
      <Card className="flex-1 bg-zinc-50 dark:bg-zinc-950/50 border-zinc-200 dark:border-zinc-800 overflow-hidden relative shadow-md rounded-2xl flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          onMouseDown={startDrawing}
          onMouseUp={stopDrawing}
          onMouseOut={stopDrawing}
          onMouseMove={draw}
          onTouchStart={startDrawing}
          onTouchEnd={stopDrawing}
          onTouchCancel={stopDrawing}
          onTouchMove={draw}
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm rounded-xl cursor-crosshair touch-none"
        />
      </Card>
    </div>
  )
}
