import {X} from 'lucide-react'

import type { Citation } from "../services/sendQueryAndFile";

type RightPanelProps = {
  citation: Citation | null;
  onClose: () => void;
};

function RightPanel({ citation, onClose }: RightPanelProps) {
  const source = citation?.metadata.source;
  const pdfId =
    typeof source === "string" ? (source.split(/[\\/]/).pop() ?? "") : "";
  const rawPageNumber = citation?.metadata.pageNumber;
  const pageNumber =
    typeof rawPageNumber === "number" &&
    Number.isInteger(rawPageNumber) &&
    rawPageNumber > 0
      ? rawPageNumber
      : null;
  const pdfUrl =
    citation && /^[a-f\d]{32}$/i.test(pdfId) && pageNumber !== null
      ? `http://localhost:5000/api/pdf/${pdfId}#toolbar=0&page=${pageNumber}&zoom=page-fit`
      : null;

  if (!citation || !pdfUrl || pageNumber === null) {
    return null
  }

  return (
    <aside className="right-panel is-open" aria-label="Citation PDF viewer">
      <header className="pdf-panel-header">
        <div>
          <span className="pdf-panel-label">CITATION</span>
          <h2>{citation.chunkId}</h2>
        </div>
        <span className="pdf-page-badge">Page {pageNumber}</span>
        <button
          aria-label="Close PDF viewer"
          className="pdf-panel-close"
          onClick={onClose}
          type="button"
        >
          <X size={18} />
        </button>
      </header>
      <iframe
        className="citation-pdf"
        key={pdfUrl}
        src={pdfUrl}
        title={`PDF source ${citation.chunkId}, page ${pageNumber}`}
      />
    </aside>
  );
}

export default RightPanel;
