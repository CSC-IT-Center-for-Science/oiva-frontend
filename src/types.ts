import { LocaleUpper, Tila, Type } from "enums";

export type ChangeObject = {
  anchor: string;
  properties: object;
};

export type BackendChangeObject = {
  koodiarvo: string;
  koodisto: string;
  nimi: string;
  kuvaus: string;
  kohde: object;
  maaraystyyppi: string;
  maaraysUuid: string;
  meta: {
    changeObjects: Array<ChangeObject>;
    kuvaus?: string;
    perusteluteksti: string;
    rajoiteId?: string;
    tunniste: string;
    tyyppi?: string;
  };
  tila: Tila;
  type: Type;
};

export type Kieli = {
  koodiarvo: string;
  koodisto: string;
  metadata: {
    EN?: MetadataOfKieli;
    FI?: MetadataOfKieli;
    SV?: MetadataOfKieli;
  };
  versio: string;
  voimassaAlkuPvm: string;
};

export type KieliRaw = {
  koodiArvo: string;
  koodisto: string;
  metadata: Array<MetadataOfKieli>;
  versio: string;
  voimassaAlkuPvm: string;
};

export type Kielet = Array<Kieli>;

// export type KieletRaw = Array<KieliRaw>;

export type LocalesByLang = {
  [key: string]: string;
};

export type MetadataOfKieli = {
  huomioitavaKoodi?: string;
  kasite?: string;
  kayttoohje?: string;
  kieli: LocaleUpper;
  kuvaus?: string;
  nimi: string;
  sisaltaaMerkityksen?: string;
};

export type Organisation = {
  nimi: OrganisationName;
  oid: string;
};

export type OrganisationName = {
  [key: string]: string;
};

export type Role = {};

export type Roles = {
  [key: string]: string;
};

export type User = {
  oid: string;
  roles: Array<Role>;
  username: string;
};
