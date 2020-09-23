import React, { Component } from 'react'
import styled from 'styled-components'


const TutkintoWrapper = styled.div`
  margin: 6px 0 6px 30px;
  font-size: 16px;
  display: flex;
  position: relative;
`

const Koodi = styled.span`
  flex: 1;
`

const Nimi = styled.span`
  flex: 4;
`

class Tutkintokieli extends Component {

    render() {

        const { tutkintokoodi, nimi } = this.props

        return (
            <div>
                <TutkintoWrapper>
                    <Koodi>{tutkintokoodi}</Koodi>
                    <Nimi>{nimi}</Nimi>
                </TutkintoWrapper>
            </div>
        )
    }
}

export default Tutkintokieli
