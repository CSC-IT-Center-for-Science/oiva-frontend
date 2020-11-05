import {
  assocPath,
  find,
  forEach,
  includes,
  insert,
  map,
  path,
  prop,
  propEq,
  split
} from "ramda";
import { findObjectWithKey, getAnchorPart } from "utils/common";
import { setAttachmentUuids } from "utils/muutospyyntoUtil";

const getSavedFiles = muutospyynto => {
  if (!!muutospyynto) {
    const attachments = prop("liitteet", muutospyynto);
    const muutospyyntoData = setAttachmentUuids(attachments, muutospyynto);
    const backendMuutokset = prop("muutokset")(muutospyyntoData);
    return findObjectWithKey(backendMuutokset, "liitteet");
  }
};

const getUpdatedC = (muutospyynto, filesFromMuutokset) => {
  return map(changeObj => {
    const files = path(["properties", "attachments"], changeObj)
      ? map(file => {
          const fileFromBackend =
            find(
              propEq("tiedostoId", file.tiedostoId),
              filesFromMuutokset || {}
            ) || {};
          return Object.assign({}, file, fileFromBackend);
        }, changeObj.properties.attachments || [])
      : null;
    return files
      ? assocPath(["properties", "attachments"], files, changeObj)
      : changeObj;
  }, findObjectWithKey({ ...muutospyynto }, "changeObjects"));
};

export const getSavedChangeObjects = muutospyynto => {
  if (!!muutospyynto) {
    let changesBySection = {};

    const savedFiles = getSavedFiles(muutospyynto);

    const updatedC = getUpdatedC(muutospyynto, savedFiles);
    // localforage.setItem("backendMuutokset", backendMuutokset);

    if (updatedC) {
      forEach(changeObj => {
        const anchorInitialSplitted = split(
          "_",
          getAnchorPart(changeObj.anchor, 0)
        );
        const existingChangeObjects =
          path(anchorInitialSplitted, changesBySection) || [];
        const changeObjects = insert(-1, changeObj, existingChangeObjects);
        changesBySection = assocPath(
          anchorInitialSplitted,
          changeObjects,
          changesBySection
        );
      }, updatedC);
    }

    // Special case: Toiminta-alueen perustelut
    const toimintaAluePerusteluChangeObject = path(
      ["perustelut", "toimintaalue", "0"],
      changesBySection
    );
    if (
      toimintaAluePerusteluChangeObject &&
      !includes("reasoning", toimintaAluePerusteluChangeObject.anchor)
    ) {
      changesBySection = assocPath(
        ["perustelut", "toimintaalue"],
        [
          {
            anchor: "perustelut_toimintaalue.reasoning.A",
            properties: toimintaAluePerusteluChangeObject.properties
          }
        ],
        changesBySection
      );
    }

    changesBySection.topthree = path(["meta", "topthree"], muutospyynto) || [];
    changesBySection.paatoksentiedot = path(["meta", "paatoksentiedot"], muutospyynto) || [];

    // Set uuid for asianumero
    const topThreeChanges = find(
      topthree => getAnchorPart(topthree.anchor, 1) === "asianumero",
      changesBySection.topthree
    );

    if (topThreeChanges) {
      topThreeChanges.properties.metadata = { uuid: muutospyynto.uuid };
    }

    if (
      changesBySection.categoryFilter &&
      changesBySection.categoryFilter.length > 0
    ) {
      changesBySection.toimintaalue = [
        Object.assign({}, changesBySection.categoryFilter[0])
      ];
    }

    delete changesBySection.categoryFilter;

    return changesBySection;
  }
};
