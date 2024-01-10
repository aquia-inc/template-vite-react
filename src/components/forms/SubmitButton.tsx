/**
 * A component that renders a button to submit a form.
 * @module components/forms/SubmitButton
 */
import Button, { ButtonProps } from '@mui/material/Button'
import { PropsWithChildren } from 'react'

type SubmitButtonProps = {
  label?: string
  disabled?: boolean
} & ButtonProps

/**
 * The primary button to submit forms.
 * @param {SubmitButtonProps} props
 * @param {string} [props.label] Option to add a button label
 * @param {boolean} [props.disabled] Option to disable the button
 * @returns {JSX.Element}
 */
const SubmitButton: React.FC<PropsWithChildren<SubmitButtonProps>> = ({
  children = 'Submit',
  ...props
}): JSX.Element => <Button {...props}>{children}</Button>

SubmitButton.defaultProps = {
  color: 'primary',
  label: 'Submit',
  size: 'large',
  type: 'submit',
  variant: 'contained',
}

export default SubmitButton
