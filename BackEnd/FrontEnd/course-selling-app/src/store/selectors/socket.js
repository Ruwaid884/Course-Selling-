import { selector } from "recoil";
import { socketState } from "../atoms/socket";

export const Socket = selector({
    key: 'Socket',
    get: ({get}) => {
      const state = get(socketState);
      return state.socket;
    },
  });