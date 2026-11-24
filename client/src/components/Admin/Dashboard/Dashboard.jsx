import {useRef, useState} from 'react'
import {FileText, HardDrive, MessageSquare, Plus, Search} from 'lucide-react'

import './Dashboard.css'

const tabs = [
  {id: 'knowledge-base', label: 'Knowledge Base'},
  {id: 'token-analytics', label: 'Token Analytics'},
]

const stats = [
  {label: 'Total Documents', value: '128', icon: FileText},
  {label: 'Total Size', value: '2.4 GB', icon: HardDrive},
  {label: 'Total Conversations', value: '1,248', icon: MessageSquare},
  {label: 'Unanswered Questions', value: '24', icon: Search},
]

function Dashboard() {
  const [activeTab, setActiveTab] = useState('knowledge-base')
  const tabButtonRefs = useRef([])

  function handleTabKeyDown(event, currentIndex) {
    let nextIndex

    if (event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % tabs.length
    } else if (event.key === 'ArrowLeft') {
      nextIndex = (currentIndex + tabs.length - 1) % tabs.length
    } else if (event.key === 'Home') {
      nextIndex = 0
    } else if (event.key === 'End') {
      nextIndex = tabs.length - 1
    }

    if (nextIndex !== undefined) {
      event.preventDefault()
      setActiveTab(tabs[nextIndex].id)
      tabButtonRefs.current[nextIndex]?.focus()
    }
  }

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div>
          <p className="dashboard__eyebrow">OVERVIEW</p>
          <h1 className="dashboard__title">Knowledge Base</h1>
          <p className="dashboard__subtitle">
            Manage your documents and keep your support knowledge up to date.
          </p>
        </div>
        <button className="dashboard__add-button" type="button">
          <Plus aria-hidden="true" size={18} />
          <span>Add Document</span>
        </button>
      </header>

      <div aria-label="Admin dashboard sections" className="dashboard__tabs" role="tablist">
        {tabs.map((tab, index) => (
          <button
            aria-controls={`dashboard-panel-${tab.id}`}
            aria-selected={activeTab === tab.id}
            className={`dashboard__tab${activeTab === tab.id ? ' dashboard__tab--active' : ''}`}
            id={`dashboard-tab-${tab.id}`}
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={(event) => handleTabKeyDown(event, index)}
            ref={(element) => {
              tabButtonRefs.current[index] = element
            }}
            role="tab"
            tabIndex={activeTab === tab.id ? 0 : -1}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>

      <section
        aria-labelledby="dashboard-tab-knowledge-base"
        className="dashboard__tabpanel"
        hidden={activeTab !== 'knowledge-base'}
        id="dashboard-panel-knowledge-base"
        role="tabpanel"
        tabIndex={0}
      >
        <div className="dashboard__stats">
          {stats.map(({label, value, icon: Icon}) => (
            <article className="dashboard__stat-card" key={label}>
              <span aria-hidden="true" className="dashboard__stat-icon">
                <Icon size={18} />
              </span>
              <p className="dashboard__stat-label">{label}</p>
              <p className="dashboard__stat-value">{value}</p>
            </article>
          ))}
        </div>

        <div className="dashboard__sections">
          <section aria-labelledby="uploaded-documents-title" className="dashboard__card">
            <div className="dashboard__card-header">
              <div>
                <h2 className="dashboard__card-title" id="uploaded-documents-title">
                  Uploaded Documents
                </h2>
                <p className="dashboard__card-description">
                  Browse and manage your knowledge sources.
                </p>
              </div>
              <span className="dashboard__count">128</span>
            </div>

            <label className="dashboard__search">
              <Search aria-hidden="true" size={17} />
              <input
                aria-label="Search uploaded documents"
                placeholder="Search documents"
                type="search"
              />
            </label>

            <div
              aria-label="Uploaded documents"
              className="dashboard__table-scroll"
              role="region"
              tabIndex={0}
            >
              <table className="dashboard__table">
                <thead>
                  <tr>
                    <th scope="col">Name</th>
                    <th scope="col">Type</th>
                    <th scope="col">Size</th>
                    <th scope="col">Uploaded</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="dashboard__empty-row" colSpan="4">
                      No documents uploaded yet.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section aria-labelledby="unanswered-questions-title" className="dashboard__card">
            <div className="dashboard__card-header">
              <div>
                <h2 className="dashboard__card-title" id="unanswered-questions-title">
                  Unanswered Questions
                </h2>
                <p className="dashboard__card-description">
                  Questions that may need new source material.
                </p>
              </div>
              <span className="dashboard__count dashboard__count--accent">24</span>
            </div>
            <div className="dashboard__question-placeholder">
              <span aria-hidden="true" className="dashboard__question-mark">?</span>
              <p>Unanswered questions will appear here.</p>
            </div>
          </section>
        </div>
      </section>

      <section
        aria-labelledby="dashboard-tab-token-analytics"
        className="dashboard__tabpanel"
        hidden={activeTab !== 'token-analytics'}
        id="dashboard-panel-token-analytics"
        role="tabpanel"
        tabIndex={0}
      >
        <div className="dashboard__placeholder">
          <h2>Token Analytics</h2>
          <p>Token usage analytics will appear here.</p>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
