import fs from "fs"
import path from "path"

export interface FileTreeItem {
  name: string
  children?: string[]
}

export const toFileTree = (
  paths: string[],
  baseDir: string,
): Record<string, FileTreeItem> => {
  const tree: Record<string, FileTreeItem> = {
    root: { name: "root", children: [] },
  }

  const ensureNode = (id: string, name: string) => {
    if (tree[id]) return tree[id]
    const isDirectory = fs.statSync(path.join(baseDir, id)).isDirectory()
    tree[id] = isDirectory ? { name, children: [] } : { name }
    return tree[id]
  }

  for (const filePath of paths) {
    const segments = filePath.split("/").filter(Boolean)
    let parentId = "root"

    segments.forEach((segment, i) => {
      const id = segments.slice(0, i + 1).join("/")
      ensureNode(id, segment)

      const parent = tree[parentId]
      if (parent.children && !parent.children.includes(id)) {
        parent.children.push(id)
      }

      parentId = id
    })
  }

  return tree
}
