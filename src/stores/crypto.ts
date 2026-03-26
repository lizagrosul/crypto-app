import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ticker } from '@/types/ticker'

export const useCryptoStore = defineStore('crypto', () => {
  const tickers = ref<Ticker[]>([
    {
      name: 'BTC',
      price: '',
    },
    {
      name: 'ETH',
      price: '',
    },
    {
      name: 'DOGE',
      price: '',
    },
  ])

  function addTicker(tickerName: string) {
    const formattedName = tickerName.trim().toUpperCase()
    if (!formattedName) return

    const isExists = tickers.value.some((t) => t.name === formattedName)
    if (isExists) return

    const newTicker: Ticker = {
      name: formattedName,
      price: '-',
    }

    tickers.value.push(newTicker)
  }

  function removeTicker(tickerName: string) {
    tickers.value = tickers.value.filter((t) => t.name !== tickerName)
  }

  return {
    tickers,
    addTicker,
    removeTicker,
  }
})
