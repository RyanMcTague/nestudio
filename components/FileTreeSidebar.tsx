"use client"

import { Tree, TreeItem, TreeItemLabel } from "@/components/reui/tree"
import { hotkeysCoreFeature, syncDataLoaderFeature } from "@headless-tree/core"
import { useTree } from "@headless-tree/react"
import { FileIcon, FolderIcon, FolderOpenIcon } from "lucide-react"

interface Item {
  name: string
  children?: string[]
}

const indent = 20

interface Props {
  items: Record<string, Item>
}

export const FileTreeSidebar = ({ items }: Props) => {
  const tree = useTree<Item>({
    initialState: {
      expandedItems: [],
    },
    indent,
    rootItemId: "root",
    getItemName: (item) => item.getItemData().name,
    isItemFolder: (item) => Array.isArray(item.getItemData()?.children),
    dataLoader: {
      getItem: (itemId) => items[itemId],
      getChildren: (itemId) => items[itemId].children ?? [],
    },
    features: [syncDataLoaderFeature, hotkeysCoreFeature],
  })

  return (
    <div className="w-70 border-r h-full place-self-start lg:w-xs py-2">
      <Tree
        className="relative before:absolute before:inset-0 before:-ms-1 before:bg-[repeating-linear-gradient(to_right,transparent_0,transparent_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)-1px),var(--border)_calc(var(--tree-indent)))]"
        indent={indent}
        tree={tree}
      >
        {tree.getItems().map((item) => {
          return (
            <TreeItem key={item.getId()} item={item} className="cursor-pointer">
              <TreeItemLabel className="before:bg-background relative before:absolute before:inset-x-0 before:-inset-y-0.5 before:-z-10">
                <span className="flex items-center gap-2">
                  {item.isFolder() ? (
                    item.isExpanded() ? (
                      <FolderOpenIcon className="text-muted-foreground pointer-events-none size-4" />
                    ) : (
                      <FolderIcon className="text-muted-foreground pointer-events-none size-4" />
                    )
                  ) : (
                    <FileIcon className="text-muted-foreground pointer-events-none size-4" />
                  )}
                  {item.getItemName()}
                </span>
              </TreeItemLabel>
            </TreeItem>
          )
        })}
      </Tree>
    </div>
  )
}
