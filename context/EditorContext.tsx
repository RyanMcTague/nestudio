"use client"

import { createContext, ReactNode, useContext, useState } from "react"

interface EditorContextState {
  content: string
  setContent: (value: string) => void
}

const EditorContext = createContext<EditorContextState | null>(null)

export const EditorContextProvider = ({
  children,
  content,
}: {
  children: ReactNode
  content: string
}) => {
  const [val, setVale] = useState(content)
  return (
    <EditorContext.Provider value={{ content: val, setContent: setVale }}>
      {children}
    </EditorContext.Provider>
  )
}

export const useEditor = () => {
  const context = useContext(EditorContext)

  if (!context) {
    throw new Error(
      "useEditor must be used withen a EditorContextProvider component",
    )
  }

  return {
    content: context.content,
    setContent: context.setContent,
  }
}
