import {ThunkDispatch} from "redux-thunk";
import {AppActionsType, GetStateType} from "../store";
import {DataPayloadType, DataType, I_listType, I_ticket} from "../../types/ticket-types";
import {ticketsAPI} from "./api";
import {fetchHandler} from "../fetchHandler";
import {newTicketId} from "./reducer";
import {selectList, selectListsArr} from "./selectors";
import {selectUserData} from "../app/selectors";
import {batch} from "react-redux";

export const ticketsActionTypes: {
  SET_FETCHED_DATA: "tickets/SET_FETCHED_DATA"
  UPDATE_ITEM_SUCCESS: "tickets/UPDATE_ITEM_SUCCESS"
  DELETE_TICKET_SUCCESS: "tickets/DELETE_TICKET_SUCCESS"
} = {
  SET_FETCHED_DATA: "tickets/SET_FETCHED_DATA",
  UPDATE_ITEM_SUCCESS: "tickets/UPDATE_ITEM_SUCCESS",
  DELETE_TICKET_SUCCESS: "tickets/DELETE_TICKET_SUCCESS"
};

export type I_dataActions = I_setFetchedData | I_updateItemSuccess |
  I_deleteTicketSuccess

//interfaces
interface I_setFetchedData {
  type: typeof ticketsActionTypes.SET_FETCHED_DATA,
  data: Array<DataPayloadType>
  dataType: DataType
}
interface I_updateItemSuccess {
  type: typeof ticketsActionTypes.UPDATE_ITEM_SUCCESS,
  data: DataPayloadType
  dataType: DataType
}

interface I_deleteTicketSuccess {
  type: typeof ticketsActionTypes.DELETE_TICKET_SUCCESS,
  data: I_ticket
}

//Internal ACTIONS CREATORS

export const _updateItemSuccess = (data: DataPayloadType, dataType: DataType): I_updateItemSuccess =>
  ({type: ticketsActionTypes.UPDATE_ITEM_SUCCESS, data, dataType});

export const _deleteTicketSuccess = (data: I_ticket): I_deleteTicketSuccess =>
  ({type: ticketsActionTypes.DELETE_TICKET_SUCCESS, data});

export const _setFetchedData = (data: DataPayloadType[], dataType: DataType): I_setFetchedData =>
  ({type: ticketsActionTypes.SET_FETCHED_DATA, data, dataType});



/* ====================
  thunk actions
 ==================== */

export const fetchAllData = () =>
  fetchHandler(
    "fetchAllData",
    async (dispatch: ThunkDispatch<{}, {}, AppActionsType>) => {
      //array of data to fetch
      const datas: DataType[] = ["ticket", "list", "user"];
      //promiced function
      let fetch = async (type: DataType) => {
        let res = await ticketsAPI[
          type === "ticket" ? "getTickets"
          : type === "list" ? "getLists" : "getUsers"]();
        if (res) {
          dispatch(_setFetchedData(res, type));
          return true;
        }
      };
      // racing all data
      const success = await Promise.race(datas.map(d => fetch(d)));
      if (success) {
        return true;
      }
  });


export const onTicketUpdate = (ticket: I_ticket) =>
  fetchHandler(
    `ticket${ticket.id}`,
    async (dispatch: ThunkDispatch<{}, {}, AppActionsType>, getState: GetStateType) => {
      //if data comes with newId
      let isNew = ticket.id === newTicketId;
      let res;
      //user data to set who was updating last
      let userData = selectUserData(getState());
      if (userData && userData.id) {
        if (isNew) {
          res = await ticketsAPI.addTicket({
            ...ticket,
            creatorId: userData.id,
            lastModifiedId: userData.id,
          });
        } else {
          res = await ticketsAPI.updateTicket({...ticket, lastModifiedId: userData.id});
        }
        //after response set data to reducer
        if (res) {
          if (isNew) {
            //set new note to list arr
            let list = selectList(getState(), ticket.listId);
            let listRes = await ticketsAPI.updateList({...list, order: [res.id, ...list.order]});
            if (listRes) {
              dispatch(_updateItemSuccess({...list, order: [res.id, ...list.order]}, "list"));
            }
          }
          dispatch(_updateItemSuccess(res, "ticket"));
          return true;
        }
      }
    });

export const onUpdateList = (list: I_listType) =>
  fetchHandler(
    "updateList",
    async (dispatch: ThunkDispatch<{}, {}, AppActionsType>) => {
      const res = await ticketsAPI.updateList(list);
      if (res) {
        dispatch(_updateItemSuccess(res, "list"));
        return true;
      }
    });

export const onTicketDelete = (data: I_ticket) =>
  fetchHandler(
    `ticket${data.id}`,
    async (dispatch: ThunkDispatch<{}, {}, AppActionsType>, getState: GetStateType) => {
      let list = selectList(getState(), data.listId);
      if (list) {
        const resFrom = await ticketsAPI.updateList({
          ...list, order: list.order.filter(id => id !== data.id)
        });
        if (resFrom) {
          dispatch(_updateItemSuccess(resFrom, 'list'));
        }
        const res = await ticketsAPI.deleteTicket(data);
        if (res) {
          dispatch(_deleteTicketSuccess(data));
          return true;
        }
      }
    });

export const onTicketMove = (data: I_ticket) =>
  fetchHandler(
    `ticket${data.id}`,
    async (dispatch: ThunkDispatch<{}, {}, AppActionsType>, getState: GetStateType) => {
      const lists = selectListsArr(getState());
      let userData = selectUserData(getState());
      ///list that should update to remove from id's arr
      let removeFrom: I_listType | null  = null;
      ///list that should update to add new Id to arr
      let addTo: I_listType | null = null;
      ///listId that should update to add new Id to arr
      let addToId: string = '';
      lists.forEach((l: I_listType )=> {
        if (l.id === data.listId) {
          ///set list that should be cleared
          removeFrom = {...l, order: l.order.filter(id => id !== data.id)};
        } else {
          ///set list where to add
          addTo = {...l, order: [data.id, ...l.order]} as I_listType;
          addToId = l.id;
        }
      });
      ///if we have both lists
      if (removeFrom && addToId && addTo && userData) {
        const res = await ticketsAPI.updateTicket({
          ...data, listId: addToId,
          lastModifiedId: userData.id
        });
        const resFrom = await ticketsAPI.updateList(removeFrom);
        const resTo = await ticketsAPI.updateList(addTo);
        if (res && resFrom && resTo) {
          batch(() => {
            dispatch(_updateItemSuccess(res, 'ticket'));
            dispatch(_updateItemSuccess(resFrom, 'list'));
            dispatch(_updateItemSuccess(resTo, 'list'));
          });
          return true;
        }
      }

    });