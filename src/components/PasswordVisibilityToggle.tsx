/**
 * @module components/PasswordVisibilityToggle.tsx
 */
import { useCallback } from 'react'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import VisibilityOutline from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

type PasswordVisibilityToggleProps = {
  showPassword: boolean
  setShowPassword: (value: boolean) => void
}

const PasswordVisibilityToggle: React.FC<PasswordVisibilityToggleProps> = ({
  showPassword,
  setShowPassword,
}): JSX.Element => {
  const handleClick = useCallback(
    () => setShowPassword(!showPassword),
    [showPassword, setShowPassword]
  )

  return (
    <InputAdornment position="end">
      <IconButton
        edge="end"
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleClick}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? <VisibilityOutline /> : <VisibilityOffIcon />}
      </IconButton>
    </InputAdornment>
  )
}

export default PasswordVisibilityToggle
