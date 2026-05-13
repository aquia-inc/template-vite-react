const fileTransform = require('../../config/jest/fileTransform.cjs')

const getSvgComponentName = (filename: string): string => {
  const result = fileTransform.process('', filename)
  const match = result.match(/React\.forwardRef\(function ([^(]+)/)

  if (!match) {
    throw new Error(`No SVG component name generated for ${filename}`)
  }

  return match[1]
}

describe('fileTransform', () => {
  test.each([
    ['src/assets/icons/ChevronLeft.svg', 'SvgChevronLeft'],
    ['src/assets/icons/FOO-bar.svg', 'SvgFooBar'],
    ['src/assets/icons/XMLHttpRequest.svg', 'SvgXmlHttpRequest'],
    ['src/assets/icons/CAFÉ-icon.svg', 'SvgCaféIcon'],
  ])(
    'generates stable PascalCase SVG component names',
    (filename, expected) => {
      expect(getSvgComponentName(filename)).toBe(expected)
    },
  )
})
