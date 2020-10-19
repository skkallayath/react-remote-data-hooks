import { useState } from 'react'

export const usePerformAction = (
  action: (...params: any[]) => Promise<any>,
  onSuccess?: (data: any) => void,
  onError?: (error: Error) => void
): {
  isPerforming?: boolean
  error?: Error
  performAction: (...params: any[]) => Promise<any>
} => {
  const [isPerforming, setIsPerforming] = useState(false)
  const [error, setError] = useState<Error | undefined>(undefined)

  const performAction = async (...params: any[]) => {
    if (isPerforming) {
      return
    }
    setIsPerforming(true)
    setError(undefined)
    let data
    try {
      data = await action(...params)
      if (onSuccess) {
        onSuccess(data)
      }
    } catch (e) {
      setError(e)
      if (onError) {
        onError(e)
      }
    }
    setIsPerforming(false)
    return data
  }

  return {
    isPerforming,
    performAction,
    error
  }
}
