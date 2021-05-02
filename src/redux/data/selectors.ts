import {AppStateType} from "../store";
import {I_listType, I_ticket, I_User} from "../../types/ticket-types";
import {isUser} from "../../types/typeHelpers";

export const selectListsArr = (state: AppStateType): I_listType[] => {
  let res:I_listType[] = [];
  Object.keys(state.data.list).forEach((key: string) => res.push(state.data.list[key] as I_listType));
  return res;
};

export const selectList = (state: AppStateType, listId: string): I_listType => {
  return state.data.list[listId] as I_listType;
};

export const selectUser = (state: AppStateType, userId: string): I_User | null =>
  isUser(state.data.user[userId]);

export const selectTicketByKey = (state: AppStateType, key: string): I_ticket | null =>
  !!state.data.ticket[key] ? state.data.ticket[key] as I_ticket : null;
