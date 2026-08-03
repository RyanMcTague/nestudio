import path from "path"
import fs from "fs"
import { FileTreeSidebar } from "../../components/FileTreeSidebar"
import { TextEditor } from "@/components/TextEditor"
import { EditorMenuBar } from "@/components/EditorMenuBar"
import { EditorContextProvider } from "@/context/EditorContext"
import { toFileTree } from "@/lib/fs-utils"
import { PaletteViewer } from "@/components/PaletteViewer"

export default async function Page() {
  const content = await fs.promises.readFile(
    path.join(process.cwd(), "storage/sample-project/src/entrypoint.asm"),
    "utf-8",
  )

  const saveFile = async (content: string) => {
    "use server"
    await fs.promises.writeFile(
      path.join(process.cwd(), "storage/sample-project/src/entrypoint.asm"),
      content,
    )
  }

  const projectDir = path.join(process.cwd(), "storage/sample-project")
  const project = await fs.promises.readdir(projectDir, { recursive: true })

  const items = toFileTree(project as string[], projectDir)

  return (
    <EditorContextProvider content={content}>
      <div className="h-full grid-cols-12 fixed w-full flex flex-col">
        <EditorMenuBar onSaveFile={saveFile} fileTree={items} />
        <div className="flex flex-1">
          <FileTreeSidebar items={items} />
          <div className="flex-1 flex flex-col">
            <div className="flex-1">
              {/* <TextEditor /> */}
              <PaletteViewer />
            </div>
          </div>
        </div>
      </div>
    </EditorContextProvider>
  )
}
