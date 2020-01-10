import { API_BASE_URL } from "../../modules/constants";
import { backendRoutes } from "./backendRoutes";
import { equals, includes, join, mergeDeepLeft } from "ramda";

async function run(abortController, config, callbackFn) {
  const routeObj = backendRoutes[config.key];
  const options = { signal: abortController.signal };

  const response = await fetch(
    `${API_BASE_URL}/${join("", [
      routeObj.path,
      config.urlEnding,
      routeObj.postfix
    ])}`,
    // add 'accept' header if it does not exist
    mergeDeepLeft(options, {
      headers: { Accept: "application/json" }
    })
  ).catch(err => {
    console.info(err);
    callbackFn(null, true);
  });

  if (response) {
    if (response.ok) {
      const contentType = response.headers.get("content-type");
      if (includes("application/json", contentType)) {
        callbackFn(await response.json(), false);
      }
    } else {
      callbackFn(null, true);
    }
  }
}

export default function loadFromBackend(config, callbackFn) {
  if (!callbackFn) {
    console.info("Callback function is missing", config);
    return;
  }
  const abortController = new AbortController();
  run(abortController, config, callbackFn);
  return abortController;
}

export function execute(
  { getState, setState },
  config,
  propsToState = {},
  refreshIntervalInSeconds = 120
) {
  const state = getState();
  if (
    state.isLoading !== true &&
    (state.isErroneous ||
      !equals(propsToState, state.keyParams) ||
      !state.fetchedAt ||
      new Date().getTime() - state.fetchedAt >= refreshIntervalInSeconds * 1000)
  ) {
    setState({
      isLoading: true
    });

    const abortController = loadFromBackend(config, (data, isErroneous) => {
      setState({
        ...{ keyParams: propsToState },
        data,
        fetchedAt: new Date().getTime(),
        isErroneous,
        isLoading: false
      });
    });

    return abortController;
  }
  return null;
}
