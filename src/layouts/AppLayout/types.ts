export type DashboardSectionId = 'overview' | 'records' | 'upload' | 'activity'

export interface AppLayoutOutletContext {
  searchQuery: string
}

export interface WorkspaceNavigationProps {
  activeSection: DashboardSectionId
  isMobile: boolean
  onNavigate: (section: DashboardSectionId) => void
  onUnavailable: (feature: 'Profile' | 'Settings') => void
}
