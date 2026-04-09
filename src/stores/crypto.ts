import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Ticker } from '@/types/ticker'
import { subscribeToTicker, unsubscribeFromTicker } from '@/api'

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

  const updatePrice = (name: string, price: number) => {
    const currentTicker = tickers.value.find((t) => t.name === name)
    if (currentTicker) {
      currentTicker.price = price > 1 ? price.toFixed(2) : price.toPrecision(6)
    }
  }

  tickers.value.forEach((t) => {
    subscribeToTicker(t.name, (newPrice: number) => updatePrice(t.name, newPrice))
  })

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
    subscribeToTicker(formattedName, (newPrice: number) => {
      updatePrice(formattedName, newPrice)
    })
  }

  function removeTicker(tickerName: string) {
    tickers.value = tickers.value.filter((t) => t.name !== tickerName)
    unsubscribeFromTicker(tickerName)
  }

  return {
    tickers,
    addTicker,
    removeTicker,
  }
})
