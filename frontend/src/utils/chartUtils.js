import { CHART_COLORS } from '../constants/chartConfig.js'

/**
 * Small chart helpers shared by the Recharts visualisations.
 */

export const DEFAULT_CHART_MARGIN = { top: 16, right: 16, bottom: 8, left: 0 }

export function getChartColor(index) {
  return CHART_COLORS[index % CHART_COLORS.length]
}
