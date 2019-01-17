import React from 'react'
import { Link } from 'react-router-dom'

import { parseLocalizedField } from "../../../modules/helpers"
import { Td, Tr } from "../../../modules/Table"

const Lupa = (props) => {
  const { lupa } = props
  const { jarjestajaYtunnus } = lupa
  const maakunta = parseLocalizedField(lupa.jarjestaja.maakuntaKoodi.metadata)
  const jarjestajaNimi = lupa.jarjestaja.nimi.fi || lupa.jarjestaja.nimi.sv || ''

  return (
    <Tr>
      <Link ytunnus={jarjestajaYtunnus} to={{pathname: "/jarjestajat/" + jarjestajaYtunnus + "/jarjestamislupa", ytunnus: jarjestajaYtunnus}}>
        <Td flex="4" className="lupa-jarjestaja">{jarjestajaNimi}</Td>
        <Td className="lupa-maakunta">{maakunta}</Td>
      </Link>
    </Tr>
  )
}

export default Lupa
