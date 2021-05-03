export type LocalesByLang = {
  [key: string]: string;
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
