import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  getAddPeopleForm,
  getKuljettajienJatkokoulutuslomake
} from "../../../../../services/lomakkeet/perustelut/koulutukset";
import CategorizedListRoot from "../../../../02-organisms/CategorizedListRoot";
import * as R from "ramda";

const defaultProps = {
  changeObjects: [],
  isReadOnly: false
};

const KuljettajienJatkokoulutuslomake = ({
  changeObjects = defaultProps.changeObjects,
  isReadOnly = defaultProps.isReadOnly,
  onChangesUpdate
}) => {
  const sectionId = "perustelut_koulutukset_kuljettajakoulutukset";
  const [lomake, setLomake] = useState(getKuljettajienJatkokoulutuslomake());
  const [peopleForms, setPeopleForms] = useState([]);
  const [changes, setChanges] = useState(null);

  useEffect(() => {
    const addPeopleForm = () => {
      setPeopleForms(prevForms => {
        return R.insert(-1, getAddPeopleForm(prevForms.length + 1, isReadOnly))(
          prevForms
        );
      });
    };

    setLomake(
      getKuljettajienJatkokoulutuslomake(addPeopleForm, isReadOnly, peopleForms)
    );
  }, [isReadOnly, peopleForms]);

  useEffect(() => {
    if (!changes) {
      /**
       * At this point we have some changes given to this component by props. Some
       * of the changes are related to the people form (Opettajien kelpoisuus ja
       * työkokemus) so we have to show as many people forms as what user has made
       * changes to.
       */
      const peopleFormAnchors = R.map(
        R.compose(
          R.split("."),
          R.prop("anchor")
        ),
        R.filter(
          R.compose(
            R.contains("opettajien-kelpoisuus-ja-tyokokemus.lisatyt-henkilot"),
            R.prop("anchor")
          )
        )(changeObjects)
      );
      if (peopleFormAnchors.length) {
        /**
         * People form count is calculated using the anchors related to the people
         * forms.
         */
        const peopleFormCount = Math.max(
          ...R.map(
            R.compose(
              Number,
              R.view(R.lensIndex(4))
            ),
            peopleFormAnchors
          )
        );

        /**
         * Let's add the needed people forms so that we can show the changes user
         * has made on them.
         */
        R.forEach(() => {
          setPeopleForms(prevForms => {
            return R.insert(
              -1,
              getAddPeopleForm(prevForms.length + 1, isReadOnly)
            )(prevForms);
          });
        }, new Array(peopleFormCount));
      }
    }
    setChanges(changeObjects);
  }, [changes, changeObjects, isReadOnly]);

  return (
    <React.Fragment>
      {changes ? (
        <CategorizedListRoot
          anchor={sectionId}
          categories={lomake}
          changes={changes}
          onUpdate={onChangesUpdate}
          showCategoryTitles={true}
        />
      ) : null}
    </React.Fragment>
  );
};

KuljettajienJatkokoulutuslomake.propTypes = {
  changeObjects: PropTypes.array,
  onChangesUpdate: PropTypes.func
};

export default KuljettajienJatkokoulutuslomake;
