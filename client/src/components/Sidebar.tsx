import {
  BookOpen,
  Inbox,
  MessageSquarePlus,
  Search,
} from 'lucide-react'
import { useState } from 'react'

const recentConversations = [
  'Refund request for order',
  'Update shipping address',
  'Product compatibility question',
  'Subscription billing',
]

function Sidebar() {
  const [query, setQuery] = useState('')
  const filteredConversations = recentConversations.filter((conversation) =>
    conversation.toLowerCase().includes(query.trim().toLowerCase()),
  )

  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">
          <MessageSquarePlus size={18} strokeWidth={2.2} />
        </span>
        <span>ResolveDesk AI</span>
      </div>

      <label className="sidebar-search">
        <Search size={17} />
        <input
          aria-label="Search conversations"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search conversations"
          type="search"
          value={query}
        />
        <kbd>Ctrl K</kbd>
      </label>

      <nav className="primary-nav" aria-label="Main navigation">
        <div className="nav-item active">
          <MessageSquarePlus size={18} />
          <span>New conversation</span>
        </div>
        <div className="nav-item">
          <Inbox size={18} />
          <span>Inbox</span>
        </div>
        <a className="nav-item" href="/admin">
          <BookOpen size={18} />
          <span>Knowledge base</span>
        </a>
      </nav>

      <section className="sidebar-section" aria-label="Recent conversations">
        <h2 className="section-label">Recent</h2>
        <div className="conversation-list">
          {filteredConversations.map((conversation, index) => (
            <div
              className={`conversation-item${index === 0 ? ' selected' : ''}`}
              key={conversation}
            >
              {conversation}
            </div>
          ))}
          {filteredConversations.length === 0 && (
            <p className="no-conversations">No matching conversations</p>
          )}
        </div>
      </section>

      <div className="sidebar-spacer" />

      <footer className="sidebar-footer">
        <span className="account-avatar" aria-hidden="true">JD</span>
        <span className="account-copy">
          <strong>Jordan Davis</strong>
          <span>Support team account</span>
        </span>
      </footer>
    </aside>
  )
}

export default Sidebar
