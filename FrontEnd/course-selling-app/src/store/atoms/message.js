import {atom} from "recoil";
export const chatMessagesState = atom({
    key: 'chatMessagesState',
    default: [],
  });

  export const attchmentSend = atom({
    key: 'attchmentSend',
    default: false,
  });
