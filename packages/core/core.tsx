import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

import { AlertTriangle, X, Check, Copy } from './icons'
import { cn, copy, normalizeIndentation } from './utils'
import { EnvCheckAction, EnvCheckActionResult, EnvCheckResult, VariableGroup } from './types'
import { checkEnvironmentVariables } from './actions'
import { CSS_CONTENT } from './styles'

type SetupToolbarBaseProps = {
  title: string
  description: string
}

type SetupToolbarProps =
  | (SetupToolbarBaseProps & {
      envs: VariableGroup
    })
  | (SetupToolbarBaseProps & {
      envCheckAction: EnvCheckAction
    })

// Internal component that will be rendered inside shadow DOM
const SetupToolbarInternal = ({ title, description, ...props }: SetupToolbarProps) => {
  const [open, setOpen] = useState(false)
  const [envs, setEnvs] = useState<EnvCheckResult[]>([])
  const [loading, setLoading] = useState(true)
  const [allValid, setAllValid] = useState(false)
  const [copiedScript, setCopiedScript] = useState<string | null>(null)
  const ref = useRef(null)

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  const handleCopyScript = async (content: string, scriptId: string) => {
    await copy(content)
    setCopiedScript(scriptId)
    setTimeout(() => setCopiedScript(null), 2000)
  }

  useEffect(() => {
    setLoading(true)
    if ('envs' in props) {
      checkEnvironmentVariables(props.envs).then((result: EnvCheckActionResult) => {
        setEnvs(result.envs)
        setAllValid(result.allValid)
        setLoading(false)
      })
    } else {
      props.envCheckAction().then((result: EnvCheckActionResult) => {
        setEnvs(result.envs)
        setAllValid(result.allValid)
        setLoading(false)
      })
    }
  }, [])

  if (loading || allValid) {
    return null
  }

  const validCount = envs.filter((env) => env.isValid).length

  return (
    <div
      aria-hidden="true"
      className={cn(
        'v0-fixed v0-inset-0 v0-transition-colors v0-flex v0-items-end v0-justify-center v0-z-[9999] v0-p-4 v0-pointer-events-none'
      )}
    >
      <div
        onClick={() => setOpen(false)}
        className={cn(
          'v0-absolute v0-inset-0 v0-transition-colors',
          open ? 'v0-pointer-events-auto v0-bg-black/30' : 'v0-pointer-events-none'
        )}
      />

      <AnimatePresence>
        {open ? (
          <motion.div
            layoutId="wrapper"
            className="v0-pointer-events-auto v0-absolute v0-bottom-6 v0-w-[500px] v0-overflow-hidden v0-bg-neutral-100 v0-p-1 v0-outline-none v0-flex v0-flex-col"
            ref={ref}
            style={{
              borderRadius: 12,
              boxShadow:
                '0 0 0 1px rgba(0, 0, 0, 0.08), 0px 2px 2px rgba(0, 0, 0, 0.04), 0px 0px 0px 1px rgba(0, 0, 0, 0.08)',
              height: '400px',
            }}
          >
            {/* Header with animated title and close button */}
            <div className="v0-flex v0-items-center v0-justify-between v0-flex-shrink-0 v0-px-4 v0-py-3 v0-border-b v0-border-dashed v0-rounded-t-lg v0-bg-neutral-50 v0-border-neutral-200">
              <div className="v0-flex v0-items-center v0-gap-2">
                <motion.div layoutId="icon">
                  <AlertTriangle className="v0-size-4 v0-text-amber-600" />
                </motion.div>
                <motion.span layoutId="title" className="v0-text-sm v0-font-semibold v0-text-amber-800">
                  {title}
                </motion.span>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="v0-p-1 v0-transition-colors v0-rounded v0-text-neutral-300 v0-hover:v0-text-neutral-600 v0-hover:v0-bg-neutral-100"
              >
                <X className="v0-size-4" />
              </button>
            </div>

            <div className="v0-flex v0-flex-col v0-flex-1 v0-min-h-0">
              <motion.div
                exit={{ y: 8, opacity: 0 }}
                transition={{ type: 'spring', duration: 0.25, bounce: 0 }}
                key="content"
                className="v0-flex v0-flex-col v0-flex-1 v0-min-h-0 v0-rounded-b-lg"
              >
                {/* Description */}
                <div className="v0-flex v0-items-center v0-justify-between v0-flex-shrink-0 v0-gap-4 v0-px-3 v0-py-1.5 v0-border-b v0-bg-neutral-100 v0-border-neutral-200">
                  <p className="v0-text-xs v0-text-balance v0-text-neutral-600">{description}</p>
                  <div className="v0-flex v0-items-center v0-justify-center v0-shrink-0">
                    <div className="v0-relative v0-size-10">
                      {/* Background circle */}
                      <svg className="v0-transform v0--rotate-90 v0-size-10" viewBox="0 0 32 32">
                        <circle
                          cx="16"
                          cy="16"
                          r="12"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="transparent"
                          className="v0-text-neutral-300"
                        />
                        {/* Progress circle */}
                        <circle
                          cx="16"
                          cy="16"
                          r="12"
                          stroke="currentColor"
                          strokeWidth="2"
                          fill="transparent"
                          strokeDasharray={`${2 * Math.PI * 12}`}
                          strokeDashoffset={`${2 * Math.PI * 12 * (1 - validCount / envs.length)}`}
                          className={validCount === envs.length ? 'v0-text-green-500' : 'v0-text-amber-500'}
                          style={{
                            transition: 'stroke-dashoffset 0.3s ease-in-out',
                          }}
                        />
                      </svg>
                      {/* Center text */}
                      <div className="v0-absolute v0-inset-0 v0-flex v0-items-center v0-justify-center">
                        <span className="v0-text-[10px] v0-font-semibold v0-text-neutral-700 v0-leading-none v0-tabular-nums">
                          {validCount}/{envs.length}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Environment variables list */}
                <div className="v0-flex-1 v0-overflow-y-auto v0-bg-white">
                  <div className="v0-p-4 v0-pb-6 v0-space-y-3">
                    {envs.map((env) => (
                      <div
                        key={env.name}
                        className=" v0-p-3 v0-border v0-rounded-lg v0-bg-neutral-50 v0-border-neutral-200"
                      >
                        <div className="v0-flex v0-items-center v0-gap-3">
                          <div
                            className={`v0-flex-shrink-0 v0-size-8 v0-rounded-sm v0-flex v0-items-center v0-justify-center ${
                              env.isValid ? 'v0-bg-green-100 v0-text-green-600' : 'v0-bg-amber-100 v0-text-amber-600'
                            }`}
                          >
                            {env.isValid ? <Check className="v0-size-4" /> : <AlertTriangle className="v0-size-4" />}
                          </div>
                          <div className="v0-flex-1 v0-min-w-0">
                            <div className="v0-text-sm v0-font-medium v0-text-neutral-900">{env.label}</div>
                            <div className="v0-font-mono v0-text-xs v0-truncate v0-text-neutral-500">{env.name}</div>
                          </div>
                          <div
                            className={`v0-text-xs v0-font-medium ${env.isValid ? 'v0-text-green-600' : 'v0-text-amber-600'}`}
                          >
                            {env.isValid ? 'Set' : 'Missing'}
                          </div>
                        </div>
                        {env.script?.content && !env.isValid && (
                          <div className="v0-relative v0-mt-4">
                            {/* Copy button */}
                            <button
                              onClick={() => handleCopyScript(env.script!.content, env.name)}
                              className="v0-absolute v0-top-2 v0-right-2 v0-z-10 v0-p-2 v0-rounded v0-bg-neutral-800 v0-hover:v0-bg-neutral-700 v0-transition-colors v0-text-neutral-300 v0-hover:v0-text-white"
                              title="Copy code"
                            >
                              {copiedScript === env.name ? (
                                <Check className="v0-size-4" />
                              ) : (
                                <Copy className="v0-size-4" />
                              )}
                            </button>
                            {/* @ts-expect-error - TODO: fix this */}
                            <SyntaxHighlighter
                              language={env.script.language.toLowerCase()}
                              style={oneDark}
                              customStyle={{
                                margin: 0,
                                padding: '12px',
                                fontSize: '11px',
                                scrollbarWidth: 'none',
                              }}
                            >
                              {normalizeIndentation(env.script.content)}
                            </SyntaxHighlighter>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.button
            layoutId="wrapper"
            onClick={() => {
              setOpen(true)
            }}
            key="button"
            className="v0-relative v0-flex v0-items-center v0-gap-2 v0-px-3 v0-font-medium v0-transition-colors v0-border v0-rounded-lg v0-shadow-sm v0-outline-none v0-pointer-events-auto v0-h-9 v0-border-amber-200 v0-bg-amber-50 v0-hover:v0-bg-amber-100"
            style={{ borderRadius: 8 }}
          >
            <motion.div layoutId="icon">
              <AlertTriangle className="v0-w-4 v0-h-4 v0-text-amber-600" />
            </motion.div>
            <motion.span layoutId="title" className="v0-block v0-text-sm v0-text-amber-800">
              {title}
            </motion.span>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  )
}

const MOUNT_INSTANCE_KEY = '__V0_SETUP_TOOLBAR_MOUNTED__'

export const SetupToolbar = (props: SetupToolbarProps) => {
  const shadowHostRef = useRef<HTMLDivElement | null>(null)
  const shadowRootRef = useRef<ShadowRoot | null>(null)
  const portalContainerRef = useRef<HTMLDivElement | null>(null)
  const mountInstanceIdRef = useRef<string | null>(null)
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    const w = window as any
    const instanceId = Math.random().toString(36).substr(2, 9)

    // Check if there's already a mounted instance
    const existingInstanceId = w[MOUNT_INSTANCE_KEY]
    if (existingInstanceId && existingInstanceId !== mountInstanceIdRef.current) {
      // Another instance is already mounted, don't mount this one
      return
    }

    // Mark this instance as the mounted one
    mountInstanceIdRef.current = instanceId
    w[MOUNT_INSTANCE_KEY] = instanceId

    // Create shadow host element
    const shadowHost = document.createElement('div')
    shadowHost.style.cssText =
      'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999;'
    shadowHostRef.current = shadowHost

    // Create shadow root
    const shadowRoot = shadowHost.attachShadow({ mode: 'open' })
    shadowRootRef.current = shadowRoot

    // Inject styles into shadow DOM
    const styleElement = document.createElement('style')
    styleElement.textContent = CSS_CONTENT
    shadowRoot.appendChild(styleElement)

    // Create container for React portal
    const portalContainerElement = document.createElement('div')
    portalContainerElement.style.cssText = 'width: 100%; height: 100%;'
    portalContainerRef.current = portalContainerElement
    shadowRoot.appendChild(portalContainerElement)
    setPortalContainer(portalContainerElement)

    // Append to document body
    document.body.appendChild(shadowHost)

    return () => {
      // Only clean up if this is still the active instance
      if (w[MOUNT_INSTANCE_KEY] === instanceId) {
        w[MOUNT_INSTANCE_KEY] = null

        // Clean DOM elements
        if (shadowHostRef.current && shadowHostRef.current.parentNode) {
          shadowHostRef.current.parentNode.removeChild(shadowHostRef.current)
        }

        shadowHostRef.current = null
        shadowRootRef.current = null
        portalContainerRef.current = null
        setPortalContainer(null)
      }
      mountInstanceIdRef.current = null
    }
  }, [])

  // Render using React Portal - no separate React root needed!
  return portalContainer ? createPortal(<SetupToolbarInternal {...props} />, portalContainer) : null
}
