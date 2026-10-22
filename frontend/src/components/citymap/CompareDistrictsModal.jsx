import { useState } from 'react'
import { X, BarChart2 } from 'lucide-react'
import { BANGALORE_DASHBOARD_DISTRICTS } from '../../data/bangaloreDashboardData.js'

export default function CompareDistrictsModal({ currentDistrict, allDistricts = [], onClose }) {
  const availableOptions = allDistricts.length > 0 ? allDistricts : BANGALORE_DASHBOARD_DISTRICTS
  
  const [targetId, setTargetId] = useState(() => {
    const other = availableOptions.find((d) => String(d.id || d.district_id) !== String(currentDistrict?.id || currentDistrict?.district_id))
    return other ? String(other.id || other.district_id) : 'city-avg'
  })

  const targetDistrict = targetId === 'city-avg' 
    ? {
        name: 'Karnataka State Average',
        zone: 'All Regions',
        wsi: 0.54,
        risk: 'moderate',
        riskLabel: 'Moderate Risk',
        population: '312,000 avg',
        rainfall: '780 mm avg',
        demand: '98 MLD avg',
        groundwater: '52% extraction',
      }
    : (availableOptions.find((d) => String(d.id || d.district_id) === String(targetId)) || availableOptions[0])

  const metrics = [
    {
      label: 'Water Stress Index (WSI)',
      key: 'wsi',
      val1: Number(currentDistrict.wsi ?? currentDistrict.water_stress_index ?? 0.87).toFixed(2),
      val2: Number(targetDistrict.wsi ?? targetDistrict.water_stress_index ?? 0.54).toFixed(2),
    },
    {
      label: 'Annual Rainfall',
      key: 'rainfall',
      val1: currentDistrict.rainfall || '520 mm',
      val2: targetDistrict.rainfall || '780 mm',
    },
    {
      label: 'Water Demand / Reliance',
      key: 'demand',
      val1: currentDistrict.demand || '124 MLD',
      val2: targetDistrict.demand || '98 MLD',
    },
    {
      label: 'Groundwater Status',
      key: 'groundwater',
      val1: currentDistrict.groundwater || '-18.4 m',
      val2: targetDistrict.groundwater || '-12.0 m',
    },
    {
      label: 'Population Density',
      key: 'population',
      val1: currentDistrict.population || '240,000',
      val2: targetDistrict.population || '312,000',
    },
  ]

  return (
    <div className="wm-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div 
        className="wm-modal" 
        style={{ maxWidth: '44rem', background: '#ffffff', borderRadius: '16px' }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="wm-modal__header">
          <div className="wm-modal__title-wrap">
            <span className="wm-modal__title-icon wm-modal__title-icon--emerald">
              <BarChart2 size={20} />
            </span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 700, color: '#0f172a' }}>
                Compare Districts & Regional Benchmarks
              </h3>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
                Side-by-side water stress metrics and hydrological deficit analysis.
              </p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose} 
            className="interactive-ward-panel__close-btn"
            style={{ border: 'none', background: 'transparent', cursor: 'pointer', padding: '0.35rem' }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: '1.25rem 1.5rem', maxHeight: '70vh', overflowY: 'auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Selected District</span>
              <h4 style={{ margin: '0.2rem 0 0', fontSize: '1.05rem', color: '#075d4c' }}>{currentDistrict.name}</h4>
              <span style={{ fontSize: '0.76rem', color: '#64748b' }}>{currentDistrict.zone}</span>
            </div>

            <div style={{ background: '#f8fafc', padding: '0.85rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Compare Against</span>
              <select
                className="native-select"
                style={{ width: '100%', marginTop: '0.3rem', padding: '0.35rem 0.6rem', fontSize: '0.82rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
              >
                <option value="city-avg">Karnataka State Average (Benchmark)</option>
                {availableOptions
                  .filter((d) => String(d.id || d.district_id) !== String(currentDistrict?.id || currentDistrict?.district_id))
                  .map((d) => (
                    <option key={d.id || d.district_id} value={d.id || d.district_id}>
                      {d.name || d.district_name} ({d.zone || 'District'})
                    </option>
                  ))}
              </select>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#475569', textAlign: 'left' }}>
                <th style={{ padding: '0.65rem 0.5rem', fontWeight: 600 }}>Hydrological Metric</th>
                <th style={{ padding: '0.65rem 0.5rem', fontWeight: 600, color: '#075d4c' }}>{currentDistrict.name}</th>
                <th style={{ padding: '0.65rem 0.5rem', fontWeight: 600, color: '#2563eb' }}>{targetDistrict.name}</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((m, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '0.75rem 0.5rem', color: '#334155', fontWeight: 500 }}>{m.label}</td>
                  <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: '#0f172a' }}>{m.val1}</td>
                  <td style={{ padding: '0.75rem 0.5rem', fontWeight: 700, color: '#0f172a' }}>{m.val2}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '1.25rem', padding: '0.85rem 1rem', background: '#ecfdf5', borderRadius: '8px', border: '1px solid #a7f3d0', fontSize: '0.8rem', color: '#065f46' }}>
            <strong>Hydrological Assessment: </strong>
            {currentDistrict.name} exhibits {Number(currentDistrict.wsi ?? 0.8) > Number(targetDistrict.wsi ?? 0.54) ? 'higher' : 'lower'} overall water stress compared to {targetDistrict.name}. Priority conservation initiatives should focus on groundwater recharge and demand mitigation.
          </div>
        </div>

        <div style={{ padding: '0.85rem 1.5rem', background: '#fafbfc', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
          <button
            type="button"
            className="interactive-ward-btn interactive-ward-btn--primary"
            onClick={onClose}
            style={{ padding: '0.45rem 1.25rem' }}
          >
            Done
          </button>
        </div>
      </div>
    </div>
  )
}
