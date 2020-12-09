/**
 * Open file using generated and hidden <a> element
 * @param obj containing properties filename and tiedosto or property url. Has optional parameter openInNewWindow
 */
export const downloadFileFn = ({
  filename,
  tiedosto,
  url,
  openInNewWindow
}) => {
  return () => {
    let a = document.createElement("a");
    a.setAttribute("type", "hidden");
    if (openInNewWindow) {
      a.setAttribute("target", "_blank");
      a.setAttribute("rel", "noopener noreferer");
    }

    document.body.appendChild(a); // Needed for Firefox
    if (tiedosto && tiedosto instanceof Blob) {
      const reader = new FileReader();
      reader.readAsDataURL(tiedosto);
      reader.onload = function() {
        a.href = reader.result;
        a.download = filename;
        a.click();
        a.remove();
      };
    } else if (url) {
      // a.href = API_BASE_URL + url; // TODO: get API_BASE_URL somehow
      a.click();
      a.remove();
    } else {
      console.warn("Cannot open file: No octet stream nor file url");
    }
  };
};

export const checkFiletypeAndSize = (type, size) => {
  return size <= 26214400 &&
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
    ].includes(type);
};