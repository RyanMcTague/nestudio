"use client"
import { NES_PALETTE } from "@/lib/palette"
import { cn } from "@/lib/utils"
import { ComponentPropsWithoutRef, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { EllipsisVertical, Plus } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

interface Palette {
  color0: number
  color1: number
  color2: number
  color3: number
}

const getBrightness = (hex: string) => {
  // Clean hex string
  hex = hex.replace("#", "")

  // Extract R, G, B values
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  // Calculate perceived brightness (0 to 255)
  return 0.299 * r + 0.587 * g + 0.114 * b
}

const getPaletteTextColor = (hex: string) =>
  getBrightness(hex) >= 200 ? "text-black" : "text-white"

interface PaletteColorProps extends ComponentPropsWithoutRef<"div"> {
  paletteColor: number
}

const PaletteColor = ({
  paletteColor,
  className,
  ...props
}: PaletteColorProps) => (
  <div
    className={cn(
      "w-10 h-10 flex justify-center items-center text-sm rounded border-2 cursor-pointer",
      getPaletteTextColor(NES_PALETTE[paletteColor]),
      className,
    )}
    style={{ backgroundColor: NES_PALETTE[paletteColor] }}
    {...props}
  >
    <span>${paletteColor.toString(16).padStart(2, "0")}</span>
  </div>
)

interface PaletteViewProps {
  name: string
  palette: Palette
  setPalette: (name: string, palette: Palette) => void
}

const PaletteView = ({ name, palette, setPalette }: PaletteViewProps) => {
  const [showPaletteDialog, setShowPaletteDialog] = useState(false)
  const [editingColor, setEditingColor] = useState<keyof Palette>("color0")

  const handleColorClicked = (key: keyof Palette) => {
    return () => {
      setEditingColor(key)
      setShowPaletteDialog(true)
    }
  }

  const handleColorPicked = (idx: number) => {
    return () => {
      setPalette(name, {
        ...palette,
        [editingColor]: idx,
      })
      setShowPaletteDialog(false)
    }
  }

  return (
    <div className="border p-3 flex flex-col">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-bold font-lg">{name}</h3>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <EllipsisVertical className="w-4 h-4 cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              <DropdownMenuItem>Rename</DropdownMenuItem>
              <DropdownMenuItem>Delete</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex gap-x-2 self-center">
        <PaletteColor
          paletteColor={palette.color0}
          onClick={handleColorClicked("color0")}
        />
        <PaletteColor
          paletteColor={palette.color1}
          onClick={handleColorClicked("color1")}
        />
        <PaletteColor
          paletteColor={palette.color2}
          onClick={handleColorClicked("color2")}
        />
        <PaletteColor
          paletteColor={palette.color3}
          onClick={handleColorClicked("color3")}
        />
      </div>
      <Dialog open={showPaletteDialog} onOpenChange={setShowPaletteDialog}>
        <DialogContent className="min-w-fit">
          <DialogHeader className="px-4">
            <DialogTitle>Color Picker</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-16 grid-rows-4 w-160 p-4">
            {NES_PALETTE.map((color, idx) => (
              <div
                key={idx}
                className={cn(
                  "h-10 w-10 border flex justify-center items-center text-xs cursor-pointer",
                  getPaletteTextColor(color),
                )}
                style={{ backgroundColor: color }}
                onClick={handleColorPicked(idx)}
              >
                <span>${idx.toString(16).padStart(2, "0")}</span>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export const PaletteViewer = () => {
  const [palettes, setPalettes] = useState<Record<string, Palette>>({
    mysprite: {
      color0: 0x00,
      color1: 0x1b,
      color2: 0x1c,
      color3: 0x1d,
    },
    mybg: {
      color0: 0x00,
      color1: 0x1b,
      color2: 0x1c,
      color3: 0x1d,
    },
    default: {
      color0: 0x00,
      color1: 0x1b,
      color2: 0x1c,
      color3: 0x1d,
    },
  })

  const setPalette = (name: string, palette: Palette) =>
    setPalettes({
      ...palettes,
      [name]: palette,
    })

  const createPalette = () => {
    setPalettes({
      ...palettes,
      [`Untitled Palette ${Object.keys(palettes).length}`]: {
        color0: 0,
        color1: 0,
        color2: 0,
        color3: 0,
      },
    })
  }

  return (
    <div className="h-full w-full p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-lg">Palettes</h3>
        <Button onClick={() => createPalette()}>
          <Plus /> New Palette
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {Object.entries(palettes).map(([name, palette], idx) => (
          <PaletteView
            key={idx}
            name={name}
            palette={palette}
            setPalette={(name, palette) => setPalette(name, palette)}
          />
        ))}
      </div>
    </div>
  )
}
