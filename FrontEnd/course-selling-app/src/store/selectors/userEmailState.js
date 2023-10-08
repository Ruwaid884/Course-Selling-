import { UserState, adminState } from "../atoms/user";
import {selector} from "recoil";


export const userEmailState = selector({
    key:"userEmailState",
    get:({get})=>{
        const state = get(adminState);
        if(state!=null) 
        return state.userEmail
        return "";
    }
});

export const EmailState = selector({
    key:"EmailState",
    get:({get})=>{
        const state = get(UserState);
        if(state!=null) 
        return state.userEmail
    return "";
    }
});