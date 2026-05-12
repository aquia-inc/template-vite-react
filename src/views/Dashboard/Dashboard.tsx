/**
 * The default view that an authenticated user first sees when they visit the
 *  app. It renders a list of teams that the user is a member of, and a list
 *  of the api keys that the user has access to.
 * @module views/Dashboard/Dashboard
 */
import * as React from 'react'
import { useLoaderData } from 'react-router-dom'
import Typography from '@mui/material/Typography'

/**
 * Component that renders the contents of the Dashboard view.
 * @returns {JSX.Element} Component that renders the dashboard contents.
 */
const DashboardContainer: React.FC = (): JSX.Element => {
  const { username = '' } = useLoaderData() as { username: string }

  return (
    <React.Fragment>
      <Typography variant="body1">
        Welcome User <code>{username}</code>
      </Typography>
    </React.Fragment>
  )
}
export default DashboardContainer
