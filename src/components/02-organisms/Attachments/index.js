import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { injectIntl } from "react-intl";
import { COLORS } from "../../../modules/styles";
import Attachment from "../Attachment/index";
import { FaRegFile, FaFile, FaTimes, FaLock, FaDownload } from "react-icons/fa";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import common from "../../../i18n/definitions/common";
import * as R from "ramda";
import DialogTitle from "../DialogTitle";
import { downloadFileFn } from "../../../utils/common";

const whyDidYouRender = require("@welldone-software/why-did-you-render/dist/no-classes-transpile/umd/whyDidYouRender.min.js");
whyDidYouRender(React);

const Error = styled.div`
  color: ${COLORS.OIVA_RED};
  margin-bottom: 8px;
  min-height: 20px;
`;
const Checkbox = styled.div`
  width: 20px;
  position: relative;
  margin: 0.6em 0.3em 0 0.9em;

  label {
    width: 1.3em;
    height: 1.3em;
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    background: white;
    border-radius: 0;
    border: 1px solid ${COLORS.OIVA_GREEN};
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover {
      &:after {
        border-color: ${COLORS.OIVA_GREEN};
        opacity: 0.5;
      }
    }
  }
  input[type="checkbox"] {
    visibility: hidden;

    &:checked + label {
      color: ${COLORS.OIVA_GREEN};
      &:hover {
        &:after {
          background: rgba(90, 138, 112, 0);
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
`;
const LiiteListItem = styled.div`
  font-size: 1em;
  display: flex;
  justify-content: stretch;
  align-items: center;
  width: 100%;
  padding: 2px;
  button {
    background-color: transparent;
    border: 0;
    height: 2em;
    width: 2em;
    cursor: cursor;
    &:hover {
      color: ${props =>
        props.disabled
          ? COLORS.WHITE
          : props.bgColor
          ? props.bgColor
          : COLORS.WHITE};
      background-color: ${props =>
        props.disabled
          ? COLORS.LIGHT_GRAY
          : props.textColor
          ? props.textColor
          : COLORS.OIVA_GREEN};
      ${props => (props.disabled ? "cursor: not-allowed;" : null)}
      cursor: pointer;
    }
  }
  svg {
    margin: auto;
  }
  input {
    width: auto;
    height: 2em;
    flex: 1;
    margin: 0 0.1em 0 0.1em;
    padding: 0 0.2em 0 0.5em;
  }
  .name {
    flex: 1;
    margin-left: 0.2em;
  }
  .type {
    min-width: 3em;
    text-align: right;
  }
  .size {
    min-width: 5em;
    text-align: right;
  }
  &:hover {
    background-color: ${COLORS.OIVA_TABLE_HOVER_COLOR};
  }
`;
export const Input = styled.input`
  font-size: 1em;
  padding: 0.2em 0.4em;
  width: 100%;
  margin: 0.5em 0;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
  border: 1px solid #aaa;
  border-radius: 0.2em;
`;

const Attachments = React.memo(
  props => {
    const [selectedAttachment, setSelectedAttachment] = useState([]);
    const [attachments, setAttachments] = useState([]);
    // const [fileAdded, setFileAdded] = useState(false);
    const [fileError, setFileError] = useState(false);
    const [isNameModalOpen, setIsNameModalOpen] = useState(false);
    const [nameMissing, setNameMissing] = useState(false);

    const {
      intl: { formatMessage }
    } = props;

    const openNameModal = () => {
      setNameMissing(false);
      setIsNameModalOpen(true);
    };

    const closeNameModal = () => {
      setIsNameModalOpen(false);
    };

    if (props.payload && props.payload.attachments) {
      useEffect(() => {
        setAttachments(props.payload.attachments);
      }, [props.payload.attachments]);
    }

    // Adds attachment into attachment list
    const addAttachment = () => {
      if (selectedAttachment.nimi) {
        setNameMissing(false);
        closeNameModal();
        // Find correct attachment and set name
        props.payload.attachments.map((liite, idx) => {
          if (
            (selectedAttachment.tiedostoId &&
              liite.tiedostoId === selectedAttachment.tiedostoId) ||
            (selectedAttachment.uuid && liite.uuid === selectedAttachment.uuid)
          ) {
            let atts = props.payload.attachments;
            atts[idx].nimi = selectedAttachment.nimi;
            setAttachments(atts);
            props.onUpdate(props.payload, {
              attachments: atts
            });
          }
          return null;
        });
      } else setNameMissing(true);
    };

    const setAttachment = e => {
      setFileError(false);
      // setFileAdded("");

      if (e.target.files.length === 0) return;
      console.log("File selected");

      const type = e.target.files[0].name
        .split(".")
        .pop()
        .toLowerCase();

      // Rajoitetaan max kooksi 25MB ja vain pdf, word, excel, jpeg ja gif on sallittuja
      if (
        e.target.files[0].size <= 26214400 &&
        [
          "pdf",
          "doc",
          "txt",
          "docx",
          "xls",
          "xlsx",
          "xlsm",
          "jpg",
          "jpeg",
          "jpe",
          "jfif",
          "gif"
        ].includes(type)
      ) {
        let liite = {};
        liite.tiedostoId = Math.random() + "-" + e.target.files[0].name;
        liite.filename = e.target.files[0].name;
        liite.kieli = "fi";
        liite.tyyppi = type;
        liite.nimi = e.target.files[0].name.split(".")[0].toLowerCase();
        liite.tiedosto = new Blob([e.target.files[0]]);
        liite.koko = e.target.files[0].size;
        liite.removed = false;
        liite.salainen = false;
        liite.paikka = props.placement;
        liite.new = true;

        let atts = props.payload.attachments;
        atts.push(liite);
        setAttachments(atts);
        setSelectedAttachment(liite);

        openNameModal();
      } else return setFileError(true);
    };

    const cancelAttachment = () => {
      closeNameModal();
      let atts = attachments.pop(); // take last out
      setAttachments(atts);
    };

    const removeAttachment = (e, tiedostoId, uuid) => {
      e.preventDefault();
      setFileError(false);

      attachments.map((liite, idx) => {
        if (
          (tiedostoId && liite.tiedostoId === tiedostoId) ||
          (uuid && liite.uuid === uuid)
        ) {
          let atts = [...props.payload.attachments];
          atts[idx].removed = true;
          setAttachments(atts);
          props.onUpdate(props.payload, {
            attachments: atts
          });
          return true;
        } else return false;
      });
    };

    // Sen name of attachment
    const setAttachmentName = (e, tiedostoId, uuid) => {
      e.preventDefault();
      setFileError(false);
      // setFileAdded("");

      attachments.map((liite, idx) => {
        if (
          (tiedostoId && liite.tiedostoId === tiedostoId) ||
          (uuid && liite.uuid === uuid)
        ) {
          let atts = props.payload.attachments;
          atts[idx].nimi = e.target.value;
          setAttachments(atts);
          props.onUpdate(props.payload, {
            attachments: atts
          });
          return true;
        } else return false;
      });
    };

    // set if attachment is secret
    const setAttachmentVisibility = (e, tiedostoId, uuid) => {
      e.preventDefault();
      setFileError(false);
      // setFileAdded("");

      attachments.map((liite, idx) => {
        if (
          (tiedostoId && liite.tiedostoId === tiedostoId) ||
          (uuid && liite.uuid === uuid)
        ) {
          let atts = [...attachments];
          atts[idx].salainen = e.target.checked;
          setAttachments(atts);
          props.onUpdate(props.payload, {
            attachments: atts
          });
          return true;
        } else return false;
      });
    };

    // Checks if file limits are met
    const bytesToSize = bytes => {
      if (!bytes || bytes === 0) return "";

      const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
      const i = parseInt(
        Math.floor(Math.log(Math.abs(bytes)) / Math.log(1024)),
        10
      );
      if (i === 0) return `(${bytes} ${sizes[i]}))`;
      else return `${(bytes / 1024 ** i).toFixed(1)} ${sizes[i]}`;
    };

    const addLiiteUrl = file =>
      file.uuid
        ? Object.assign({}, file, { url: `/liitteet/${file.uuid}/raw` })
        : file;

    // Lists all attachments
    const LiiteList = () => {
      if (attachments && attachments.length > 0)
        return attachments.map(liite => {
          console.info(liite);
          if (
            (liite.tiedostoId || liite.uuid) &&
            !liite.removed &&
            (!props.placement || liite.paikka === props.placement)
          ) {
            return (
              <React.Fragment
                key={
                  props.id + liite.tiedostoId ? liite.tiedostoId : liite.uuid
                }>
                <LiiteListItem>
                  {liite.new ? <FaFile /> : <FaRegFile />}
                  <input
                    onBlur={e => {
                      setAttachmentName(e, liite.tiedostoId, liite.uuid);
                    }}
                    defaultValue={liite.nimi}
                    onKeyPress={e => {
                      if (e.key === "Enter") {
                        setAttachmentName(e, liite.tiedostoId, liite.uuid);
                      }
                    }}
                  />
                  <span className="type">{liite.tyyppi}</span>
                  <span className="size">{bytesToSize(liite.koko)}</span>
                  <button
                    title={formatMessage(common.attachmentDownload)}
                    onClick={downloadFileFn(addLiiteUrl(liite))}
                    className="ml-2">
                    <FaDownload />
                  </button>
                  <Checkbox
                    title={
                      liite.salainen
                        ? formatMessage(common.attachmentSecretUnselect)
                        : formatMessage(common.attachmentSecretSelect)
                    }>
                    <input
                      type="checkbox"
                      checked={liite.salainen}
                      onChange={e =>
                        setAttachmentVisibility(e, liite.tiedostoId, liite.uuid)
                      }
                      id={
                        liite.tiedostoId
                          ? "c" + liite.tiedostoId
                          : "c" + liite.uuid
                      }
                    />
                    <label
                      htmlFor={
                        liite.tiedostoId
                          ? "c" + liite.tiedostoId
                          : "c" + liite.uuid
                      }>
                      {liite.salainen && <FaLock />}
                    </label>
                  </Checkbox>
                  <button
                    title={formatMessage(common.attachmentRemove)}
                    onClick={e =>
                      removeAttachment(e, liite.tiedostoId, liite.uuid)
                    }>
                    <FaTimes />
                  </button>
                </LiiteListItem>
              </React.Fragment>
            );
          } else return null;
        });
      else return null;
    };

    // Lists all attachments in read only state
    const LiiteListReadOnly = () => {
      if (attachments && attachments.length > 0)
        return attachments.map(liite => {
          if (
            (liite.tiedostoId || liite.uuid) &&
            !liite.removed &&
            (!props.placement || liite.paikka === props.placement)
          ) {
            return (
              <React.Fragment
                key={
                  props.id + liite.tiedostoId ? liite.tiedostoId : liite.uuid
                }>
                <LiiteListItem>
                  {liite.new ? <FaFile /> : <FaRegFile />}
                  <span className="w-full pl-2">{liite.nimi}</span>
                  <span className="type">{liite.tyyppi}</span>
                  <span className="size">{bytesToSize(liite.koko)}</span>
                  <button
                    title={formatMessage(common.attachmentDownload)}
                    onClick={downloadFileFn(addLiiteUrl(liite))}
                    className="ml-2">
                    <FaDownload />
                  </button>
                  <span
                    title={
                      liite.salainen
                        ? formatMessage(common.attachmentSecret)
                        : ""
                    }>
                    {liite.salainen && <FaLock />}
                  </span>
                </LiiteListItem>
              </React.Fragment>
            );
          } else return null;
        });
      else {
        return (
          <p>
            <i>{formatMessage(common.attachmentNone)}</i>
          </p>
        );
      }
    };
    return (
      <React.Fragment>
        {!props.showListOnly && !props.isReadOnly && (
          <Attachment
            id={props.id}
            setAttachment={setAttachment}
            setAttachmentName={setAttachmentName}
          />
        )}
        {fileError && <Error>{formatMessage(common.attachmentError)}</Error>}
        {!props.listHidden && !props.isReadOnly && <LiiteList />}
        {!props.listHidden && props.isReadOnly && <LiiteListReadOnly />}
        <Dialog
          open={isNameModalOpen}
          aria-labelledby="name-dialog"
          fullWidth={true}
          maxWidth="sm">
          <DialogTitle id="name-dialog">
            {formatMessage(common.attachmentName)}
          </DialogTitle>
          <DialogContent>
            <Input
              defaultValue={selectedAttachment.nimi}
              autoFocus
              onFocus={e => {
                var val = e.target.value;
                e.target.value = "";
                e.target.value = val;
              }}
              onBlur={e => {
                setAttachmentName(
                  e,
                  selectedAttachment.tiedostoId,
                  selectedAttachment.uuid
                );
              }}
              onKeyUp={e => {
                if (e.keyCode === 13) {
                  setAttachmentName(
                    e,
                    selectedAttachment.tiedostoId,
                    selectedAttachment.uuid
                  );
                  addAttachment(e);
                }
              }}
            />
            <Error>
              {nameMissing && formatMessage(common.attachmentErrorName)}
            </Error>
          </DialogContent>
          <DialogActions>
            <Button onClick={addAttachment} color="primary" variant="contained">
              {formatMessage(common.ok)}
            </Button>
            <Button
              onClick={cancelAttachment}
              color="secondary"
              variant="outlined">
              {formatMessage(common.cancel)}
            </Button>
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  },
  (prevState, nextState) => {
    return R.equals(prevState.payload, nextState.payload);
  }
);

Attachments.propTypes = {
  attachments: PropTypes.object,
  fileName: PropTypes.string,
  id: PropTypes.string,
  isReadOnly: PropTypes.bool,
  listHidden: PropTypes.bool,
  onUpdate: PropTypes.func,
  payload: PropTypes.object,
  placement: PropTypes.string,
  selectedAttachment: PropTypes.object,
  showListOnly: PropTypes.bool
};

Attachments.whyDidYouRender = {
  logOnDifferentValues: true,
  customName: "Attachments"
};

export default injectIntl(Attachments);
