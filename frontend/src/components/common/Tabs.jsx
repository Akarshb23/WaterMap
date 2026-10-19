/**
 * Controlled tab strip. `tabs` is `[{ id, label }]`; the caller decides
 * what content each tab shows.
 */
const Tabs = ({ tabs = [], activeTab, onChange }) => (
  <div className="tabs" role="tablist">
    {tabs.map((tab) => (
      <button
        key={tab.id}
        type="button"
        role="tab"
        aria-selected={tab.id === activeTab}
        className={tab.id === activeTab ? 'tabs__tab tabs__tab--active' : 'tabs__tab'}
        onClick={() => onChange(tab.id)}
      >
        {tab.label}
      </button>
    ))}
  </div>
)

export default Tabs
