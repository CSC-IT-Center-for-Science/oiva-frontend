import {
  CAS_LOGIN_REDIRECT_URL,
  HOST_BASE_URL
} from "../../../modules/constants";

export default ({ locale }) => {
  // const casLoginReady = `${HOST_BASE_URL}/cas-ready`;
  const casLoginReady = `${HOST_BASE_URL}/cas-ready?locale=${locale}`;
  const nextUrl = CAS_LOGIN_REDIRECT_URL(casLoginReady);
  return (window.location = nextUrl);
};
