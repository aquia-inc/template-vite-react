export interface WorkspaceTokens {
  canvas: string
  canvasCool: string
  navigation: string
  navigationActive: string
  primary: string
  violet: string
  text: string
  textMuted: string
  border: string
  success: string
  warning: string
  railWidth: number
  mobileHeaderHeight: number
  mobileNavHeight: number
  cardRadius: number
  heroRadius: number
  cardShadow: string
  gutter: { xs: number; sm: number; lg: number }
}

export const workspaceTokens: WorkspaceTokens = {
  canvas: '#F6F6F3',
  canvasCool: '#F5F7FC',
  navigation: '#0D1838',
  navigationActive: '#4C4FF8',
  primary: '#3157FF',
  violet: '#7457F5',
  text: '#11182B',
  textMuted: '#66728A',
  border: '#D8DEEC',
  success: '#139B72',
  warning: '#C98216',
  railWidth: 72,
  mobileHeaderHeight: 64,
  mobileNavHeight: 68,
  cardRadius: 18,
  heroRadius: 22,
  cardShadow: '0 12px 32px rgba(25, 35, 63, 0.08)',
  gutter: { xs: 12, sm: 22, lg: 28 },
}
