// import React from "react";
// import ReactDOM from "react-dom";
// // import renderer from "react-test-renderer";
// import Footer from "./Footer";
// import { mountWithIntl } from './intl-enzyme-test-helper.js';


// it("renders without crashing", () => {
//   const div = document.createElement("div");
//   ReactDOM.render(
//       mountWithIntl(<Footer />),
//     div
//   );
// });

// it("renders a snapshot", () => {
//   const tree = renderer
//     .create(
//       <AppWrapper>
//         <Footer />
//       </AppWrapper>
//     )
//     .toJSON();
//   expect(tree).toMatchSnapshot();
// });

import React from 'react';
import { mountWithIntl, shallowWithIntl, loadTranslation } from 'enzyme-react-intl';
import chai, { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';

import Footer from './Footer';

chai.use(chaiEnzyme());

// Load in the desired react-intl translation file.
loadTranslation("./src/i18n/locales/fi.json");

describe('<Footer />', () => {
    it('renders with correct texts', () => {
        const wrapper = mountWithIntl(<Footer />);
        expect(wrapper.find('[data-testid="organization"]')).to.have.text('OPETUS- JA KULTTUURIMINISTERIÖ');
    });
});