import { BuffAccount } from '@/types/Accounts'
import { defineStore } from 'pinia'

export const useAccountStore = defineStore('account', {
  state: () => ({
    list: [] as any,
    steamHisotryOrder:[] as any,
    buffInfo:[] as Array<BuffAccount>
  }),
  getters: {
    // doubleCount: (state) => state.count * 2
    getSteamHistoryOrders:(state)=>state.steamHisotryOrder
  },
  actions: {
    add(params:any) {
      this.list.push(params)
    },
    addSteamHistoryOrder(params:any){
      this.steamHisotryOrder.push(params)
    },
    clearSteamHistoryOrder(){
      this.steamHisotryOrder=[]
    },

    setBuffInfo(params:Array<BuffAccount>){
      this.buffInfo = params
    },
    getBuffInfo(){
      return this.buffInfo
    }
  },
  persist: true
})