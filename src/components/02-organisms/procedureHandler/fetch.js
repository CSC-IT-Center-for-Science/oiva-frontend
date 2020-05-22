import { backendRoutes } from "../../../stores/utils/backendRoutes";
import { API_BASE_URL } from "../../../modules/constants";
import { join } from "ramda";

/**
 * You can send data to backend with this function.
 * @param {*} urlKey - Key of the backend routes mapping (backendRoutes.js)
 * @param {*} formData - Data to be sent.
 * @param {*} options  - Options.
 */
export async function postData(urlKey, formData, options = {}) {
  const abortController = new AbortController();
  const routeObj = backendRoutes[urlKey];
  const { urlEnding } = options;
  const url = `${API_BASE_URL}/${join("", [
    routeObj.path,
    urlEnding,
    routeObj.postfix
  ])}`;
  if (!url) throw new Error("No url found!");
  const response = await fetch(url, {
    credentials: "include",
    signal: abortController.signal,
    method: "POST",
    body: formData
  }).catch(err => {
    console.info(err);
  });
  return response;
}
