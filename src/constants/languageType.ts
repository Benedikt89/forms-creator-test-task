import {hasOwnProperty} from "../types/typeHelpers";

export type LanguageType = 'eng' | 'pl' | 'rus'
export const languagesArr:LanguageType[] = ['eng' , 'pl' , 'rus'];
type LocaleObject = {
  [key in LanguageType]: {
    [key: string]: string
  }
}

/* ====================
   locale variables (later can be fetched from API)
 ==================== */

const localeInterface:LocaleObject = {
  eng: {
    time_format: 'MM-DD-YYYY, HH:mm',
    header_profile: 'Profile',
    header_log_out: 'Log Out',
    header_forms: 'Forms',

    forms_page_header: 'Forms Page',
    form: 'Form',
    field: 'Field',
    option: 'Option',
    custom: 'Custom answer',
    mandatory: 'Required',
    displayDescription: 'Description',
    add: 'Add',
    delete: 'Delete',
    edit: 'Edit',
    submit: 'Submit',
    save: 'Save',

    ticket_edit_title: 'Edit Title',
    ticket_edit_content: 'Edit Content',
    ticket_edit_expire_time: 'Set Expire Time',
    ticket_edit_delete: 'Delete Item',
    ticket_edit_move: 'Move to another list',

    ticket_meta_expire_time: 'Expire time',
    ticket_meta_last_time: 'Last Time Edited ',

    add_ticket: 'Add new Note to List',
    log_in: 'Log in',
    register_now: 'Register now!',

    placeholder_password: 'Password',
    placeholder_phone: 'Phone',
    placeholder_name: 'Email address',

    error_name: 'Please input correct email!',
    error_phone: 'Please input your phone!',
    error_valid_phone: 'Please enter a valid Phone *** *** ****',
    error_password: 'Please input your Password!',

    button_submit: 'Submit',

    error_fetch: 'Something went wrong. Try again later.',
    error_login: 'Wrong password or login!',
    error_register: 'User with that email already exists',
  },
  pl: {
    time_format: 'MM-DD-YYYY, HH:mm',
    header_profile: 'Profil',
    header_log_out: 'Wyloguj',
    header_forms: 'Formy',

    forms_page_header: 'Staronka Formy',
    form: 'Forma',
    field: 'Field',
    option: 'Option',
    custom: 'Custom answer',
    mandatory: 'wymagany',
    displayDescription: 'Opis',
    add: 'Dodaj',
    delete: 'Usu??',
    edit: 'Edytuj',
    submit: 'Zatwierd??',
    save: 'Zatwierd??',

    ticket_edit_title: 'Edytuj tytu??',
    ticket_edit_content: 'Edytuj zawarto????',
    ticket_edit_expire_time: 'Ustaw czas wyga??ni??cia',
    ticket_edit_delete: 'Usu?? przedmiot',
    ticket_edit_move: 'Przejd?? do innej listy',

    ticket_meta_expire_time: 'Data wa??no??ci',
    ticket_meta_last_time: 'Ostatnio edytowane',

    add_ticket: 'Dodaj now?? notatk?? do listy',
    log_in: 'Zaloguj sie',
    register_now: 'Zarejestruj si?? teraz!',

    placeholder_password: 'Has??o',
    placeholder_phone: 'Telefon',
    placeholder_name: 'Adres e-mail',

    error_name: 'Wprowad?? poprawny adres e-mail!',
    error_phone: 'Wprowad?? sw??j numer telefonu!',
    error_valid_phone: 'Podaj prawid??owy telefon *** *** ****',
    error_password: 'Wprowad?? swoje has??o!',

    button_submit: 'Zatwierd??',

    error_fetch: 'Co?? posz??o nie tak. Spr??buj ponownie p????niej.',
    error_login: 'B????dne has??o lub login!',
    error_register: 'U??ytkownik z tym adresem e-mail ju?? istnieje',
  },
  rus: {
    time_format: 'MM-DD-YYYY, HH:mm',
    header_profile: '??????????????',
    header_log_out: '??????????',
    header_forms: '??????????',

    forms_page_header: '???????????????? ????????',
    form: '????????a',
    field: '????????',
    option: 'Option',
    custom: '???????? ??????????????',
    mandatory: '??????????????????????',
    displayDescription: '????????????????',
    add: '????????????????',
    delete: '??????????????',
    edit: '??????????????????????????',
    submit: '??????????????????????',
    save: '??????????????????',

    ticket_edit_title: '?????????????????????????? ??????????????????',
    ticket_edit_content: '?????????????????????????? ??????????????',
    ticket_edit_expire_time: '???????????? ?????????? ??????????????????????????????',
    ticket_edit_delete: '??????????????',
    ticket_edit_move: '?????????????????????? ?? ???????????? ????????',

    ticket_meta_expire_time: '?????????? ??????????????????????????????',
    ticket_meta_last_time: '?????????????????? ?????????????????????????????? ',

    add_ticket: '???????????????? ?????????? ?????????????? ?? ????????',
    log_in: '??????????',
    register_now: '????????????????????????????????????!',

    placeholder_password: '????????????',
    placeholder_phone: '??????????????',
    placeholder_name: 'Email ??????????',

    error_name: '????????????????????, ?????????????? ???????????????????? email!',
    error_phone: '????????????????????, ?????????????? ???????????????????? ??????????????!',
    error_valid_phone: '????????????????????, ?????????????? ???????????????????? ?????????? ?? ?????????????? *** *** ****',
    error_password: '????????????????????, ?????????????? ????????????!',

    button_submit: '??????????????????????',

    error_fetch: '?????? ???? ?????????? ???? ??????. ?????????????????? ??????????.',
    error_login: '???? ???????????????????? ???????????? ?????? ??????????!',
    error_register: '???????????????????????? ?? ?????????? ???????????? ?????? ????????????????????',
  }
};

export const getLocale = (lang: LanguageType, key: string): string => {
  let language = localeInterface.eng;
  let res = key;
  if (hasOwnProperty(localeInterface, lang)) {
    language = localeInterface[lang];
  }
  if (hasOwnProperty(language, key)) {
    return language[key] as string;
  }
  return res;
};