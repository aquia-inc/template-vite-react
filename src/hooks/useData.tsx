/**
 * @module hooks/useData
 */
import * as React from 'react'

type DataState = {
  data: unknown
}

const INITIAL_STATE = {
  data: {},
  setData: () => null,
} as DataState

const DataContext = React.createContext<{
  data: DataState
  setData: (values: DataState) => void
}>({
  data: INITIAL_STATE,
  setData: () => ({}),
})

type DataProviderProps = {
  children: JSX.Element
  initialState?: DataState
}

export const DataProvider = ({
  children,
  initialState = INITIAL_STATE,
}: DataProviderProps): JSX.Element => {
  const [data, dispatchSetData] = React.useState<DataState>(initialState)

  const setData = (values: DataState) => {
    dispatchSetData((prevData) => ({
      ...prevData,
      ...values,
    }))
  }

  const value = React.useMemo(() => {
    return {
      data,
      setData,
    }
  }, [data])

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export const useData = () => React.useContext(DataContext)
