"use client"
import { File, Folder, SearchIcon } from "lucide-react"
import { Dialog, DialogContent } from "./ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table"
import { Field } from "./ui/field"
import { Button } from "./ui/button"
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group"
import { FileTreeItem } from "@/lib/fs-utils"
import { useState } from "react"

interface Props {
  open: boolean
  onOpenChange: (value: boolean) => void
  items: Record<string, FileTreeItem>
}

export const FileExplorer = ({ open, onOpenChange, items }: Props) => {
  const [fsItems, setFsItems] = useState(items)

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        onOpenChange(value)
        if (!value) {
          setFsItems(items)
        }
      }}
    >
      <DialogContent className="min-w-150 max-w-150 h-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Last Opened At</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {fsItems["root"].children!.map((child, idx) => (
              <TableRow
                key={idx}
                className="cursor-pointer"
                onDoubleClick={() => {
                  if (!items[child].children) return

                  setFsItems({ root: items[child] })
                }}
              >
                <TableCell>
                  {items[child].children ? (
                    <Folder className="w-4 h-4" />
                  ) : (
                    <File className="w-4 h-4" />
                  )}
                </TableCell>
                <TableCell>{items[child].name}</TableCell>
                <TableCell>Yesterday at 8:52pm</TableCell>
                <TableCell>---</TableCell>
                <TableCell>
                  {items[child].children ? "Folder" : "File"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex gap-x-4 mt-2">
          <Field>
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <SearchIcon />
              </InputGroupAddon>
              <InputGroupInput
                id="input-group-url"
                placeholder="/path/to/file"
              />
            </InputGroup>
          </Field>
          <Button>Create File</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
