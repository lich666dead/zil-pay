<template>
  <form
    :class="b()"
    @submit.prevent="onSave"
  >
    <Input
      v-model="contract.model"
      :title="local.TOKEN_CONTRACT"
      :error="contract.error"
      placeholder="zil1whrkchln60sxedk04jw09x92vss5hvyjmrvlz6"
      round
      autofocus
      @input="onFindToken"
    />
    <ul :class="b('details')">
      <li
        v-for="(el, index) of this.payload"
        :key="index"
      >
        <P>
          {{ el.title }}
        </P>
        <P>
          {{ el.value }}
        </P>
      </li>
    </ul>
    <Button
      v-show="payload && payload.length > 0"
      :color="COLOR_VARIANTS.negative"
      block
      round
    >
      {{ local.SAVE_TOKEN }}
    </Button>
  </form>
</template>

<script>
import { isBech32 } from '@zilliqa-js/util/dist/validation'

import { mapState, mapMutations, mapActions, mapGetters } from 'vuex'
import uiStore from '@/store/ui'
import settingsStore from '@/store/settings'
import tokenStore from '@/store/token'

import { COLOR_VARIANTS, EVENTS } from '@/config'

import Input, { INPUT_TYPES } from '@/components/Input'
import Button from '@/components/Button'
import P from '@/components/P'

import { Background } from '@/services'
import { toAddress, fromZil } from '@/filters'

export default {
  name: 'TokenCreater',
  filters: { toAddress },
  components: {
    Input,
    P,
    Button
  },
  data() {
    return {
      COLOR_VARIANTS,
      INPUT_TYPES,

      contract: {
        model: null,
        error: null
      },
      payload: []
    }
  },
  computed: {
    ...mapState(uiStore.STORE_NAME, [
      uiStore.STATE_NAMES.local
    ]),
    ...mapState(settingsStore.STORE_NAME, [
      settingsStore.STATE_NAMES.addressFormat
    ]),
    ...mapGetters(tokenStore.STORE_NAME, [
      tokenStore.GETTERS_NAMES.getSelectedToken
    ])
  },
  methods: {
    ...mapMutations(uiStore.STORE_NAME, [
      uiStore.MUTATIONS_NAMES.setLoad
    ]),
    ...mapActions(tokenStore.STORE_NAME, [
      tokenStore.ACTIONS_NAMES.onAddToken
    ]),

    async onFindToken() {
      this.contract.error = null

      if (!this.contract.model || !isBech32(this.contract.model)) {
        this.contract.error = `*${this.local.INCORRECT_ADDR_FORMAT}`

        return null
      }

      const bg = new Background()

      this.setLoad()

      try {
        const result = await bg.getTokenInfo(this.contract.model)

        this.payload = [
          {
            title: this.local.BALANCE,
            value: fromZil(result.balance, result.decimals)
          },
          {
            title: this.local.TOKEN_SYMBOL,
            value: result.symbol
          },
          {
            title: this.local.TOKEN_NAME,
            value: result.name
          },
          {
            title: this.local.TOTAL_SUPPLY,
            value: result.totalSupply
          },
          {
            title: this.local.TOKEN_DECIMALS,
            value: result.decimals
          },
          {
            title: this.local.TOKEN_OWNER,
            value: toAddress(result.owner, this.addressFormat)
          }
        ]
      } catch (err) {
        this.contract.error = err.message
      }

      this.setLoad()
    },
    async onSave() {
      this.setLoad()

      try {
        await this.onAddToken(this.contract.model)

        this.$emit(EVENTS.input)
      } catch (err) {
        this.contract.error = err.message
      } finally {
        this.setLoad()
      }
    }
  }
}
</script>

<style lang="scss">
.TokenCreater {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;

  padding: 10px;

  &__details {
    padding: 0;
    list-style: none;

    width: 100%;

    & > li {
      display: flex;
      align-items: center;
      justify-content: space-between;

      line-height: 20px;
    }
  }

  & > .Input {
    width: 90%;
  }

  & > .Button {
    max-width: 200px;
  }
}
</style>
