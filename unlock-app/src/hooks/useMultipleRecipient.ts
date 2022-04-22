import { useState, useEffect, useContext } from 'react'
import { ToastHelper } from '../components/helpers/toast.helper'
import { ConfigContext } from '../utils/withConfig'
import { Web3ServiceContext } from '../utils/withWeb3Service'
import { getAddressForName } from './useEns'
import { Lock } from '../unlockTypes'
import { WalletServiceContext } from '../utils/withWalletService'

const MAX_RETRY_COUNT = 5
interface User {
  lockAddress: string
  userAddress: string
}
export interface RecipientItem {
  userAddress: string
  resolvedAddress: string
  valid: boolean
  index: number
  metadata?: { [key: string]: any }
  keyId?: string
}

interface RecipientPayload {
  users: {
    userAddress: string
    metadata: { [key: string]: any }
    lockAddress: string
  }[]
}

export const useMultipleRecipient = (
  lock: Lock,
  network?: number,
  maxRecipients = 1
) => {
  const web3Service = useContext(Web3ServiceContext)
  const walletService = useContext(WalletServiceContext)
  const [hasMultipleRecipients, setHasMultipleRecipients] = useState(false)
  const [recipients, setRecipients] = useState(new Set<RecipientItem>())
  const [loading, setLoading] = useState(false)
  const config: any = useContext(ConfigContext)
  const [retryCount, setRetryCount] = useState(0)
  const [ignoreRecipients, setIgnoreRecipients] = useState<User[]>([])
  const normalizeRecipients = () => {
    if (!lock.address) return

    /*
      we need to exclude user metadata that already already exists,
      by creating a new array without items in "ignoreRecipients"
     */
    const listWithoutExcluded = recipientsList().filter(
      ({ resolvedAddress }) => {
        const exludedAddressList = (ignoreRecipients ?? []).map(
          ({ userAddress }) => userAddress
        )
        const isAddressExcluded =
          (exludedAddressList?.length > 0 &&
            exludedAddressList.includes(resolvedAddress)) ||
          exludedAddressList.length === 0
        return isAddressExcluded
      }
    )

    const payload: RecipientPayload = {
      users: listWithoutExcluded.map(({ resolvedAddress, metadata = {} }) => {
        return {
          userAddress: resolvedAddress,
          metadata,
          lockAddress: lock.address,
        }
      }),
    }
    return payload
  }

  const clear = () => {
    setRecipients(new Set([]))
  }

  useEffect(() => {
    const activeMultiple = +maxRecipients > 1
    setHasMultipleRecipients(activeMultiple)
  }, [])

  const recipientsList = (): RecipientItem[] => {
    return Array.from(recipients)
  }

  const canAddUser = () => {
    return recipients.size < maxRecipients
  }

  const getAddressAndValidation = async (recipient: string) => {
    const address = await getAddressForName(recipient)
    const isAddressWithKey = await web3Service.getHasValidKey(
      lock.address,
      address,
      network
    )
    const addressList = recipientsList().map(
      ({ resolvedAddress }) => resolvedAddress
    )
    const addressItemsCount = addressList.filter(
      (item) => item === address
    ).length
    const isAddressInList = addressList.includes(address)

    const canAddMultiple = (lock?.publicLockVersion ?? 1) >= 10

    // todo: need also to check how many keys the address owns to improve this logic
    const limitNotReached =
      addressItemsCount < (lock?.maxKeysPerAddress ?? 1) && !isAddressWithKey
    const addressValid = address?.length > 0

    const valid = addressValid && canAddMultiple && limitNotReached
    return {
      valid,
      address,
      isAddressWithKey,
      isAddressInList,
      limitNotReached,
      canAddMultiple,
    }
  }

  const submitBulkRecipients = async () => {
    if (!network) return
    try {
      const message = `I am signing the metadata for the lock at ${lock.address}`
      const signature = await walletService.signMessage(
        message,
        'personal_sign'
      )
      if (!signature) return
      const url = `${config.services.storage.host}/v2/api/metadata/${network}/users`
      const opts = {
        method: 'POST',
        body: JSON.stringify(normalizeRecipients()),
        headers: {
          'content-type': 'application/json',
        },
      }
      const response = await fetch(url, opts)
      return response
    } catch (err: any) {
      ToastHelper.error(err?.message ?? 'Ops, something went wrong')
    }
  }

  const submit = async (): Promise<boolean> => {
    if (retryCount < MAX_RETRY_COUNT) {
      const res = await submitBulkRecipients()
      if (res) {
        const result: any = await res.json()
        const errorCodes = [500, 401, 404]
        const successCodes = [200, 201]
        setIgnoreRecipients([])

        if (res.status === 409) {
          const addressesWithMetadata = result?.users?.map(
            ({ userAddress }: any) => userAddress
          )
          setIgnoreRecipients(addressesWithMetadata)
          setRetryCount(retryCount + 1)
          ToastHelper.error(`${result?.message}` ?? 'Failed to add metadata.')
        }

        if (errorCodes.includes(res.status)) {
          ToastHelper.error(result?.message ?? 'Ops, something went wrong')
          setRetryCount(retryCount + 1)
        }

        if (successCodes.includes(res.status)) {
          ToastHelper.success('Successfully added metadata')
          return true
        }
      }
      return false
    }
    ToastHelper.error('Failed to add metadata.')
    return false
  }

  const addRecipientItem = async <T>(
    userAddress: string,
    metadata: T
  ): Promise<boolean> => {
    setLoading(true)
    if (canAddUser()) {
      const index = recipients?.size + 1
      const {
        valid,
        address,
        isAddressWithKey,
        isAddressInList,
        canAddMultiple,
        limitNotReached,
      } = await getAddressAndValidation(userAddress)
      if (valid) {
        setRecipients(
          (prev) =>
            new Set(
              prev.add({
                userAddress,
                metadata,
                index,
                resolvedAddress: address ?? userAddress,
                valid,
              })
            )
        )
        ToastHelper.success('Recipient correctly added in list.')
      }

      if (canAddMultiple && !limitNotReached && isAddressWithKey) {
        ToastHelper.error(
          'This address reached max keys limit. You cannot grant them a new one.'
        )
      } else if (isAddressWithKey) {
        ToastHelper.error(
          'This address already owns a valid key. You cannot grant them a new one.'
        )
      } else if (isAddressInList) {
        ToastHelper.error(
          'This address is already present in list. Please add a new one.'
        )
      } else if (!valid) {
        ToastHelper.error(
          'Recipient address is not valid, please use a valid wallet address or ENS name.'
        )
      }

      setLoading(false)
      return Promise.resolve(valid)
    }
    ToastHelper.error("You can't add more recipients")
    setLoading(false)
    return Promise.resolve(false)
  }

  const removeRecipient = (address: string) => {
    const newRecipientsList = recipientsList().filter(
      ({ userAddress }) => userAddress !== address
    )
    setRecipients(new Set(newRecipientsList))
  }

  return {
    hasMultipleRecipients,
    recipients: recipientsList(),
    addRecipientItem,
    loading,
    maxRecipients,
    submitBulkRecipients: submit,
    clear,
    removeRecipient,
  }
}