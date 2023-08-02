import { selector } from "recoil";
import { socketState } from "../atoms/socket";

export const socketValue = selector({
    key:"socketValue",
    get:({get})=>{
        const state = get(socketState);
        return state.socket
    }
});