import { getMessages } from "../../utils";

function getReasoningForm(isReadOnly) {
  return [
    {
      anchor: "liitteet",
      components: [
        {
          name: "StatusTextRow",
          styleClasses: ["w-full"],
          properties: {
            title:
              "Liitteen koko saa olla korkeintaan 25 MB ja tyypiltään pdf, word, excel, jpeg tai gif. Muistakaa merkitä salassa pidettävät liitteet.",
            isHidden: isReadOnly
          }
        },
        {
          anchor: "A",
          styleClasses: ["w-full"],
          name: "Attachments",
          messages: getMessages("attachments"),
          properties: {
            isReadOnly: false
          }
        }
      ]
    }
  ];
}

export default function getPerustelutLiitteetlomake(action, isReadOnly) {
  switch (action) {
    case "reasoning":
      return getReasoningForm(isReadOnly);
    default:
      return [];
  }
}
