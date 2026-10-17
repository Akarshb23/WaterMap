/**
 * Data structures for the About WaterMap page.
 *
 * Provides structured informational content describing WaterMap's mission,
 * workflow, analytical methodology, component factors, formula, and collaborative team.
 */

export const ABOUT_HEADER = {
  title: 'About WaterMap',
  subtitle: 'Data-driven insights for more water secure and resilient cities.',
  bannerCard: {
    line1: 'Sustainable cities today',
    line2: 'for a brighter tomorrow.',
  },
}

export const MISSION_VISION_CARDS = [
  {
    id: 'mission',
    title: 'Our Mission',
    description: 'To enable data-driven decision making for water secure and resilient cities.',
    iconName: 'Target',
    tone: 'blue',
  },
  {
    id: 'vision',
    title: 'Our Vision',
    description: 'A future where every city can anticipate, adapt and thrive amid water challenges.',
    iconName: 'Eye',
    tone: 'blue',
  },
  {
    id: 'approach',
    title: 'Our Approach',
    description: 'Combine real-world data, advanced analytics and scenario modelling.',
    iconName: 'Users',
    tone: 'green',
  },
  {
    id: 'impact',
    title: 'Our Impact',
    description: 'Support planners, policymakers and communities in building sustainable urban water systems.',
    iconName: 'Leaf',
    tone: 'green',
  },
]

export const WORKFLOW_STEPS = [
  {
    step: 1,
    title: '1. Collect Data',
    description: 'Integrate multiple sources (government, satellite, climate, etc.)',
    iconName: 'Database',
    tone: 'blue',
  },
  {
    step: 2,
    title: '2. Process & Clean',
    description: 'Standardize, validate and handle missing data.',
    iconName: 'Settings',
    tone: 'green',
  },
  {
    step: 3,
    title: '3. Analyze & Model',
    description: 'Use machine learning and statistical models to assess water stress and predict future risks.',
    iconName: 'BarChart3',
    tone: 'purple',
  },
  {
    step: 4,
    title: '4. Visualize',
    description: 'Interactive maps, dashboards and scenario simulations.',
    iconName: 'MapPin',
    tone: 'blue',
  },
  {
    step: 5,
    title: '5. Recommend',
    description: 'Provide actionable interventions and policy suggestions.',
    iconName: 'Lightbulb',
    tone: 'green',
  },
]

export const METHODOLOGY_ITEMS = [
  {
    id: 'wsi',
    title: 'Water Stress Index (WSI)',
    description: 'Composite index using demand, supply, groundwater and climate indicators.',
    iconName: 'Droplet',
    tone: 'blue',
  },
  {
    id: 'modeling',
    title: 'Predictive Modeling',
    description: 'Time-series analysis and machine learning to forecast future water stress.',
    iconName: 'TrendingUp',
    tone: 'purple',
  },
  {
    id: 'scenario',
    title: 'Scenario Simulation',
    description: 'Evaluate impact of interventions under different climate and urban growth scenarios.',
    iconName: 'SlidersHorizontal',
    tone: 'green',
  },
  {
    id: 'engine',
    title: 'Recommendation Engine',
    description: 'Prioritize actions based on impact, feasibility and cost-effectiveness.',
    iconName: 'Target',
    tone: 'coral',
  },
]

export const KEY_COMPONENTS = [
  {
    id: 'supply',
    title: 'Water Supply',
    description: 'Surface water, groundwater, piped supply.',
    iconName: 'Droplet',
    tone: 'blue',
  },
  {
    id: 'demand',
    title: 'Water Demand',
    description: 'Population, domestic, industrial, commercial.',
    iconName: 'Users',
    tone: 'green',
  },
  {
    id: 'climate',
    title: 'Climate Factors',
    description: 'Rainfall, temperature, climate projections.',
    iconName: 'CloudRain',
    tone: 'blue',
  },
  {
    id: 'urban',
    title: 'Urban Environment',
    description: 'Land use, green cover, impervious surfaces.',
    iconName: 'Leaf',
    tone: 'green',
  },
]

export const WSI_FORMULA_DATA = {
  formula: 'WSI = w₁D + w₂S + w₃G + w₄C + w₅U',
  subtitle: 'A composite index (0 – 1) indicating the level of water stress in each ward.',
  variables: [
    { symbol: 'D', name: 'Water Demand Index', color: '#2589e9' },
    { symbol: 'S', name: 'Water Supply Index', color: '#10b981' },
    { symbol: 'G', name: 'Groundwater Depletion Index', color: '#8b5cf6' },
    { symbol: 'C', name: 'Climate Risk Index', color: '#f59e0b' },
    { symbol: 'U', name: 'Urbanization Pressure Index', color: '#ef4444' },
  ],
}

export const RISK_CATEGORIES = [
  {
    id: 'low',
    level: 'Low Risk',
    range: '0.0 – 0.3',
    description: 'Adequate supply, low stress',
    color: '#10b981',
    badgeTone: 'mint',
  },
  {
    id: 'moderate',
    level: 'Moderate Risk',
    range: '0.3 – 0.6',
    description: 'Watch for emerging risks',
    color: '#f59e0b',
    badgeTone: 'yellow',
  },
  {
    id: 'high',
    level: 'High Risk',
    range: '0.6 – 0.8',
    description: 'Significant water stress',
    color: '#f97316',
    badgeTone: 'orange',
  },
  {
    id: 'very-high',
    level: 'Very High Risk',
    range: '0.8 – 1.0',
    description: 'Critical, immediate action needed',
    color: '#ef4444',
    badgeTone: 'red',
  },
]

export const TEAM_ROLES = [
  {
    id: 'planners',
    title: 'Urban Planners',
    description: 'City development and infrastructure',
    iconName: 'Users',
    tone: 'blue',
  },
  {
    id: 'data-scientists',
    title: 'Data Scientists',
    description: 'Analytics and machine learning',
    iconName: 'BarChart3',
    tone: 'blue',
  },
  {
    id: 'climate-experts',
    title: 'Climate Experts',
    description: 'Climate modelling and risk assessment',
    iconName: 'Leaf',
    tone: 'green',
  },
  {
    id: 'policy-advisors',
    title: 'Policy Advisors',
    description: 'Governance and implementation strategies',
    iconName: 'FileText',
    tone: 'blue',
  },
  {
    id: 'community-partners',
    title: 'Community Partners',
    description: 'Local insights and on-ground impact',
    iconName: 'Users',
    tone: 'green',
  },
]

export const TEAM_COLLABORATION_BANNER = {
  title: 'Together for a Water Secure Future',
  caption: 'WaterMap is an open, collaborative platform designed to support smarter, more resilient and sustainable cities.',
}
