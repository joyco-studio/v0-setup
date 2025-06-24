import { version } from '../../package.json'
// Import styles so they're bundled
import './styles.css'

export const VERSION = version
export type { EnvCheckAction, EnvCheckResult, EnvCheckActionResult } from './types'
export { SetupToolbar } from './core'
export { cn } from './utils'
