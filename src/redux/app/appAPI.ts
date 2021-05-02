import db from '../firebase';
import {I_UserData} from "../../types/app-types";
import {getRandomAvatar} from "../../constants/avatarImages";

/* ====================
   users api
   //TODO use firebase auth for login etc.
 ==================== */

export const appAPI = {
  logIn: async (user: {password: string, name: string}): Promise<never | null | I_UserData> => {
    let res:I_UserData | null = null;
    // read db if exists user with such name
    const snapshot = await db.collection("users")
      .where("name", "==", user.name).get();
    snapshot.forEach((doc) => {
      let id = doc.id;
      let common = doc.data() as I_UserData;
      // check if pass matches
      if (user.password === common.password) {
        res = {...common, id, avatar: common.avatar ? common.avatar : getRandomAvatar()}
      }
    });
    // error if no res object
    if (!res) {
      throw new Error('error_login')
    }
    return res;
  },

  register: async (user: I_UserData): Promise<never | undefined | I_UserData> => {
    let toSend: any = {...user};
    delete toSend.id;
    let exists = false;
    //read db if user with such name exists
    let snapshot = await db.collection('users')
          .where("name", "==", user.name).get();
    snapshot.forEach((doc) => {
      if (doc.id) {
        exists = true;
      }
    });
    //exists throw error
    if (exists) {
      throw new Error('error_register');
    } else {
      //post new user and return it
      const res = await db.collection("users").add(toSend);
      if (res && res.id) {
        return {...user, id: res.id};
      }
    }
  }
};