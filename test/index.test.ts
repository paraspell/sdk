import { expect, describe, test } from 'vitest'
import { ApiPromise, WsProvider } from '@polkadot/api'
import { selectLimit, createAccID } from '../src/utils'

describe('utils.ts', () => {
  test('returns correct limit result', () => {
    const weight = 100000
    const yes = true
    const no = false
    const outputWyes = { Limited: 100000 }
    const outputWno = 'Unlimited'
    expect(JSON.stringify(selectLimit(weight, yes))).eq(JSON.stringify(outputWyes))
    expect(selectLimit(weight, no)).eq(outputWno)
  })
  test('creates correct account type', async () => {
    const wsProvider = new WsProvider('wss://rococo-rpc.polkadot.io')
    const api = await ApiPromise.create({ provider: wsProvider })
    const address = '5GuyiXkd2idYJUD7q6cjMqErrKoC665D8pbmJacjnJErqwoU'
    const output = '0xd68558dc97ed11b88215d11b2c346109e668de16002c6218fc0b5d572644bb35'
    expect(createAccID(api, address)).eq(output)
  }, 40000)
})
