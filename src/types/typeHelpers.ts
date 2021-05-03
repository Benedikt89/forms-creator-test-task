////TYPE Checkers
import {DataPayloadType, FormItemType, I_User} from "./form-types";

export function hasOwnProperty<X extends {}, Y extends PropertyKey>
(obj: X, prop: Y): obj is X & Record<Y, unknown> {
  return obj.hasOwnProperty(prop)
}

export function getProperty<T, K extends keyof T>(obj: T, key: K) {
  return obj[key]; // Inferred type is T[K]
}

export function isUser(data?: DataPayloadType): I_User | null {
  return data && hasOwnProperty(data, 'name') ? data as I_User : null;
}
export function isForm(data?: DataPayloadType): FormItemType | null {
  return data && hasOwnProperty(data, 'fieldsIds') ? data as FormItemType : null;
}