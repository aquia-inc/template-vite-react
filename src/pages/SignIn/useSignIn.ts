/**
 * @module pages/SignIn/useSignIn
 */
import { Auth } from 'aws-amplify'
import { FederatedSignInOptions } from '@aws-amplify/auth/lib/types'
import { BaseSyntheticEvent, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, UseFormHandleSubmit } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import loginUser from '@/actions/loginUser'
import useAlert from '@/hooks/useAlert'
import useAuthDispatch from '@/store/auth/useAuthDispatch'
import {
  TFieldValues,
  useSignInReturnType,
} from '@/pages/SignIn/SignIn.interfaces'
import { Routes } from '@/router/constants'

/**
 * A custom hook to retrieve methods and state pertaining to the SignIn.
 * @returns {useSignInReturnType} All the methods and state required for the SignIn/SignOut Views.
 */
const useSignIn = (): useSignInReturnType => {
  const { setAlert } = useAlert()
  const dispatch = useAuthDispatch()
  const navigate = useNavigate()

  const [loading, setLoading] = useState<boolean>(false)
  const [showPassword, setShowPassword] = useState<boolean>(false)

  const {
    clearErrors,
    control,
    formState,
    formState: { errors },
    handleSubmit: handleSubmitInternal,
    getFieldState,
    getValues,
    register,
    reset,
    resetField,
    setError,
    setFocus,
    setValue,
    trigger,
    unregister,
    watch,
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'onBlur',
    resolver: yupResolver(
      yup.object().shape({
        email: yup
          .string()
          .email('Invalid email format')
          .required('Email is required'),
        password: yup
          .string()
          .min(8, 'Password must be at least 8 characters')
          .required('Password is required'),
      })
    ),
  })

  const handleFederatedSignIn = useCallback(async () => {
    try {
      await Auth.federatedSignIn({
        provider: 'COGNITO',
      } as FederatedSignInOptions)
    } catch (error) {
      setAlert({
        message: 'There was an error with the identity provider.',
        severity: 'error',
      })
    }
  }, [setAlert])

  const onSubmit = useCallback(
    async (data: TFieldValues) => {
      const { email, password } = data
      setLoading(true)
      try {
        await loginUser(dispatch, { email, password })
        setLoading(false)
        navigate(Routes.DASHBOARD)
      } catch (error) {
        setLoading(false)
        setAlert({
          message: 'There was an error logging in. Please try again.',
          severity: 'error',
        })
      }
    },
    [dispatch, navigate, setAlert]
  )

  return {
    loading,
    setLoading,
    showPassword,
    setShowPassword,
    control,
    errors,
    formState,
    clearErrors,
    getFieldState,
    getValues,
    handleFederatedSignIn,
    handleSubmit: handleSubmitInternal(onSubmit) as ((
      e?: BaseSyntheticEvent<unknown, unknown, unknown> | undefined
    ) => Promise<void>) &
      UseFormHandleSubmit<TFieldValues>,
    register,
    reset,
    resetField,
    setError,
    setFocus,
    setValue,
    trigger,
    unregister,
    watch,
  }
}

export default useSignIn
