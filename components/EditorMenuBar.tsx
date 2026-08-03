"use client"
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { useEditor } from "@/context/EditorContext"
import { useState } from "react"
import { FileExplorer } from "./FileExplorer"
import { FileTreeItem } from "@/lib/fs-utils"

interface Props {
  onSaveFile: (content: string) => Promise<void>
  fileTree: Record<string, FileTreeItem>
}

export const EditorMenuBar = ({ onSaveFile, fileTree }: Props) => {
  const [fileDialogShown, setFileDialogShown] = useState(false)

  const editor = useEditor()
  return (
    <>
      <Menubar className="w-full rounded-none">
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent>
            <MenubarGroup>
              <MenubarItem>
                New Tab <MenubarShortcut>⌘T</MenubarShortcut>
              </MenubarItem>

              <MenubarItem onClick={() => setFileDialogShown(true)}>
                Open File <MenubarShortcut>⌘O</MenubarShortcut>
              </MenubarItem>
              <MenubarItem
                onClick={async () => {
                  onSaveFile(editor.content)
                }}
              >
                Save <MenubarShortcut>⌘S</MenubarShortcut>
              </MenubarItem>
            </MenubarGroup>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
      <FileExplorer
        open={fileDialogShown}
        onOpenChange={setFileDialogShown}
        items={fileTree}
      />
    </>
  )
}
