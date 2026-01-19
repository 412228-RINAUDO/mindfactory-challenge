import { describe, it, expect } from 'vitest'
import { formatDate } from './formatDate'

describe('formatDate', () => {
  it('should format ISO date string to readable format', () => {
    const result = formatDate('2024-01-15T10:00:00Z')
    expect(result).toMatch(/Jan \d{1,2}, 2024/)
  })

  it('should return a string in "MMM D, YYYY" format', () => {
    const result = formatDate('2024-06-20T12:00:00Z')
    expect(result).toMatch(/^[A-Z][a-z]{2} \d{1,2}, \d{4}$/)
  })

  it('should handle different date inputs consistently', () => {
    const date1 = formatDate('2024-03-10T12:00:00Z')
    const date2 = formatDate('2024-03-10T12:00:00Z')
    expect(date1).toBe(date2)
  })

  it('should format year correctly', () => {
    const result = formatDate('2024-01-15T10:00:00Z')
    expect(result).toContain('2024')
  })

  it('should format month as short name', () => {
    const result = formatDate('2024-01-15T10:00:00Z')
    expect(result).toMatch(/^Jan/)
  })
})
