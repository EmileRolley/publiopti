import type { RawRules } from '../source/commons'
import { getRawNodes } from '../source/commons'

import { callWithParsedRules } from './utils.test'

function getRawNodesWith(rawRules: any): RawRules {
  return callWithParsedRules(getRawNodes, rawRules)
}

describe('getRawRules', () => {
  it('∅ -> ∅', () => {
    expect(getRawNodesWith({})).toStrictEqual({})
  })
  it('Single null rule', () => {
    expect(getRawNodesWith({ test1: null })).toStrictEqual({
      test1: null,
    })
  })
  it('Simple single rule', () => {
    const rawRules = {
      test2: {
        titre: 'Test 2',
        formule: '10 * 3',
      },
    }
    expect(getRawNodesWith(rawRules)).toStrictEqual(rawRules)
  })
  it('Number constant', () => {
    expect(getRawNodesWith({ test3: 10 })).toStrictEqual({
      test3: { valeur: '10' },
    }) // will be reparsed by the website client, so not a problem?
  })

  // FIXME: doesn't pass with bun but passes with jest. The values seem to be equal.
  it('Referenced rules', () => {
    const rawRules = {
      ruleA: {
        titre: 'Rule A',
        formule: 'B . C * 3',
      },
      'ruleA . B': null,
      'ruleA . B . C': {
        valeur: '10',
      },
    }
    expect(getRawNodesWith(rawRules)).toStrictEqual(rawRules)
  })
  it('Mechansim [avec] should not create empty objects', () => {
    const rawRules = {
      ruleA: {
        avec: {
          bus: null,
        },
        titre: 'Rule A',
        formule: 'B . C * 3',
      },
      'ruleA . B': null,
      'ruleA . B . C': {
        valeur: '10',
      },
    }
    expect(getRawNodesWith(rawRules)).toStrictEqual({
      ruleA: {
        titre: 'Rule A',
        formule: 'B . C * 3',
      },
      'ruleA . B': null,
      'ruleA . B . C': {
        valeur: '10',
      },
      'ruleA . bus': null,
    })
  })
})
