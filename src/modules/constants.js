// Palvelu
export const HOST_BASE_URL = window.location.origin;
export const API_BASE_URL = `${HOST_BASE_URL}/api`;
export const CAS_LOGIN_REDIRECT_URL = `${API_BASE_URL}/auth/login?redirect=${HOST_BASE_URL}/cas-ready`;
export const CAS_LOGIN_READY = `${HOST_BASE_URL}/cas-ready`;
export const CAS_BASE_URL = "https://virkailija.testiopintopolku.fi";
export const CAS_LOGOUT_URL = `${API_BASE_URL}/auth/logout`;

// Luvan erikoiskäsittely
export const LUPA_EXCEPTION_PATH = `${API_BASE_URL}/pebble/resources/liitteet/lisakoulutusluvat/`;

// USERS & ROLES
export const ROLE_APPLICATION = "OIVA_APP";
export const ROLE_YLLAPITAJA = "OIVA_APP_ADMIN";
export const ROLE_ESITTELIJA = "OIVA_APP_ESITTELIJA";
export const ROLE_MUOKKAAJA = "OIVA_APP_MUOKKAAJA";
export const ROLE_NIMENKIRJOITTAJA = "OIVA_APP_NIMENKIRJOITTAJA";
export const ROLE_KATSELIJA = "OIVA_APP_KATSELIJA";
