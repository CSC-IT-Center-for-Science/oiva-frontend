import { getMessages } from "../utils";
import { __ } from "i18n-for-browser";

export function liitetiedostot(data) {
  return [
    {
      anchor: "ohjeteksti",
      components: [
        {
          anchor: "A",
          name: "StatusTextRow",
          styleClasses: ["w-full"],
          properties: {
            title:
              "Liitteen koko saa olla korkeintaan 25 MB ja tyypiltään pdf, word, excel, jpeg tai gif. Muistakaa merkitä salassa pidettävät liitteet."
          }
        }
      ]
    },
    {
      anchor: "tiedostolistaus",
      components: [
        {
          anchor: "A",
          name: "FileUpload",
          messages: {
            dropAreaInfo1: __("attachments.dropAreaInfo1"),
            dropAreaInfo2: __("attachments.dropAreaInfo2"),
            dropAreaInfo3: __("attachments.dropAreaInfo3"),
            functions: __("common.functions"),
            "file-invalid-type": "Tiedosto on väärän tyyppinen.",
            "file-too-large": "Tiedosto on liian suuri."
          },
          styleClasses: ["w-full"],
          properties: {
            messages: getMessages("attachments"),
            onChanges: data.onChanges
          }
        }
      ]
    }
  ];
}
