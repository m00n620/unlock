import { Button } from '@unlock-protocol/ui'
import React, { useEffect, useState } from 'react'
import {
  ActiveLock,
  Lock,
  Key,
  PolygonIcon,
  DAIIcon,
  EthereumIcon,
  BSCIcon,
  CeloIcon,
} from '../../icons'
import numeral from 'numeral'
import { ethers } from 'ethers'
import { networks } from '@unlock-protocol/networks'
import dynamic from 'next/dynamic'

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false })

export const OVERVIEW_CONTENTS = [
  {
    value: 84019,
    title: 'Total of Locks Deployed',
    description: 'All Time, production networks only',
    Icon: Lock,
  },
  {
    value: 4293238,
    title: 'Total of Keys Sold',
    description: 'All Time, production networks only',
    Icon: Key,
  },
  {
    value: 281,
    title: 'Active Locks',
    description: 'Minted at least 1 membership in the last 30 days',
    Icon: ActiveLock,
  },
]

const NETWORKS = [
  'All Networks',
  'Ethereum',
  'Optimism',
  'Binance Smart Chain',
  'Gnosis Chain',
  'Polygon',
  'Arbitrum',
  'Celo',
  'Avalanche (C-Chain)',
]

const GROSS_NETWORK_ICONS = [
  {
    unit: 'MATIC',
    Icon: PolygonIcon,
  },
  {
    unit: 'DAI',
    Icon: DAIIcon,
  },
  {
    unit: 'ETH',
    Icon: EthereumIcon,
  },
  {
    unit: 'BNB',
    Icon: BSCIcon,
  },
  {
    unit: 'CELO',
    Icon: CeloIcon,
  },
]

const filters = ['1D', '7D', '1M', '1Y', 'All']

function RenderChart() {
  const chartOptions = {
    series: [
      {
        name: 'Session Duration',
        data: [45, 52, 38, 24, 33, 26, 21, 20, 6, 8, 15, 10],
      },
      {
        name: 'Page Views',
        data: [35, 41, 62, 42, 13, 18, 29, 37, 36, 51, 32, 35],
      },
      {
        name: 'Total Visits',
        data: [87, 57, 74, 99, 75, 38, 62, 47, 82, 56, 45, 47],
      },
    ],
    options: {
      chart: { zoom: { enabled: false } },
      dataLabels: {
        enabled: false,
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6,
        },
      },
      xaxis: {
        categories: [
          '01 Jan',
          '02 Jan',
          '03 Jan',
          '04 Jan',
          '05 Jan',
          '06 Jan',
          '07 Jan',
          '08 Jan',
          '09 Jan',
          '10 Jan',
          '11 Jan',
          '12 Jan',
        ],
      },
      yaxis: { show: false },
      tooltip: {
        y: [
          {
            title: {
              formatter: function (val) {
                return val + ' (mins)'
              },
            },
          },
          {
            title: {
              formatter: function (val) {
                return val + ' per session'
              },
            },
          },
          {
            title: {
              formatter: function (val) {
                return val
              },
            },
          },
        ],
      },
      grid: {
        borderColor: '#f1f1f1',
        xaxis: { lines: { show: true } },
        yaxis: { lines: { show: true } },
      },
    },
  }

  return (
    <div className="w-full h-80">
      <ReactApexChart
        options={chartOptions.options}
        series={chartOptions.series}
        type="line"
        height={320}
      />
    </div>
  )
}

function DateFilter({
  filter,
  setFilter,
}: {
  filter: string
  setFilter: (value: string) => void
}) {
  return (
    <div className="gap-4 flex flex-row items-center justify-center rounded-md bg-white p-2">
      {filters.map((item, index) => (
        <div
          className="cursor-pointer"
          onClick={() => setFilter(item)}
          key={index}
        >
          <p
            className={`text-gray font-lg px-3 py-1 ${
              filter === item ? 'bg-black text-white rounded-md' : 'bg-white'
            }`}
          >
            {item}
          </p>
        </div>
      ))}
    </div>
  )
}

async function getGdpForNetwork(provider, network) {
  const abi = ['function grossNetworkProduct() constant view returns (uint256)']
  const contract = new ethers.Contract(network.unlockAddress, abi, provider)
  const gnp = await contract.grossNetworkProduct()
  return gnp
}

async function getGNPs() {
  const values = await Promise.all(
    Object.keys(networks).map(async (id) => {
      try {
        const network = networks[id]
        if (!network.unlockAddress) {
          return null
        }
        const provider = new ethers.providers.JsonRpcProvider(network.provider)
        const gdp = await getGdpForNetwork(provider, network)
        const total = parseFloat(ethers.utils.formatUnits(gdp, '18'))
        return { total, network }
      } catch (error) {
        console.error('Error retrieving data for', id)
        console.error(error)
        return null
      }
    })
  )
  return values.filter((x) => !!x)
}

export function State() {
  const [filter, setFilter] = useState('1Y')
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [gnpValues, setGNPValues] = useState<any[]>([])

  useEffect(() => {
    const run = async () => {
      const values = await getGNPs()
      values.sort((a, b) => {
        if (a.total < b.total) return 1
        if (a.total > b.total) return -1
        return 0
      })
      const gnpValueswithIcon = values
        .map((item) => ({
          ...item,
          Icon: GROSS_NETWORK_ICONS.find(
            (icon) =>
              icon.unit.toLowerCase() ===
              item.network.baseCurrencySymbol.toLocaleLowerCase()
          )?.Icon,
        }))
        .filter((item) => !item.network.isTestNetwork)
      console.log(gnpValueswithIcon)
      setGNPValues(gnpValueswithIcon)
      setIsLoading(false)
    }
    run()
  }, [])

  return (
    <div className="p-6">
      <div className="mx-auto max-w-7xl">
        <div className="space-y-4">
          <h1 className="heading text-center space-y-8"> State of Unlock </h1>
          <div className="space-y-4">
            <div className="space-y-2">
              <p className="text-2xl space-y-1 font-bold">Overview</p>
              <div className="grid gap-4 grid-cols-3">
                {OVERVIEW_CONTENTS.map(
                  ({ value, title, description, Icon }, index) => (
                    <div
                      key={index}
                      className="w-full p-8 trans-pane rounded-md"
                    >
                      <h2 className="heading-small space-y-4">
                        {numeral(value).format('0,0')}
                      </h2>
                      <div className="flex justify-between">
                        <div>
                          <p className="pt-2 text-lg sm:text-xl lg:text-2xl text-black max-w-prose font-bold">
                            {title}
                          </p>
                          <span>{description}</span>
                        </div>
                        <Icon className="self-center not-sr-only" />
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-2xl space-y-1 font-bold">Activity over time</p>
              <div className="flex justify-between">
                <select
                  id="network"
                  className="bg-white text-black rounded-md border-none px-4"
                >
                  {NETWORKS.map((item, index) => (
                    <option value={item} key={index}>
                      {item}
                    </option>
                  ))}
                </select>
                <DateFilter filter={filter} setFilter={setFilter} />
              </div>
              <RenderChart />
            </div>
            <div className="space-y-2">
              <p className="text-2xl space-y-1 font-bold">
                Gross Network Product
              </p>
              {!isLoading && (
                <div className="grid lg:grid-cols-3 gap-4 md:grid-cols-2 grid-cols-1">
                  {gnpValues.map(({ total, network, Icon }, index) => (
                    <div
                      key={index}
                      className="p-6 border border-gray-300 rounded-md"
                    >
                      <div className="flex justify-start pb-4 border-b border-gray-300">
                        {Icon && (
                          <Icon className="self-center mr-2 w-10 h-auto" />
                        )}
                        <p className="heading-small pr-2">
                          {numeral(total).format('0,0.000')}{' '}
                        </p>
                        <p className="heading-small pr-2">
                          {network.baseCurrencySymbol.toUpperCase()}
                        </p>
                      </div>
                      <div className="flex justify-between pt-4">
                        <p className="font-bold text-xl">{network.name}</p>
                        <p className="font-bold text-xl">
                          +{numeral(0).format('0,0.0')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
