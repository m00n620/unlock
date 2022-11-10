import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll,
} from 'matchstick-as/assembly/index'
import { Address, BigInt } from '@graphprotocol/graph-ts'

import {
  duration,
  keyPrice,
  newKeyPrice,
  lockAddress,
  lockOwner,
  tokenAddress,
  nullAddress,
  name,
  symbol,
  baseTokenURI,
  maxNumberOfKeys,
  maxKeysPerAddress,
  now,
} from './constants'

import {
  createNewLockEvent,
  createLockManagerAddedEvent, // using RoleGranted
  createLockManagerRemovedEvent,
  createPricingChangedEvent,
  createLockUpgradedEvent,
  createLockMetadata,
} from './locks-utils'
import { handleNewLock, handleLockUpgraded } from '../src/unlock'
// mock contract functions
import './mocks'

describe('Describe LockDayData Events', () => {
  beforeAll(() => {
    const newLockEvent = createNewLockEvent(
      Address.fromString(lockOwner),
      Address.fromString(lockAddress)
    )
    handleNewLock(newLockEvent)
  })

  test('Creation of a lockDayData', () => {
    const lockDayID = 1 / 86400
    assert.entityCount('LockDayData', 1)
    assert.fieldEquals('LockDayData', lockDayID.toString(), 'lockDeployed', '1')
    assert.fieldEquals('LockDayData', lockDayID.toString(), 'keysSold', '0')
    assert.fieldEquals('LockDayData', lockDayID.toString(), 'activeLocks', '0')
  })
})
