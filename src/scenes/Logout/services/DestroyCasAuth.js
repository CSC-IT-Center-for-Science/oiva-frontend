import { CAS_LOGOUT_URL } from "../../../modules/constants";

export default locale => (window.location = CAS_LOGOUT_URL(locale));
