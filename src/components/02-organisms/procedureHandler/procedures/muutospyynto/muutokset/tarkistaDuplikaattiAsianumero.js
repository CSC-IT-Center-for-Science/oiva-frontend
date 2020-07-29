// muutospyynto.muutokset.tarkistaDuplikaattiAsianumero
import {postData} from "../../../fetch";

export const tarkistaDuplikaattiAsianumero = {
    label: "Tarkistaa onko asianumero jo olemassa järjestelmässä",
    input: ["uuid", "asianumero"],
    run: async ({uuid, asianumero}) => {
        let formData = new FormData();
        if (uuid) {
            formData.append("uuid", uuid);
        }
        formData.append("asianumero", asianumero);
        const response = await postData(
            "tarkistaDuplikaattiAsianumero",
            formData
        );
        const isAsianumeroKaytossa = await response.json();
        return {
            result: isAsianumeroKaytossa,
            status: response.status
        };
    },
    next: output => {
        if (output.result) {
            return ["muutospyynto.muutokset.asianumeroOnJoKaytossa"];
        }
    }
};
