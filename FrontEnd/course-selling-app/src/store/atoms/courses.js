import {atom} from "recoil";

export const coursesState = atom({
  key: 'coursesState',
  default: {
    isLoading: true,
    courses: []
  },
});

export const purchasedCourse = atom({
  key: 'purchasedCourse',
  default: {
    isLoading: true,
    purchasedCourses: []
  },
});