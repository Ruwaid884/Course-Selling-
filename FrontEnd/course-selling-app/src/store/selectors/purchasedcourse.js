import {selector} from "recoil";
import { purchaseState } from "../atoms/purchase";


export const purchase = selector({
    key: 'purchase',
    get: ({get}) => {
      const state = get(purchaseState);
      return state.courses;
    },
  });


export const PurchasecoursesLoading = selector({
    key: 'PurchasecoursesLoading',
    get: ({get}) => {
      const state = get(purchaseState);
      return state.isLoading;
    },
  });