export type DashboardStatusTone = 'ready' | 'configured' | 'example'
export type DashboardTone =
  'primary' | 'violet' | 'success' | 'warning' | 'info'

export interface DashboardRecord {
  id: string
  name: string
  owner: string
  status: string
  updated: string
  icon: 'route' | 'auth' | 'upload'
}

export interface DashboardMetric {
  label: string
  value: string
  detail: string
  icon: 'route' | 'primitives' | 'quality'
  tone: DashboardTone
}

export interface DashboardActivityItem {
  label: string
  status: string
}

export interface ReadinessItem {
  label: string
  tone: Extract<DashboardTone, 'primary' | 'violet' | 'success'>
}
