import { useEffect, useMemo, useState } from 'react'
import clsx from 'clsx'
import {
  Activity,
  Blocks,
  Cpu,
  GitBranch,
  KeyRound,
  LayoutGrid,
  Link2,
  LogOut,
  Moon,
  PlugZap,
  Shield,
  Sun,
  Timer,
  Wallet,
} from 'lucide-react'
import {
  connections,
  crons,
  missingTools,
  projects,
  security,
  skills,
  subAgents,
  systemHealth,
  usage,
} from './mock'

const PASSWORD = 'IWThalassa4!'

type Theme = 'dark' | 'light'

function useTheme() {
  const [theme, setTheme] = useState<Theme>('dark')

  useEffect(() => {
    const saved = (localStorage.getItem('mc_theme') as Theme | null) ?? 'dark'
    setTheme(saved)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem('mc_theme', theme)
  }, [theme])

  return { theme, setTheme }
}

function ThemeToggle({ theme, setTheme }: { theme: Theme; setTheme: (t: Theme) => void }) {
  const isDark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="inline-flex items-center gap-2 rounded-full border border-border/10 bg-card/60 px-3 py-2 text-sm text-fg hover:opacity-90 transition"
    >
      {isDark ? <Sun size={16} /> : <Moon size={16} />}
      <span className="hidden sm:inline">{isDark ? 'Light' : 'Dark'}</span>
    </button>
  )
}

function Chip({ tone, children }: { tone: 'good' | 'warn' | 'bad' | 'neutral'; children: React.ReactNode }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full border px-2.5 py-1 text-xs',
        tone === 'good' && 'border-good/30 bg-good/10',
        tone === 'warn' && 'border-warn/35 bg-warn/10',
        tone === 'bad' && 'border-bad/35 bg-bad/10',
        tone === 'neutral' && 'border-border/10 bg-card/40'
      )}
    >
      {children}
    </span>
  )
}

function Panel({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="rounded-3xl border border-border/10 bg-card/70 p-5 shadow-glow backdrop-blur-xl">
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl border border-border/10 bg-card/60">
            {icon}
          </span>
          <h2 className="text-sm font-semibold tracking-wide text-fg">{title}</h2>
        </div>
      </header>
      {children}
    </section>
  )
}

function Login({ onOk }: { onOk: () => void }) {
  const { theme, setTheme } = useTheme()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0 mc-grid opacity-45" />
      <div className="relative mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <div className="text-xs tracking-[0.28em] text-muted/70">MISSION CONTROL</div>
            <h1 className="mt-2 text-2xl font-semibold text-fg">Sign in</h1>
          </div>
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </div>

        <div className="rounded-3xl border border-border/10 bg-card/70 p-6 shadow-glow backdrop-blur-xl">
          <p className="text-sm text-muted/70">Password protected prototype.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (password === PASSWORD) {
                localStorage.setItem('mc_auth', '1')
                onOk()
              } else {
                setError('Mot de passe incorrect.')
              }
            }}
            className="mt-6 space-y-4"
          >
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError(null)
              }}
              className="w-full rounded-2xl border border-border/10 bg-transparent px-4 py-3 text-fg outline-none focus:ring-2 focus:ring-accent/60"
              placeholder="Passphrase"
              autoFocus
            />
            {error ? <div className="rounded-2xl border border-bad/30 bg-bad/10 px-4 py-3 text-sm">{error}</div> : null}
            <button className="w-full rounded-2xl bg-fg px-4 py-3 text-sm font-semibold text-bg hover:opacity-90 transition">
              Authenticate
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const { theme, setTheme } = useTheme()
  const [active, setActive] = useState<'overview' | 'ops' | 'usage'>('overview')

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div className="pointer-events-none absolute inset-0 mc-grid opacity-35" />

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-10">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-12">
          <aside className="md:col-span-3">
            <div className="sticky top-6 rounded-3xl border border-border/10 bg-card/70 p-4 shadow-glow backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-[10px] tracking-[0.35em] text-muted/70">MISSION</div>
                  <div className="mt-1 text-lg font-semibold text-fg">Control</div>
                </div>
                <ThemeToggle theme={theme} setTheme={setTheme} />
              </div>

              <nav className="mt-5 space-y-1">
                <button
                  onClick={() => setActive('overview')}
                  className={clsx(
                    'flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-sm transition',
                    active === 'overview' ? 'bg-accent/12 text-fg' : 'text-muted/70 hover:bg-card/60'
                  )}
                >
                  <LayoutGrid size={16} /> Overview
                </button>
                <button
                  onClick={() => setActive('ops')}
                  className={clsx(
                    'flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-sm transition',
                    active === 'ops' ? 'bg-accent/12 text-fg' : 'text-muted/70 hover:bg-card/60'
                  )}
                >
                  <Blocks size={16} /> Ops
                </button>
                <button
                  onClick={() => setActive('usage')}
                  className={clsx(
                    'flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-sm transition',
                    active === 'usage' ? 'bg-accent/12 text-fg' : 'text-muted/70 hover:bg-card/60'
                  )}
                >
                  <Wallet size={16} /> Usage
                </button>
              </nav>

              <button
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-border/10 bg-card/60 px-3 py-2 text-sm text-fg hover:opacity-90"
                onClick={onLogout}
              >
                <LogOut size={16} /> Logout
              </button>

              <div className="mt-4 rounded-2xl border border-border/10 bg-card/50 px-3 py-3 text-xs text-muted/70">
                v2 • Sidebar navigation
              </div>
            </div>
          </aside>

          <main className="md:col-span-9">
            <header className="mb-4 rounded-3xl border border-border/10 bg-card/50 p-5 backdrop-blur-xl">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <div className="text-xs tracking-[0.35em] text-muted/70">DASHBOARD</div>
                  <h1 className="mt-2 text-2xl font-semibold text-fg">{active === 'overview' ? 'Overview' : active === 'ops' ? 'Operations' : 'Usage & Cost'}</h1>
                </div>
                <div className="text-sm text-muted/70">Mock data • responsive • light/dark</div>
              </div>
            </header>

            {active === 'overview' ? (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Panel title="Skills" icon={<Cpu size={16} />}>
                  <div className="flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <Chip key={s.name} tone={s.status === 'ok' ? 'good' : s.status === 'warn' ? 'warn' : 'bad'}>
                        {s.name} <span className="ml-2 text-muted/70">{s.version}</span>
                      </Chip>
                    ))}
                  </div>
                </Panel>
                <Panel title="Santé système" icon={<Activity size={16} />}>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-2xl border border-border/10 bg-card/40 px-3 py-3">
                      <div className="text-xs text-muted/70">Uptime</div>
                      <div className="mt-1 text-lg font-semibold text-fg">{systemHealth.uptime}</div>
                    </div>
                    <div className="rounded-2xl border border-border/10 bg-card/40 px-3 py-3">
                      <div className="text-xs text-muted/70">Errors</div>
                      <div className="mt-1 text-lg font-semibold text-fg">{systemHealth.recentErrors}</div>
                    </div>
                    {systemHealth.apiStatus.map((a) => (
                      <div key={a.name} className="col-span-1 rounded-2xl border border-border/10 bg-card/40 px-3 py-3 text-sm">
                        <div className="flex items-center justify-between">
                          <span className="text-muted/70">{a.name}</span>
                          <span className={clsx('font-semibold', a.status === 'ok' ? 'text-good' : 'text-warn')}>
                            {a.status.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
                <Panel title="Connexions" icon={<Link2 size={16} />}>
                  <div className="space-y-2">
                    {connections.map((c) => (
                      <div key={c.name} className="rounded-2xl border border-border/10 bg-card/40 px-3 py-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold text-fg">{c.name}</div>
                            <div className="mt-1 text-xs text-muted/70">{c.note}</div>
                          </div>
                          <Chip tone={c.status === 'connected' ? 'good' : c.status === 'degraded' ? 'warn' : 'bad'}>{c.status}</Chip>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
                <Panel title="Manques" icon={<PlugZap size={16} />}>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {missingTools.map((m) => (
                      <div key={m.name} className="rounded-2xl border border-border/10 bg-card/40 px-3 py-3">
                        <div className="text-sm font-semibold text-fg">{m.name}</div>
                        <div className="mt-1 text-xs text-muted/70">{m.why}</div>
                      </div>
                    ))}
                  </div>
                </Panel>
              </div>
            ) : null}

            {active === 'ops' ? (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Panel title="Projets" icon={<GitBranch size={16} />}>
                  <div className="space-y-2">
                    {projects.map((p) => (
                      <div key={p.name} className="rounded-2xl border border-border/10 bg-card/40 px-3 py-3">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <div className="text-sm font-semibold text-fg">{p.name}</div>
                            <div className="mt-1 text-xs text-muted/70">Updated {p.updated}</div>
                          </div>
                          <Chip tone={p.status === 'done' ? 'good' : p.status === 'blocked' ? 'bad' : 'neutral'}>
                            {p.status}
                          </Chip>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
                <Panel title="Sub-agents" icon={<Shield size={16} />}>
                  <div className="space-y-2">
                    {subAgents.map((a) => (
                      <div key={a.id} className="rounded-2xl border border-border/10 bg-card/40 px-3 py-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted/70">{a.id}</span>
                          <span className="text-xs text-muted/70">{a.when}</span>
                        </div>
                        <div className="mt-2 text-sm font-semibold text-fg">{a.task}</div>
                        <div className="mt-1 text-xs text-muted/70">{a.result}</div>
                      </div>
                    ))}
                  </div>
                </Panel>
                <Panel title="Crons" icon={<Timer size={16} />}>
                  <div className="space-y-2">
                    {crons.map((c) => (
                      <div key={c.name} className="rounded-2xl border border-border/10 bg-card/40 px-3 py-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="text-sm font-semibold text-fg">{c.name}</div>
                            <div className="mt-1 text-xs text-muted/70">{c.schedule}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-muted/70">next</div>
                            <div className="text-sm font-medium text-fg">{c.next}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Panel>
                <Panel title="Quick status" icon={<Activity size={16} />}>
                  <div className="flex flex-wrap gap-2">
                    <Chip tone="good">Deploy: OK</Chip>
                    <Chip tone="warn">OpenAI: spikes</Chip>
                    <Chip tone="neutral">Backups: scheduled</Chip>
                    <Chip tone="neutral">Incidents: none</Chip>
                  </div>
                </Panel>
              </div>
            ) : null}

            {active === 'usage' ? (
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Panel title="Usage" icon={<Wallet size={16} />}>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-2xl border border-border/10 bg-card/40 px-3 py-3">
                      <div className="text-xs text-muted/70">Tokens (24h)</div>
                      <div className="mt-1 text-xl font-semibold text-fg">{usage.tokens24h.toLocaleString()}</div>
                    </div>
                    <div className="rounded-2xl border border-border/10 bg-card/40 px-3 py-3">
                      <div className="text-xs text-muted/70">Cost (24h)</div>
                      <div className="mt-1 text-xl font-semibold text-fg">${usage.cost24h.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="mt-3 rounded-2xl border border-border/10 bg-card/40 px-3 py-3">
                    <div className="text-xs text-muted/70">Top models</div>
                    <div className="mt-3 space-y-2">
                      {usage.topModels.map((m) => (
                        <div key={m.name} className="flex items-center justify-between text-sm">
                          <span className="text-muted/70">{m.name}</span>
                          <span className="font-semibold text-fg">{m.share}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </Panel>
                <Panel title="Sécurité" icon={<KeyRound size={16} />}>
                  <div className="grid grid-cols-1 gap-3">
                    <div className="rounded-2xl border border-border/10 bg-card/40 px-3 py-3">
                      <div className="text-xs text-muted/70">Score global</div>
                      <div className="mt-2 flex items-end justify-between">
                        <div className="text-3xl font-semibold text-fg">{security.score}</div>
                        <Chip tone={security.score >= 85 ? 'good' : security.score >= 70 ? 'warn' : 'bad'}>
                          {security.score >= 85 ? 'STRONG' : security.score >= 70 ? 'WATCH' : 'RISK'}
                        </Chip>
                      </div>
                      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-fg/10">
                        <div
                          className={clsx(
                            'h-full rounded-full',
                            security.score >= 85 ? 'bg-good' : security.score >= 70 ? 'bg-warn' : 'bg-bad'
                          )}
                          style={{ width: `${security.score}%` }}
                        />
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border/10 bg-card/40 px-3 py-3">
                      <div className="text-xs font-semibold text-fg">Alertes</div>
                      <div className="mt-3 space-y-2">
                        {security.alerts.map((a) => (
                          <div key={a.title} className="rounded-2xl border border-border/10 bg-card/30 px-3 py-3">
                            <div className="flex items-center justify-between">
                              <div className="text-sm font-semibold text-fg">{a.title}</div>
                              <Chip tone={a.severity === 'high' ? 'bad' : a.severity === 'med' ? 'warn' : 'neutral'}>
                                {a.severity}
                              </Chip>
                            </div>
                            <div className="mt-1 text-xs text-muted/70">{a.note}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border/10 bg-card/40 px-3 py-3">
                      <div className="text-xs font-semibold text-fg">Clés API</div>
                      <div className="mt-3 space-y-2">
                        {security.apiKeys.map((k) => (
                          <div key={k.name} className="flex items-start justify-between gap-3">
                            <div>
                              <div className="text-sm font-semibold text-fg">{k.name}</div>
                              <div className="mt-0.5 text-xs text-muted/70">{k.note}</div>
                            </div>
                            <Chip tone={k.status === 'ok' ? 'good' : k.status === 'warn' ? 'warn' : 'bad'}>
                              {k.status}
                            </Chip>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border/10 bg-card/40 px-3 py-3">
                      <div className="text-xs font-semibold text-fg">Accès récents</div>
                      <div className="mt-3 space-y-2">
                        {security.access.map((x) => (
                          <div key={`${x.when}-${x.ip}-${x.action}`} className="flex items-center justify-between text-xs">
                            <span className="text-muted/70">{x.when} • {x.ip}</span>
                            <span className={clsx('font-semibold', x.result === 'success' ? 'text-good' : 'text-bad')}>
                              {x.action}:{x.result}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl border border-border/10 bg-card/40 px-3 py-3">
                      <div className="text-xs font-semibold text-fg">Recommandations</div>
                      <ul className="mt-3 space-y-1 text-xs text-muted/70">
                        {security.recommendations.map((r) => (
                          <li key={r}>• {r}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Panel>

                <Panel title="Optimisations" icon={<Cpu size={16} />}>
                  <ul className="space-y-2 text-sm text-muted/70">
                    <li>• Cache prompts & embeddings</li>
                    <li>• Batch tool calls where possible</li>
                    <li>• Prefer smaller models for routing</li>
                    <li>• Alert when cost/day threshold exceeded</li>
                  </ul>
                </Panel>
              </div>
            ) : null}
          </main>
        </div>
      </div>
    </div>
  )
}

function App() {
  const [authed, setAuthed] = useState(false)

  useEffect(() => {
    setAuthed(localStorage.getItem('mc_auth') === '1')
  }, [])

  const view = useMemo(() => {
    if (!authed) return <Login onOk={() => setAuthed(true)} />
    return (
      <Dashboard
        onLogout={() => {
          localStorage.removeItem('mc_auth')
          setAuthed(false)
        }}
      />
    )
  }, [authed])

  return view
}

export default App
