/**
 * @module components/PasswordVisibilityToggle.tsx
 */
import { useCallback } from 'react'
import type { ElementType } from 'react'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import VisibilityOutline from '@mui/icons-material/Visibility'
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff'

type PasswordVisibilityToggleProps = {
  showPassword: boolean
  setShowPassword: (value: boolean) => void
}

const resolveIconComponent = (iconModule: unknown): ElementType => {
  if (iconModule && typeof iconModule === 'object' && 'default' in iconModule) {
    return (iconModule as { default: ElementType }).default
  }

  return iconModule as ElementType
}

const VisibilityIconComponent = resolveIconComponent(VisibilityOutline)
const VisibilityOffIconComponent = resolveIconComponent(VisibilityOffIcon)

const PasswordVisibilityToggle: React.FC<PasswordVisibilityToggleProps> = ({
  showPassword,
  setShowPassword,
}): JSX.Element => {
  const handleClick = useCallback(
    () => setShowPassword(!showPassword),
    [showPassword, setShowPassword],
  )

  return (
    <InputAdornment position="end">
      <IconButton
        edge="end"
        onMouseDown={(e) => e.preventDefault()}
        onClick={handleClick}
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? (
          <VisibilityIconComponent />
        ) : (
          <VisibilityOffIconComponent />
        )}
      </IconButton>
    </InputAdornment>
  )
}

export default PasswordVisibilityToggle
