import {ticketsActionTypes} from "./actions";
import {DataPayloadType, I_dataState, I_listType} from "../../types/ticket-types";
import {AppActionsType} from "../store";
import moment from "moment";
import {isList} from "../../types/typeHelpers";

export const newTicketId = '_NEW_TICKET';

export const newTicket = {
  id: newTicketId,
  creatorId: '',
  lastModified: moment(),
  lastModifiedId: '',
  listId: '',
  title: 'Untitled',
  content: 'no content',
  expireTime: moment(),
};

const initialState:I_dataState = {
  ticket: {
    [newTicketId]: newTicket
  },
  user: {},
  list: {},
};

const dataReducer = (state: I_dataState = initialState, action: AppActionsType): I_dataState => {
  switch (action.type) {
    //adding fetched data
    case ticketsActionTypes.SET_FETCHED_DATA: {
      let newState = {...state};
      action.data.forEach((d: DataPayloadType) => {
        newState[action.dataType][d.id] = d;
      });
      if (action.dataType === 'user') {
        console.log(newState)
      }
      return newState;
    }
    //merge common data with existing or create new
    case ticketsActionTypes.UPDATE_ITEM_SUCCESS: {
      let newState = {...state};
      if (newState[action.dataType][action.data.id]) {
        newState[action.dataType][action.data.id] = {
          ...newState[action.dataType][action.data.id],
          ...action.data
        };
      } else {
        newState[action.dataType][action.data.id] = action.data;
      }

      return newState;
    }
    //delete data
    case ticketsActionTypes.DELETE_TICKET_SUCCESS: {
      let newState = {...state};
      delete newState.ticket[action.data.id];
      let list:I_listType | null = isList(newState.list[action.data.listId]);
      if (list) {
        list.order = list.order.filter(id => id !== action.data.id);
        newState.list[list.id] = list;
      }
      return newState;
    }
    default:
      return state;
  }
};

export default dataReducer;