'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'

export type TGStopScope = 'program' | 'debugger'
export type TGStopResult = { success: boolean; error?: string }
type TGStopHandler = () => TGStopResult | Promise<TGStopResult>

export interface TGStopSession {
  scope: TGStopScope
  label: string
}

interface TGStopContextValue {
  activeSession: TGStopSession | null
  canStop: boolean
  registerStopHandler: (
    session: TGStopSession,
    handler: TGStopHandler,
  ) => () => void
  stopActiveSession: () => Promise<TGStopResult>
}

const TGStopContext = createContext<TGStopContextValue | null>(null)

export function TGStopProvider({ children }: { children: React.ReactNode }) {
  const handlerRef = useRef<TGStopHandler | null>(null)
  const [activeSession, setActiveSession] = useState<TGStopSession | null>(null)

  const registerStopHandler = useCallback<TGStopContextValue['registerStopHandler']>(
    (session, handler) => {
      handlerRef.current = handler
      setActiveSession(session)

      return () => {
        if (handlerRef.current === handler) {
          handlerRef.current = null
          setActiveSession(null)
        }
      }
    },
    [],
  )

  const stopActiveSession = useCallback(async (): Promise<TGStopResult> => {
    if (!handlerRef.current) {
      return { success: false, error: 'Ingen TG-session kjører for øyeblikket.' }
    }

    try {
      return await Promise.resolve(handlerRef.current())
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
      }
    }
  }, [])

  const value = useMemo<TGStopContextValue>(
    () => ({
      activeSession,
      canStop: activeSession !== null,
      registerStopHandler,
      stopActiveSession,
    }),
    [activeSession, registerStopHandler, stopActiveSession],
  )

  return <TGStopContext.Provider value={value}>{children}</TGStopContext.Provider>
}

export function useTGStop(): TGStopContextValue {
  const context = useContext(TGStopContext)
  if (!context) {
    throw new Error('useTGStop must be used inside TGStopProvider.')
  }

  return context
}
