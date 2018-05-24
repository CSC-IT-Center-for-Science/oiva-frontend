import { API_BASE_URL } from "../../../../../../modules/constants"
import axios from "axios/index"
import { formatMuutospyynto } from "./koulutusUtil"

// Constants
export const FETCH_MUUTOSPYYNTO_START = 'FETCH_MUUTOSPYYNTO_START'
export const FETCH_MUUTOSPYYNTO_SUCCESS = 'FETCH_MUUTOSPYYNTO_SUCCESS'
export const FETCH_MUUTOSPYYNTO_FAILURE = 'FETCH_MUUTOSPYYNTO_FAILURE'

export const CREATE_MUUTOSPYYNTO_START = 'CREATE_MUUTOSPYYNTO_START'
export const CREATE_MUUTOSPYYNTO_SUCCESS = 'CREATE_MUUTOSPYYNTO_SUCCESS'
export const CREATE_MUUTOSPYYNTO_FAILURE = 'CREATE_MUUTOSPYYNTO_FAILURE'

export const PREVIEW_MUUTOSPYYNTO_START = 'PREVIEW_MUUTOSPYYNTO_START'
export const PREVIEW_MUUTOSPYYNTO_SUCCESS = 'PREVIEW_MUUTOSPYYNTO_SUCCESS'
export const PREVIEW_MUUTOSPYYNTO_FAILURE = 'PREVIEW_MUUTOSPYYNTO_FAILURE'

// Actions
export function fetchMuutospyynto(ytunnus, query) {
  return (dispatch) => {
    dispatch({ type: FETCH_MUUTOSPYYNTO_START })

    const request = fetch(`${API_BASE_URL}/muutospyynnot/${ytunnus}${query ? query : ''}`)

    request
      .then((response) => response.json())
      .then((data) => {
        dispatch({ type: FETCH_MUUTOSPYYNTO_SUCCESS, payload: data })
      })
      .catch((err) => dispatch({ type: FETCH_MUUTOSPYYNTO_FAILURE, payload: err }))
  }
}

export function createMuutospyynto(muutospyynto) {

    console.log("PDFksi asdasd: " + JSON.stringify(muutospyynto))

    const formatted = formatMuutospyynto(muutospyynto)

  let obj = {}
  return (dispatch) => {
    dispatch({ type: CREATE_MUUTOSPYYNTO_START })

    axios.put(`${API_BASE_URL}/muutospyynnot/create`, formatted)
      .then(response => {
        dispatch({ type: CREATE_MUUTOSPYYNTO_SUCCESS, payload: response })
      })
      .catch(err => {
        dispatch({ type: CREATE_MUUTOSPYYNTO_FAILURE, payload: err })
      })
  }
}

export function previewMuutospyynto(muutospyynto) {
    console.log("PDFksi 1: " + JSON.stringify(muutospyynto))

//    const formatted = formatMuutospyynto(muutospyynto)

    const formatted = "{\n" +
        "  \"diaarinumero\": \"43/531/2017\",\n" +
        "  \"hakupvm\": \"2017-08-13\",\n" +
        "  \"id\": 0,\n" +
        "  \"jarjestajaOid\": \"1.2.246.562.10.48442622063\",\n" +
        "  \"jarjestajaYtunnus\": \"0208201-1\",\n" +
        "  \"luoja\": \"oiva-sanni\",\n" +
        "  \"luontipvm\": \"2017-08-13\",\n" +
        "  \"lupaId\": 43,\n" +
        "  \"paatoskierrosId\": 19,\n" +
        "  \"paivittaja\": \"string\",\n" +
        "  \"paivityspvm\": null,\n" +
        "  \"tila\": \"LUONNOS\",\n" +
        "  \"voimassaalkupvm\": \"2018-01-01\",\n" +
        "  \"voimassaloppupvm\": \"2018-12-31\",\n" +
        "  \"muutosperustelu\": {\n" +
        "    \"arvo\": \"\",\n" +
        "    \"koodiarvo\": \"01\",\n" +
        "    \"koodisto\": \"oivaperustelut\",\n" +
        "    \"luoja\": \"oiva-sanni\",\n" +
        "    \"luontipvm\": \"2017-08-13\",\n" +
        "    \"meta\": {\n" +
        "      \"perusteluteksti\": \"Työttömyys nousee\"\n" +
        "    }\n" +
        "  },\n" +
        "  \"muutokset\": [ \n" +
        " \t    {\n" +
        "\t\t  \"kohdeId\": 1,\n" +
        "\t\t  \"koodiarvo\": \"447101\",\n" +
        "\t\t  \"koodisto\": \"koulutus\",\n" +
        "\t\t  \"luoja\": \"oiva-sanni\",\n" +
        "   \t\t  \"luontipvm\": \"2018-03-15\",\n" +
        "\t\t  \"maaraystyyppiId\": 1,\n" +
        "\t\t  \"meta\": {\n" +
        "\t\t    \"perusteluteksti\": \"Lorem ipsum\"\n" +
        "\t\t  },\n" +
        "\t\t  \"tila\": \"LISAYS\"\n" +
        "\t\t},\n" +
        " \t    {\n" +
        "\t\t  \"kohdeId\": 1,\n" +
        "\t\t  \"koodiarvo\": \"457503\",\n" +
        "\t\t  \"koodisto\": \"koulutus\",\n" +
        "\t\t  \"luoja\": \"oiva-sanni\",\n" +
        "   \t\t  \"luontipvm\": \"2018-03-15\",\n" +
        "\t\t  \"maaraystyyppiId\": 1,\n" +
        "\t\t  \"meta\": {\n" +
        "\t\t    \"perusteluteksti\": \"Lorem ipsum 2\"\n" +
        "\t\t  },\n" +
        "\t\t  \"tila\": \"LISAYS\"\n" +
        "\t\t},\n" +
        " \t    {\n" +
        "\t\t  \"kohdeId\": 1,\n" +
        "\t\t  \"koodiarvo\": \"321604\",\n" +
        "\t\t  \"koodisto\": \"koulutus\",\n" +
        "\t\t  \"luoja\": \"oiva-sanni\",\n" +
        "   \t\t  \"luontipvm\": \"2018-03-15\",\n" +
        "\t\t  \"maaraystyyppiId\": 1,\n" +
        "\t\t  \"meta\": {\n" +
        "\t\t    \"perusteluteksti\": \"Lorem ipsum 2\"\n" +
        "\t\t  },\n" +
        "\t\t  \"tila\": \"POISTO\"\n" +
        "\t\t},\n" +
        " \t    {\n" +
        "\t\t  \"kohdeId\": 4,\n" +
        "\t\t  \"koodiarvo\": \"3\",\n" +
        "\t\t  \"koodisto\": \"koulutussektori\",\n" +
        "\t\t  \"arvo\": \"6650\",\n" +
        "\t\t  \"luoja\": \"oiva-sanni\",\n" +
        "   \t\t  \"luontipvm\": \"2018-03-15\",\n" +
        "\t\t  \"maaraystyyppiId\": 1,\n" +
        "\t\t  \"meta\": {\n" +
        "\t\t    \"perusteluteksti\": \"Lorem ipsum 3\"\n" +
        "\t\t  },\n" +
        "\t\t  \"tila\": \"LISAYS\"\n" +
        "\t\t},\n" +
        " \t    {\n" +
        "\t\t  \"kohdeId\": 4,\n" +
        "\t\t  \"koodiarvo\": \"2\",\n" +
        "\t\t  \"koodisto\": \"oivamuutoikeudetvelvollisuudetehdotjatehtavat\",\n" +
        "\t\t  \"arvo\": \"50\",\n" +
        "\t\t  \"luoja\": \"oiva-sanni\",\n" +
        "   \t\t  \"luontipvm\": \"2018-03-15\",\n" +
        "\t\t  \"maaraystyyppiId\": 2,\n" +
        "\t\t  \"meta\": {\n" +
        "\t\t    \"perusteluteksti\": \"Lorem ipsum 3\"\n" +
        "\t\t  },\n" +
        "\t\t  \"tila\": \"LISAYS\"\n" +
        "\t\t},\n" +
        " \t    {\n" +
        "\t\t  \"kohdeId\": 4,\n" +
        "\t\t  \"koodiarvo\": \"4\",\n" +
        "\t\t  \"koodisto\": \"oivamuutoikeudetvelvollisuudetehdotjatehtavat\",\n" +
        "\t\t  \"arvo\": \"60\",\n" +
        "\t\t  \"luoja\": \"oiva-sanni\",\n" +
        "   \t\t  \"luontipvm\": \"2018-03-15\",\n" +
        "\t\t  \"maaraystyyppiId\": 2,\n" +
        "\t\t  \"meta\": {\n" +
        "\t\t    \"perusteluteksti\": \"Lorem ipsum 3\"\n" +
        "\t\t  },\n" +
        "\t\t  \"tila\": \"LISAYS\"\n" +
        "\t\t},\n" +
        " \t    {\n" +
        "\t\t  \"kohdeId\": 3,\n" +
        "\t\t  \"koodiarvo\": \"01\",\n" +
        "\t\t  \"koodisto\": \"maakunta\",\n" +
        "\t\t  \"luoja\": \"oiva-sanni\",\n" +
        "   \t\t  \"luontipvm\": \"2018-03-15\",\n" +
        "\t\t  \"maaraystyyppiId\": 3,\n" +
        "\t\t  \"meta\": {\n" +
        "\t\t    \"perusteluteksti\": \"Lorem ipsum 4\"\n" +
        "\t\t  },\n" +
        "\t\t  \"tila\": \"LISAYS\"\n" +
        "\t\t},\n" +
        " \t    {\n" +
        "\t\t  \"kohdeId\": 3,\n" +
        "\t\t  \"koodiarvo\": \"287\",\n" +
        "\t\t  \"koodisto\": \"kunta\",\n" +
        "\t\t  \"luoja\": \"oiva-sanni\",\n" +
        "   \t\t  \"luontipvm\": \"2018-03-15\",\n" +
        "\t\t  \"maaraystyyppiId\": 3,\n" +
        "\t\t  \"meta\": {\n" +
        "\t\t    \"perusteluteksti\": \"Lorem ipsum 5\"\n" +
        "\t\t  },\n" +
        "\t\t  \"tila\": \"LISAYS\"\n" +
        "\t\t}\n" +
        "  ]\n" +
        "}"



    console.log("PDFksi 2: " + JSON.stringify(formatted))
    return (dispatch) => {
        dispatch({ type: PREVIEW_MUUTOSPYYNTO_START })

        return axios.put(`${API_BASE_URL}/pdf/muutospyyntoObjToPdf`,
            formatted,
            {
                responseType: 'arraybuffer',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/pdf'
                }
            })
            .then(response => {
                dispatch({ type: PREVIEW_MUUTOSPYYNTO_SUCCESS, payload: response })
            })
            .catch(err => {
                dispatch({ type: PREVIEW_MUUTOSPYYNTO_FAILURE, payload: err })
            })
    }
}

export const actions = {
  fetchMuutospyynto,
  createMuutospyynto,
  previewMuutospyynto
}

// Action handlers
const ACTION_HANDLERS = {
  [FETCH_MUUTOSPYYNTO_START]    : (state, action) => {
    return {
      ...state,
      isFetching: true,
      fetched: false,
      hasErrored: false
    }
  },
  [FETCH_MUUTOSPYYNTO_SUCCESS]  : (state, action) => {
    return {
      ...state,
      isFetching: false,
      fetched: true,
      hasErrored: false,
      data: action.payload
    }
  },
  [FETCH_MUUTOSPYYNTO_FAILURE]  : (state, action) => {
    return {
      ...state,
      isFetching: false,
      fetched: false,
      hasErrored: true
    }
  },
    [CREATE_MUUTOSPYYNTO_START]   : (state, action) => {
        return {
            ...state,
            create: {
                isSubmitting: true,
                isCreated: false,
                hasErrored: false,
            }
        }
    },
    [CREATE_MUUTOSPYYNTO_SUCCESS]   : (state, action) => {
        return {
            ...state,
            create: {
                isSubmitting: false,
                isCreated: true,
                hasErrored: false,
                response: action.payload
            }
        }
    },
    [CREATE_MUUTOSPYYNTO_FAILURE]   : (state, action) => {
        return {
            ...state,
            create: {
                isSubmitting: false,
                hasCreated: false,
                hasErrored: true,
                response: action.payload
            }
        }
    },
    [PREVIEW_MUUTOSPYYNTO_START]   : (state, action) => {
      return {
        ...state,
        isFetching: true,
        fetched: false,
        hasErrored: false
      }
    },
    [PREVIEW_MUUTOSPYYNTO_SUCCESS]   : (state, action) => {
      return {
        ...state,
        isFetching: false,
        fetched: true,
        hasErrored: false,
        pdf: action.payload
      }
    },
    [PREVIEW_MUUTOSPYYNTO_FAILURE]   : (state, action) => {
      return {
        ...state,
        isFetching: false,
        fetched: false,
        hasErrored: true
      }
    }
}

// Reducer
const initialState = {
  isFetching: false,
  fetched: false,
  hasErrored: false,
  data: {},
  create: undefined
}

export default function muutospyyntoReducer(state = initialState, action) {
  const handler = ACTION_HANDLERS[action.type]

  return handler ? handler(state, action) : state
}
