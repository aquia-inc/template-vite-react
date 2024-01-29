/**
 * The default view that an authenticated user first sees when they visit the
 *  app. It renders a list of teams that the user is a member of, and a list
 *  of the api keys that the user has access to.
 * @module pages/Dashboard/Dashboard
 */
import * as React from 'react'
import { useLoaderData, Await } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import Fallback from '@/components/SimpleLoadingFallback'

/**
 * Component that renders the contents of the Dashboard view.
 * @returns {JSX.Element} Component that renders the dashboard contents.
 */
const DashboardContainer: React.FC = (): JSX.Element => {
  const data = useLoaderData() as { username: string }

  return (
    <React.Suspense fallback={<Fallback />}>
      <Await
        resolve={data}
        errorElement={<div>Could not load dashboard</div>}
        // eslint-disable-next-line react/no-children-prop
        children={({ username = '' }) => (
          <>
            <Typography variant="body1">
              Welcome User <code>{username}</code>
            </Typography>
          </>
        )}
      />
    </React.Suspense>
  )
}
export default DashboardContainer
