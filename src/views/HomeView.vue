<script setup lang="ts">
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useCryptoStore } from '@/stores/crypto'
import IconAdd from '@/components/icons/IconAdd.vue'
import IconTrash from '@/components/icons/IconTrash.vue'
import TickerCard from '@/components/TickerCard.vue'

const cryptoStore = useCryptoStore()
const { tickers } = storeToRefs(cryptoStore)
const { addTicker, removeTicker } = cryptoStore

const ticker = ref('')
function onSubmit() {
  addTicker(ticker.value)
  ticker.value = ''
}
</script>

<template>
  <div class="container mx-auto p-4">
    <section>
      <div class="flex">
        <div class="max-w-xs">
          <label for="ticker" class="block text-sm font-medium text-white">Ticker</label>

          <div class="mt-1 relative rounded-md shadow-sm">
            <input
              v-model="ticker"
              @keydown.enter="onSubmit"
              type="text"
              id="ticker"
              class="block w-full pr-10 border-gray-300 text-gray-900 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
              placeholder="e.g. BTC"
              autocomplete="off"
            />
          </div>
        </div>
      </div>
      <button
        @click="onSubmit"
        type="button"
        class="my-4 inline-flex items-center py-2 px-4 border border-transparent shadow-sm text-sm leading-4 font-medium rounded-full text-white bg-gray-600 hover:bg-gray-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
      >
        <IconAdd />
        Add
      </button>
    </section>
    <template v-if="tickers.length">
      <hr class="w-full border-t border-gray-600 my-4" />

      <div class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <TickerCard v-for="t in tickers" :key="t.name" :name="t.name" :price="t.price">
          <button
            @click.stop="removeTicker(t.name)"
            class="flex items-center justify-center font-medium w-full bg-gray-100 px-4 py-4 sm:px-6 text-md text-gray-500 hover:text-gray-600 hover:bg-gray-200 transition-all focus:outline-none"
          >
            <IconTrash />
            Remove
          </button>
        </TickerCard>
      </div>
      <hr class="w-full border-t border-gray-600 my-4" />
    </template>
  </div>
</template>
