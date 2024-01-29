/**
 * @module pages/SignIn/SignIn.interfaces
 */

import { BaseSyntheticEvent, Dispatch, SetStateAction } from 'react'
import { FieldErrors, UseFormReturn } from 'react-hook-form'

export interface FormData {
  email: string
  password: string
}

export type TContext = Record<string, unknown>

export type TFieldValues = {
  email: string
  password: string
}

export type useSignInReturnType = {
  control: unknown
  errors: FieldErrors<{
    email: string
    password: string
  }>
  handleFederatedSignIn: () => Promise<void>
  handleSubmit: (
    e?: BaseSyntheticEvent<unknown, unknown, unknown> | undefined
  ) => Promise<void>
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
  showPassword: boolean
  setShowPassword: Dispatch<SetStateAction<boolean>>
} & UseFormReturn<TFieldValues, TContext, TFieldValues>
