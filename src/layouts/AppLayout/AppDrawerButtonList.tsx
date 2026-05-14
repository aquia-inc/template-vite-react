/**
 * @module layouts/AppLayout/AppDrawerButtonList
 */
import { useMemo } from 'react'
import DashboardIcon from '@mui/icons-material/Dashboard'
import AppDrawerButton from '@/components/AppDrawerButton'
import { RouteIds, RouteNames, Routes } from '@/router/constants'

type AppDrawerButtonListProps = {
  open: boolean
}

const AppDrawerButtonList: React.FC<AppDrawerButtonListProps> = ({
  open,
}): JSX.Element => {
  const items = useMemo(
    () => [
      {
        icon: <DashboardIcon />,
        id: RouteIds.DASHBOARD,
        label: RouteNames.DASHBOARD,
        to: Routes.DASHBOARD,
      },
    ],
    [],
  )

  return (
    <>
      {items.map(({ icon, id, label, to }) => (
        <AppDrawerButton
          icon={icon}
          key={id}
          label={label}
          open={open}
          to={to}
        />
      ))}
    </>
  )
}

export default AppDrawerButtonList
