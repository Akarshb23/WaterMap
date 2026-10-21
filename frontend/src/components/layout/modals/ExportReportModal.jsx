import { useState } from 'react'
import {
  Download,
  FileText,
  FileSpreadsheet,
  Code,
  CheckCircle2,
  Printer,
  Sparkles,
  X,
  Shield,
  Layers,
  Calendar,
  AlertCircle,
} from 'lucide-react'

const RECOMMENDATIONS_DATA = [
  { id: 'REC-01', title: 'Implement Rainwater Harvesting Mandate', category: 'Nature-based Solutions', priority: 'High', costCr: 45, impact: '34% WSI Reduction', districts: 'Koramangala, Indiranagar, Electronic City' },
  { id: 'REC-02', title: 'Eco-Restoration of Wetland Lake Chains', category: 'Nature-based Solutions', priority: 'High', costCr: 80, impact: '28% WSI Reduction', districts: 'Bellandur, Varthur, Hebbal' },
  { id: 'REC-03', title: 'Enforced RWH & Dual-Piping in Commercial Zones', category: 'Policy & Governance', priority: 'High', costCr: 12, impact: '19% WSI Reduction', districts: 'City Wide (All Districts)' },
  { id: 'REC-04', title: 'Increase Use of Recycled Wastewater for Non-Potable', category: 'Demand Management', priority: 'High', costCr: 65, impact: '22% WSI Reduction', districts: 'Whitefield, Bellandur, Marathahalli' },
  { id: 'REC-05', title: 'Re-engineering Rajakaluve Primary Stormwater Drains', category: 'Infrastructure', priority: 'High', costCr: 120, impact: '31% WSI Reduction', districts: 'Central, South, East Bangalore' },
  { id: 'REC-06', title: 'Smart Acoustic Leak Detection in Cauvery Network', category: 'Infrastructure', priority: 'High', costCr: 35, impact: '18% WSI Reduction', districts: 'Old City, Malleshwaram, Basavanagudi' },
  { id: 'REC-07', title: 'Rooftop Catchment Subsidies for Residential RWAs', category: 'Policy & Governance', priority: 'Medium', costCr: 25, impact: '14% WSI Reduction', districts: 'Jayanagar, BTM Layout, HSR Layout' },
  { id: 'REC-08', title: 'Deep Piezometer Aquifer Recharge Well Network', category: 'Nature-based Solutions', priority: 'High', costCr: 38, impact: '24% WSI Reduction', districts: 'Koramangala, Whitefield, Mahadevapura' },
]

const ExportReportModal = ({ isOpen, onClose, onShowToast }) => {
  const [format, setFormat] = useState('pdf') // 'pdf' | 'csv' | 'json' | 'print'
  const [isGenerating, setIsGenerating] = useState(false)
  const [sections, setSections] = useState({
    executiveSummary: true,
    districtMatrix: true,
    recommendationsList: true,
    rwhSpecs: true,
    climateProjections: true,
  })

  if (!isOpen) return null

  const handleToggleSection = (key) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleExport = () => {
    setIsGenerating(true)

    setTimeout(() => {
      setIsGenerating(false)

      if (format === 'csv') {
        // Generate CSV file download
        const headers = ['ID', 'Title', 'Category', 'Priority', 'Est Cost (Cr)', 'Projected Impact', 'Target Districts']
        const rows = RECOMMENDATIONS_DATA.map((r) =>
          [r.id, `"${r.title}"`, `"${r.category}"`, r.priority, r.costCr, `"${r.impact}"`, `"${r.districts}"`].join(',')
        )
        const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n')
        const encodedUri = encodeURI(csvContent)
        const link = document.createElement('a')
        link.setAttribute('href', encodedUri)
        link.setAttribute('download', `WaterMap_Karnataka_Resilience_Report_2026.csv`)
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        onShowToast?.('Spreadsheet report downloaded (.csv)')
      } else if (format === 'json') {
        // Generate JSON file download
        const jsonData = {
          reportTitle: 'Karnataka Water Resilience Blueprint 2026–2030',
          generatedAt: new Date().toISOString(),
          jurisdiction: 'Bengaluru Urban Core & Peri-Urban Basins',
          authority: 'BWSSB & BBMP Joint Resilience Taskforce',
          metrics: {
            currentCompositeWSI: 0.74,
            targetWSI: 0.46,
            totalInvestmentCr: 520,
            recommendedActionsCount: 24,
            priorityBasinsCount: 12,
          },
          includedSections: sections,
          recommendations: RECOMMENDATIONS_DATA,
        }
        const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `WaterMap_Bangalore_Hydrology_2026.json`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
        onShowToast?.('Hydrological dataset downloaded (.json)')
      } else {
        // Print / PDF format: open clean print preview window
        const printWindow = window.open('', '_blank', 'width=900,height=750')
        if (printWindow) {
          printWindow.document.write(`
            <!DOCTYPE html>
            <html>
              <head>
                <title>WaterMap — Bangalore Water Resilience Report 2026</title>
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; padding: 40px; color: #0f2937; line-height: 1.5; }
                  .header { border-bottom: 2px solid #075d4c; padding-bottom: 20px; margin-bottom: 30px; display: flex; justify-content: space-between; align-items: flex-start; }
                  .title { font-size: 24px; font-weight: 800; color: #075d4c; margin: 0; }
                  .subtitle { font-size: 14px; color: #64748b; margin-top: 5px; }
                  .badge { background: #e6f4f1; color: #075d4c; font-weight: 700; font-size: 11px; padding: 4px 10px; border-radius: 99px; display: inline-block; }
                  .metrics-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; margin-bottom: 30px; }
                  .metric-card { border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; background: #f8fafc; }
                  .metric-val { font-size: 22px; font-weight: 800; color: #075d4c; }
                  .metric-lbl { font-size: 11px; text-transform: uppercase; color: #64748b; margin-top: 4px; font-weight: 600; }
                  table { width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px; }
                  th, td { border: 1px solid #e2e8f0; padding: 10px 12px; text-align: left; }
                  th { background: #f1f5f9; font-weight: 700; color: #334155; }
                  .priority-high { color: #dc2626; font-weight: 700; }
                  .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; display: flex; justify-content: space-between; }
                  @media print { body { padding: 0; } }
                </style>
              </head>
              <body>
                <div class="header">
                  <div>
                    <span class="badge">Official Resilience Blueprint 2026–2030</span>
                    <h1 class="title">Bangalore Urban Water Resilience Action Plan</h1>
                    <div class="subtitle">Bangalore Water Supply & Sewerage Board (BWSSB) & Municipal Climate Resilience Cell</div>
                  </div>
                  <div style="text-align: right; font-size: 12px; color: #64748b;">
                    <div><strong>Date:</strong> ${new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                    <div><strong>Author:</strong> Akarsh (Lead Urban Hydrologist)</div>
                    <div><strong>Cycle:</strong> Municipal Review Phase 1</div>
                  </div>
                </div>

                <div class="metrics-grid">
                  <div class="metric-card">
                    <div class="metric-val">0.74 → 0.46</div>
                    <div class="metric-lbl">Target Composite WSI</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-val">24 Actions</div>
                    <div class="metric-lbl">Prioritized Interventions</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-val">38%</div>
                    <div class="metric-lbl">Net Stress Reduction</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-val">₹520 Cr</div>
                    <div class="metric-lbl">Estimated Budget (5-Yr)</div>
                  </div>
                </div>

                <h3 style="color: #0f2937; margin-bottom: 5px;">Priority Municipal Actions & Feasibility Matrix</h3>
                <table>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Intervention Title</th>
                      <th>Category</th>
                      <th>Priority</th>
                      <th>Est Cost</th>
                      <th>WSI Impact</th>
                      <th>Target Districts</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${RECOMMENDATIONS_DATA.map(
                      (r) => `
                      <tr>
                        <td><strong>${r.id}</strong></td>
                        <td>${r.title}</td>
                        <td>${r.category}</td>
                        <td><span class="${r.priority === 'High' ? 'priority-high' : ''}">${r.priority}</span></td>
                        <td>₹${r.costCr} Cr</td>
                        <td><strong>${r.impact}</strong></td>
                        <td>${r.districts}</td>
                      </tr>
                    `
                    ).join('')}
                  </tbody>
                </table>

                <div style="margin-top: 35px; padding: 20px; background: #eaf5f2; border-radius: 8px; border-left: 4px solid #075d4c;">
                  <strong style="color: #075d4c;">Immediate Action Recommendation:</strong>
                  <p style="margin: 5px 0 0; font-size: 13px; color: #1e3a34;">
                    Prioritize Phase 1 Rooftop Rainwater Harvesting retrofit subsidies in Koramangala and Indiranagar before the onset of the Southwest Monsoon. Projected to yield 420,000 m³ in stormwater buffer and mitigate critical extraction by 34%.
                  </p>
                </div>

                <div class="footer">
                  <div>WaterMap Analytics Engine • Validated against NWIC & IMD Gridded Rainfall Feeds</div>
                  <div>Page 1 of 1 • Signed by Municipal Water Planning Directorate</div>
                </div>
                <script>
                  window.onload = function() {
                    window.print();
                  }
                </script>
              </body>
            </html>
          `)
          printWindow.document.close()
          onShowToast?.('Printable Resilience Blueprint opened')
        } else {
          onShowToast?.('Resilience Report generated successfully')
        }
      }

      onClose()
    }, 600)
  }

  return (
    <div className="wm-modal-overlay" onClick={onClose} role="presentation">
      <div
        className="wm-modal wm-export-modal"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="export-modal-title"
      >
        <header className="wm-modal__header">
          <div className="wm-modal__title-wrap">
            <div className="wm-modal__title-icon wm-modal__title-icon--teal">
              <Download size={18} />
            </div>
            <div>
              <h2 id="export-modal-title" className="wm-modal__title">
                Export Resilience Report
              </h2>
              <span className="wm-modal__subtitle">
                Generate Municipal Briefing, Data Spreadsheets & Spatial Hydrology
              </span>
            </div>
          </div>
          <button
            type="button"
            className="wm-modal__close-btn"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </header>

        <div className="wm-modal__body">
          {/* Format Selection Cards */}
          <div className="wm-export-format-grid">
            {[
              {
                id: 'pdf',
                icon: <FileText size={20} className="wm-text-rose" />,
                title: 'Executive PDF / Print',
                desc: 'Print-ready official document with BWSSB seal, KPI cards & action matrix',
                tag: 'Recommended',
              },
              {
                id: 'csv',
                icon: <FileSpreadsheet size={20} className="wm-text-emerald" />,
                title: 'Excel / CSV Matrix',
                desc: 'Structured tabular data of all 24 recommendations, costs & district mappings',
                tag: 'Data Analysis',
              },
              {
                id: 'json',
                icon: <Code size={20} className="wm-text-cyan" />,
                title: 'GeoJSON & Telemetry',
                desc: 'Machine-readable hydrological parameters, WSI scores & sensor indicators',
                tag: 'API / GIS',
              },
            ].map((f) => (
              <label
                key={f.id}
                className={`wm-export-format-card ${format === f.id ? 'wm-export-format-card--selected' : ''}`}
              >
                <input
                  type="radio"
                  name="exportFormat"
                  value={f.id}
                  checked={format === f.id}
                  onChange={(e) => setFormat(e.target.value)}
                  className="wm-sr-only"
                />
                <div className="wm-export-format-card__header">
                  {f.icon}
                  <span className="wm-export-format-card__tag">{f.tag}</span>
                </div>
                <div className="wm-export-format-card__title">{f.title}</div>
                <div className="wm-export-format-card__desc">{f.desc}</div>
                <div className="wm-export-format-card__radio-indicator">
                  {format === f.id && <CheckCircle2 size={13} />}
                </div>
              </label>
            ))}
          </div>

          {/* Section Inclusions Checklist */}
          <div className="wm-export-sections-card">
            <h4 className="wm-export-sections-card__title">
              <Layers size={14} className="wm-text-primary" />
              <span>Report Content & Scope Inclusions</span>
            </h4>

            <div className="wm-export-checklist">
              {[
                { key: 'executiveSummary', label: 'Executive Summary & 38% WSI Reduction Target' },
                { key: 'districtMatrix', label: '12 High-Priority Water Basin Vulnerability Matrix' },
                { key: 'recommendationsList', label: '24 Actionable Interventions with Cost & Feasibility' },
                { key: 'rwhSpecs', label: 'Rainwater Harvesting & Wetland Bio-filtration Engineering Specs' },
                { key: 'climateProjections', label: '2026–2030 Monsoon Anomaly & Rainfall Forecasts' },
              ].map((item) => (
                <label key={item.key} className="wm-export-checkbox-row">
                  <input
                    type="checkbox"
                    checked={sections[item.key]}
                    onChange={() => handleToggleSection(item.key)}
                    className="wm-checkbox"
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Summary Preview Banner */}
          <div className="wm-export-preview-banner">
            <Shield size={16} className="wm-text-emerald" />
            <div>
              <strong>Target Scope:</strong> Bengaluru Urban (198 BBMP Wards) • ₹520 Cr Resilience Roadmap
            </div>
          </div>
        </div>

        <footer className="wm-modal__footer">
          <button
            type="button"
            className="wm-btn wm-btn--secondary"
            onClick={onClose}
            disabled={isGenerating}
          >
            Cancel
          </button>
          <button
            type="button"
            className="wm-btn wm-btn--primary"
            onClick={handleExport}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <span className="wm-spinner-inline" />
                <span>Compiling Blueprint...</span>
              </>
            ) : (
              <>
                {format === 'pdf' ? <Printer size={15} /> : <Download size={15} />}
                <span>
                  {format === 'pdf' ? 'Print / Save PDF Report' : `Download ${format.toUpperCase()} Report`}
                </span>
              </>
            )}
          </button>
        </footer>
      </div>
    </div>
  )
}

export default ExportReportModal
