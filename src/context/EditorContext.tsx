import { createContext, useContext } from 'react'
import { Profile } from '../types'

export type Editor = {
  p: Profile
  uploading: string
  update: (patch: Partial<Profile>) => void
  setTheme: (patch: Record<string, unknown>) => void
  setColors: (patch: Record<string, unknown>) => void
  setBg: (patch: Record<string, unknown>) => void
  setCouple: (patch: Record<string, unknown>) => void
  upload: (file: File | undefined, folder: string, onDone: (url: string) => void) => void
}

export const EditorCtx = createContext<Editor | null>(null)

export function useEditor(): Editor {
  const v = useContext(EditorCtx)
  if (!v) throw new Error('useEditor must be used inside EditorCtx.Provider')
  return v
}
