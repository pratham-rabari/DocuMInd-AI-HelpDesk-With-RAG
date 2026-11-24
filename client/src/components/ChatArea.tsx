import {
  ArrowUp,
  Paperclip,
  X,
  Sparkles,
} from 'lucide-react'
import {
  Fragment,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
  type KeyboardEvent,
} from 'react'

import {sendQuery, type Citation} from '../services/sendQueryAndFile'
import ReactMarkdown from 'react-markdown'

const allowedFileExtensions = new Set(['pdf', 'docx', 'txt'])
const acceptedFileTypes =
  '.pdf,.docx,.txt,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain'

type SentMessage = {
  id: number
  text: string
  files: string[]
  response: string
  citationIds: string[]
  citations: Citation[]
  isPending: boolean
}

type ChatAreaProps = {
  onCitationSelect: (citation: Citation) => void
}

function ChatArea({onCitationSelect}: ChatAreaProps) {
  const [message, setMessage] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [fileError, setFileError] = useState('')
  const [isDraggingFiles, setIsDraggingFiles] = useState(false)
  const [sentMessages, setSentMessages] = useState<SentMessage[]>([])
  const [isLoading,setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null)

  function addFiles(selectedFiles: File[]) {
    const acceptedFiles = selectedFiles.filter((file) => {
      const extension = file.name.split('.').pop()?.toLowerCase()
      return extension !== undefined && allowedFileExtensions.has(extension)
    })
    const rejectedFiles = selectedFiles.length - acceptedFiles.length

    if (acceptedFiles.length > 0) {
      setFiles((currentFiles) => [...currentFiles, ...acceptedFiles])
    }

    setFileError(
      rejectedFiles > 0
        ? `${rejectedFiles} file${rejectedFiles === 1 ? '' : 's'} not added. Choose PDF, DOCX, or TXT files only.`
        : '',
    )
  }

  async function sendMessage() {
    const text = message.trim()
    setMessage('');
    if ((!text && files.length === 0) || isLoading) return

    const sentMessageId = Date.now()
    const sentFiles = files.map((file) => file.name)
    let response = ''
    let citationIds: string[] = []
    let citations: Citation[] = []
    setIsLoading(true)
    setFileError('')
    setSentMessages((currentMessages) => [
      ...currentMessages,
      {
        id: sentMessageId,
        text,
        files: sentFiles,
        response: '',
        citationIds: [],
        citations: [],
        isPending: true,
      },
    ])

    try {
      if (files.length === 0) {
        const res = (await sendQuery(text || undefined, null)).response;
        response = res.answer;
        citationIds = res.citationIds
        citations = res.citations
      } else {
        for (const [index, file] of files.entries()) {
          const result = (await sendQuery(index === 0 ? text || undefined : undefined, file)).response
          if (index === 0) {
            response = result.answer
            citationIds = result.citationIds
            citations = result.citations
          }
        }
      }
    } catch (error) {
      setSentMessages((currentMessages) =>
        currentMessages.filter((sentMessage) => sentMessage.id !== sentMessageId),
      )
      setIsLoading(false)
      setFileError(error instanceof Error ? error.message : 'Failed to send message.')
      return
    }

    setSentMessages((currentMessages) =>
      currentMessages.map((sentMessage) =>
        sentMessage.id === sentMessageId
          ? {
              ...sentMessage,
              response,
              citationIds,
              citations,
              isPending: false,
            }
          : sentMessage,
      ),
    )
    setIsLoading(false)
    setMessage('')
    setFiles([])
    setFileError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    sendMessage()
  }

  function handleMessageKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  function handleFilesChange(event: ChangeEvent<HTMLInputElement>) {
    addFiles(Array.from(event.target.files ?? []))
    event.target.value = ''
  }

  function handleDrop(event: DragEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsDraggingFiles(false)
    addFiles(Array.from(event.dataTransfer.files))
  }

  function handleCitationClick(chunkId: string, messageId: number) {
    const selectedMessage = sentMessages.find(
      (sentMessage) => sentMessage.id === messageId,
    )

    const citation = selectedMessage?.citations.find(
      (citation) => citation.chunkId === chunkId,
    )

    if (citation) onCitationSelect(citation)
  }

  return (
    <main className="chat-area">
      <header className="chat-header">
        <div className="chat-heading">
          <span>New conversation</span>
        </div>
        <div className="assistant-status">
          <span className="online-indicator" aria-label="Assistant online" />
          <span>AI SUPPORT</span>
        </div>
      </header>

      <div className="chat-content">
        {sentMessages.length === 0 ? (
          <section className="welcome-content" aria-labelledby="welcome-title">
            <div className="welcome-icon">
              <Sparkles size={22} />
            </div>
            <p className="welcome-eyebrow">YOUR SUPPORT, REIMAGINED</p>
            <h1 id="welcome-title">How can we help today?</h1>
            <p>
              I’m your AI support assistant. Describe what you need help with
              and we’ll take it from there.
            </p>
          </section>
        ) : (
          <section className="chat-messages" aria-label="Conversation">
            {sentMessages.map((sentMessage) => (
              <Fragment key={sentMessage.id}>
                <article className="message-bubble sent-message">
                  {sentMessage.text && <p>{sentMessage.text}</p>}
                  {sentMessage.files.map((fileName) => (
                    <span className="message-file" key={fileName}>
                      <Paperclip size={14} />
                      {fileName}
                    </span>
                  ))}
                </article>
                {sentMessage.isPending && (
                  <p className="thinking-indicator" role="status">Thinking...</p>
                )}
                {sentMessage.response && (
                  <article className="message-bubble received-message">
                    <ReactMarkdown>{sentMessage.response}</ReactMarkdown>
                    <div className="citation-links">
                      {sentMessage.citationIds.map((citationId, index) => (
                        <button
                          className="citation-link"
                          key={citationId}
                          onClick={() => handleCitationClick(citationId,sentMessage.id)}
                          type="button"
                        >
                          source_{index + 1}
                        </button>
                      ))}
                    </div>
                  </article>
                )}
              </Fragment>
            ))}
          </section>
        )}

        <div className="composer-wrap">
          <form
            className={`composer${isDraggingFiles ? ' dragging-files' : ''}`}
            onDragEnter={(event) => {
              event.preventDefault()
              setIsDraggingFiles(true)
            }}
            onDragLeave={(event) => {
              if (
                !(event.relatedTarget instanceof Node) ||
                !event.currentTarget.contains(event.relatedTarget)
              ) {
                setIsDraggingFiles(false)
              }
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={handleDrop}
            onSubmit={handleSubmit}
          >
            {isDraggingFiles && (
              <p className="drop-prompt">Drop PDF, DOCX, or TXT files to attach</p>
            )}
            {files.length > 0 && (
              <div aria-label="Attached files" className="attachment-list">
                {files.map((file, index) => (
                  <span className="attachment-chip" key={`${file.name}-${index}`}>
                    <Paperclip size={13} />
                    <span>{file.name}</span>
                    <button
                      aria-label={`Remove ${file.name}`}
                      onClick={() =>
                        setFiles((currentFiles) => {
                          const remainingFiles = currentFiles.filter(
                            (_, fileIndex) => fileIndex !== index,
                          )
                          if (remainingFiles.length === 0) setFileError('')
                          return remainingFiles
                        })
                      }
                      type="button"
                    >
                      <X size={13} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <textarea
              aria-label="Write a message"
              onChange={(event) => setMessage(event.target.value)}
              onKeyDown={handleMessageKeyDown}
              placeholder="Tell us what you need help with..."
              rows={2}
              value={message}
            />
            <div className="composer-toolbar">
              <div className="composer-context">
                <input
                  accept={acceptedFileTypes}
                  aria-label="Attach PDF, DOCX, or TXT files"
                  className="file-input"
                  multiple
                  onChange={handleFilesChange}
                  ref={fileInputRef}
                  type="file"
                />
                <button
                  className="attach-button"
                  onClick={() => fileInputRef.current?.click()}
                  type="button"
                >
                  <Paperclip size={17} />
                  <span>Add files</span>
                </button>
              </div>
              <div className="composer-submit">
                <span>Enter to send</span>
                <button
                  aria-label="Send message"
                  className="send-button"
                  disabled={!message.trim() && files.length === 0 || isLoading}
                  type="submit"
                >
                  <ArrowUp size={18} />
                </button>
              </div>
            </div>
            {fileError && (
              <p className="file-error" role="alert">
                {fileError}
              </p>
            )}
          </form>
          <p className="composer-note">
            ResolveDesk AI may make mistakes. Check important details.
          </p>
        </div>
      </div>
    </main>
  )
}

export default ChatArea
