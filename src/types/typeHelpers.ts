////TYPE Checkers
import {DataPayloadType, I_listType, I_ticket, I_User} from "./ticket-types";

export function hasOwnProperty<X extends {}, Y extends PropertyKey>
(obj: X, prop: Y): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop)
}

export function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key]; // Inferred type is T[K]
}

export function isUser(data?: DataPayloadType): I_User | null {
  return data && hasOwnProperty(data, 'name') ? data : null;
}

export function isTicket(data: DataPayloadType): I_ticket | null {
  return hasOwnProperty(data, 'listId') && hasOwnProperty(data, 'id') ? data as I_ticket : null;
}

export function isList(data: DataPayloadType): I_listType | null {
  return hasOwnProperty(data, 'order') ? data as I_listType : null;
}
