import React, { useState } from "react";
import PropTypes from "prop-types";
import Attachment from "../Attachment";
import DialogTitle from "../DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import { Input } from "../Attachments";
import styled from "styled-components";
import { COLORS } from "../Attachments/styles";
import { checkFiletypeAndSize } from "../Attachments/utils";

const Error = styled.div`
  color: ${COLORS.OIVA_RED};
  margin-bottom: 8px;
  min-height: 20px;
`;

const SelectAttachment = React.memo(props => {
  const [nameMissing, setNameMissing] = useState(false);
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [selectedAttachment, setSelectedAttachment] = useState([]);
  const [fileError, setFileError] = useState(false);

  const setAttachment = e => {
    setFileError(false);

    if (e.target.files.length === 0) return;

    const type = e.target.files[0].name
      .split(".")
      .pop()
      .toLowerCase();

    // Rajoitetaan max kooksi 25MB ja vain pdf, word, excel, jpeg ja gif on sallittuja
    if (checkFiletypeAndSize(type, e.target.files[0].size)) {
      let liite = {};
      liite.filename = e.target.files[0].name;
      liite.tiedostoId = Math.random() + "-" + liite.filename;
      liite.kieli = "fi";
      liite.tyyppi = props.fileType ? props.fileType : type;
      liite.nimi = liite.filename.substr(0, liite.filename.lastIndexOf("."));
      liite.tiedosto = new Blob([e.target.files[0]]);
      liite.koko = e.target.files[0].size;
      liite.removed = false;
      liite.salainen = false;
      setSelectedAttachment(liite);

      openNameModal();
    } else return setFileError(true);
  };

  const openNameModal = () => {
    setNameMissing(false);
    setIsNameModalOpen(true);
  };

  const addAttachment = () => {
    if (selectedAttachment.nimi) {
      props.attachmentAdded(selectedAttachment);
    } else {
      setNameMissing(true);
    }
  };

  const cancelAttachment = () => {
    setSelectedAttachment([]);
    setIsNameModalOpen(false);
  };

  const setAttachmentName = e => {
    const liite = selectedAttachment;
    liite.nimi = e.target.value;
    setSelectedAttachment(liite);
  };

  return (
    <React.Fragment>
      <Attachment
        style={{ cursor: "pointer" }}
        id={props.id}
        name={props.name}
        styles={props.styles}
        setAttachment={setAttachment}
        setAttachmentName={setAttachmentName}
        messages={props.messages}
      />
      {fileError && <Error>{props.messages.attachmentError}</Error>}
      <Dialog
        open={isNameModalOpen}
        aria-labelledby="name-dialog"
        fullWidth={true}
        maxWidth="sm">
        <DialogTitle id="name-dialog">
          {props.messages.attachmentName}
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
              setAttachmentName(e);
            }}
            onKeyUp={e => {
              if (e.keyCode === 13) {
                setAttachmentName(e);
                addAttachment();
              }
            }}
          />
          <Error>{nameMissing && props.messages.attachmentErrorName}</Error>
        </DialogContent>
        <DialogActions>
          <Button onClick={addAttachment} color="primary" variant="contained">
            {props.messages.ok}
          </Button>
          <Button
            onClick={cancelAttachment}
            color="secondary"
            variant="outlined">
            {props.messages.cancel}
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
});

SelectAttachment.propTypes = {
  id: PropTypes.string,
  messages: PropTypes.object,
  name: PropTypes.string,
  fileType: PropTypes.string,
  attachmentAdded: PropTypes.func,
  styles: PropTypes.object
};

SelectAttachment.defaultProps = {
  styles: {}
};

export default SelectAttachment;
