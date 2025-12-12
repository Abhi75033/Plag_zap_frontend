/**
 * PDF Report Generator Utility
 * 
 * Generates a PDF report from analysis results using browser's print functionality
 */

export const generatePDFReport = (result, text) => {
    // Create a new window for the print-friendly report
    const printWindow = window.open('', '_blank');

    if (!printWindow) {
        alert('Please allow popups to download the PDF report');
        return;
    }

    // Generate report HTML
    const reportHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>PlagZap Analysis Report</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          padding: 40px;
          color: #1a1a1a;
          line-height: 1.6;
        }
        .header {
          text-align: center;
          margin-bottom: 40px;
          padding-bottom: 20px;
          border-bottom: 3px solid #7c3aed;
        }
        .logo {
          font-size: 32px;
          font-weight: bold;
          color: #7c3aed;
          margin-bottom: 5px;
        }
        .subtitle {
          color: #666;
          font-size: 14px;
        }
        .date {
          color: #888;
          font-size: 12px;
          margin-top: 10px;
        }
        .scores-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 20px;
          margin-bottom: 40px;
        }
        .score-card {
          padding: 20px;
          border-radius: 12px;
          text-align: center;
        }
        .score-card.plagiarism {
          background: #fef2f2;
          border: 2px solid #ef4444;
        }
        .score-card.ai {
          background: #fff7ed;
          border: 2px solid #f97316;
        }
        .score-card.overall {
          background: #f0fdf4;
          border: 2px solid #22c55e;
        }
        .score-value {
          font-size: 48px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .score-card.plagiarism .score-value { color: #ef4444; }
        .score-card.ai .score-value { color: #f97316; }
        .score-card.overall .score-value { color: #22c55e; }
        .score-label {
          font-size: 14px;
          color: #666;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .section {
          margin-bottom: 30px;
        }
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #1a1a1a;
          margin-bottom: 15px;
          padding-bottom: 10px;
          border-bottom: 1px solid #eee;
        }
        .text-content {
          background: #f9fafb;
          padding: 20px;
          border-radius: 8px;
          font-size: 14px;
          white-space: pre-wrap;
          word-wrap: break-word;
          max-height: 400px;
          overflow: hidden;
        }
        .sources-list {
          list-style: none;
        }
        .sources-list li {
          padding: 10px;
          background: #f9fafb;
          margin-bottom: 8px;
          border-radius: 6px;
          font-size: 13px;
        }
        .sources-list li a {
          color: #7c3aed;
          text-decoration: none;
        }
        .no-sources {
          color: #22c55e;
          background: #f0fdf4;
          padding: 15px;
          border-radius: 8px;
          text-align: center;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #eee;
          text-align: center;
          color: #888;
          font-size: 12px;
        }
        .highlight-legend {
          display: flex;
          gap: 20px;
          margin-bottom: 15px;
        }
        .legend-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 12px;
        }
        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
        }
        .legend-dot.safe { background: #22c55e; }
        .legend-dot.plagiarized { background: #ef4444; }
        .legend-dot.paraphrased { background: #f97316; }
        @media print {
          body { padding: 20px; }
          .score-card { break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="logo">⚡ PlagZap</div>
        <div class="subtitle">Plagiarism & AI Detection Report</div>
        <div class="date">Generated on ${new Date().toLocaleString()}</div>
      </div>

      <div class="scores-grid">
        <div class="score-card plagiarism">
          <div class="score-value">${result.plagarismScore || 0}%</div>
          <div class="score-label">Plagiarism</div>
        </div>
        <div class="score-card ai">
          <div class="score-value">${result.aiScore || 0}%</div>
          <div class="score-label">AI Content</div>
        </div>
        <div class="score-card overall">
          <div class="score-value">${100 - (result.overallScore || 0)}%</div>
          <div class="score-label">Original</div>
        </div>
      </div>

      ${result.aiReason ? `
        <div class="section">
          <div class="section-title">AI Detection Analysis</div>
          <p style="color: #666; font-size: 14px;">${result.aiReason}</p>
        </div>
      ` : ''}

      <div class="section">
        <div class="section-title">Detected Sources</div>
        ${result.matches && result.matches.length > 0 ? `
          <ul class="sources-list">
            ${result.matches.map(match => `
              <li>
                <strong>${match.title || 'Unknown Source'}</strong><br/>
                <a href="${match.url}" target="_blank">${match.url}</a>
                ${match.similarity ? `<br/><span style="color: #ef4444;">Similarity: ${Math.round(match.similarity * 100)}%</span>` : ''}
              </li>
            `).join('')}
          </ul>
        ` : `
          <div class="no-sources">✓ No external sources detected. Content appears to be original.</div>
        `}
      </div>

      <div class="section">
        <div class="section-title">Analyzed Text (${text?.length || 0} characters)</div>
        <div class="text-content">${text?.substring(0, 2000) || 'No text provided'}${text?.length > 2000 ? '...(truncated)' : ''}</div>
      </div>

      <div class="footer">
        <p>This report was generated by PlagZap - Your trusted plagiarism detection tool</p>
        <p>© ${new Date().getFullYear()} PlagZap. All rights reserved.</p>
      </div>

      <script>
        // Auto-print when loaded
        window.onload = function() {
          window.print();
        };
      </script>
    </body>
    </html>
  `;

    printWindow.document.write(reportHTML);
    printWindow.document.close();
};

export default generatePDFReport;
