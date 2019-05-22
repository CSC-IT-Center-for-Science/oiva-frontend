import React, { Component } from 'react'
import { Field, formValueSelector } from 'redux-form'
import styled from 'styled-components'
import { COLORS } from "../../../../modules/styles"
import { PAATOS_TILAT, VALMISTELU_FIELDS } from "../modules/valmisteluConstants"
import { getIndex} from "../modules/muutosUtil"

const PaatosWrapper = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 3px solid ${COLORS.BORDER_GRAY};
  padding: 0 110px 30px 60px;
  margin: 10px 40px 20px 40px;
  
  textarea {
    width: 100%;
    max-width: 100%;
    font-size: 14px;
    border: 1px solid ${COLORS.BORDER_GRAY};
    
    &:focus {
      outline: none;
    }
  }
`

const PaatosTopArea = styled.div`
  margin-bottom: 20px;
`

const Indent = styled.div`
  margin-left: 40px;
`

const PaatosLuonnos = styled.div`
  background-color: ${COLORS.BG_GRAY};
  padding: 10px 20px;
`

const RadioWrapper = styled.div`
  display: flex;
  margin-bottom: 20px;
`

class Paatos extends Component {
  componentWillMount() {
    const { muutosperustelut } = this.props

    if (muutosperustelut && !muutosperustelut.fetched) {
      this.props.fetchMuutosperustelut()
    }
  }

  render() {
    const { muutokset, koodiarvo, fields, perusteluteksti, muutosperusteluId } = this.props

    return (
      <PaatosWrapper>
        <p>Hakijan perustelut</p>

        <PaatosTopArea>
          <Indent>
            <p>{muutosperusteluId !== undefined ? 'asd' : 'Tässä on hakijan valitsema muutosperustelu'}</p>
            <p>{perusteluteksti}</p>
          </Indent>
        </PaatosTopArea>

        <PaatosLuonnos>
          <p>Päätösluonnos</p>
          <RadioWrapper>
            <label className="control control-radio">
              <Field
                name={VALMISTELU_FIELDS.PAATOS}
                component="input"
                type="radio"
                value={PAATOS_TILAT.HYVAKSYTTY}
                
              />
              <div className="control_indicator"></div>
              Hyväksy haettu
            </label>
            <label className="control control-radio">
              <Field
                name={VALMISTELU_FIELDS.PAATOS}
                component="input"
                type="radio"
                value={PAATOS_TILAT.HYLATTY}
              />
              <div className="control_indicator"></div>
              Haettua ei hyväksytä
            </label>
            <label className="control control-radio">
              <Field
                name={VALMISTELU_FIELDS.PAATOS}
                component="input"
                type="radio"
                value={PAATOS_TILAT.TAYDENNETTAVA}
              />
              <div className="control_indicator"></div>
              Täydennettävä
            </label>
          </RadioWrapper>

          <div>
            <p>Perustelut</p>
            <textarea
              rows="5"
              // defaultValue={perusteluteksti !== null ? perusteluteksti : undefined}
              onBlur={(e) => {
                const i = getIndex(muutokset, koodiarvo)
                let obj = fields.get(i)
                obj.perustelu = e.target.value
                fields.remove(i)
                fields.insert(i, obj)
              }}
            />
          </div>


        </PaatosLuonnos>

      </PaatosWrapper>
    )
  }
}

export default Paatos