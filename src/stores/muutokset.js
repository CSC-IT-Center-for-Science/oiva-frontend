import { createContainer, createHook, createStore } from "react-sweet-state";
import {
  add,
  append,
  assoc,
  assocPath,
  compose,
  concat,
  difference,
  endsWith,
  filter,
  flatten,
  groupBy,
  includes,
  isNil,
  join,
  last,
  length,
  map,
  max,
  mergeAll,
  not,
  path,
  pipe,
  prepend,
  prop,
  propEq,
  reduce,
  reject,
  sortBy,
  split,
  startsWith,
  values
} from "ramda";
import {
  getAnchorPart,
  getLatestChangesByAnchor,
  recursiveTreeShake,
  replaceAnchorPartWith
} from "utils/common";
// import { muutokset } from "scenes/Koulutusmuodot/AmmatillinenKoulutus/sivun1tietojaTaytettyKattavasti";

const removeUnderRemoval = () => ({ getState, setState }) => {
  const currentState = getState();
  const nextChangeObjects = assoc(
    "underRemoval",
    {},
    currentState.changeObjects
  );
  setState(assoc("changeObjects", nextChangeObjects, currentState));
};

const removeUnsavedChanges = () => ({ getState, setState }) => {
  const currentState = getState();
  const nextChangeObjects = assoc("unsaved", {}, currentState.changeObjects);
  setState(assoc("changeObjects", nextChangeObjects, currentState));
};

const setFocusOn = anchor => ({ getState, setState }) => {
  setState(assoc("focusOn", anchor, getState()));
};

const setLatestChanges = changeObjects => ({ getState, setState }) => {
  setState(assoc("latestChanges", changeObjects, getState()));
};

const setSavedChanges = (changeObjects, anchor) => ({ getState, setState }) => {
  if (anchor) {
    setState(
      assocPath(split(".", anchor), changeObjects, getState().changeObjects)
    );
  } else {
    const nextState = assocPath(
      ["changeObjects", "saved"],
      changeObjects,
      getState()
    );
    setState(nextState);
  }
};

const closeRestrictionDialog = () => ({ getState, setState }) => {
  setState(
    assocPath(["changeObjects", "unsaved", "rajoitelomake"], [], getState())
  );
  setState({ ...getState(), isRestrictionDialogVisible: false });
};

const suljeAlirajoitedialogi = () => ({ getState, setState }) => {
  setState(
    assocPath(["changeObjects", "unsaved", "alirajoitelomake"], [], getState())
  );
  setState({ ...getState(), isAlirajoitedialogiVisible: false });
};

const Store = createStore({
  // initialState: muutokset,
  initialState: {
    changeObjects: {
      saved: {},
      unsaved: {},
      underRemoval: {}
    },
    focusOn: null,
    latestChanges: {},
    validity: {}
  },
  actions: {
    /**
     * -------------------- CRITERIONS OF LIMITATIONS --------------------
     */
    acceptRestriction: (sectionId, restrictionId, targetSectionId) => ({
      getState,
      dispatch,
      setState
    }) => {
      const currentChangeObjects = prop("unsaved", getState().changeObjects);
      const newRestrictionChangeObjs =
        currentChangeObjects.rajoitelomake[restrictionId];

      setState(
        assocPath(
          ["changeObjects", "unsaved", targetSectionId, restrictionId],
          // Vaihdetaan ankkurien ensimmäiseksi osaksi targetSectionId:n arvo,
          // jolloin muutokset siirtyvät sen mukaiselle lomakkeelle ja
          // tallennetaan muutosobjektit tilanhallintaan.
          map(changeObj => {
            return {
              ...changeObj,
              anchor: replaceAnchorPartWith(
                changeObj.anchor,
                0,
                `${targetSectionId}_${restrictionId}`
              )
            };
          }, newRestrictionChangeObjs),
          getState()
        )
      );
      dispatch(closeRestrictionDialog());
    },
    addCriterion: (
      sectionId,
      kohdennusId,
      rajoiteId,
      kohdennusindeksipolku
    ) => ({ getState, setState }) => {
      const kohdennuspolku = join(
        ".",
        map(kohdennustaso => {
          return `kohdennukset.${kohdennustaso}`;
        }, kohdennusindeksipolku)
      );

      const currentChangeObjects = getState().changeObjects;
      const asetuksetChangeObjects = filter(changeObj => {
        return startsWith(
          `${sectionId}_${rajoiteId}.${kohdennuspolku}.rajoite.asetukset`,
          changeObj.anchor
        );
      }, concat(path(["unsaved", sectionId, rajoiteId], currentChangeObjects) || [], path(["saved", sectionId, rajoiteId], currentChangeObjects) || []) || []);
      /**
        Seuraavan kriteerin id saadaan jakamalla asetuksia koskevien muutos-
        objektien määrä kahdella, koska yksi asetus sisältää sekä kohteen että
        tarkentimen. Määräajan tapauksessa asetus sisältää kohteen sekä kaksi tarkenninta.
        Täytyy siis vähentää yksi per määräaikaasetus asetuksetChangeObjectsin pituudesta.
       */
      const maaraAikaAsetustenLkm = reduce(
        add,
        0,
        map(
          asetus =>
            path(["properties", "value", "value"], asetus) ===
            "kujalisamaareetlisaksiajalla_1"
              ? 1
              : 0,
          asetuksetChangeObjects
        )
      );

      const nextAsetuksetIndex =
        (length(asetuksetChangeObjects) - maaraAikaAsetustenLkm) / 2;

      /**
       * Luodaan
       */
      const nextChangeObjects = assocPath(
        ["unsaved", sectionId, rajoiteId],
        append(
          {
            anchor: `${sectionId}_${rajoiteId}.${kohdennuspolku}.rajoite.asetukset.${nextAsetuksetIndex}.kohde`,
            properties: {
              value: ""
            }
          },
          currentChangeObjects.unsaved[sectionId][rajoiteId] || []
        ),
        currentChangeObjects
      );
      setState({ ...getState(), changeObjects: nextChangeObjects });
    },
    closeRestrictionDialog: () => ({ dispatch }) => {
      dispatch(closeRestrictionDialog());
    },
    /**
     * -------------------- DYNAMIC TEXTBOXES --------------------
     */
    createTextBoxChangeObject: (sectionId, koodiarvo, from) => ({
      getState,
      dispatch,
      setState
    }) => {
      if (sectionId) {
        const splittedSectionId = split("_", sectionId);
        const currentChangeObjects = getState().changeObjects;
        const textBoxChangeObjects = filter(
          changeObj =>
            startsWith(`${sectionId}.${koodiarvo}`, changeObj.anchor) &&
            endsWith(".kuvaus", changeObj.anchor) &&
            !startsWith(`${sectionId}.${koodiarvo}.0`, changeObj.anchor),
          concat(
            (currentChangeObjects.unsaved &&
              currentChangeObjects.unsaved[sectionId]) ||
              [],
            (currentChangeObjects.saved &&
              currentChangeObjects.saved[sectionId]) ||
              []
          ) || []
        );

        const textBoxNumber =
          length(textBoxChangeObjects) > 0
            ? reduce(
                max,
                -Infinity,
                map(
                  changeObj => parseInt(getAnchorPart(changeObj.anchor, 2), 10),
                  textBoxChangeObjects
                )
              ) + 1
            : from > 0
            ? from
            : 1;

        /**
         * Luodaan uusi muutosobjekti ja annetaan sille focus-ominaisuus,
         * jotta muutosobjektin pohjalta lomakepalvelun puolella luotava
         * kenttä olisi automaattisesti fokusoitu.
         */
        const anchorOfTextBoxChangeObj = `${sectionId}.${koodiarvo}.${textBoxNumber}.kuvaus`;
        let nextChangeObjects = assocPath(
          prepend("unsaved", splittedSectionId),
          append(
            {
              anchor: `${sectionId}.${koodiarvo}.${textBoxNumber}.kuvaus`,
              properties: {
                value: ""
              }
            },
            path(splittedSectionId, currentChangeObjects.unsaved) || []
          ),
          currentChangeObjects
        );
        dispatch(setFocusOn(anchorOfTextBoxChangeObj));
        setState({ ...getState(), changeObjects: nextChangeObjects });
      }
    },
    initializeChanges: changeObjects => ({ dispatch }) => {
      dispatch(setSavedChanges(changeObjects));
      dispatch(setLatestChanges({}));
      dispatch(removeUnderRemoval());
      dispatch(removeUnsavedChanges());
    },
    lisaaKohdennus: (
      sectionId,
      kohdennusId,
      rajoiteId,
      kohdennusindeksipolku
    ) => ({ getState, setState }) => {
      const kohdennuspolku = join(
        ".",
        map(kohdennustaso => {
          return `kohdennukset.${kohdennustaso}`;
        }, kohdennusindeksipolku)
      );

      const currentChangeObjects = getState().changeObjects;

      /**
       * Filteröidään muutosobjektit, joiden ankkuri alkaa kohdennuspolulla,
       * sekä seuraava ankkurin osa on kohdennukset
       */

      const kohdennusChangeObjects = filter(
        cObj =>
          startsWith(
            `${sectionId}_${rajoiteId}.${kohdennuspolku}`,
            cObj.anchor
          ) &&
          getAnchorPart(cObj.anchor, 1 + 2 * length(kohdennusindeksipolku)) ===
            "kohdennukset",
        concat(
          path(["unsaved", sectionId, rajoiteId], currentChangeObjects) || [],
          path(["saved", sectionId, rajoiteId], currentChangeObjects) || []
        ) || []
      );

      const nextKohdennusAnchorPart =
        length(kohdennusChangeObjects) > 0
          ? reduce(
              max,
              -Infinity,
              map(changeObj => {
                return parseInt(
                  getAnchorPart(
                    changeObj.anchor,
                    2 + 2 * length(kohdennusindeksipolku)
                  ),
                  10
                );
              }, kohdennusChangeObjects)
            ) + 1
          : 0;

      /**
       * Luodaan
       */
      const nextChangeObjects = assocPath(
        ["unsaved", sectionId, rajoiteId],
        append(
          {
            anchor: `${sectionId}_${rajoiteId}.${kohdennuspolku}.kohdennukset.${nextKohdennusAnchorPart}.kohde.A`,
            properties: {
              value: ""
            }
          },
          currentChangeObjects.unsaved[sectionId][rajoiteId] || []
        ),
        currentChangeObjects
      );
      setState({ ...getState(), changeObjects: nextChangeObjects });
    },
    removeChangeObjectByAnchor: anchor => ({ getState, setState }) => {
      const allCurrentChangeObjects = getState().changeObjects;
      const anchorParts = split("_", getAnchorPart(anchor, 0));
      const unsavedFullPath = prepend("unsaved", anchorParts);
      const changeObjects = path(unsavedFullPath, allCurrentChangeObjects);
      if (changeObjects) {
        let nextChangeObjects = assocPath(
          unsavedFullPath,
          filter(compose(not, propEq("anchor", anchor)), changeObjects),
          getState().changeObjects
        );
        nextChangeObjects = recursiveTreeShake(
          unsavedFullPath,
          nextChangeObjects
        );
        setState(assoc("changeObjects", nextChangeObjects, getState()));
      }
    },
    setChanges: (changeObjects, anchor = "") => ({
      getState,
      dispatch,
      setState
    }) => {
      const currentChangeObjects = getState().changeObjects;
      const anchorParts = split("_", anchor);

      const unsavedFullPath = prepend("unsaved", anchorParts).filter(Boolean);
      const savedFullPath = prepend("saved", anchorParts).filter(Boolean);
      const underRemovalFullPath = prepend("underRemoval", anchorParts).filter(
        Boolean
      );

      const savedByAnchor = path(savedFullPath, getState().changeObjects) || [];
      const unsavedChangeObjects = difference(changeObjects, savedByAnchor);
      const savedChangeObjects = difference(savedByAnchor, changeObjects);

      /**
       * Etsitään ankkuria käyttäen vastaavat underRemoval-tilassa olevat
       * muutokset.
       */
      const underRemovalByAnchor =
        path(underRemovalFullPath, getState().changeObjects) || [];

      /**
       * Etsitään löydetyistä muutosobjekteista ne, joita vastaavia muutos-
       * objekteja ollaan tallentamassa.
       */
      const freshNewChangeObjects = difference(
        unsavedChangeObjects,
        underRemovalByAnchor
      );

      let nextChangeObjects = assocPath(
        unsavedFullPath,
        freshNewChangeObjects,
        currentChangeObjects
      );

      nextChangeObjects = assocPath(
        underRemovalFullPath,
        savedChangeObjects,
        nextChangeObjects
      );

      /**
       * Ravistetaan muutosten puusta tyhjät objektit pois.
       **/
      nextChangeObjects = recursiveTreeShake(
        unsavedFullPath,
        nextChangeObjects,
        dispatch
      );
      nextChangeObjects = recursiveTreeShake(
        underRemovalFullPath,
        nextChangeObjects,
        dispatch
      );

      const focusWhenDeleted = path(
        ["properties", "metadata", "focusWhenDeleted"],
        last(
          sortBy(
            path(["properties", "dateOfRemoval"]),
            filter(changeObj => {
              const anchor = path(
                ["properties", "metadata", "focusWhenDeleted"],
                changeObj
              );
              return changeObj.properties.isDeleted && anchor;
            }, changeObjects)
          )
        )
      );

      console.info(changeObjects, focusWhenDeleted);

      if (focusWhenDeleted) {
        dispatch(setFocusOn(focusWhenDeleted));
      }

      dispatch(
        setLatestChanges({
          underRemoval: savedChangeObjects,
          unsaved: freshNewChangeObjects
        })
      );
      setState(assoc("changeObjects", nextChangeObjects, getState()));
    },
    setFocusOn: anchor => ({ dispatch }) => {
      dispatch(setFocusOn(anchor));
    },
    setPreviewMode: value => ({ getState, setState }) => {
      setState(assoc("isPreviewModeOn", value, getState()));
    },
    setRajoitelomakeChangeObjects: (rajoiteId, sectionId, targetSectionId) => ({
      getState,
      setState
    }) => {
      // Muutosobjektit, jotka rajoitedialogissa on tarkoitus näyttää.
      const changeObjects = getChangeObjectsByAnchorWithoutUnderRemoval(
        getState(),
        { anchor: sectionId }
      );

      const changeObjectsOfCurrentRestriction = filter(
        cObj => includes(rajoiteId, getAnchorPart(cObj.anchor, 0)),
        changeObjects
      );

      setState(
        assocPath(
          ["changeObjects", "unsaved", targetSectionId, rajoiteId],
          // Vaihdetaan ankkurien ensimmäiseksi osaksi targetSectionId:n arvo,
          // jolloin muutokset siirtyvät sen mukaiselle lomakkeelle ja
          // tallennetaan muutosobjektit tilanhallintaan.
          map(changeObj => {
            return {
              ...changeObj,
              anchor: replaceAnchorPartWith(
                changeObj.anchor,
                0,
                `${targetSectionId}_${rajoiteId}`
              )
            };
          }, changeObjectsOfCurrentRestriction),
          getState()
        )
      );
    },
    showNewRestrictionDialog: () => ({ getState, setState }) => {
      setState({ ...getState(), isRestrictionDialogVisible: true });
    },
    showAlirajoitedialogi: () => ({ getState, setState }) => {
      setState({ ...getState(), isAlirajoitedialogiVisible: true });
    },
    suljeAlirajoitedialogi: () => ({ dispatch }) => {
      dispatch(suljeAlirajoitedialogi());
    }
  },
  name: "Muutokset"
});

const getChangeObjectsByKeyAndAnchor = (key, anchor, changeObjects = {}) => {
  return path(prepend(key, split("_", anchor)), changeObjects) || [];
};

const getAllChangeObjectsByKeyAnchor = (state, { anchor }) => {
  const { changeObjects } = state;
  return {
    saved: getChangeObjectsByKeyAndAnchor("saved", anchor, changeObjects),
    underRemoval: getChangeObjectsByKeyAndAnchor(
      "underRemoval",
      anchor,
      changeObjects
    ),
    unsaved: getChangeObjectsByKeyAndAnchor("unsaved", anchor, changeObjects)
  };
};

const getChangeObjectsByAnchorWithoutUnderRemoval = (state, { anchor }) => {
  const { changeObjects } = state;
  const saved = reject(
    isNil,
    flatten(
      values(getChangeObjectsByKeyAndAnchor("saved", anchor, changeObjects))
    )
  );
  const underRemoval = reject(
    isNil,
    flatten(
      values(
        getChangeObjectsByKeyAndAnchor("underRemoval", anchor, changeObjects)
      )
    )
  );
  const unsaved = reject(
    isNil,
    flatten(
      values(getChangeObjectsByKeyAndAnchor("unsaved", anchor, changeObjects))
    )
  );
  const mergedChanges = pipe(
    groupBy(prop("anchor")),
    values,
    map(groupedChanges => mergeAll(groupedChanges))
  )(concat(saved, unsaved));
  return difference(mergedChanges, underRemoval);
};

const getLatestChangesByAnchorByKey = (state, { anchor }) => {
  const { latestChanges } = state;
  return {
    underRemoval: getLatestChangesByAnchor(anchor, latestChanges.underRemoval),
    unsaved: getLatestChangesByAnchor(anchor, latestChanges.unsaved)
  };
};

export const useLomake = createHook(Store);

export const useLatestChanges = createHook(Store, {
  selector: state => state.latestChanges
});

export const useLatestChangesByAnchor = createHook(Store, {
  selector: getLatestChangesByAnchorByKey
});

export const useChangeObjectsByAnchor = createHook(Store, {
  selector: getAllChangeObjectsByKeyAnchor
});

export const useChangeObjectsByAnchorWithoutUnderRemoval = createHook(Store, {
  selector: getChangeObjectsByAnchorWithoutUnderRemoval
});

export const useChangeObjectsByMultipleAnchorsWithoutUnderRemoval = createHook(
  Store,
  {
    selector: (state, { anchors }) => {
      return mergeAll(
        map(anchor => {
          return {
            [anchor]: getChangeObjectsByAnchorWithoutUnderRemoval(state, {
              anchor
            })
          };
        }, anchors)
      );
    }
  }
);

export const useChangeObjects = createHook(Store);

export const useUnsavedChangeObjects = createHook(Store, {
  selector: state => state.changeObjects.unsaved
});

export const useUnderRemovalChangeObjects = createHook(Store, {
  selector: state => state.changeObjects.underRemoval
});

export const MuutoksetContainer = createContainer(Store, {
  onInit: () => ({ setState }, initialState) => {
    setState(initialState);
  }
});
