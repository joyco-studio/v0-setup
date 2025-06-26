import { version } from '../../package.json'

export const VERSION = version
export type { EnvCheckAction, EnvCheckResult, EnvCheckActionResult } from './types'
export { SetupToolbar } from './core'
export { cn } from './utils'
export { CSS_CONTENT, injectStyles } from './styles'
