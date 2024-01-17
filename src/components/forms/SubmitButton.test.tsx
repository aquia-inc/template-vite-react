import { render, screen } from '@testing-library/react'
import SubmitButton from '@/components/forms/SubmitButton'

test('renders without crashing', () => {
  render(<SubmitButton />)
  const buttonElement = screen.getByRole('button')
  expect(buttonElement).toBeInTheDocument()
})

test('applies default props correctly', () => {
  render(<SubmitButton />)
  const buttonElement = screen.getByRole('button')
  expect(buttonElement).toHaveAttribute('type', 'submit')
  expect(buttonElement).toHaveClass('MuiButton-contained')
  expect(buttonElement).toHaveClass('MuiButton-containedPrimary')
  expect(buttonElement.textContent).toBe('Submit')
})

test('applies passed props correctly', () => {
  render(
    <SubmitButton color="secondary" variant="outlined">
      Save
    </SubmitButton>
  )
  const buttonElement = screen.getByRole('button')
  expect(buttonElement).toHaveClass('MuiButton-outlined')
  expect(buttonElement).toHaveClass('MuiButton-outlinedSecondary')
  expect(buttonElement.textContent).toBe('Save')
})

test('is disabled when disabled prop is passed', () => {
  render(<SubmitButton disabled />)
  const buttonElement = screen.getByRole('button')
  expect(buttonElement).toBeDisabled()
})
