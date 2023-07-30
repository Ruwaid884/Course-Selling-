import { UserState, adminState } from "../atoms/user";
import {selector} from "recoil";


export const userEmailState = selector({
    key:"userEmailState",
    get:({get})=>{
        const state = get(adminState);
        return state.userEmail
    }
});

export const EmailState = selector({
    key:"EmailState",
    get:({get})=>{
        const state = get(UserState);
        return state.userEmail
    }
});