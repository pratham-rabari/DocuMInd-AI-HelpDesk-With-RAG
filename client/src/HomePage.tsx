import {useState} from 'react'

import ChatArea from './components/ChatArea'
import RightPanel from './components/RightPanel'
import Sidebar from './components/Sidebar'
import type {Citation} from './services/sendQueryAndFile'

function HomePage() {
  const [selectedCitation, setSelectedCitation] = useState<Citation | null>(null)

  return (
    <div className="app-shell">
      <Sidebar />
      <ChatArea onCitationSelect={setSelectedCitation} />
      <RightPanel
        citation={selectedCitation}
        onClose={() => setSelectedCitation(null)}
      />
    </div>
  )
}

export default HomePage
