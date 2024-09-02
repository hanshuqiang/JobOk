import { defineStore } from "pinia";

export const breadcrumbStore = defineStore("breadcrumb", {
  state: () => ({
    menu1: {},
    menu2: {},
    menu3: {},
  }) as any,
  getters: {
    getBreadcrumb: (state) => {
      return {
        menu1: state.menu1,
        menu2: state.menu2,
        menu3: state.menu3,
      };
    },
  },
  actions: {
    setMenu1(params: any) {
      this.menu1 = params;
    },
    setMenu2(params: any) {
      this.menu2 = params;
    },
    setMenu3(params: any) {
      this.menu3 = params;
    },
  },
  persist: true,
});
