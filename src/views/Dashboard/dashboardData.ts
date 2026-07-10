import type {
  DashboardActivityItem,
  DashboardMetric,
  DashboardRecord,
  ReadinessItem,
} from './dashboard.types'

export const dashboardRecords: DashboardRecord[] = [
  {
    id: 'route-map',
    name: 'Route map',
    owner: 'Frontend',
    status: 'Ready',
    updated: '2 min ago',
    icon: 'route',
  },
  {
    id: 'auth-loader',
    name: 'Auth loader',
    owner: 'Platform',
    status: 'Configured',
    updated: '12 min ago',
    icon: 'auth',
  },
  {
    id: 'upload-flow',
    name: 'Upload flow',
    owner: 'Product',
    status: 'Example',
    updated: '1 hr ago',
    icon: 'upload',
  },
]

export const dashboardMetrics: DashboardMetric[] = [
  {
    label: 'Routes wired',
    value: '6',
    detail: 'Public, authenticated, protected, and fallback paths.',
    icon: 'route',
    tone: 'primary',
  },
  {
    label: 'Reusable primitives',
    value: '18',
    detail: 'Layout, feedback, form, upload, and MUI wrappers.',
    icon: 'primitives',
    tone: 'violet',
  },
  {
    label: 'Quality gates',
    value: '5',
    detail: 'Install, lint, test, build, and Storybook checks.',
    icon: 'quality',
    tone: 'info',
  },
]

export const dashboardActivity: DashboardActivityItem[] = [
  { label: 'Environment config', status: 'Ready to customize' },
  { label: 'Protected app shell', status: 'Mounted at /app' },
  { label: 'Storybook examples', status: 'Component-first workflow' },
]

export const readinessItems: ReadinessItem[] = [
  { label: 'Routes', tone: 'success' },
  { label: 'MUI', tone: 'primary' },
  { label: 'Storybook', tone: 'violet' },
]
