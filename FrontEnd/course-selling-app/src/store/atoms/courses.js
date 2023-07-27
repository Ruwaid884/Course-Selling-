import {atom} from "recoil";

export const coursesState = atom({
  key: 'coursesState',
  default: {
    isLoading: true,
    courses: []
  },
});