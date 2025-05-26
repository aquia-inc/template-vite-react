/**
 * @module hooks/useDialog
 */
import {
  Children,
  cloneElement,
  createContext,
  isValidElement,
  useCallback,
  useContext,
  useRef,
  useState,
} from 'react'
import Dialog, { DialogProps } from '@mui/material/Dialog'

export type DialogState = {
  children: JSX.Element
  props?: DialogProps | null
}

type DialogContextValue = [(dialog: DialogState) => void, () => void]

const DialogContext = createContext<DialogContextValue>([() => {}, () => {}])

const DialogProvider: React.FC<React.PropsWithChildren> = ({
  children,
}): JSX.Element => {
  const [
    { children: dialogChildren, props: dialogProps, ...params },
    setDialog,
  ] = useState<DialogState>({ children: <></>, props: null })

  const [open, setOpen] = useState(false)

  const openDialog = useCallback((dialog: DialogState) => {
    setDialog(dialog)
    setOpen(true)
  }, [])

  const closeDialog = () => {
    setOpen(false)
  }

  const contextValue = useRef<DialogContextValue>([openDialog, closeDialog])

  return (
    <DialogContext.Provider value={contextValue.current}>
      {children}
      <Dialog {...dialogProps} onClose={closeDialog} open={open}>
        {Children.map(dialogChildren, (child) => {
          // Checking isValidElement is the safe way and avoids a
          // typescript error too.
          const combinedProps = {
            ...params,
            setOpen,
          }
          if (isValidElement(child)) {
            return cloneElement(child, combinedProps)
          }
          return child
        })}
      </Dialog>
    </DialogContext.Provider>
  )
}

export const useDialog = () => {
  const result = useContext(DialogContext)
  if (!result) {
    throw new Error('Dialog context is only available inside its provider')
  }
  return result
}

export default DialogProvider
