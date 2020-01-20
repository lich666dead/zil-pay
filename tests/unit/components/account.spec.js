/*
 * Project: ZilPay-wallet
 * Author: Rinat(lich666dead)
 * -----
 * Modified By: the developer formerly known as Rinat(lich666dead) at <lich666black@gmail.com>
 * -----
 * Copyright (c) 2019 ZilPay
 */
import { shallowMount, createLocalVue } from '@vue/test-utils'
import vueBemCn from 'vue-bem-cn'
import Account from 'src/components/Account.vue'
import {
  BEM_CONFIG
} from 'src/config'
import { uuid } from 'uuidv4'

const TEST_TEXT = uuid()
const localVue = createLocalVue()

localVue.use(vueBemCn, { delimiters: BEM_CONFIG })

describe('components:Account', () => {
  const wrapper = shallowMount(Account, {
    localVue,
    slots: {
      default: [TEST_TEXT]
    }
  })

  it('Should be vue instance', () => {
    expect(wrapper.isVueInstance()).toBeTruthy()
  })

  it('Should be mount', () => {
    expect(wrapper).toBeTruthy()
  })

  it('Should can import', () => {
    expect(Account).toBeTruthy()
  })

  it('Should be have some class', () => {
    expect(wrapper.classes()).toEqual([Account.name])
  })
})
