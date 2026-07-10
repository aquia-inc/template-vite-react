interface RgbaColor {
  alpha: number
  blue: number
  green: number
  red: number
}

const parseCssColor = (value: string): RgbaColor => {
  const channels = value.match(/[\d.]+/g)?.map(Number) ?? []

  if (channels.length < 3) {
    throw new Error(`Unsupported CSS color: ${value}`)
  }

  return {
    red: channels[0],
    green: channels[1],
    blue: channels[2],
    alpha: channels[3] ?? 1,
  }
}

const composite = (foreground: RgbaColor, background: RgbaColor): RgbaColor => {
  const alpha = foreground.alpha + background.alpha * (1 - foreground.alpha)
  const blend = (foregroundChannel: number, backgroundChannel: number) =>
    alpha === 0
      ? 0
      : (foregroundChannel * foreground.alpha +
          backgroundChannel * background.alpha * (1 - foreground.alpha)) /
        alpha

  return {
    red: blend(foreground.red, background.red),
    green: blend(foreground.green, background.green),
    blue: blend(foreground.blue, background.blue),
    alpha,
  }
}

const relativeLuminance = ({ red, green, blue }: RgbaColor): number => {
  const linearize = (channel: number) => {
    const normalized = channel / 255
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4
  }

  return (
    0.2126 * linearize(red) +
    0.7152 * linearize(green) +
    0.0722 * linearize(blue)
  )
}

export const getElementContrastRatio = (element: Element): number => {
  const foreground = parseCssColor(window.getComputedStyle(element).color)
  const backgroundLayers: RgbaColor[] = []
  let current: Element | null = element

  while (current) {
    const backgroundValue = window.getComputedStyle(current).backgroundColor
    if ((backgroundValue.match(/[\d.]+/g)?.length ?? 0) >= 3) {
      const background = parseCssColor(backgroundValue)
      if (background.alpha > 0) backgroundLayers.push(background)
    }
    current = current.parentElement
  }

  const white: RgbaColor = {
    red: 255,
    green: 255,
    blue: 255,
    alpha: 1,
  }
  const background = backgroundLayers
    .reverse()
    .reduce((result, layer) => composite(layer, result), white)
  const renderedForeground = composite(foreground, background)
  const foregroundLuminance = relativeLuminance(renderedForeground)
  const backgroundLuminance = relativeLuminance(background)

  return (
    (Math.max(foregroundLuminance, backgroundLuminance) + 0.05) /
    (Math.min(foregroundLuminance, backgroundLuminance) + 0.05)
  )
}
