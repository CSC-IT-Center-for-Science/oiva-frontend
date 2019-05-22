import _ from 'lodash'
import React, { Component } from 'react'
import styled from 'styled-components'
import { LUPA_VOIMASSAOLO_20181231_ASTI } from "../modules/constants"
import { LUPA_VOIMASSAOLO_20180731_ASTI } from "../modules/constants"
import { LUPA_VOIMASSAOLO_20180801_LUKIEN } from "../modules/constants"
import { LUPA_VOIMASSAOLO_20190101_LUKIEN } from "../modules/constants"




const TutkintoWrapper = styled.div`
  margin: 6px 0 6px 30px;
  font-size: 15px;
  display: flex;
  position: relative;
`

const Koodi = styled.span`
  flex: 1;
`

const Nimi = styled.span`
  flex: 6;
`

const Pvm = styled.span`
  flex: 2;
`

const RajoiteStyle = styled.div`
  margin-left: 125px;
`

const Rajoite = (props) => {
  const { koodi, nimi, koodisto } = props
  if(koodisto==='kieli') return ''
  return (
    <RajoiteStyle>lukuun&nbsp;ottamatta:&nbsp;{koodi}&nbsp;{nimi}</RajoiteStyle>
  )
}

class Tutkinto extends Component {
  // constructor(props) {
  //   super(props)
  //   // this.handleOnChange = this.handleOnChange.bind(this)
  // }

  render() {
    const { koodi, nimi, rajoitteet, renderCheckbox } = this.props


    return (
      <div>
        <TutkintoWrapper>
          {renderCheckbox
            ? <input type="checkbox" ref="tutkintoInput" defaultValue="off" onChange={this.handleInputOnChange.bind(this)} />
            : null
          }
          <Koodi>{koodi}</Koodi>
          <Nimi>{nimi}</Nimi>
          <Pvm>{ this.checkDateString(koodi) }</Pvm>
        </TutkintoWrapper>
        {rajoitteet ? _.map(rajoitteet, (rajoite, i) => <Rajoite {...rajoite} key={i}/>) : null}
      </div>
    )
  }

  getInputValue() {
    return this.refs.tutkintoInput.checked
  }

  handleInputOnChange() {
    const { koodi, nimi, maaraysId } = this.props
    const val = this.getInputValue()

    if (val === true) {
      this.props.removeTutkinto({ koodi, nimi, maaraysId })
    } else {
      this.props.undoRemoveTutkinto({ koodi, nimi, maaraysId })
    }

  }

  checkDateString(koodi) {

    if(_.includes(LUPA_VOIMASSAOLO_20181231_ASTI, koodi)) {
      return "31.12.2018 asti";
    }
      if(_.includes(LUPA_VOIMASSAOLO_20180731_ASTI, koodi)) {
          return "31.07.2018 asti";
      }
      if(_.includes(LUPA_VOIMASSAOLO_20180801_LUKIEN, koodi)) {
          return "01.08.2018 lukien";
      }
      if(_.includes(LUPA_VOIMASSAOLO_20190101_LUKIEN, koodi)) {
          return "01.01.2019 lukien";
      }

  }

}

export default Tutkinto
