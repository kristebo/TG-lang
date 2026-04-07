'use client'

import { useEffect, useRef } from 'react'
import { TG_COLOR_CHANNEL_MAX } from '../../src/lang/constants'

type Pixel = {
  x: number
  y: number
  r: number
  g: number
  b: number
}

type VikingskipCanvasPanelProps = {
  isActive: boolean
  resolution: number | null
  pixels: Pixel[]
}

export function VikingskipCanvasPanel({
  isActive,
  resolution,
  pixels,
}: VikingskipCanvasPanelProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    if (!canvasRef.current || !isActive || !resolution) {
      return
    }

    const canvas = canvasRef.current
    const pixelSize = 12
    canvas.width = resolution * pixelSize
    canvas.height = resolution * pixelSize

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      return
    }

    ctx.fillStyle = '#0f1516'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    for (const pixel of pixels) {
      if (pixel.x < 0 || pixel.y < 0 || pixel.x >= resolution || pixel.y >= resolution) {
        continue
      }

      ctx.fillStyle = `rgb(${Math.round((pixel.r / TG_COLOR_CHANNEL_MAX) * 255)}, ${Math.round((pixel.g / TG_COLOR_CHANNEL_MAX) * 255)}, ${Math.round((pixel.b / TG_COLOR_CHANNEL_MAX) * 255)})`
      ctx.fillRect(pixel.x * pixelSize, pixel.y * pixelSize, pixelSize, pixelSize)
    }
  }, [isActive, resolution, pixels])

  return (
    <article className="panel">
      <div className="panel-heading">
        <h2>Vikingskip canvas</h2>
        <p className="panel-meta">
          {isActive && resolution
            ? `Opplosning: ${resolution} x ${resolution}`
            : 'Grafisk output for vikingskip-programmer.'}
        </p>
      </div>

      {isActive ? (
        <div className="canvas-wrap">
          <canvas
            ref={canvasRef}
            id="tg-canvas"
            style={{ width: '100%', maxWidth: '360px', border: '1px solid #d5c8a9', borderRadius: '10px' }}
          />
        </div>
      ) : (
        <p className="panel-note">
          Aktiveres automatisk nar programmet starter med <strong>vikingskip</strong>.
        </p>
      )}
    </article>
  )
}
