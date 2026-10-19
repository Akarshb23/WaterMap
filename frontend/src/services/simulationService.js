import { apiGet, apiPost, isApiMode } from './apiClient.js'
import { DEFAULT_SIMULATION_INPUT, runScenarioSimulation, SCENARIOS, AREAS } from '../data/simulationData.js'
import { fetchWards } from './wardService.js'

const INTERVENTION_MAP = { rainwater: 'rainwater_harvesting', recycled: 'leakage_reduction', demand: 'demand_management', green: 'lake_restoration', supply: 'groundwater_recharge' }

export async function runSimulation(scenario, { signal, cityId = 'bengaluru' } = {}) {
  const payload = scenario || DEFAULT_SIMULATION_INPUT
  if (!isApiMode()) return runScenarioSimulation(payload)
  const wards = await fetchWards({ signal, cityId })
  const selectedArea = AREAS.find((item) => item.id === payload.area) ?? AREAS[0]
  const ward = wards.find((item) => String(item.id) === String(payload.area) || String(item.ward_id) === String(payload.area)) ?? wards[0]
  if (!ward) throw new Error('No ward data is available for simulation.')
  const coverage = Math.max(0, Math.min(1, Number(payload.level ?? 50) / 100))
  const intervention_type = INTERVENTION_MAP[payload.scenario] ?? 'rainwater_harvesting'
  const response = await apiPost('/simulations/run', { city_id: cityId, ward_id: ward.ward_id ?? ward.id, intervention_type, coverage }, { signal })
  const baselineWsi = Number(response.baseline_wsi ?? ward.wsi ?? 0)
  const simulatedWsi = Number(response.projected_wsi ?? baselineWsi)
  const selectedScenario = SCENARIOS.find((item) => item.id === payload.scenario) ?? SCENARIOS[0]
  const level = { value: String(payload.level ?? '50'), label: `${payload.level ?? 50}% implementation` }
  const horizon = { value: String(payload.horizon ?? '2030'), label: String(payload.horizon ?? '2030') }
  const reduction = Number(response.relative_reduction_pct ?? 0)
  return { scenario: { ...selectedScenario, label: response.intervention_label ?? selectedScenario.label }, area: { ...selectedArea, id: ward.id, label: ward.name ?? selectedArea.label }, level, horizon, baseline: { wsi: baselineWsi, rainfall: null, demand: null, groundwater: null }, simulated: { wsi: simulatedWsi, rainfall: null, demand: null, groundwater: null }, impact: { reduction, absoluteReduction: Number(response.absolute_reduction ?? baselineWsi - simulatedWsi) }, wardReduction: reduction / 100, wardReductionPct: reduction, cityReduction: null, cityReductionPct: null, adjustment: Number(payload.level ?? 50) / 100, demandDrop: null, groundwaterGain: null, resilience: 'Not estimated', backendResult: response }
}

export async function fetchSimulationRun(runId, { signal } = {}) {
  if (!isApiMode()) return null
  return apiGet(`/simulations/${encodeURIComponent(runId)}`, { signal })
}
