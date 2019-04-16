import React, { Component } from "react";
import styled from "styled-components";

import { MUUTOS_WIZARD_TEKSTIT } from "../modules/constants";
import { getMuutosperusteluEditIndex } from "../modules/muutosperusteluUtil";

const PerusteluSelectWrapper = styled.div`
  margin-bottom: 20px;
`;

class PerusteluSelect extends Component {
  handleChange(e, selectedOption) {
    console.log(selectedOption);
    const { muutokset, fields, muutos } = this.props;

    const i = getMuutosperusteluEditIndex(muutokset, muutos.koodiarvo);
    if (i !== undefined) {
      let obj = fields.get(i);
      fields.remove(i);

      if (obj.muutosperustelukoodiarvo.length === 0) {
        obj.muutosperustelukoodiarvo.push(selectedOption);
      } else {
        let muutosperustelut = obj.muutosperustelukoodiarvo.filter(v => {
          return v !== selectedOption;
        });
        if (muutosperustelut.length === obj.muutosperustelukoodiarvo.length) {
          // Lisää uusi perustelu
          obj.muutosperustelukoodiarvo.push(selectedOption);
        } else {
          // Poista aiemmin valittu perustelu
          obj.muutosperustelukoodiarvo = muutosperustelut;
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
