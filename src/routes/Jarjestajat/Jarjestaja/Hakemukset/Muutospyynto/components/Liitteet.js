import React, { Component } from 'react'
import styled from 'styled-components'
import { COLORS } from "../../../../../../modules/styles"
import { FaRegFile, FaFile, FaTimes, FaLock } from 'react-icons/fa';
import { HAKEMUS_VIRHE, HAKEMUS_OTSIKOT, HAKEMUS_VIESTI } from "../modules/uusiHakemusFormConstants"
import Liite from './Liite'
import { getIndex } from "../modules/muutosUtil"
import Modal from 'react-modal'
import { modalStyles, ModalButton, ModalText, Content } from "./ModalComponents"

const Error = styled.div`
  color: ${COLORS.OIVA_RED};
  margin-bottom: 8px;
  min-height: 20px;
`
// const Message = styled.div`
//   color: ${COLORS.OIVA_GREEN};
//   margin-bottom: 8px;
// `
const Checkbox = styled.div`
  width: 20px;
  position: relative;
  margin: 6px 10px 0 10px;
  
  label {
    width: 20px;
    height: 20px;
    cursor: pointer;
    position: absolute;
    top: -3px;
    left: 0;
    background: white;
    border-radius: 0;
    border: 1px solid ${COLORS.OIVA_GREEN};
    display: flex;
    justify-content: center;
    align-items: center;
    padding-bottom: 2px;
    
    &:hover {
      &:after {
        border-color: ${COLORS.OIVA_GREEN};
        opacity: 0.5;
      }
    }
  }
  input[type=checkbox] {
    visibility: hidden;

    &:checked + label {
      color: ${COLORS.OIVA_GREEN};
      &:hover {
        &:after {
          background: rgba(90, 138, 112, 0.0);
        }
      }
    }
    
    &:checked + label:after {
      opacity: 1;
    }
    
    &:checked + label:hover {
      &:after {
        border-color: white;
        opacity: 1;
      }
    }
  }
`
const AttachmentWrapper = styled.div`
  &.intend {
    margin-left: 30px;
  }
`
const LiiteListItem = styled.div`
  font-size: 14px;
  display: flex;
  justify-content: stretch;
  align-items: center;
  width: 100%;
  padding: 2px;
  button {
    background-color: transparent;
    border: 0;
    height: 24px;
    width: 24px;
    cursor: cursor;
    &:hover {
      color: ${props => props.disabled ? COLORS.WHITE : props.bgColor ? props.bgColor : COLORS.WHITE};
      background-color: ${props => props.disabled ? COLORS.LIGHT_GRAY : props.textColor ? props.textColor : COLORS.OIVA_GREEN};
      ${props => props.disabled ? 'cursor: not-allowed;' : null}
      cursor: pointer;
    }
  }
  svg {
    margin: 0 0 -2px 0;
  }
  input {
    min-width: 300px;
    height: 24px;
    font-size: 14px;
    flex: 1;
    margin: 0 8px 0 4px;
    padding: 0 8px 0 4px;
  }
  .name {
    flex: 1;
    margin-left: 8px;
  }
  .type {
    min-width: 40px;
    text-align: right;
  }
  .size {
    min-width: 70px;
    text-align: right;
  }
  &:hover {
    background-color: ${COLORS.OIVA_TABLE_HOVER_COLOR};
  }
`
export const Input = styled.input`
  font-size: 15px;
  padding: 8px 16px;
  width: 320px;
  margin: 10px 10px 10px 0;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  
  &:focus {
    outline: none;
  }
`

class Liiteet extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fileError: false,
      fileAdded: "",
      isNameModalOpen: false,
      fileName: "",
      liite: {},
      liitteetObj: {},
      nameMissing: false
    }
  }

  openNameModal = () => {
    this.setState( {nameMissing: false })
    this.setState({ isNameModalOpen: true });
  }

  afterOpenNamneModal = () => {
  }

  closeNameModal = () => {
    this.setState({ isNameModalOpen: false })
  }

  render() {
    const { muutokset, fields, koodiarvo, paikka } = this.props

    let liite = {};
    let liitteetObj = {};
    let index = 0;

    const addAttachment = (e, name) => {
      if (this.state.fileName || name) {
        this.setState( {nameMissing: false })
        this.closeNameModal();
        liite = this.state.liite;
        name ? liite.nimi = name : liite.nimi = this.state.fileName;
        this.setState( {liite: liite });
        if (koodiarvo) {
          this.state.liitteetObj.liitteet.push(liite);
          fields.remove(index);
          fields.insert(index, this.state.liitteetObj);
        } else {
          if (!fields.liitteet) {
            fields.liitteet = [];
          }
          fields.liitteet.push(liite);
        }
        this.setState({fileAdded: liite.nimi })
      } else this.setState( {nameMissing: true })
    }

    const setAttachment = e => {

      this.setState({fileError: false});
      this.setState({fileAdded: ""});

      if (e.target.files.length === 0) return;

      console.log("File selected");

      const type = e.target.files[0].name.split('.').pop().toLowerCase();

      // Rajoitetaan max kooksi 25MB ja vain pdf, word, excel, jpeg ja gif on sallittuja
      if (e.target.files[0].size <= 26214400 && 
          ['pdf', 'doc', 'txt', 'docx', 'xls', 'xlsx', 'xlsm', 'jpg', 'jpeg', 'jpe', 'jfif', 'gif'].includes(type)) {
  
        if (koodiarvo) {
          index = getIndex(muutokset, koodiarvo);
          liitteetObj = fields.get(index);
          if (!liitteetObj) return;
          if (!liitteetObj.liitteet) {
            liitteetObj.liitteet = []
          }
        }
    
        liite.tiedostoId = e.target.files[0].name+"-"+Math.random();
        liite.kieli = "fi";
        liite.tyyppi = type;
        liite.nimi = e.target.files[0].name.split('.')[0].toLowerCase();
        liite.tiedosto = e.target.files[0];
        liite.koko = e.target.files[0].size;
        liite.removed = false;
        liite.salainen = false;
        liite.paikka = paikka;
        liite.new = true;

        this.setState( {liite: liite} );
        this.setState( {liitteetObj: liitteetObj} );
        this.setState( {fileName: liite.nimi} );

        this.openNameModal();

      } else return (
        this.setState({fileError: true })
      )
    }

    const removeAttachment = (e, tiedostoId, uuid) => {
      e.preventDefault();
      this.setState({fileError: false});
      this.setState({fileAdded: ""});
      let obj = undefined;
      let i = 0;
      if (koodiarvo) {
        i = getIndex(muutokset, koodiarvo);
        obj = fields.get(i);
        obj.liitteet.map( (liite, index) => {
          if ( (tiedostoId && (liite.tiedostoId === tiedostoId)) || (uuid && (liite.uuid === uuid)) ) {
            liite.removed = true;
            obj.liitteet[index] = liite;
            fields.remove(i);
            fields.insert(i, obj);
            return true;
          } else return false;
        })
      } else {
        fields.liitteet.map( (liite, index) => {
          if ( (tiedostoId && (liite.tiedostoId === tiedostoId)) || (uuid && (liite.uuid === uuid)) ) {
            liite.removed = true;
            fields.liitteet[index] = liite;
            return true;
          } else return false;
        })
      }
    }

    const setAttachmentName = (e, tiedostoId, uuid) => {
      e.preventDefaults();
      this.setState({fileError: false});
      this.setState({fileAdded: ""});
      let obj = undefined;
      let i = 0;

      if (e.target.value)
        if (koodiarvo) {
          i = getIndex(muutokset, koodiarvo);
          obj = fields.get(i);
          obj.liitteet.map( (liite, index) => {
            if ( (tiedostoId && (liite.tiedostoId === tiedostoId)) || (uuid && (liite.uuid === uuid)) ) {
              liite.nimi = e.target.value;
              obj.liitteet[index] = liite;
              fields.remove(i);
              fields.insert(i, obj);
              return true;
            } return false;
          }
        )} else {
          fields.liitteet.map( (liite, index) => {
            if ( (tiedostoId && (liite.tiedostoId === tiedostoId)) || (uuid && (liite.uuid === uuid)) ) {
              liite.nimi = e.target.value;
              fields.liitteet[index] = liite;
              return true;
            } else return false;
          })
        }
    }

    const setAttachmentVisibility= (e, tiedostoId, uuid) => {
      this.setState({fileError: false});
      let obj = undefined;
      let i = 0;
      if (koodiarvo) {
        i = getIndex(muutokset, koodiarvo);
        obj = fields.get(i);
        obj.liitteet.map( (liite, index) => {
          if ( (tiedostoId && (liite.tiedostoId === tiedostoId)) || (uuid && (liite.uuid === uuid)) ) {
            liite.salainen = e.target.checked;
            obj.liitteet[index] = liite;
            fields.remove(i);
            fields.insert(i, obj);
            return true;
          } return false;
        }
      )} else {
        fields.liitteet.map( (liite, index) => {
          if ( (tiedostoId && (liite.tiedostoId === tiedostoId)) || (uuid && (liite.uuid === uuid)) ) {
            liite.salainen = e.target.checked;
            fields.liitteet[index] = liite;
            return true;
          } else return false;
        })
      }
    }
    
    const bytesToSize = (bytes)  => {
      if (!bytes || bytes === 0) return '';

      const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
      const i = parseInt(Math.floor(Math.log(Math.abs(bytes)) / Math.log(1024)), 10);
      if (i === 0)
        return `(${bytes} ${sizes[i]}))`;
      else
        return `${(bytes / (1024 ** i)).toFixed(1)} ${sizes[i]}`;
    }

    const LiiteList = () => {
      let obj = undefined;
      if (koodiarvo) {
        const i = getIndex(muutokset, koodiarvo);
        obj = fields.get(i);
      }
      else 
        obj = fields;

      if (obj && obj.liitteet)
        return  obj.liitteet.map( liite => {
          if ( (!paikka || liite.paikka.startsWith(paikka)) && !liite.removed) {
            return (
              <div key={ liite.tiedostoId ? liite.tiedostoId : liite.uuid }>
                <LiiteListItem>
                  {liite.new ? <FaFile /> : <FaRegFile /> }
                  <input 
                    onBlur={(e) => {setAttachmentName(e, liite.tiedostoId, liite.uuid)}} 
                    defaultValue={liite.nimi} 
                    onKeyPress={e => {
                      if (e.key === 'Enter') {
                        setAttachmentName(e, liite.tiedostoId, liite.uuid)
                      }
                    }}
                  />
                  <span className="type">{ liite.tyyppi }</span>                    
                  <span className="size">{ bytesToSize(liite.koko) }</span>
                  <Checkbox title={ liite.salainen ? HAKEMUS_OTSIKOT.SALAINEN_LIITE_VALINTA_POISTA.FI : HAKEMUS_OTSIKOT.SALAINEN_LIITE_VALINTA.FI}>
                    <input
                      type="checkbox"
                      checked={liite.salainen}
                      onChange={e => setAttachmentVisibility(e,liite.tiedostoId,liite.uuid)}
                      id={ liite.tiedostoId ? "c"+liite.tiedostoId : "c"+liite.uuid }
                    />
                    <label htmlFor={liite.tiedostoId ? "c"+liite.tiedostoId : "c"+liite.uuid }>
                      { liite.salainen && <FaLock/> }
                    </label>
                  </Checkbox>
                  <button title={HAKEMUS_OTSIKOT.POISTA_LIITE.FI} onClick={(e) => removeAttachment(e,liite.tiedostoId,liite.uuid)}><FaTimes /></button>
                </LiiteListItem>
              </div> 
            )
          } else return null;
        } 
      )
     else
      return null;
    }

    const showHeader = () => {
      let obj = undefined;
      if (koodiarvo) {
        const i = getIndex(muutokset, koodiarvo);
        obj = fields.get(i);
      }
      else 
        obj = fields;

      if (obj && obj.liitteet) {

        obj.liitteet.map( liite => {
          if ( (!paikka || liite.paikka.startsWith(paikka)) && !liite.removed) {
            return true
          }
          return false
        })
        return false
      }
      else return false
    }

    return (
      <AttachmentWrapper className={this.props.isIntend ? 'intend' :''}>
        { ((!this.props.listHidden && !this.props.showListOnly) || (this.props.showListOnly && showHeader())) &&
          <h4>{this.props.header ? this.props.header: HAKEMUS_OTSIKOT.LIITE_HEADER.FI }</h4>
        }
        { this.props.listHidden && <br /> }
        { !this.props.showListOnly && 
          <Liite setAttachment={setAttachment} setAttachmentName={setAttachmentName} helpText={this.props.helpText} /> 
        }
        { this.state.fileError && 
          <Error>{HAKEMUS_VIRHE.LIITE.FI}</Error>
        }
        {/* { this.state.fileAdded !=="" && 
          <Message>{HAKEMUS_VIESTI.LIITE_LISATTY.FI}: {this.state.fileAdded}</Message> 
        } */}
        { !this.props.listHidden &&
           < LiiteList /> 
        }
        <Modal
          isOpen={this.state.isNameModalOpen}
          onAfterOpen={this.afterOpenNameModal}
          onRequestClose={this.closeNameModal}
          contentLabel={HAKEMUS_VIESTI.VARMISTUS_HEADER.FI}
          style={modalStyles}
        >
          <Content>
            <ModalText>{HAKEMUS_VIESTI.TIEDOSTON_NIMI.FI}</ModalText>
            <Input 
              defaultValue={this.state.fileName}
              autoFocus
              onFocus={(e) => {
                var val = e.target.value;
                e.target.value = '';
                e.target.value = val;
              }}
              onBlur={e => {
                  this.setState( {fileName: e.target.value} )
              }}
              onKeyPress={e => {
                if (e.key === 'Enter') {
                  this.setState({
                    fileName: e.target.value
                  });
                  addAttachment(e, e.target.value)
                }
              }}
              />
            <Error>
              { this.state.nameMissing && HAKEMUS_VIESTI.TIEDOSTO_NIMI_ERROR.FI }
            </Error>
          </Content>
          <div>
            <ModalButton primary onClick={(e) => addAttachment(e)}>{HAKEMUS_VIESTI.OK.FI}</ModalButton>
            <ModalButton
              onClick={this.closeNameModal}>
              {HAKEMUS_VIESTI.PERUUTA.FI}
            </ModalButton>
          </div>
        </Modal>
      </AttachmentWrapper>
    )

  }
}

export default Liiteet