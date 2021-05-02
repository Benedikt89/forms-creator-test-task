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

    forms_page_header: 'Form',

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
    header_tickets: 'Notatki',

    ticket_page_header: 'Tvoje Notatki',

    ticket_edit_title: 'Edytuj tytuł',
    ticket_edit_content: 'Edytuj zawartość',
    ticket_edit_expire_time: 'Ustaw czas wygaśnięcia',
    ticket_edit_delete: 'Usuń przedmiot',
    ticket_edit_move: 'Przejdź do innej listy',

    ticket_meta_expire_time: 'Data ważności',
    ticket_meta_last_time: 'Ostatnio edytowane',

    add_ticket: 'Dodaj nową notatkę do listy',
    log_in: 'Zaloguj sie',
    register_now: 'Zarejestruj się teraz!',

    placeholder_password: 'Hasło',
    placeholder_phone: 'Telefon',
    placeholder_name: 'Adres e-mail',

    error_name: 'Wprowadź poprawny adres e-mail!',
    error_phone: 'Wprowadź swój numer telefonu!',
    error_valid_phone: 'Podaj prawidłowy telefon *** *** ****',
    error_password: 'Wprowadź swoje hasło!',

    button_submit: 'Zatwierdź',

    error_fetch: 'Coś poszło nie tak. Spróbuj ponownie później.',
    error_login: 'Błędne hasło lub login!',
    error_register: 'Użytkownik z tym adresem e-mail już istnieje',
  },
  rus: {
    time_format: 'MM-DD-YYYY, HH:mm',
    header_profile: 'Профиль',
    header_log_out: 'Выйти',
    header_tickets: 'Заметки',

    ticket_page_header: 'Заметки',

    ticket_edit_title: 'Редактировать Заголовок',
    ticket_edit_content: 'Редактировать Контент',
    ticket_edit_expire_time: 'Задать время самоуничтожения',
    ticket_edit_delete: 'Удалить',
    ticket_edit_move: 'Переместить в другой лист',

    ticket_meta_expire_time: 'Время самоуничтожения',
    ticket_meta_last_time: 'Последний редактировавший ',

    add_ticket: 'Добавить новую заметку в лист',
    log_in: 'Войти',
    register_now: 'Зарегистрироваться!',

    placeholder_password: 'Пароль',
    placeholder_phone: 'Телефон',
    placeholder_name: 'Email адрес',

    error_name: 'Пожалуйста, введите правильный email!',
    error_phone: 'Пожалуйста, введите правильный телефон!',
    error_valid_phone: 'Пожалуйста, введите правильный номер в формате *** *** ****',
    error_password: 'Пожалуйста, введите Пароль!',

    button_submit: 'Подтвердить',

    error_fetch: 'Что то пошло не так. Повторите позже.',
    error_login: 'Не правильный Пароль или Логин!',
    error_register: 'Пользователь с таким именем уже существует',
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