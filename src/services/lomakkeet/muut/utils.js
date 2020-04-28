import { head } from "ramda";

/**
 * Function scrolls the KJ wizard view to Opiskelijavuodet section.
 * Animation is implemented using CSS: scrollBehavior: "smooth".
 * For more information:
 * https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-behavior
 * See also MuutospyyntoWizard.js. The scrollBehavior is used there.
 */
export function scrollToOpiskelijavuodet() {
  /**
   * head takes the first element of an array which in this use case will
   * be fulfilled with HTMLElements returned by querySelectorAll function.
   * The idea is to calculate the height of { position: fixed } elements. With
   * that knowledge the amount of srolling can be set correctly.
   **/
  const muiDialogTitle = head(
    // This gets all the HTMLElements that have the class MuiDialogTitle-root.
    document.querySelectorAll('[class~="MuiDialogTitle-root"]')
  );
  const wizardNavigation = head(
    /**
     * All the HTMLElements with aria-labelledby value as
     * navigate-between-pages will be returned.
     **/

    document.querySelectorAll('[aria-labelledby="navigate-between-pages"]')
  );

  // Wizard content is the element we're going to scroll.
  const wizardContent = head(
    document.getElementsByClassName("MuiDialogContent-root")
  );

  // If all three elements exist the scrolling will be run.
  if (muiDialogTitle && wizardContent) {
    /**
     * This is why we fetched the muiDialogTitle and the wizardNavigation.
     * Without them we can't calculate the height of the whole header section.
     */
    const headerHeight =
      muiDialogTitle.offsetHeight + wizardNavigation
        ? wizardNavigation.offsetHeight
        : 0;

    /**
     * The last thing before scrolling is to fetch the target HTMLElement
     * where we're going to scroll to. As the name of this function refers to
     * the element refers to the Opiskelijavuodet section.
     **/
    const targetElement = head(
      document.querySelectorAll('[aria-labelledby="opiskelijavuodet-summary"]')
    );

    if (targetElement) {
      /**
       * All is ready! Let's scroll. -90 = It's nice to see the title of
       * Opiskelijavuodet section. You can calculate the number the same way
       * as the other heights are calculated maybe we have calculated enough.
       **/
      wizardContent.scrollTo(
        0,
        targetElement.offsetParent.offsetTop - headerHeight - 190
      );
    }
  }
}
