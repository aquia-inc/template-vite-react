/**
 * @module views/SignIn/useSignIn
 */
import { signInWithRedirect } from 'aws-amplify/auth'
import { BaseSyntheticEvent, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm, UseFormHandleSubmit } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import loginUser from '@/actions/loginUser'
import useAlert from '@/hooks/useAlert'
import useAuthDispatch from '@/store/auth/useAuthDispatch'
import {
  TContext,
  TFieldValues,
  useSignInReturnType,
} from '@/views/SignIn/SignIn.interfaces'
import { Routes } from '@/router/constants'
import { AUTH_DISABLED_HELP as AUTH_DISABLED_HELP_TEXT } from '@/locales/en'
import CONFIG from '@/utils/config'

/**
 * A custom hook to retrieve methods and state pertaining to the SignIn.
 * @returns {useSignInReturnType} All the methods and state required for the SignIn/SignOut Views.
 */
const useSignIn = (): useSignInReturnType => {
  const { setAlert } = useAlert()
  const dispatch = useAuthDispatch()
  const navigate = useNavigate()
  const authEnabled = CONFIG.AUTH_ENABLED
  const cognitoAuthEnabled = CONFIG.COGNITO_AUTH_ENABLED

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
    resetDefaultValues,
    resetField,
    setError,
    setFocus,
    setValue,
    setValues,
    subscribe,
    trigger,
    unregister,
    watch,
  } = useForm<TFieldValues, TContext, TFieldValues>({
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
      }),
    ),
  })

  const handleFederatedSignIn = useCallback(async () => {
    if (!cognitoAuthEnabled) {
      setAlert({
        message: AUTH_DISABLED_HELP_TEXT,
        severity: 'warning',
      })
      return
    }

    try {
      await signInWithRedirect()
    } catch {
      setAlert({
        message: 'There was an error with the identity provider.',
        severity: 'error',
      })
    }
  }, [cognitoAuthEnabled, setAlert])

  const onSubmit = useCallback(
    async (data: TFieldValues) => {
      if (!authEnabled) {
        setAlert({
          message: AUTH_DISABLED_HELP_TEXT,
          severity: 'warning',
        })
        return
      }

      const { email, password } = data
      setLoading(true)
      try {
        const userData = await loginUser(dispatch, { email, password })

        if (!userData) {
          throw new Error('Login failed')
        }

        navigate(Routes.DASHBOARD)
      } catch {
        setAlert({
          message: 'There was an error logging in. Please try again.',
          severity: 'error',
        })
      } finally {
        setLoading(false)
      }
    },
    [authEnabled, dispatch, navigate, setAlert],
  )

  return {
    authEnabled,
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
      e?: BaseSyntheticEvent<unknown, unknown, unknown> | undefined,
    ) => Promise<void>) &
      UseFormHandleSubmit<TFieldValues>,
    register,
    reset,
    resetDefaultValues,
    resetField,
    setError,
    setFocus,
    setValue,
    setValues,
    subscribe,
    trigger,
    unregister,
    watch,
  }
}

export default useSignIn
