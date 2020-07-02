/*
 * Project: ZilPay-wallet
 * Author: Rinat(lich666dead)
 * -----
 * Modified By: the developer formerly known as Rinat(lich666dead) at <lich666black@gmail.com>
 * -----
 * Copyright (c) 2019 ZilPay
 */
import { DEFAULT_TOKEN } from 'config'
import {
  getTokens,
  setSelectedCoin,
  Background
} from '@/services'

const STORE_NAME = 'token'
const STATE_NAMES = {
  tokens: 'tokens',
  selectedcoin: 'selectedcoin'
}
const MUTATIONS_NAMES = {
  setTokens: 'setTokens',
  setSelectedCoin: 'setSelectedCoin'
}
const ACTIONS_NAMES = {
  onUpdateTokensStore: 'onUpdateTokensStore',
  onAddToken: 'onAddToken',
  onSelectToken: 'onSelectToken',
  onBalanceUpdate: 'onBalanceUpdate',
  onRemoveToken: 'onRemoveToken'
}
const GETTERS_NAMES = {
  getSelectedToken: 'getSelectedToken',
  getDefaultToken: 'getDefaultToken'
}
const STORE = {
  namespaced: true,
  state: {
    [STATE_NAMES.tokens]: [],
    [STATE_NAMES.selectedcoin]: 'ZIL'
  },
  mutations: {
    [MUTATIONS_NAMES.setSelectedCoin](state, value) {
      state[STATE_NAMES.selectedcoin] = value
    },
    [MUTATIONS_NAMES.setTokens](state, values) {
      state[STATE_NAMES.tokens] = values
    }
  },
  actions: {
    async [ACTIONS_NAMES.onUpdateTokensStore]({ commit }) {
      const data = await getTokens()

      if (data && data[STATE_NAMES.selectedcoin]) {
        commit(MUTATIONS_NAMES.setSelectedCoin, data[STATE_NAMES.selectedcoin])
      }
      if (data && data[STATE_NAMES.tokens]) {
        commit(MUTATIONS_NAMES.setTokens, data[STATE_NAMES.tokens])
      }

      return data
    },
    async [ACTIONS_NAMES.onAddToken]({ commit }, address) {
      const bg = new Background()
      const data = await bg.setToken(address)

      commit(MUTATIONS_NAMES.setSelectedCoin, data[STATE_NAMES.selectedcoin])
      commit(MUTATIONS_NAMES.setTokens, data[STATE_NAMES.tokens])

      return data
    },
    async [ACTIONS_NAMES.onSelectToken]({ commit }, symbol) {
      await setSelectedCoin(symbol)

      commit(MUTATIONS_NAMES.setSelectedCoin, symbol)
    },
    async [ACTIONS_NAMES.onBalanceUpdate]({ commit }) {
      const bg = new Background()
      const tokens = await bg.balanceUpdate()

      commit(MUTATIONS_NAMES.setTokens, tokens)

      return tokens
    },
    async [ACTIONS_NAMES.onRemoveToken]({ commit }, token) {
      const bg = new Background()
      const data = await bg.removeToken(token.symbol)

      commit(MUTATIONS_NAMES.setSelectedCoin, data[STATE_NAMES.selectedcoin])
      commit(MUTATIONS_NAMES.setTokens, data[STATE_NAMES.tokens])

      return data
    }
  },
  getters: {
    [GETTERS_NAMES.getSelectedToken](state) {
      const { tokens, selectedcoin } = state

      return tokens.find((t) => t.symbol === selectedcoin)
    },
    [GETTERS_NAMES.getDefaultToken](state) {
      const { tokens } = state

      return tokens.find((t) => t.symbol === DEFAULT_TOKEN.symbol)
    },
  }
}

export default {
  STORE_NAME,
  STORE,
  STATE_NAMES,
  MUTATIONS_NAMES,
  ACTIONS_NAMES,
  GETTERS_NAMES
}
