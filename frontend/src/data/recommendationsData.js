/**
 * Illustrative sample data for the Recommendations dashboard.
 *
 * All values represent planning-grade demo figures for New Delhi's water resilience
 * planning — these are illustrative simulations and projections, not verified live API values.
 */

export const RECOMMENDATIONS_HEADER_DATA = {
  title: 'Recommendations',
  subtitle: 'Data-driven, actionable solutions for a more water secure New Delhi.',
  bannerTitle: 'From insights to impact',
  bannerSubtitle: 'Practical interventions for resilient cities.',
}

export const RECOMMENDATION_METRICS = [
  {
    id: 'recommended-actions',
    title: 'Recommended Actions',
    value: '24',
    trend: '8 new this month',
    trendDirection: 'up',
    trendTone: 'positive',
    tone: 'green',
    iconName: 'Leaf',
  },
  {
    id: 'high-priority-wards',
    title: 'High Priority Wards',
    value: '12',
    trend: '3 more than last month',
    trendDirection: 'up',
    trendTone: 'negative',
    tone: 'blue',
    iconName: 'Target',
  },
  {
    id: 'potential-wsi-reduction',
    title: 'Potential WSI Reduction',
    value: '38%',
    note: 'with full implementation',
    tone: 'blue',
    iconName: 'Droplets',
  },
  {
    id: 'estimated-investment',
    title: 'Estimated Investment',
    value: '₹ 520 Cr',
    note: '2025 – 2030',
    tone: 'green',
    iconName: 'Users',
  },
]

export const CATEGORY_FILTERS = [
  { id: 'all', label: 'All Recommendations' },
  { id: 'infrastructure', label: 'Infrastructure' },
  { id: 'policy', label: 'Policy & Governance' },
  { id: 'demand', label: 'Demand Management' },
  { id: 'nature', label: 'Nature-based Solutions' },
]

export const PRIORITY_FILTERS = [
  { value: 'all', label: 'All Risk Levels' },
  { value: 'high', label: 'High Priority' },
  { value: 'medium', label: 'Medium Priority' },
  { value: 'low', label: 'Low Priority' },
]

export const SORT_OPTIONS = [
  { value: 'impact', label: 'Sort by: Impact' },
  { value: 'cost-desc', label: 'Sort by: Cost (High to Low)' },
  { value: 'cost-asc', label: 'Sort by: Cost (Low to High)' },
  { value: 'priority', label: 'Sort by: Priority' },
  { value: 'savings', label: 'Sort by: Water Savings' },
]

export const RECOMMENDATIONS_LIST = [
  {
    id: 'rainwater-harvesting',
    title: 'Implement Rainwater Harvesting',
    shortTitle: 'Rainwater Harvesting',
    category: 'nature',
    priority: 'high',
    priorityLabel: 'High Priority',
    badgeLabel: 'High',
    summary: 'Rooftop and community systems for rainwater collection and storage.',
    scope: 'Ward 12, 17, 21',
    targetWards: '12, 17, 21',
    targetWardIds: ['12', '17', '21'],
    implementationLevel: 'Moderate',
    timeHorizon: '2025 – 2028',
    estimatedCost: '₹ 120 Cr',
    costNum: 120,
    potentialWsiReduction: '0.12 – 0.25',
    wsiReductionNum: 0.18,
    annualWaterSavings: '45 – 90 MLD',
    savingsNum: 67,
    impactScore: 96,
    iconName: 'CloudRain',
    tone: 'blue',
    keyBenefits: [
      { id: 'b1', iconName: 'Droplets', text: 'Reduces dependence on groundwater' },
      { id: 'b2', iconName: 'Sprout', text: 'Increases local water resilience' },
      { id: 'b3', iconName: 'Users', text: 'Engages communities' },
      { id: 'b4', iconName: 'Leaf', text: 'Cost-effective and scalable' },
    ],
    overview: {
      description:
        'A comprehensive decentralized rainwater harvesting network targeting institutional rooftops, municipal buildings, residential colonies, and public parks across high-stress northern and central sectors. Captures heavy monsoon discharge and funnels it into recharge shafts and storage basins.',
      targetSectors: ['Civil Lines Government Complex', 'Old Delhi Dense Commercial Quarters', 'Karol Bagh Mixed Residential'],
      leadAgency: 'Delhi Jal Board (DJB) & MCD',
      keyObjective: 'Arrest rapid aquifer depletion and harvest clean monsoon runoff before discharge into stormwater drains.',
    },
    expectedImpact: {
      headline: 'Estimated 0.12 to 0.25 reduction in composite Water Stress Index across target wards.',
      metrics: [
        { label: 'Groundwater Table Rise', value: '+1.2 m to +1.8 m' },
        { label: 'Annual Runoff Capture', value: '45–90 MLD' },
        { label: 'Peak Stormwater Reduction', value: '34%' },
        { label: 'Municipal Tanker Reliance', value: '-58%' },
      ],
      wardBreakdown: [
        { ward: 'Ward 12 (Civil Lines)', current: 0.87, projected: 0.46, reduction: '-47%' },
        { ward: 'Ward 17 (Paharganj)', current: 0.71, projected: 0.44, reduction: '-38%' },
        { ward: 'Ward 21 (Daryaganj)', current: 0.76, projected: 0.45, reduction: '-41%' },
      ],
    },
    implementation: {
      duration: '36 Months (Q1 2025 – Q4 2028)',
      status: 'Ready for DPR Approval & Procurement',
      leadAgency: 'Delhi Jal Board (DJB) in partnership with MCD & DDA',
      phases: [
        {
          phase: 'Phase 1: Q1 – Q3 2025',
          title: 'GIS Rooftop Feasibility & Structural Audit',
          description: 'LiDAR survey of 850 institutional and commercial rooftops; soil infiltration profiling for recharge pit locations.',
        },
        {
          phase: 'Phase 2: Q4 2025 – Q2 2027',
          title: 'Public Infrastructure & School Retrofits',
          description: 'Deploy 320 high-capacity filtration units and automated telemetry sensors across municipal schools and offices.',
        },
        {
          phase: 'Phase 3: Q3 2027 – Q4 2028',
          title: 'Residential Rebates & Community Recharge Shafts',
          description: 'Roll out property tax rebate incentives for residential societies; commission 45 community aquifer injection shafts.',
        },
      ],
    },
    cost: {
      total: '₹ 120 Cr',
      fundingSources: 'AMRUT 2.0 Central Grant (40%), DJB Capital Budget (45%), Private CSR Co-funding (15%)',
      breakdown: [
        { item: 'Recharge Shafts & Injection Wells', cost: '₹ 52 Cr', percent: '43%' },
        { item: 'Filtration Units & Catchment Piping', cost: '₹ 36 Cr', percent: '30%' },
        { item: 'IoT Telemetry & Water Quality Sensors', cost: '₹ 18 Cr', percent: '15%' },
        { item: 'Community Engagement & Third-party Audit', cost: '₹ 14 Cr', percent: '12%' },
      ],
      roi: 'Estimated 3.8-year economic payback via reduced emergency water trucking and urban flood mitigation.',
    },
    caseStudies: [
      {
        title: 'Civil Lines DJB Zonal Office Pilot',
        location: 'Ward 12, Delhi',
        result: 'Harvested 8.4 million litres during 2024 monsoon; raised local shallow water column by 0.9m.',
        year: '2024',
      },
      {
        title: 'Greater Chennai Mandatory RWH Benchmark',
        location: 'Chennai Metropolitan Area',
        result: 'Rigorous rooftop mandate raised regional groundwater table by 1.8m within 4 years of civic enforcement.',
        year: 'Benchmark Precedent',
      },
    ],
  },
  {
    id: 'recycled-water-use',
    title: 'Increase Use of Recycled Water',
    shortTitle: 'Recycled Water Use',
    category: 'infrastructure',
    priority: 'high',
    priorityLabel: 'High Priority',
    badgeLabel: 'High',
    summary: 'Treated wastewater for non-potable uses',
    scope: 'Ward 4, 8, 15',
    targetWards: '4, 8, 15',
    targetWardIds: ['4', '8', '15'],
    implementationLevel: 'High',
    timeHorizon: '2025 – 2027',
    estimatedCost: '₹ 160 Cr',
    costNum: 160,
    potentialWsiReduction: '0.10 – 0.20',
    wsiReductionNum: 0.15,
    annualWaterSavings: '70 – 110 MLD',
    savingsNum: 90,
    impactScore: 90,
    iconName: 'RotateCcw',
    tone: 'purple',
    keyBenefits: [
      { id: 'b1', iconName: 'Droplets', text: 'Preserves drinking-grade water supplies' },
      { id: 'b2', iconName: 'Building2', text: 'Dedicated industrial & park dual piping' },
      { id: 'b3', iconName: 'TrendingUp', text: 'Closes circular urban wastewater loop' },
      { id: 'b4', iconName: 'Coins', text: 'Low-cost secondary supply for bulk buyers' },
    ],
    overview: {
      description:
        'Connect tertiary effluent from Okhla and Coronation Pillar STPs directly to industrial parks, construction sites, and DDA horticultures via a dedicated purple pipe network.',
      targetSectors: ['Industrial Clusters', 'DDA Horticultural Parks', 'Construction Hubs'],
      leadAgency: 'Delhi Jal Board (DJB)',
      keyObjective: 'Replace 80+ MLD of fresh potable extraction with high-quality treated wastewater.',
    },
    expectedImpact: {
      headline: 'Substitution of up to 110 MLD fresh potable extraction with Class-A tertiary recycled effluent.',
      metrics: [
        { label: 'Freshwater Saved', value: '70–110 MLD' },
        { label: 'Industrial Groundwater Cuts', value: '-72%' },
        { label: 'Sewage Discharge Reduction', value: '31%' },
        { label: 'Target WSI Improvement', value: '-0.15 pts' },
      ],
      wardBreakdown: [
        { ward: 'Ward 4 (Karol Bagh)', current: 0.73, projected: 0.48, reduction: '-34%' },
        { ward: 'Ward 8 (Rohini East)', current: 0.82, projected: 0.49, reduction: '-40%' },
        { ward: 'Ward 15 (Patel Nagar)', current: 0.69, projected: 0.47, reduction: '-32%' },
      ],
    },
    implementation: {
      duration: '24 Months (Q2 2025 – Q2 2027)',
      status: 'Detailed Project Report Finalized',
      leadAgency: 'Delhi Jal Board & Department of Environment',
      phases: [
        {
          phase: 'Phase 1: Q2 2025 – Q4 2025',
          title: 'Tertiary Polishing & Ultra-filtration Retrofit',
          description: 'Upgrade secondary effluent clarifying stages with UV and membrane polishing.',
        },
        {
          phase: 'Phase 2: Q1 2026 – Q4 2026',
          title: 'Dedicated Dual Distribution Mains',
          description: 'Laying 42 km of pressurized non-potable secondary distribution mains to industrial zones.',
        },
        {
          phase: 'Phase 3: Q1 2027 – Q2 2027',
          title: 'Bulk Metering & Compliance Mandate',
          description: 'Mandatory hook-up enforcement for construction projects > 20,000 sq.m.',
        },
      ],
    },
    cost: {
      total: '₹ 160 Cr',
      fundingSources: 'National Mission for Clean Ganga (NMCG), DJB State Funds, PPP Concessions',
      breakdown: [
        { item: 'Dual Pipeline Trunk Infrastructure', cost: '₹ 78 Cr', percent: '49%' },
        { item: 'Tertiary Filtration & UV Clarification', cost: '₹ 48 Cr', percent: '30%' },
        { item: 'Pumping Stations & Intermediate Reservoirs', cost: '₹ 22 Cr', percent: '14%' },
        { item: 'Flow Telemetry & SCADA Interlocks', cost: '₹ 12 Cr', percent: '7%' },
      ],
      roi: 'Commercial tariff revenue provides self-sustaining operational cost recovery within 5 years.',
    },
    caseStudies: [
      {
        title: 'Koyambedu Tertiary Treatment RO Plant',
        location: 'Chennai SIPCOT',
        result: 'Supplies 45 MLD treated industrial effluent, freeing fresh water for 500,000 residents.',
        year: '2023',
      },
    ],
  },
  {
    id: 'green-infrastructure',
    title: 'Enhance Green Infrastructure',
    shortTitle: 'Green Infrastructure',
    category: 'nature',
    priority: 'medium',
    priorityLabel: 'Medium Priority',
    badgeLabel: 'Medium',
    summary: 'Parks, permeable surfaces & urban green cover',
    scope: 'Ward 3, 6, 11',
    targetWards: '3, 6, 11',
    targetWardIds: ['3', '6', '11'],
    implementationLevel: 'Moderate',
    timeHorizon: '2026 – 2029',
    estimatedCost: '₹ 85 Cr',
    costNum: 85,
    potentialWsiReduction: '0.08 – 0.16',
    wsiReductionNum: 0.12,
    annualWaterSavings: '30 – 50 MLD',
    savingsNum: 40,
    impactScore: 85,
    iconName: 'Sprout',
    tone: 'green',
    keyBenefits: [
      { id: 'b1', iconName: 'Droplets', text: 'Bioswales maximize natural infiltration' },
      { id: 'b2', iconName: 'TreePine', text: 'Urban canopy buffers urban heat island' },
      { id: 'b3', iconName: 'CloudRain', text: 'Prevents storm drain inundation & pooling' },
      { id: 'b4', iconName: 'Users', text: 'Expands civic community green spaces' },
    ],
    overview: {
      description:
        'Transforming impervious surfaces across public plazas, median verges, and neighborhood parks into permeable bioswales, rain gardens, and retention wetlands that filter and sink stormwater into shallow aquifers.',
      targetSectors: ['Public Right-of-Ways', 'Community Green Belts', 'MCD Parks & Open Spaces'],
      leadAgency: 'MCD Horticulture & DDA',
      keyObjective: 'Restore urban hydrological sponge capacity and counter extreme microclimate heat.',
    },
    expectedImpact: {
      headline: 'Increases urban rainwater retention capacity by 35% across high-density neighborhoods.',
      metrics: [
        { label: 'Surface Runoff Attenuation', value: '42%' },
        { label: 'Permeable Area Increase', value: '+185,000 m²' },
        { label: 'Natural Aquifer Infiltration', value: '30–50 MLD' },
        { label: 'Urban Heat Island Drop', value: '-1.4 °C' },
      ],
      wardBreakdown: [
        { ward: 'Ward 3 (Narela North)', current: 0.65, projected: 0.49, reduction: '-25%' },
        { ward: 'Ward 6 (Alipur)', current: 0.58, projected: 0.44, reduction: '-24%' },
        { ward: 'Ward 11 (Pitampura)', current: 0.62, projected: 0.48, reduction: '-23%' },
      ],
    },
    implementation: {
      duration: '36 Months (Q1 2026 – Q4 2028)',
      status: 'Landscape Architecture Concept Ready',
      leadAgency: 'DDA & Municipal Corporation of Delhi',
      phases: [
        {
          phase: 'Phase 1: Q1 – Q3 2026',
          title: 'Pilot Sponge Park Demonstrations',
          description: 'Convert 12 district parks into sunken detention basins with gravel infiltration beds.',
        },
        {
          phase: 'Phase 2: Q4 2026 – Q4 2027',
          title: 'Roadside Bioswales & Permeable Pavers',
          description: 'Replace 65 km of concrete pedestrian pavements with high-porosity interlocking permeable pavers.',
        },
        {
          phase: 'Phase 3: Q1 2028 – Q4 2028',
          title: 'Wetland Buffer Rejuvenation',
          description: 'Restore 4 neglected waterbodies into living eco-retention wetlands with native macrophyte plants.',
        },
      ],
    },
    cost: {
      total: '₹ 85 Cr',
      fundingSources: 'National Clean Air Programme (NCAP) Green Funds, State Urban Development Budget',
      breakdown: [
        { item: 'Permeable Pavement & Roadside Bioswales', cost: '₹ 38 Cr', percent: '45%' },
        { item: 'Sponge Parks & Infiltration Detention Basins', cost: '₹ 28 Cr', percent: '33%' },
        { item: 'Ecological Planting & Soil Conditioning', cost: '₹ 12 Cr', percent: '14%' },
        { item: 'Hydrological Monitoring Wells', cost: '₹ 7 Cr', percent: '8%' },
      ],
      roi: 'Reduces municipal storm drainage de-silting costs by ₹ 14 Cr annually while cutting flood claims.',
    },
    caseStudies: [
      {
        title: 'Wuhan Sponge City Program',
        location: 'Hubei Province Benchmark',
        result: 'Retained 70% of stormwater within city limits, eliminating 90% of chronic flooding spots.',
        year: 'Benchmark Precedent',
      },
    ],
  },
  {
    id: 'water-supply-network',
    title: 'Improve Water Supply Network',
    shortTitle: 'Supply Network Improvement',
    category: 'infrastructure',
    priority: 'high',
    priorityLabel: 'High Priority',
    badgeLabel: 'High',
    summary: 'Reduce leakage and improve efficiency',
    scope: 'Ward 9, 14, 19',
    targetWards: '9, 14, 19',
    targetWardIds: ['9', '14', '19'],
    implementationLevel: 'High',
    timeHorizon: '2025 – 2028',
    estimatedCost: '₹ 110 Cr',
    costNum: 110,
    potentialWsiReduction: '0.07 – 0.15',
    wsiReductionNum: 0.11,
    annualWaterSavings: '40 – 65 MLD',
    savingsNum: 52,
    impactScore: 80,
    iconName: 'Wrench',
    tone: 'blue',
    keyBenefits: [
      { id: 'b1', iconName: 'Droplets', text: 'Cuts non-revenue water (NRW) pipe losses' },
      { id: 'b2', iconName: 'Gauge', text: 'Equalizes pressurized pipeline distribution' },
      { id: 'b3', iconName: 'Coins', text: 'Significantly cuts municipal energy overhead' },
      { id: 'b4', iconName: 'Users', text: 'Guarantees reliable tail-end ward pressure' },
    ],
    overview: {
      description:
        'Targeted pressure management, District Metered Area (DMA) zoning, acoustic sensor deployment, and ductile iron pipe replacement across high-leakage corridors to cut Non-Revenue Water from 42% down to 18%.',
      targetSectors: ['Old Cast-Iron Feeder Mains', 'High-Pressure Transmission Junctions', 'Informal Hookup Zones'],
      leadAgency: 'Delhi Jal Board (DJB)',
      keyObjective: 'Eliminate chronic physical leakage and ensure clean, continuous piped pressure.',
    },
    expectedImpact: {
      headline: 'Recovers up to 65 MLD of treated potable water currently lost to subterranean leakage.',
      metrics: [
        { label: 'Non-Revenue Water Loss', value: '42% → 18%' },
        { label: 'Recovered Potable Flow', value: '40–65 MLD' },
        { label: 'Pumping Energy Savings', value: '22%' },
        { label: 'Water Contamination Alerts', value: '-84%' },
      ],
      wardBreakdown: [
        { ward: 'Ward 9 (Shakur Basti)', current: 0.74, projected: 0.51, reduction: '-31%' },
        { ward: 'Ward 14 (Rajouri Garden)', current: 0.70, projected: 0.49, reduction: '-30%' },
        { ward: 'Ward 19 (Chandni Chowk)', current: 0.81, projected: 0.52, reduction: '-36%' },
      ],
    },
    implementation: {
      duration: '36 Months (Q2 2025 – Q2 2028)',
      status: 'Tender Documentation Under Review',
      leadAgency: 'DJB Distribution & Leakage Management Cell',
      phases: [
        {
          phase: 'Phase 1: Q2 2025 – Q4 2025',
          title: 'District Metered Area (DMA) Boundary Isolation',
          description: 'Establish 28 isolated hydraulic DMAs with electromagnetic inlet flow meters.',
        },
        {
          phase: 'Phase 2: Q1 2026 – Q4 2027',
          title: 'Acoustic Leak Detection & Main Replacement',
          description: 'Fix 1,400 hidden subterranean fractures; replace 52 km of rusted colonial-era pipelines.',
        },
        {
          phase: 'Phase 3: Q1 2028 – Q2 2028',
          title: 'Automated Pressure Reducing Valves (PRVs)',
          description: 'Install smart automated PRVs linked to SCADA for demand-responsive night-time pressure modulation.',
        },
      ],
    },
    cost: {
      total: '₹ 110 Cr',
      fundingSources: 'DJB Capital Infrastructure Budget & JICA External Assistance',
      breakdown: [
        { item: 'Pipeline Replacement & Ductile Iron Mains', cost: '₹ 58 Cr', percent: '53%' },
        { item: 'DMA Electromagnetic Meters & Smart PRVs', cost: '₹ 26 Cr', percent: '24%' },
        { item: 'Acoustic Correlator Leak Surveys & Repairs', cost: '₹ 16 Cr', percent: '14%' },
        { item: 'SCADA Integration & Hydraulic Modeling', cost: '₹ 10 Cr', percent: '9%' },
      ],
      roi: 'Water saved yields ₹ 38 Cr per year in avoided raw water purchase and treatment electricity.',
    },
    caseStudies: [
      {
        title: 'Nagpur 24x7 Water Supply Project',
        location: 'Nagpur Metro Benchmark',
        result: 'Reduced NRW from 52% to 26% across 5 DMAs, expanding reliable household connections.',
        year: 'National Benchmark',
      },
    ],
  },
  {
    id: 'groundwater-regulation',
    title: 'Strengthen Groundwater Regulation',
    shortTitle: 'Groundwater Regulation',
    category: 'policy',
    priority: 'medium',
    priorityLabel: 'Medium Priority',
    badgeLabel: 'Medium',
    summary: 'Enforce extraction limits and monitoring',
    scope: 'City Wide',
    targetWards: 'City-wide (All Wards)',
    targetWardIds: ['12', '8', '21', '4', '17', '9', '14'],
    implementationLevel: 'Moderate',
    timeHorizon: '2025 – 2026',
    estimatedCost: '₹ 25 Cr',
    costNum: 25,
    potentialWsiReduction: '0.06 – 0.12',
    wsiReductionNum: 0.09,
    annualWaterSavings: '35 – 55 MLD',
    savingsNum: 45,
    impactScore: 75,
    iconName: 'FileText',
    tone: 'amber',
    keyBenefits: [
      { id: 'b1', iconName: 'Scale', text: 'Statutory limits prevent unmetered over-extraction' },
      { id: 'b2', iconName: 'Droplets', text: 'Mandatory telemetry on commercial borewells' },
      { id: 'b3', iconName: 'TrendingUp', text: 'Preserves critical deep fossil aquifers' },
      { id: 'b4', iconName: 'Coins', text: 'Generates revenue reinvested into recharge' },
    ],
    overview: {
      description:
        'Enact unified Central Ground Water Authority (CGWA) and DJB bylaws requiring digital flow meters, telemetry transmission, and extraction quotas on all commercial, industrial, and institutional deep borewells.',
      targetSectors: ['Commercial Centers', 'Bottling & Beverage Plants', 'High-Rise Enclaves'],
      leadAgency: 'Delhi Groundwater Authority (DGWA) & Revenue Dept',
      keyObjective: 'Cap unsustainable extraction rates in critical over-exploited blocks.',
    },
    expectedImpact: {
      headline: 'Prevents estimated 55 MLD of unmetered groundwater depletion city-wide.',
      metrics: [
        { label: 'Unmetered Extraction Cut', value: '-65%' },
        { label: 'Borewell Telemetry Compliance', value: '94%' },
        { label: 'Deep Aquifer Water Savings', value: '35–55 MLD' },
        { label: 'Penalty Fund for Aquifer Recharge', value: '₹ 18 Cr/yr' },
      ],
      wardBreakdown: [
        { ward: 'South Delhi Zone', current: 0.84, projected: 0.58, reduction: '-31%' },
        { ward: 'South West Zone', current: 0.79, projected: 0.55, reduction: '-30%' },
        { ward: 'Central Delhi Zone', current: 0.76, projected: 0.52, reduction: '-32%' },
      ],
    },
    implementation: {
      duration: '18 Months (Q1 2025 – Q2 2026)',
      status: 'Cabinet Policy Draft Ready',
      leadAgency: 'Delhi Groundwater Authority & Revenue Dept',
      phases: [
        {
          phase: 'Phase 1: Q1 – Q2 2025',
          title: 'Mandatory Digital Registration Drive',
          description: 'Census of all commercial and high-capacity borewells; assign QR-coded digital permits.',
        },
        {
          phase: 'Phase 2: Q3 2025 – Q4 2025',
          title: 'IoT Telemetry Meter Installation Mandate',
          description: 'Enforce cellular-connected ultrasonic meters reporting real-time hourly draw to DGWA portal.',
        },
        {
          phase: 'Phase 3: Q1 2026 – Q2 2026',
          title: 'Volumetric Tariffs & Enforcement Taskforce',
          description: 'Implement progressive volumetric groundwater extraction levies; seal illegal unregistered rigs.',
        },
      ],
    },
    cost: {
      total: '₹ 25 Cr',
      fundingSources: 'State Revenue Dept & CGWA Administrative Grant',
      breakdown: [
        { item: 'Central IoT Telemetry Cloud & Compliance Portal', cost: '₹ 11 Cr', percent: '44%' },
        { item: 'Enforcement Squads, Mobile Test Vans & Sealing Kit', cost: '₹ 7 Cr', percent: '28%' },
        { item: 'Geospatial Borewell Registration Census', cost: '₹ 4 Cr', percent: '16%' },
        { item: 'Public Legal Notices & RWA Consultation', cost: '₹ 3 Cr', percent: '12%' },
      ],
      roi: 'Volumetric commercial extraction fee generates ₹ 24 Cr annually, fully self-financing enforcement.',
    },
    caseStudies: [
      {
        title: 'Marathwada Aquifer Regulation System',
        location: 'Maharashtra Groundwater Authority',
        result: 'Real-time telemetry stabilized water levels in 14 over-drafted talukas within 2 years.',
        year: '2023',
      },
    ],
  },
  {
    id: 'community-awareness',
    title: 'Community Awareness Programs',
    shortTitle: 'Community Awareness',
    category: 'demand',
    priority: 'low',
    priorityLabel: 'Low Priority',
    badgeLabel: 'Low',
    summary: 'Promote water conservation practices',
    scope: 'City Wide',
    targetWards: 'City-wide (All Wards)',
    targetWardIds: ['12', '8', '21', '4', '17', '3', '6', '9', '11', '14', '15', '19'],
    implementationLevel: 'Low',
    timeHorizon: '2025 – 2027',
    estimatedCost: '₹ 20 Cr',
    costNum: 20,
    potentialWsiReduction: '0.04 – 0.08',
    wsiReductionNum: 0.06,
    annualWaterSavings: '20 – 35 MLD',
    savingsNum: 27,
    impactScore: 70,
    iconName: 'Users',
    tone: 'coral',
    keyBenefits: [
      { id: 'b1', iconName: 'Users', text: 'Mobilizes RWAs and school water eco-clubs' },
      { id: 'b2', iconName: 'Droplets', text: 'Cuts per-capita daily domestic waste by 18%' },
      { id: 'b3', iconName: 'Coins', text: 'High civic ROI with minimal capital expenditure' },
      { id: 'b4', iconName: 'Sprout', text: 'Nurtures grassroots water stewardship culture' },
    ],
    overview: {
      description:
        'A behavioral change campaign combining aerator distribution, school curriculum water audits, RWA conservation competitions, and mobile app water footprint gamification across all 250 municipal wards.',
      targetSectors: ['Residential Societies & RWAs', 'Schools & Colleges', 'Hospitality & Commercial Kitchens'],
      leadAgency: 'Delhi Water Literacy Mission & DJB Outreach',
      keyObjective: 'Achieve widespread domestic demand reduction through conservation behavior and tap aerators.',
    },
    expectedImpact: {
      headline: 'Achieves 12–18% per-capita reduction in domestic consumption across participating wards.',
      metrics: [
        { label: 'Domestic Demand Reduction', value: '14%' },
        { label: 'Tap Aerators Distributed', value: '250,000 units' },
        { label: 'Participating School Eco-Clubs', value: '820 schools' },
        { label: 'Annual Water Conserved', value: '20–35 MLD' },
      ],
      wardBreakdown: [
        { ward: 'All 250 Wards Aggregated', current: 0.68, projected: 0.62, reduction: '-9%' },
      ],
    },
    implementation: {
      duration: '24 Months (Q2 2025 – Q2 2027)',
      status: 'Curriculum & Outreach Materials Prepared',
      leadAgency: 'Delhi Jal Board Outreach Directorate & MCD Education',
      phases: [
        {
          phase: 'Phase 1: Q2 2025 – Q4 2025',
          title: 'Mass Media & School Eco-Club Launch',
          description: 'Deploy WaterTap School Audit kits across 820 schools; launch digital public service campaign.',
        },
        {
          phase: 'Phase 2: Q1 2026 – Q4 2026',
          title: 'Low-Flow Aerator Doorstep Distribution',
          description: 'Distribute 250,000 subsidized dual-flow tap aerators through RWAs and local ward councilors.',
        },
        {
          phase: 'Phase 3: Q1 2027 – Q2 2027',
          title: 'Inter-Ward Blue Shield Awards',
          description: 'Annual civic competition recognizing top conservation wards with municipal development grants.',
        },
      ],
    },
    cost: {
      total: '₹ 20 Cr',
      fundingSources: 'State Public Information Budget & NGO Partner Support',
      breakdown: [
        { item: 'Low-Flow Aerator Bulk Procurement & Logistics', cost: '₹ 8.5 Cr', percent: '42%' },
        { item: 'Digital Campaign, Radio & Transit Media', cost: '₹ 5.5 Cr', percent: '28%' },
        { item: 'School Audit Kits & Youth Training Workshops', cost: '₹ 3.5 Cr', percent: '17%' },
        { item: 'RWA Incentive Grants & Impact Measurement', cost: '₹ 2.5 Cr', percent: '13%' },
      ],
      roi: 'Saves 27 MLD of water daily at a capital cost under ₹ 0.74 per kilolitre saved.',
    },
    caseStudies: [
      {
        title: 'Cape Town Day Zero Campaign',
        location: 'Western Cape Benchmark',
        result: 'Public awareness and behavioral rationing cut city-wide consumption by 50% during extreme drought.',
        year: 'International Benchmark',
      },
    ],
  },
]

export const CUMULATIVE_IMPACT_PROJECTION = [
  { year: '2024', withoutInterventions: 0.65, withInterventions: 0.65 },
  { year: '2025', withoutInterventions: 0.71, withInterventions: 0.54 },
  { year: '2026', withoutInterventions: 0.74, withInterventions: 0.46 },
  { year: '2027', withoutInterventions: 0.77, withInterventions: 0.41 },
  { year: '2028', withoutInterventions: 0.79, withInterventions: 0.38 },
  { year: '2029', withoutInterventions: 0.81, withInterventions: 0.36 },
  { year: '2030', withoutInterventions: 0.84, withInterventions: 0.34 },
]

export const INTERVENTION_TYPE_IMPACT = [
  { name: 'Rainwater Harvesting', percent: 38, color: '#60a5fa' },
  { name: 'Recycled Water Use', percent: 24, color: '#a78bfa' },
  { name: 'Green Infrastructure', percent: 18, color: '#34d399' },
  { name: 'Demand Management', percent: 12, color: '#fbbf24' },
  { name: 'Supply Network Improvement', percent: 8, color: '#93c5fd' },
]

export const TOP_PRIORITY_WARDS_DATA = [
  {
    rank: 1,
    ward: 'Ward 12',
    wardId: '12',
    currentWsi: 0.87,
    projectedWsi: 0.46,
    keyActions: 'Rainwater Harvesting, Recycled Water',
  },
  {
    rank: 2,
    ward: 'Ward 8',
    wardId: '8',
    currentWsi: 0.82,
    projectedWsi: 0.49,
    keyActions: 'Supply Network, Green Infrastructure',
  },
  {
    rank: 3,
    ward: 'Ward 21',
    wardId: '21',
    currentWsi: 0.76,
    projectedWsi: 0.45,
    keyActions: 'Rainwater Harvesting, Demand Management',
  },
  {
    rank: 4,
    ward: 'Ward 4',
    wardId: '4',
    currentWsi: 0.73,
    projectedWsi: 0.48,
    keyActions: 'Recycled Water, Green Infrastructure',
  },
  {
    rank: 5,
    ward: 'Ward 17',
    wardId: '17',
    currentWsi: 0.71,
    projectedWsi: 0.44,
    keyActions: 'Rainwater Harvesting, Supply Network',
  },
]

export const PRIORITY_MAP_LEGEND = [
  { label: 'High Priority (12)', color: '#ef4444' },
  { label: 'Medium Priority (18)', color: '#f59e0b' },
  { label: 'Low Priority (12)', color: '#10b981' },
]
