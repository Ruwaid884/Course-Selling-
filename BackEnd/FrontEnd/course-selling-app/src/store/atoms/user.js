import {atom} from "recoil";

export const adminState = atom({
  key: 'adminState',
  default: {
    isLoading: true,
    userEmail: null
  },
});

export const UserState = atom({
  key: 'userState',
  default: {
    isLoading: true,
    userEmail: null
  },
});