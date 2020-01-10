import Slot from "../../00-atoms/Slot";
import DefaultTemplate from "../Default";

const WizardTemplate = () => {
  return (
    <div>
      <Slot slot="header">{ props.children }</Slot>
      <DefaultTemplate slot="content">{ props.children }</DefaultTemplate>
      <Slot slot="footer">{ props.children }</Slot>
    </div>
  );
};

export default WizardTemplate;
