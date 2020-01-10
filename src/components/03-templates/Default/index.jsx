import Slot from "../../00-atoms/Slot";

const DefaultTemplate = () => {
  return (
    <div>
      <Slot slot="content">{ props.children }</Slot>
    </div>
  );
};

export default DefaultTemplate;
