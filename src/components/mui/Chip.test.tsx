import { render, screen } from '@testing-library/react'
import Chip from '@/components/mui/Chip'

test('renders correctly with default props', () => {
  render(<Chip />)
  const chipElement = screen.getByRole('status')
  expect(chipElement).toBeInTheDocument()
  expect(chipElement).toHaveClass('MuiChip-filled')
})

test('renders correctly with light skin and color', () => {
  render(<Chip skin="light" color="primary" />)
  const chipElement = screen.getByRole('status')
  expect(chipElement).toBeInTheDocument()
  expect(chipElement).toHaveClass('MuiChip-light')
})

test('renders correctly with specific color and default skin', () => {
  render(<Chip color="secondary" />)
  const chipElement = screen.getByRole('status')
  expect(chipElement).toBeInTheDocument()
})

test('renders correctly with custom label', () => {
  const label = 'Custom Label'
  render(<Chip label={label} />)
  const chipElement = screen.getByText(label)
  expect(chipElement).toBeInTheDocument()
})

test('calls onClick when clicked', () => {
  const onClick = jest.fn()
  render(<Chip onClick={onClick} />)
  const chipElement = screen.getByRole('status')
  chipElement.click()
  expect(onClick).toHaveBeenCalledTimes(1)
})
