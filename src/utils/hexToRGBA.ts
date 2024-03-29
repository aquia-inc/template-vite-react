/**
 * Returns Hex color to RGBA color
 * @module utils/hexToRGBA
 */
import { hexToRgb } from '@mui/material'

/**
 * Returns Hex color to RGBA color
 * @param {string} hexCode The hex color
 * @param {number} opacity The alpha value
 * @returns {string} The RGBA color string
 */
const hexToRGBA = (hexCode: string, opacity: number) => {
  // check if hexCode is valid
  if (/^#([0-9A-F]{3}){1,2}$/i.test(hexCode) === false) {
    throw new Error('Invalid hex color')
  }

  // check if opacity is valid
  if (opacity < 0 || opacity > 1) {
    throw new Error('Invalid opacity value')
  }

  const rgb = Array.from(hexToRgb(hexCode).matchAll(/\d+/g))
  return `rgba(${rgb.join(`, `)}, ${opacity})`
}

export default hexToRGBA
