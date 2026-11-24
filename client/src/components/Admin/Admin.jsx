import {
  BookOpen,
  LayoutDashboard,
  MessageSquare,
  Settings,
} from 'lucide-react'

import Dashboard from './Dashboard/Dashboard'
import './Admin.css'

const navigationItems = [
  {label: 'Dashboard', href: '/admin#dashboard', icon: LayoutDashboard, active: true},
  {label: 'Knowledge Base', href: '/admin#knowledge-base', icon: BookOpen},
  {label: 'Conversations', href: '/admin#conversations', icon: MessageSquare},
  {label: 'Settings', href: '/admin#settings', icon: Settings},
]

function Admin() {
  return (
    <div className="admin">
      <aside className="admin__sidebar">
        <a aria-label="Return to support chat" className="admin__brand" href="/">
          <span aria-hidden="true" className="admin__brand-mark">
            <BookOpen size={19} />
          </span>
          <span>ResolveDesk</span>
        </a>

        <p className="admin__section-label">ADMINISTRATION</p>
        <nav aria-label="Admin navigation" className="admin__nav">
          {navigationItems.map(({label, href, icon: Icon, active}) => (
            <a
              aria-current={active ? 'page' : undefined}
              className={`admin__nav-link${active ? ' admin__nav-link--active' : ''}`}
              href={href}
              key={label}
            >
              <Icon aria-hidden="true" size={18} />
              <span>{label}</span>
            </a>
          ))}
        </nav>

        <div className="admin__sidebar-spacer" />
        <a className="admin__back-link" href="/">
          Back to support
        </a>
      </aside>

      <main className="admin__main" id="dashboard">
        <Dashboard />
      </main>
    </div>
  )
}

export default Admin
