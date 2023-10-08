import {atom} from "recoil";

export const purchaseState = atom({
  key: 'purchaseState',
  default: {
    isLoading: true,
    courses: []
  },
});
