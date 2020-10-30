import { createStore, createHook } from "react-sweet-state";
import {
  append,
  assoc,
  assocPath,
  dissocPath,
  endsWith,
  filter,
  flatten,
  isEmpty,
  length,
  map,
  max,
  prop,
  reduce,
  split,
  startsWith
} from "ramda";
import { getAnchorPart, replaceAnchorPartWith } from "utils/common";

const Store = createStore({
  initialState: {
    changeObjects: {}
  },
  actions: {
    acceptRestriction: (sectionId, restrictionId, targetSectionId) => ({
      getState,
      setState
    }) => {
      const currentChangeObjects = prop("changeObjects", getState());
      const nextChangeObjects = map(changeObj => {
        return {
          ...changeObj,
          anchor: replaceAnchorPartWith(changeObj.anchor, 0, targetSectionId)
        };
      }, currentChangeObjects[sectionId]);
      setState(
        assocPath(
          ["changeObjects", targetSectionId],
          nextChangeObjects,
          getState()
        )
      );
    },
    addCriterion: (sectionId, rajoiteId) => ({ getState, setState }) => {
      const currentChangeObjects = prop("changeObjects", getState());
      const rajoitekriteeritChangeObjects = filter(
        changeObj =>
          startsWith(`${sectionId}.${rajoiteId}.kriteerit`, changeObj.anchor),
        currentChangeObjects[sectionId] || []
      );

      /**
       * Etsitään suurin käytössä oleva kriteerin numero ja muodostetaan seuraava
       * numero lisäämällä lukuun yksi.
       */
      const nextCriterionAnchorPart =
        length(rajoitekriteeritChangeObjects) > 0
          ? reduce(
              max,
              -Infinity,
              map(changeObj => {
                return parseInt(getAnchorPart(changeObj.anchor, 3), 10);
              }, rajoitekriteeritChangeObjects)
            ) + 1
          : 0;

      /**
       * Luodaan
       */
      const nextChangeObjects = assoc(
        sectionId,
        append(
          {
            anchor: `${sectionId}.${rajoiteId}.kriteerit.${nextCriterionAnchorPart}.valintaelementti.autocomplete`,
            properties: {
              value: ""
            }
          },
          currentChangeObjects[sectionId] || []
        ),
        currentChangeObjects
      );
      setState({ ...getState(), changeObjects: nextChangeObjects });
    },
    closeRestrictionDialog: () => ({ getState, setState }) => {
      setState({ ...getState(), isRestrictionDialogVisible: false });
    },
    createTextBoxChangeObject: (sectionId, koodiarvo) => ({
      getState,
      setState
    }) => {
      if (sectionId) {
        const currentChangeObjects = prop("changeObjects", getState());
        const textBoxChangeObjects = filter(
          changeObj =>
            startsWith(`${sectionId}.${koodiarvo}`, changeObj.anchor) &&
            endsWith(".kuvaus", changeObj.anchor) &&
            !startsWith(`${sectionId}.${koodiarvo}.0`, changeObj.anchor),
          currentChangeObjects[sectionId] || []
        );

        const textBoxNumber =
          length(textBoxChangeObjects) > 0
            ? reduce(
                max,
                -Infinity,
                map(changeObj => {
                  return parseInt(getAnchorPart(changeObj.anchor, 2), 10);
                }, textBoxChangeObjects)
              ) + 1
            : 1;

        /**
         * Luodaan
         */
        const nextChangeObjects = assoc(
          sectionId,
          append(
            {
              anchor: `${sectionId}.${koodiarvo}.${textBoxNumber}.kuvaus`,
              properties: {
                value: ""
              }
            },
            currentChangeObjects[sectionId] || []
          ),
          currentChangeObjects
        );
        setState({ ...getState(), changeObjects: nextChangeObjects });
      }
    },
    removeTextBoxChangeObject: (sectionId, anchor) => ({
      getState,
      setState
    }) => {
      if (sectionId && anchor) {
        const currentChangeObjects = prop("changeObjects", getState());
        const nextChangeObjects = filter(changeObj => {
          return changeObj.anchor !== anchor;
        }, currentChangeObjects[sectionId]);

        const path = flatten(["changeObjects", split("_", sectionId)]);
        setState(assocPath(path, flatten(nextChangeObjects), getState()));
      }
    },
    removeCriterion: (sectionId, anchor) => ({ getState, setState }) => {
      const currentChangeObjects = prop("changeObjects", getState());
      const nextChangeObjects = filter(changeObj => {
        const criterionAnchor = getAnchorPart(changeObj.anchor, 3);
        return criterionAnchor !== anchor;
      }, currentChangeObjects[sectionId]);
      setState(
        assocPath(["changeObjects", sectionId], nextChangeObjects, getState())
      );
    },
    setChangeObjects: (sectionId, changeObjects) => ({
      getState,
      setState
    }) => {
      if (!sectionId && changeObjects) {
        setState(assoc("changeObjects", changeObjects, getState()));
      }

      if (sectionId && changeObjects) {
        const path = flatten(["changeObjects", split("_", sectionId)]);
        setState(assocPath(path, changeObjects, getState()));
      }
      // Properties not including Toimintaalue and Tutkintokielet are deleted if empty.
      if (
        sectionId &&
        sectionId !== "toimintaalue" &&
        sectionId !== "kielet_tutkintokielet" &&
        isEmpty(changeObjects)
      ) {
        setState(dissocPath(split("_", sectionId), getState().changeObjects));
      }
    },
    showNewRestrictionDialog: () => ({ getState, setState }) => {
      setState({ ...getState(), isRestrictionDialogVisible: true });
    }
  },
  name: "Esi- ja perusopetus"
});

export const useEsiJaPerusopetus = createHook(Store);
