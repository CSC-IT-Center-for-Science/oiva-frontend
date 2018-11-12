import React, { Component } from 'react'
import 'styled-components'
import styled from "styled-components"
import Select from '../../../../../../modules/Select'

import { MUUTOS_WIZARD_TEKSTIT } from "../modules/constants"
import { handleMuutosperusteluSelectChange } from "../modules/muutosperusteluUtil"

const LiiteSelectWrapper = styled.div`
  margin-bottom: 20px;
`

const SelectWrapper = styled.div`
  width: 320px;
`

class LiiteKategoriaSelect extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedOption: props.muutosperustelukoodiarvo
    }
  }

  handleChange(selectedOption) {
    this.setState({ selectedOption })
    const { muutokset, fields, muutos } = this.props
    handleMuutosperusteluSelectChange(muutokset, fields, muutos, selectedOption)
  }

  render() {
    const { selectedOption } = this.state
    const { muutos } = this.props
    const { koodiarvo, koodisto } = muutos

    // kategoriat hardcode
    const options = [
      { value: 'Yleinen liite', label: 'Yleinen liite' },
      { value: 'Arviointikriteerit', label: 'Arviointikriteerit'},
      { value: 'Salainen dokumentti', label: 'Salainen dokumentti' },
      { value: 'Koko hakemusta koskeva liite (esim. hallituksen pöytäkirja)', label: 'Koko hakemusta koskeva liite (esim. hallituksen pöytäkirja)' },
      { value: 'Allekirjoitettu pöytäkirja (pakollinen)', label: 'Allekirjoitettu pöytäkirja (pakollinen)' },
    ];

    return (
      <LiiteSelectWrapper>
        <div>{MUUTOS_WIZARD_TEKSTIT.LIITE_KATEGORIA.FI}</div>
        <SelectWrapper>
          <Select
            name={`select-muutosperustelu-${koodisto}-${koodiarvo}`}
            value={selectedOption}
            options={options}
            onChange={this.handleChange.bind(this)}
            placeholder="Valitse liitteelle kategoria..."
          />
        </SelectWrapper>
      </LiiteSelectWrapper>
    )
  }
}

export default LiiteKategoriaSelect
