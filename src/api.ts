const API_KEY = '41a142f4baa7549a2342ceb301f607e8bbd21592699a6d220b6b922906275aac'
const RECONNECT_DELAY = 10000
let socket: WebSocket | null = null
type PriceHandler = (price: number) => void
const handlers = new Map<string, PriceHandler[]>()

interface TickerData {
  TYPE: string
  FROMSYMBOL: string
  PRICE?: number
}

function createSocketConnection() {
  if (socket) return
  socket = new WebSocket(`wss://streamer.cryptocompare.com/v2?api_key=${API_KEY}`)

  socket.addEventListener('open', () => {
    if (handlers.size > 0) {
      const tickerNames = Array.from(handlers.keys())
      sendToSocket({
        action: 'SubAdd',
        subs: tickerNames.map((t) => `5~CCCAGG~${t}~USD`),
      })
    }
  })

  socket.addEventListener('message', (e) => {
    const data: TickerData = JSON.parse(e.data)
    const { TYPE: type, FROMSYMBOL: currency, PRICE: newPrice } = data
    if (type !== '5' || newPrice === undefined) {
      return
    }

    const currencyHandlers = handlers.get(currency) || []
    currencyHandlers.forEach((fn) => {
      fn(newPrice)
    })
  })

  socket.addEventListener('close', () => {
    console.warn(`Socket closed. Reconnecting in ${RECONNECT_DELAY / 1000}s`)
    socket = null
    setTimeout(createSocketConnection, RECONNECT_DELAY)
  })

  socket.addEventListener('error', (e) => {
    console.error('WebSocket error:', e)
    socket?.close()
  })
}

createSocketConnection()

function sendToSocket(message: object) {
  const stringifiedMessage = JSON.stringify(message)
  if (socket?.readyState === WebSocket.OPEN) {
    socket.send(stringifiedMessage)
    return
  }
}

export const subscribeToTicker = (ticker: string, cb: PriceHandler) => {
  const subscribers = handlers.get(ticker) || []
  if (subscribers.length === 0 && socket?.readyState === WebSocket.OPEN) {
    sendToSocket({
      action: 'SubAdd',
      subs: [`5~CCCAGG~${ticker}~USD`],
    })
  }
  handlers.set(ticker, [...subscribers, cb])
}

export const unsubscribeFromTicker = (ticker: string) => {
  handlers.delete(ticker)
  sendToSocket({
    action: 'SubRemove',
    subs: [`5~CCCAGG~${ticker}~USD`],
  })
}
