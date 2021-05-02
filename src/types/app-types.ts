import {LanguageType} from "../constants/languageType";

export interface I_appState {
    isFetching: {[key: string]: boolean},
    error: {[key: string]: {message: string}}
    language: LanguageType,
    userData: I_UserData | null
}

export interface I_UserData {
    name: string,
    id: string,
    phone: string,
    avatar: string,
    password: string
}

export interface I_LoginData {
    name: string,
    password: string
}