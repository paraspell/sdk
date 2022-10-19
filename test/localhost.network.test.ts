// This test will only run with localhost setup and is designed to test core XCM functions.
// Relay chain should be Rococo and have ws - ws://127.0.0.1:9944
// Parachain 1 should be Bifrost and have ws - ws://127.0.0.1:9995 & should have ParaID 2001
// Parachain 2 should be Karura and have ws - ws://127.0.0.1:9999 & should have ParaID 2000
// You can start localhost network that is preconfigured with this spec from https://github.com/paraspell/ui
// You can launch this test via pnpm test-network

import { describe, expect, test } from 'vitest'
import { ApiPromise, WsProvider, Keyring } from '@polkadot/api'
import { transferParaToPara, transferParaToRelay, limitedTransferRelayToPara, transferRelayToPara } from '../src/pallets/xTokens/transfer'
import { closeChannel } from '../src/pallets/hrmp/channelsClose'
import { openChannel } from '../src/pallets/parasSudoWrapper/channels'

describe('xTokens.ts', () => {
  test('RelayToPara transfer scenario (WILL ONLY RUN IN LOCALHOST)', async () => {
    // Api for Relay chain
    const wsProvider = new WsProvider('ws://127.0.0.1:9944')
    const apiRelay = await ApiPromise.create({ provider: wsProvider })
    const keyring = new Keyring({ type: 'sr25519' })
    const amount = 10000000000000 // 10 UNIT/KSM
    const aliceRecipientAddr = 'gXCcrjjFX3RPyhHYgwZDmw8oe4JFpd5anko3nTY8VrmnJpe'
    const alice = keyring.createFromUri('//Alice')

    let final: any
    let txHashHas: any
    let dispatchErr: any

    const promise = transferRelayToPara(apiRelay, 2001, amount, aliceRecipientAddr)
    promise.signAndSend(alice, ({ status, txHash, dispatchError }) => {
      final = status.isFinalized
      txHashHas = txHash
      if (dispatchError) {
        if (dispatchError.isModule) {
          dispatchErr = true
        } else {
          dispatchErr = true
        }
      } else {
        dispatchErr = false
      }
    })
    await new Promise(resolve => setTimeout(resolve, 60000))
    expect(final).eq(true)
    expect(txHashHas).not.eq('')
    expect(dispatchErr).eq(false)
  })
  test('RelayToParaLimited transfer scenario (WILL ONLY RUN IN LOCALHOST)', async () => {
    // Api for Relay chain
    const wsProvider = new WsProvider('ws://127.0.0.1:9944')
    const apiRelay = await ApiPromise.create({ provider: wsProvider })
    const keyring = new Keyring({ type: 'sr25519' })
    const amount = 9000000000000 // 9 UNIT/KSM
    const aliceRecipientAddr = 'gXCcrjjFX3RPyhHYgwZDmw8oe4JFpd5anko3nTY8VrmnJpe'
    const alice = keyring.createFromUri('//Alice')

    let final: any
    let txHashHas: any
    let dispatchErr: any

    const promise = await limitedTransferRelayToPara(apiRelay, 2001, amount, aliceRecipientAddr, 0, true)
    promise.signAndSend(alice, ({ status, txHash, dispatchError }) => {
      final = status.isFinalized
      txHashHas = txHash
      if (dispatchError) {
        if (dispatchError.isModule) {
          dispatchErr = true
        } else {
          dispatchErr = true
        }
      } else {
        dispatchErr = false
      }
    })
    await new Promise(resolve => setTimeout(resolve, 60000))
    expect(final).eq(true)
    expect(txHashHas).not.eq('')
    expect(dispatchErr).eq(false)
  })
  test('ParaToRelay transfer scenario (WILL ONLY RUN IN LOCALHOST)', async () => {
    // Api for Bifrost
    const wsProvider = new WsProvider('ws://127.0.0.1:9995')
    const apiBifrost = await ApiPromise.create({ provider: wsProvider })
    const keyring = new Keyring({ type: 'sr25519' })
    const amount = 1000000000000 // 1 UNIT/KSM
    const aliceRecipientAddr = 'gXCcrjjFX3RPyhHYgwZDmw8oe4JFpd5anko3nTY8VrmnJpe'
    const currency = 'KSM'
    const origin = 'Bifrost'
    const alice = keyring.createFromUri('//Alice')

    let final: any
    let txHashHas: any
    let dispatchErr: any

    const promise = await transferParaToRelay(apiBifrost, origin, currency, amount, aliceRecipientAddr)
    promise.signAndSend(alice, ({ status, txHash, dispatchError }) => {
      final = status.isFinalized
      txHashHas = txHash
      if (dispatchError) {
        if (dispatchError.isModule) {
          dispatchErr = true
        } else {
          dispatchErr = true
        }
      } else {
        dispatchErr = false
      }
    })
    await new Promise(resolve => setTimeout(resolve, 60000))
    expect(final).eq(true)
    expect(txHashHas).not.eq('')
    expect(dispatchErr).eq(false)
  })
  test('ParaToPara transfer scenario (WILL ONLY RUN IN LOCALHOST)', async () => {
    // Api for Bifrost
    const wsProvider = new WsProvider('ws://127.0.0.1:9995')
    const apiBifrost = await ApiPromise.create({ provider: wsProvider })
    const keyring = new Keyring({ type: 'sr25519' })
    const amount = 1000000000000 // 1 UNIT/KSM
    const aliceRecipientAddr = 'gXCcrjjFX3RPyhHYgwZDmw8oe4JFpd5anko3nTY8VrmnJpe'
    const currency = 'KSM'
    const origin = 'Bifrost'
    const destination = 2000
    const alice = keyring.createFromUri('//Alice')

    let final: any
    let txHashHas: any
    let dispatchErr: any

    const promise = await transferParaToPara(apiBifrost, origin, destination, currency, amount, aliceRecipientAddr)
    promise.signAndSend(alice, ({ status, txHash, dispatchError }) => {
      final = status.isFinalized
      txHashHas = txHash
      if (dispatchError) {
        if (dispatchError.isModule) {
          dispatchErr = true
        } else {
          dispatchErr = true
        }
      } else {
        dispatchErr = false
      }
    })
    await new Promise(resolve => setTimeout(resolve, 60000))
    expect(final).eq(true)
    expect(txHashHas).not.eq('')
    expect(dispatchErr).eq(false)
  })
}, 270000)

describe('channels.ts', () => {
  test('opens HRMP channel (WILL ONLY RUN IN LOCALHOST)', async () => {
    // Api for Relay chain
    const wsProvider = new WsProvider('ws://127.0.0.1:9944')
    const apiRelay = await ApiPromise.create({ provider: wsProvider })
    const keyring = new Keyring({ type: 'sr25519' })
    const paraID1 = 2001
    const paraID2 = 2000
    const alice = keyring.createFromUri('//Alice')

    let final: any
    let txHashHas: any
    let dispatchErr: any

    const promise = await openChannel(apiRelay, paraID1, paraID2, 8, 1000)
    promise.signAndSend(alice, ({ status, txHash, dispatchError }) => {
      final = status.isFinalized
      txHashHas = txHash
      if (dispatchError) {
        if (dispatchError.isModule) {
          dispatchErr = true
        } else {
          dispatchErr = true
        }
      } else {
        dispatchErr = false
      }
    })
    await new Promise(resolve => setTimeout(resolve, 60000))
    expect(final).eq(true)
    expect(txHashHas).not.eq('')
    expect(dispatchErr).eq(false)
  })
  test('closes HRMP channel (WILL ONLY RUN IN LOCALHOST)', async () => {
    // Api for Relay chain
    const wsProvider = new WsProvider('ws://127.0.0.1:9944')
    const apiRelay = await ApiPromise.create({ provider: wsProvider })
    const keyring = new Keyring({ type: 'sr25519' })
    const paraID = 2001
    const alice = keyring.createFromUri('//Alice')

    let final: any
    let txHashHas: any
    let dispatchErr: any

    const promise = await closeChannel(apiRelay, paraID, 0, 0)
    promise.signAndSend(alice, ({ status, txHash, dispatchError }) => {
      final = status.isFinalized
      txHashHas = txHash
      if (dispatchError) {
        if (dispatchError.isModule) {
          dispatchErr = true
        } else {
          dispatchErr = true
        }
      } else {
        dispatchErr = false
      }
    })
    await new Promise(resolve => setTimeout(resolve, 60000))
    expect(final).eq(true)
    expect(txHashHas).not.eq('')
    expect(dispatchErr).eq(false)
  })
}, 150000)
