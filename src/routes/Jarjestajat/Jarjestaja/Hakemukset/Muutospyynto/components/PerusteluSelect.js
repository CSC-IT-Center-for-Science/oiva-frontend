import _ from "lodash";
import React, { Component } from "react";
import styled from "styled-components";

import { MUUTOS_WIZARD_TEKSTIT } from "../modules/constants";
import { getMuutosperusteluEditIndex } from "../modules/muutosperusteluUtil";

const PerusteluSelectWrapper = styled.div`
  margin-bottom: 20px;
`;

class PerusteluSelect extends Component {
  handleChange(e, selectedOption) {
    const { muutokset, fields, muutos } = this.props;

    const i = getMuutosperusteluEditIndex(muutokset, muutos.koodiarvo);
    if (i !== undefined) {
      let obj = fields.get(i);
      fields.remove(i);

      if (obj.meta.muutosperustelukoodiarvo.length === 0) {
        obj.meta.muutosperustelukoodiarvo.push(selectedOption);
      } else {
        let muutosperustelut = obj.meta.muutosperustelukoodiarvo.filter(v => {
          return v !== selectedOption;
        });
        if (muutosperustelut.length === obj.meta.muutosperustelukoodiarvo.length) {
          // Lisää uusi perustelu
          obj.meta.muutosperustelukoodiarvo.push(selectedOption);
        } else {
          // Poista aiemmin valittu perustelu
          obj.meta.muutosperustelukoodiarvo = muutosperustelut;
        }
      }

      fields.insert(i, obj);
    }
  }

  render() {
    const { muutosperustelut, muutos } = this.props;

    return (
      <PerusteluSelectWrapper>
        <h4>{MUUTOS_WIZARD_TEKSTIT.TAUSTA_SYYT_OTSIKKO.FI}</h4>
        <div>{MUUTOS_WIZARD_TEKSTIT.TAUSTA_SYYT_TARKENNE.FI}</div>

        {muutosperustelut.map(m => {
          const valittu = _.includes(
            muutos.meta.muutosperustelukoodiarvo,
            m.koodiArvo
          );

          return (
            <div key={m.koodiArvo}>
              <input
                name={`muutosperustelu-${muutos.koodiarvo}-${
                  m.koodisto.koodistoUri
                }-${m.koodiArvo}`}
                id={`muutosperustelu-${muutos.koodiarvo}-${
                  m.koodisto.koodistoUri
                }-${m.koodiArvo}`}
                type="checkbox"
                value={m.koodiArvo}
                checked={valittu}
                onChange={e => {
                  this.handleChange(e, m.koodiArvo);
                }}
              />
              <label
                htmlFor={`muutosperustelu-${muutos.koodiarvo}-${
                  m.koodisto.koodistoUri
                }-${m.koodiArvo}`}
              >
                {m.label}
              </label>
            </div>
          );
        })}
      </PerusteluSelectWrapper>
    );
  }
}

export default PerusteluSelect;
