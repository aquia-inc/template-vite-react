import { Auth } from 'aws-amplify'
import dashboardLoader from '@/views/Dashboard/Dashboard.loader'

test('returns username from current user info', async () => {
  ;(Auth.currentUserInfo as jest.Mock).mockResolvedValue({
    username: 'test-user',
  })
  const data = await dashboardLoader()
  expect(Auth.currentUserInfo).toHaveBeenCalled()
  expect(data).toEqual({ username: 'test-user' })
})
