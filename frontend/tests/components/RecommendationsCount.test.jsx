import { describe, expect, it } from 'vitest'
import {
  CATEGORY_FILTERS,
  RECOMMENDATIONS_LIST,
  RECOMMENDATION_METRICS,
} from '../../src/data/recommendationsData.js'

describe('Recommendations dynamic count and category sum integrity', () => {
  it('total recommendations must equal the exact sum of the 4 categories', () => {
    const counts = {
      infrastructure: 0,
      policy: 0,
      demand: 0,
      nature: 0,
    }

    RECOMMENDATIONS_LIST.forEach((item) => {
      expect(['infrastructure', 'policy', 'demand', 'nature']).toContain(item.category)
      counts[item.category] += 1
    })

    const sumCategories =
      counts.infrastructure + counts.policy + counts.demand + counts.nature

    // Check sum equality
    expect(RECOMMENDATIONS_LIST.length).toBe(sumCategories)
    expect(sumCategories).toBe(24)
    expect(counts.infrastructure).toBe(6)
    expect(counts.policy).toBe(6)
    expect(counts.demand).toBe(6)
    expect(counts.nature).toBe(6)
  })

  it('recommendation metrics recommended-actions value matches total count', () => {
    const actionMetric = RECOMMENDATION_METRICS.find(
      (m) => m.id === 'recommended-actions'
    )
    expect(actionMetric).toBeDefined()
    expect(Number(actionMetric.value)).toBe(RECOMMENDATIONS_LIST.length)
  })

  it('all 24 recommendations have required fields for detail tabs', () => {
    RECOMMENDATIONS_LIST.forEach((rec) => {
      expect(rec.id).toBeTruthy()
      expect(rec.title).toBeTruthy()
      expect(rec.shortTitle).toBeTruthy()
      expect(rec.category).toBeTruthy()
      expect(rec.priority).toMatch(/^(high|medium|low)$/)
      expect(rec.overview?.description).toBeTruthy()
      expect(rec.expectedImpact?.headline).toBeTruthy()
      expect(Array.isArray(rec.expectedImpact?.metrics)).toBe(true)
      expect(Array.isArray(rec.implementation?.phases)).toBe(true)
      expect(rec.cost?.total).toBeTruthy()
      expect(Array.isArray(rec.cost?.breakdown)).toBe(true)
      expect(Array.isArray(rec.caseStudies)).toBe(true)
    })
  })
})
