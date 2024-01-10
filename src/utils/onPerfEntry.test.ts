import onPerfEntry from '@/utils/onPerfEntry'

test('logs the provided entry to the console', () => {
  const consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation()
  const testEntry = { name: 'test', duration: 100 }
  onPerfEntry(testEntry)
  expect(consoleDebugSpy).toHaveBeenCalledWith(testEntry)
  consoleDebugSpy.mockRestore()
})
