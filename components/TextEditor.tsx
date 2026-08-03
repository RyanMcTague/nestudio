"use client"
import { basicSetup } from "codemirror"
import { asm6502 } from "@/lib/asm6502"
import { useCallback } from "react"
import CodeMirror, { ViewUpdate } from "@uiw/react-codemirror"
import { useEditor } from "@/context/EditorContext"
import { autocompletion } from "@codemirror/autocomplete"

export const TextEditor = () => {
  const editor = useEditor()
  const onChange = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    (val: string, _viewUpdate: ViewUpdate) => {
      editor.setContent(val)
    },
    [editor],
  )

  return (
    <CodeMirror
      className="w-full h-full flex-1 overflow-scroll"
      theme={"dark"}
      value={editor.content}
      height="100%"
      minHeight="100%"
      extensions={[basicSetup, asm6502(), autocompletion()]}
      onChange={onChange}
    />
  )
}
