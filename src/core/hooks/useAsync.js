import React from 'react'
import noop from 'lodash/noop'

const useAsync = (promise, immediate = true, opt) => {
  const [pending, setPending] = React.useState(false)
  const [data, setData] = React.useState(null)
  const [error, setError] = React.useState(null)

  const {
    onSuccess = async (data) => data,
    onFailed = noop,
    onFinally = noop,
    setLoading = noop
  } = opt || {}

  const pendingSetter = React.useCallback(
    (bool) => {
      setLoading(bool)
      setPending(bool)
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const execute = React.useCallback(async (arg, immediateCallback) => {
    const {
      onSuccess: onSuccessful = noop,
      onFailed: onFailure = noop,
      onFinally: onFinal = noop
    } = immediateCallback || {}

    try {
      pendingSetter(true)
      const { data: response } = await promise(arg)

      onSuccessful(response, arg)
      const result = await onSuccess(response, arg)
      setData(result)
    } catch (e) {
      console.log('e', e)
      onFailure(e)
      onFailed(e)
      setError(e)
    } finally {
      onFinal()
      onFinally()
      pendingSetter(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    if (immediate) {
      execute()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return {
    data,
    error,
    pending,
    execute
  }
}

export default useAsync
