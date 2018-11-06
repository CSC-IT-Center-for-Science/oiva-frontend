import React from 'react'
import Moment from 'react-moment'
import { Link } from 'react-router-dom'

import { parseLocalizedField } from "../../../modules/helpers"
import { API_BASE_URL, LUPA_EXCEPTION_PATH } from "../../../modules/constants"
import { LUPA_LISAKOULUTTAJAT } from "../modules/constants"
import { Th, Tr } from "../../../modules/Table"
import pdf from 'static/images/icon-pdf-small.png'

const Lupa = (props) => {
  const { lupa } = props
  const { diaarinumero, jarjestajaYtunnus, alkupvm} = lupa
  const maakunta = parseLocalizedField(lupa.jarjestaja.maakuntaKoodi.metadata)
  const jarjestajaNimi = lupa.jarjestaja.nimi.fi || lupa.jarjestaja.nimi.sv || ''

  let pdfLink = (
    <Th alignItems="center" className="lupa-pdf">
      <img src={pdf} alt="pdf" title="pdf"/>
      <a href={`${API_BASE_URL}/pdf/${diaarinumero}`} target="_blank">
        <Moment format="DD.MM.YYYY">{alkupvm}</Moment>
      </a>
    </Th>
  )

  // Luvan poikkeuskäsittely erikoisluville (17kpl)
  const lupaException = LUPA_LISAKOULUTTAJAT[jarjestajaYtunnus]

  if (lupaException) {
    const { pdflink, pvm} = lupaException

    pdfLink = (
      <Th alignItems="center" className="lupa-pdf">
        <img src={pdf} alt="pdf" title="pdf"/>
        <a href={`${LUPA_EXCEPTION_PATH}${pdflink}`} target="_blank">
          <Moment format="DD.MM.YYYY">{pvm}</Moment>
        </a>
      </Th>
    )
  }

  return (
    <Tr>
      <Th flex="3" className="lupa-jarjestaja"><Link ytunnus={jarjestajaYtunnus} to={{pathname: "/jarjestajat/" + jarjestajaYtunnus + "/jarjestamislupa", ytunnus: jarjestajaYtunnus}}>{jarjestajaNimi}</Link></Th>
      <Th className="lupa-maakunta">{maakunta}</Th>
      {pdfLink}
    </Tr>
  )
}

export default Lupa
