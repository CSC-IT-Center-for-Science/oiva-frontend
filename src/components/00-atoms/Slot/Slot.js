import React from 'react';

export default function Slot({ children, slot }) {
  let slottedChild = null; // Default to null since react can render null if a slot isn't found
  // Iterate over children to find the slot needed
  React.Children.forEach(children, child => {
    if (!React.isValidElement(child)) {
      // Check that it is a valid react element.
      return; // Return since we can't do anything with a child without props.
    }

    if (child.props["data-slot"] === slot) {
      //Verify it matches the slot we are looking for.
      slottedChild = React.cloneElement(child); // Clone it and set it to the slotted child
    }
  });
  return slottedChild;
}
