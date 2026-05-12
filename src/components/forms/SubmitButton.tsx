/**
 * A component that renders a button to submit a form.
 * @module components/forms/SubmitButton
 */
import Button, { ButtonProps } from '@mui/material/Button'
import { PropsWithChildren } from 'react'

type SubmitButtonProps = {
  disabled?: boolean
} & ButtonProps

/**
 * The primary button to submit forms.
 * @param {SubmitButtonProps} props
 * @param {boolean} [props.disabled] Option to disable the button
 * @returns {JSX.Element}
 */
const SubmitButton: React.FC<PropsWithChildren<SubmitButtonProps>> = ({
  children = 'Submit',
  color = 'primary',
  size = 'large',
  type = 'submit',
  variant = 'contained',
  ...props
}): JSX.Element => (
  <Button color={color} size={size} type={type} variant={variant} {...props}>
    {children}
  </Button>
)

export default SubmitButton
