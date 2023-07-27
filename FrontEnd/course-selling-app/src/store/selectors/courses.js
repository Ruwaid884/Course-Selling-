import {selector} from "recoil";
import { coursesState } from "../atoms/courses";


export const myCourses = selector({
    key: 'myCourses',
    get: ({get}) => {
      const state = get(coursesState);
  
      return state.courses;
    },
  });


export const coursesLoading = selector({
    key: 'coursesLoading',
    get: ({get}) => {
      const state = get(coursesState);
  
      return state.isLoading;
    },
  });