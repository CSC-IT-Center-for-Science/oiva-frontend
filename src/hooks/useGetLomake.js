import { useState, useEffect } from "react";
import axios, { CancelToken } from "axios";
import { getLomake } from "services/lomakkeet";
import equal from "react-fast-compare";

export const useGetLomake = (
  mode,
  changeObjects,
  data,
  functions,
  { isPreviewModeOn, isReadOnly },
  locale,
  _path,
  prefix
) => {
  const [lomake, setLomake] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const cancelTokenSource = CancelToken.source();

    async function fetchLomake() {
      try {
        console.info("Noudetaan lomake", _path);
        setIsLoading(true);
        const lomakerakenne = await getLomake(
          mode,
          changeObjects,
          data,
          functions,
          { isPreviewModeOn, isReadOnly },
          locale,
          _path,
          prefix
        );
        setIsLoading(false);

        const lomakeJaSenMetadata = Array.isArray(lomakerakenne)
          ? {
              isValid: true,
              structure: lomakerakenne
            }
          : lomakerakenne;

        if (!equal(lomakeJaSenMetadata, lomake)) {
          console.info(
            "Asetetaan lomake ja sen metadata.",
            _path,
            "Vanha lomake: ",
            lomake,
            lomakeJaSenMetadata
          );
          setLomake(lomakeJaSenMetadata);
        }
      } catch (err) {
        console.info(err);
        setIsLoading(null);
        if (axios.isCancel(err)) {
          return console.info(err);
        }
      }
    }

    fetchLomake();

    return () => {
      console.log("Calling cleanup", _path);

      // here we cancel preveous http request that did not complete yet
      cancelTokenSource.cancel(
        "Cancelling previous http call because a new one was made ;-)"
      );
    };
  }, [
    changeObjects,
    data,
    functions,
    isPreviewModeOn,
    isReadOnly,
    locale,
    mode,
    _path,
    prefix
  ]);

  return [lomake, isLoading];
};
