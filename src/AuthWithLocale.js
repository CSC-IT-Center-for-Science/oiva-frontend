import { useEffect } from "react";
import { useIntl } from "react-intl";
import { CAS_LOGIN_REDIRECT_URL, HOST_BASE_URL } from "modules/constants";

const AuthWithLocale = () => {
  const { locale } = useIntl();

  const casLoginReady = `${HOST_BASE_URL}/${locale}/cas-ready`;
  const nextUrl = CAS_LOGIN_REDIRECT_URL(casLoginReady);

  useEffect(() => {
    window.location = nextUrl;
  }, [nextUrl]);

  return null;
};

export default AuthWithLocale;
