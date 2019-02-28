import React, { Component } from 'react'
import styled from 'styled-components'
import { getIndex } from "../modules/muutosUtil"
import { COLORS } from "../../../../../../modules/styles"
import { MUUTOS_TYPES } from "../modules/uusiHakemusFormConstants"
import { KOODISTOT } from "../../../modules/constants"
import { parseLocalizedField } from "../../../../../../modules/helpers"

import PerusteluSelect from './PerusteluSelect'
import PerusteluOppisopimus from './PerusteluOppisopimus'
import PerusteluVaativa from './PerusteluVaativa'
import PerusteluTyovoima from './PerusteluTyovoima'
import PerusteluVankila from './PerusteluVankila'
import PerusteluKuljettajaPerus from './PerusteluKuljettajaPerus'
import PerusteluKuljettajaJatko from './PerusteluKuljettajaJatko'

import LiiteKategoriaSelect from './LiiteKategoriaSelect'

const PerusteluWrapper = styled.div`
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

const PerusteluTopArea = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 10px;
`

const LiiteTopArea = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 10px;
`

class Perustelu extends Component {
  componentWillMount() {
    const { muutosperustelut, vankilat, ELYkeskukset } = this.props

    if (muutosperustelut && !muutosperustelut.fetched) {
      this.props.fetchMuutosperustelut()
    }

    if (vankilat && !vankilat.fetched) {
      this.props.fetchVankilat()
    }

    if (ELYkeskukset && !ELYkeskukset.fetched) {
      this.props.fetchELYkeskukset()
    }

  }

  render() {

    const { helpText, muutos, muutokset, koodiarvo, fields, perusteluteksti, muutosperustelukoodiarvo, muutosperustelut, vankilat, ELYkeskukset } = this.props
    const { perusteluteksti_oppisopimus, perusteluteksti_vaativa, perusteluteksti_tyovoima, perusteluteksti_vankila } = this.props
    const { perusteluteksti_kuljetus_perus, perusteluteksti_kuljetus_jatko, filename, file} = this.props
    const { koodisto, type, metadata } = muutos
    const kasite = parseLocalizedField(metadata, 'FI', 'kasite');

    // lisälomakkeet
    // tulevat vain lisäyksille tai muutoksille.
    // koodisto on oiva muut

    // laajennettu oppisopimus

    if (koodisto == KOODISTOT.OIVA_MUUT && kasite === "laajennettu" && (type === MUUTOS_TYPES.ADDITION )) {
      return (
        <PerusteluWrapper>
          <PerusteluOppisopimus
            muutosperustelut={muutosperustelut}
            perusteluteksti_oppisopimus={perusteluteksti_oppisopimus}
            fields={fields}
            muutokset={muutokset}
            koodiarvo={koodiarvo}
          />
        </PerusteluWrapper>
      )
   }

    // vaativa erityinen tuki
    // pitääkö tulla vain yksi perustelu-lomake, vaikka kaikki kolme eri vaihtoehtoa on valittu: ohjeistettu valitsemaan vain yksi
    if (koodisto == KOODISTOT.OIVA_MUUT && (kasite === "vaativa_1" || kasite === "vaativa_2" ) && (type === MUUTOS_TYPES.ADDITION || type === MUUTOS_TYPES.CHANGE )) {
      return (
        <PerusteluWrapper>
          <PerusteluVaativa
            muutosperustelut={muutosperustelut}
            perusteluteksti_vaativa={perusteluteksti_vaativa}
            fields={fields}
            muutokset={muutokset}
            koodiarvo={koodiarvo}
            muutos={muutos}
          />
        </PerusteluWrapper>
      )
    }

    // Työvoimakoulutus
    // lisäykset ja muutokset tässä, mikäli oikeus poistetaan, tulee se normiperusteluilla
    if (koodisto == KOODISTOT.OIVA_TYOVOIMAKOULUTUS  && koodiarvo == 1 && (type === MUUTOS_TYPES.ADDITION || type === MUUTOS_TYPES.CHANGE )) {
      return (
        <PerusteluWrapper>
          <PerusteluTyovoima
            muutosperustelut={muutosperustelut}
            muutosperustelukoodiarvo={muutosperustelukoodiarvo}
            perusteluteksti_tyovoima={perusteluteksti_tyovoima}
            fields={fields}
            muutokset={muutokset}
            koodiarvo={koodiarvo}
            muutos={muutos}
            ELYkeskukset={ELYkeskukset.ELYkeskusList}
          />
        </PerusteluWrapper>
      )
    }

    // Vankilakoulutus
    // lisäykset ja muutokset tässä, mikäli oikeus poistetaan, tulee se normiperusteluilla
    if (koodisto == KOODISTOT.OIVA_MUUT && koodiarvo == 5 && (type === MUUTOS_TYPES.ADDITION || type === MUUTOS_TYPES.CHANGE )) {
      return (
        <PerusteluWrapper>
          <PerusteluVankila
            muutosperustelut={muutosperustelut}
            perusteluteksti_vankila={perusteluteksti_vankila}
            fields={fields}
            muutokset={muutokset}
            koodiarvo={koodiarvo}
            muutos={muutos}
            vankilat={vankilat.vankilaList}
          />
        </PerusteluWrapper>
      )
    }

    // Kuljettajakoulutus - perustaso
    // lisäykset ja muutokset tässä, mikäli oikeus poistetaan, tulee se normiperusteluilla
    if (koodisto == KOODISTOT.KULJETTAJAKOULUTUS && koodiarvo == 1 && (type === MUUTOS_TYPES.ADDITION || type === MUUTOS_TYPES.CHANGE )) {
      return (
        <PerusteluWrapper>
          <PerusteluKuljettajaPerus
            muutosperustelut={muutosperustelut}
            muutosperustelukoodiarvo={muutosperustelukoodiarvo}
            perusteluteksti_kuljetus_perus={perusteluteksti_kuljetus_perus}
            fields={fields}
            muutokset={muutokset}
            koodiarvo={koodiarvo}
            muutos={muutos}
          />
        </PerusteluWrapper>
      )
    }

    // Kuljettajakoulutus - jatko
    // lisäykset ja muutokset tässä, mikäli oikeus poistetaan, tulee se normiperusteluilla
    if (koodisto == KOODISTOT.KULJETTAJAKOULUTUS  && koodiarvo == 2 && (type === MUUTOS_TYPES.ADDITION || type === MUUTOS_TYPES.CHANGE )) {
      return (
        <PerusteluWrapper>
          <PerusteluKuljettajaJatko
            muutosperustelut={muutosperustelut}
            muutosperustelukoodiarvo={muutosperustelukoodiarvo}
            perusteluteksti_kuljetus_jatko={perusteluteksti_kuljetus_jatko}
            fields={fields}
            muutokset={muutokset}
            koodiarvo={koodiarvo}
            muutos={muutos}
          />
        </PerusteluWrapper>
      )
    }

    return (
      <PerusteluWrapper>
        <PerusteluSelect
          muutosperustelukoodiarvo={muutosperustelukoodiarvo}
          muutosperustelut={muutosperustelut.muutosperusteluList}
          muutos={muutos}
          muutokset={muutokset}
          fields={fields}
        />
        <PerusteluTopArea>
          <span>{helpText}</span>
          <span>Ohje</span>
        </PerusteluTopArea>
        <textarea
          rows="5"
          defaultValue={perusteluteksti !== null ? perusteluteksti : undefined}
          onBlur={(e) => {
            const i = getIndex(muutokset, koodiarvo)
            let obj = fields.get(i)
            obj.meta.perusteluteksti = e.target.value
            fields.remove(i)
            fields.insert(i, obj)
          }}
        />
        <LiiteTopArea>Lisää muutokselle liite:</LiiteTopArea>
        <div>
          <input
            type="file"
            defaultValue={file !== null ? file : undefined}
            onBlur={(e) => {
              const i = getIndex(muutokset, koodiarvo)
              let obj = fields.get(i)
              obj.file = e.target
              fields.remove(i)
              fields.insert(i, obj)
            }}/>

        </div>
        <div>
          <input type="text"
                 placeholder="Anna liitteelle nimi (valinnainen)..."
                 defaultValue={filename !== null ? filename : undefined}
                 onBlur={(e) => {
                   const i = getIndex(muutokset, koodiarvo)
                   let obj = fields.get(i)
                   obj.filename = e.target.value
                   fields.remove(i)
                   fields.insert(i, obj)
                 }}/>
        </div>
        <LiiteKategoriaSelect
          muutosperustelukoodiarvo={muutosperustelukoodiarvo}
          muutosperustelut={muutosperustelut.muutosperusteluList}
          muutos={muutos}
          muutokset={muutokset}
          fields={fields}
        />
      </PerusteluWrapper>
    )
  }
}

export default Perustelu
