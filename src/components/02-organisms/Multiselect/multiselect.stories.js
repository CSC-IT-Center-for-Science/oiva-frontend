import React from "react";
import { storiesOf } from "@storybook/react";
import Multiselect from "./index";
import { withInfo } from "@storybook/addon-info";
import { heights } from "../../../css/autocomplete";

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const top100Films = [
  { label: "The Shawshank Redemption", value: 1994, group: "1" },
  { label: "The Godfather", value: 1972, group: "1" },
  { label: "The Godfather: Part II", value: 1974, group: "1" },
  { label: "The Dark Knight", value: 2008, group: "1" },
  { label: "12 Angry Men", value: 1957, group: "1" },
  { label: "Schindler's List", value: 1993, group: "1" },
  { label: "Pulp Fiction", value: 1994, group: "1" },
  {
    label: "The Lord of the Rings: The Return of the King",
    value: 2003,
    group: "1"
  },
  { label: "The Good, the Bad and the Ugly", value: 1966, group: "1" },
  { label: "Fight Club", value: 1999, group: "1" },
  {
    label: "The Lord of the Rings: The Fellowship of the Ring",
    value: 2001,
    group: "1"
  },
  {
    label: "Star Wars: Episode V - The Empire Strikes Back",
    value: 1980,
    group: "1"
  },
  { label: "Forrest Gump", value: 1994, group: "1" },
  { label: "Inception", value: 2010, group: "1" },
  { label: "The Lord of the Rings: The Two Towers", value: 2002, group: "1" },
  { label: "One Flew Over the Cuckoo's Nest", value: 1975, group: "1" },
  { label: "Goodfellas", value: 1990, group: "2" },
  { label: "The Matrix", value: 1999, group: "2" },
  { label: "Seven Samurai", value: 1954, group: "2" },
  { label: "Star Wars: Episode IV - A New Hope", value: 1977, group: "2" },
  { label: "City of God", value: 2002, group: "2" },
  { label: "Se7en", value: 1995, group: "3" },
  { label: "The Silence of the Lambs", value: 1991, group: "3" },
  { label: "It's a Wonderful Life", value: 1946, group: "3" },
  { label: "Life Is Beautiful", value: 1997, group: "3" },
  { label: "The Usual Suspects", value: 1995, group: "3" },
  { label: "Léon: The Professional", value: 1994, group: "3" }
];

const selectedValues = [
  { label: "The Dark Knight", value: 2008, group: "1" },
  { label: "The Usual Suspects", value: 1995, group: "3" },
  { label: "1", value: "1", group: "1" }
];

storiesOf("Multiselect", module)
  .addDecorator(withInfo)
  .add("Example 1", () => (
    <div>
      <br />
      <Multiselect
        name="example"
        options={top100Films}
        callback={(payload, values) => {
          console.log(values);
        }}
        isRequired
        title="test"
        value={selectedValues}
      />
    </div>
  ))
  .add("Short height WIP", () => (
    <div>
      <br />
      <Multiselect
        name="example short WIP"
        options={[
          { label: "Aaaaaaaa", value: "Aaaaaaaa", group: "1" },
          { label: "Bbbbbb", value: "Bbbbbb", group: "2" },
          { label: "Ccccccccccc", value: "Ccccccccccc", group: "2" }
        ]}
        height={heights.SHORT}
        callback={(payload, values) => {
          console.log(values.value[0]);
        }}
      />
    </div>
  ));
