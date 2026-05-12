export const fetchAuthSession = jest.fn().mockResolvedValue({
  credentials: {
    accessKeyId: 'testAccessKeyId',
    secretAccessKey: 'testSecretAccessKey',
    sessionToken: 'testSessionToken',
    expiration: new Date('2024-01-01T00:00:00.000Z'),
  },
  identityId: 'testIdentityId',
  tokens: {
    accessToken: {
      toString: () => '123456',
    },
  },
})

export const fetchUserAttributes = jest.fn().mockResolvedValue({
  email: 'demo@test.com',
})

export const getCurrentUser = jest.fn().mockResolvedValue({
  username: 'abc123',
  userId: 'abc123',
})

export const signIn = jest.fn().mockResolvedValue({
  isSignedIn: true,
  nextStep: {
    signInStep: 'DONE',
  },
})

export const signInWithRedirect = jest.fn().mockResolvedValue(undefined)

export const signOut = jest.fn().mockResolvedValue(undefined)
