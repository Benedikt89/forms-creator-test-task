import db from '../firebase';
import moment from "moment";
import firebase from "firebase";
import {getRandomAvatar} from "../../constants/avatarImages";
import {FormItemType, I_User} from "../../types/form-types";

const {Timestamp} = firebase.firestore;

const converter = (data: FormItemType) => {
  return {
    ...data,
    lastUpdated: Timestamp.fromDate(new Date()),
  }
};

export const formsAPI = {
  getItems: async (): Promise<never | FormItemType[]> => {
    let res:FormItemType[] = [];
    const snapshot = await  db.collection("forms").get();
    snapshot.forEach((doc) => {
      let id = doc.id;
      let item = doc.data() as FormItemType;
      res.push({...item, id, lastUpdated: moment(item.lastUpdated.toDate())});
    });
    return res;
  },
  getUsers: async (): Promise<never | I_User[]> => {
    let res:I_User[] = [];
    const snapshot = await  db.collection("users").get();
    snapshot.forEach((doc) => {
      let id = doc.id;
      let user = doc.data() as I_User;
      res.push({name: user.name, id, avatar: user.avatar ? user.avatar : getRandomAvatar()});
    });
    return res;
  },
  updateItem: async (item: FormItemType): Promise<never | FormItemType> => {
    let toSend: any = converter(item);
    await db.collection("forms").doc(item.id).set(toSend);
    return item;
  },
  async addItem(item: FormItemType): Promise<never | undefined | FormItemType> {
    let toSend: any = converter(item);
    const res = await db.collection("forms").add(toSend);
    if (res && res.id) {
      return {...item, id: res.id};
    }
  },
  deleteItem: async (formId: string): Promise<never | boolean> => {
    const res = await db.collection("forms").doc(formId).delete();
    console.log(res);
    return true;
  },
};