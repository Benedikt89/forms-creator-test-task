import {Moment} from "moment";

export type DataType = 'list' | 'ticket' | 'user'
export type DataPayloadType = I_listType | I_ticket | I_User

export type I_dataState = {
  readonly [key in DataType]: {
    [key: string]: DataPayloadType
  }
}

export interface I_ticketData {
  creatorId: string,
  lastModified: Moment,
  lastModifiedId: string,
  listId: string
  title: string
  content: string
  expireTime: Moment
}

export interface I_ticket extends I_ticketData {
  id: string
}

export type I_listType = {
  id: string,
  order: string[],
  title: string,
}

export type I_User = {
  id: string,
  name: string,
  avatar: string
}