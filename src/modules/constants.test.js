import {
  HOST_BASE_URL,
  API_BASE_URL,
  CAS_LOGIN_REDIRECT_URL,
  CAS_LOGIN_READY,
  CAS_BASE_URL,
  CAS_LOGOUT_URL,
  LUPA_EXCEPTION_PATH,
  ROLE_APPLICATION,
  ROLE_YLLAPITAJA,
  ROLE_ESITTELIJA,
  ROLE_MUOKKAAJA,
  ROLE_NIMENKIRJOITTAJA,
  ROLE_KATSELIJA
} from "./constants";

it("Values of the constants should be correct", () => {
  expect(HOST_BASE_URL).toBe("http://localhost");
  expect(API_BASE_URL).toBe("http://localhost/api");
  expect(CAS_LOGIN_REDIRECT_URL).toBe(
    "http://localhost/api/auth/login?redirect=http://localhost/cas-ready"
  );
  expect(CAS_LOGIN_READY).toBe("http://localhost/cas-ready");
  expect(CAS_BASE_URL).toBe("https://virkailija.testiopintopolku.fi");
  expect(CAS_LOGOUT_URL).toBe("http://localhost/api/auth/logout");
  expect(LUPA_EXCEPTION_PATH).toBe(
    "http://localhost/api/pebble/resources/liitteet/lisakoulutusluvat/"
  );
  expect(ROLE_APPLICATION).toBe("OIVA_APP");
  expect(ROLE_YLLAPITAJA).toBe("OIVA_APP_YLLAPITAJA");
  expect(ROLE_ESITTELIJA).toBe("OIVA_APP_AMMATILLINEN_ESITTELIJA");
  expect(ROLE_MUOKKAAJA).toBe("OIVA_APP_AMMATILLINEN_MUOKKAAJA");
  expect(ROLE_NIMENKIRJOITTAJA).toBe("OIVA_APP_AMMATILLINEN_NIMENKIRJOITTAJA");
  expect(ROLE_KATSELIJA).toBe("OIVA_APP_AMMATILLINEN_KATSELIJA");
});
