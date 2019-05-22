import React from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'

import { COLORS, MEDIA_QUERIES } from "../../../modules/styles"

const LinkBoxStyle = styled.div`
  margin: 50px 0 0 20px;
  background-color: ${COLORS.OIVA_GREEN};
  color: ${COLORS.WHITE};
  display: inline-block;
  padding: 20px 40px;
  text-transform: uppercase;
  font-weight: bold;
  letter-spacing: 0.05em;
  
  @media ${MEDIA_QUERIES.MOBILE} {
    margin: 15px;
  }
`

const LinkBox = ({ to, text }) => {
  return (
    <Link to={to}>
      <LinkBoxStyle>{text}</LinkBoxStyle>
    </Link>
  )
}

LinkBox.propTypes = {
  to: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired
}

export default LinkBox
