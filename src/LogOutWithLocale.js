import { useEffect } from "react";
import { useIntl } from "react-intl";
import { CAS_LOGOUT_URL } from "modules/constants";

const LogOutWithLocale = () => {
  const { locale } = useIntl();

  useEffect(() => {
    window.location = `${CAS_LOGOUT_URL}?redirect=/${locale}/logout`;
  }, [locale]);

  return null;
};

export default LogOutWithLocale;
