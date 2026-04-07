'use client'

import { useEffect, useMemo } from 'react'
import { stopTG } from '../../src/lang/runtime'
import { useTGStop, type TGStopScope } from '../providers/TGStopProvider'

type UseTGProgramStopOptions = {
  active: boolean
  debugging?: boolean
}

export function useTGProgramStop({
  active,
  debugging = false,
}: UseTGProgramStopOptions) {
  const { activeSession, canStop, registerStopHandler, stopActiveSession } =
    useTGStop()

  const session = useMemo(
    () => ({
      scope: (debugging ? 'debugger' : 'program') as TGStopScope,
      label: debugging ? 'TG debugger session' : 'TG-lang program',
    }),
    [debugging],
  )

  useEffect(() => {
    if (!active) {
      return
    }

    return registerStopHandler(session, () => stopTG())
  }, [active, registerStopHandler, session])

  return {
    activeSession,
    canStop,
    stopActiveSession,
  }
}
