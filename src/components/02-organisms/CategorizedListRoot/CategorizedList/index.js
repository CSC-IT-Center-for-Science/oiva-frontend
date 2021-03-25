import React, { useCallback } from "react";
import PropTypes from "prop-types";
import RadioButtonWithLabel from "../../../01-molecules/RadioButtonWithLabel";
import CheckboxWithLabel from "../../../01-molecules/CheckboxWithLabel";
import StatusTextRow from "../../../01-molecules/StatusTextRow";
import Autocomplete from "../../../02-organisms/Autocomplete";
import Multiselect from "../../../02-organisms/Multiselect";
import Difference from "../../../02-organisms/Difference";
import SimpleButton from "../../../00-atoms/SimpleButton/index";
import { heights } from "../../../../css/autocomplete";
import { flattenObj, removeAnchorPart } from "../../../../utils/common";
import Datepicker from "../../../00-atoms/Datepicker";
import Dropdown from "../../../00-atoms/Dropdown";
import AlertMessage from "../../../00-atoms/Alert";
import TextBox from "../../../00-atoms/TextBox/index";
import Input from "../../../00-atoms/Input";
import Attachments from "../../Attachments";
import * as R from "ramda";
import { map } from "lodash";
import CategoryFilter from "../../CategoryFilter";
import FormTitle from "components/00-atoms/FormTitle";
import List from "components/01-molecules/List";
import { Typography } from "@material-ui/core";
import RajoitteetList from "components/02-organisms/RajoitteetList";
import Rajoite from "components/02-organisms/Rajoite";
import HtmlContent from "components/01-molecules/HtmlContent";

/** @namespace components */

/**
 * @module 02-organisms
 */

const componentContainerBaseClasses = ["flex", "flex-wrap", "flex-col"];

const componentStyleMapping = {
  justification: {
    between: "justify-between",
    start: "justify-start"
  },
  verticalAlignment: {
    center: "items-center"
  }
};

const categoryStyleMapping = {
  indentations: {
    none: 0,
    extraSmall: 2,
    small: 4,
    medium: 6,
    large: 10
  },
  margins: {
    none: 0,
    extraSmall: 2,
    small: 4,
    medium: 6,
    large: 10
  }
};

/**
 * With a layout strategy you can influence to paddings and margins
 * of a CategorizedList. Default setting sets use evenly spacing and
 * "groups" tries to separate category paths / threes from each other.
 */
const layoutStrategies = [{ key: "default" }, { key: "groups" }];

const defaultComponentStyles = {
  justification: componentStyleMapping.justification.between,
  verticalAlignment: componentStyleMapping.verticalAlignment.center
};

const defaultCategoryStyles = {
  indentation: categoryStyleMapping.indentations.large,
  /**
   * Default layout strategy is set here. You can change the strategy by
   * giving the category a layout property with desired strategy.
   * E.g. layout: { strategy: { key: "groups" }}
   **/
  layoutStrategy: R.find(R.propEq("key", "default"), layoutStrategies),
  margins: {
    top: categoryStyleMapping.margins.none
  }
};

/**
 * Returns a change object by the given anchor.
 * @param {string} anchor - Identifies the change object that is being searched for.
 * @param {array} changes - Array of change objects.
 * @returns {object} - Change object.
 */
const getChangeObjByAnchor = (anchor, changes) => {
  return R.find(R.propEq("anchor", anchor), changes) || { properties: {} };
};

/**
 * Combines the properties of the component with the properties of the
 * change object.
 * @param {object} changeObj - Change object.
 * @param {object} component - Node / component of a form.
 */
const getPropertiesObject = (
  changeObj = { properties: {} },
  component = { properties: {} }
) => {
  return Object.assign(
    {},
    R.prop("properties", component) || {},
    R.prop("properties", changeObj) || {}
  );
};

/**
 * CategorizedList loops through the form structure and handles everything in it.
 * It has a render function where it creates - if needed - more CategorizedLists.
 * The end result is group of DOM elements. The group will be returned to the
 * CategorizedListRoot component and it will pass it forward to the component
 * that uses the CategorizedListRoot. When user makes changes on to the form the
 * form structure will be gone through again and so the form will be updated.
 */
const CategorizedList = props => {
  const { onChangesUpdate, onFocus, showValidationErrors } = props;

  /**
   * This is the most common handling function for the components
   * in CategorizedList's scope. Please note that metadata of
   * change objects will be attached to them in this function.
   * The idea behind the code is to call onChangeUpdate callback
   * function with a change object related to the component that
   * user has interacted with.
   */
  const handleChanges = useCallback(
    ({ forChangeObject, fullAnchor }, changeProps) => {
      const changeObj = {
        anchor: removeAnchorPart(fullAnchor, 0),
        properties: R.reject(R.isNil)({
          ...changeProps,
          metadata: forChangeObject
        })
      };
      return onChangesUpdate(changeObj);
    },
    [onChangesUpdate]
  );

  /**
   * Rendering starts here.
   */
  return (
    <div data-anchor={props.anchor}>
      {/**
       * Categories will be looped here.
       */
      map(props.categories, (category, i) => {
        if (category.isVisible === false) {
          return null;
        }
        /**
         * Category can have a title. !props.showCategoryTitles means
         * that the title won't be shown in UI. You can see the whole
         * visibility rule under this code comment.
         */
        const isCategoryTitleVisible =
          props.showCategoryTitles && !!(category.code || category.title);

        // Anchor identifies a change object.
        const anchor = `${props.anchor}.${category.anchor}`;

        /**
         * R = Ramda library (https://ramdajs.com/docs/). Dot is the
         * default separator of an anchor chain.
         **/

        const splittedAnchor = R.split(".", anchor);

        /**
         * props.changes includes all the changes of current form. The
         * unrelevant ones will be filtered out and the relevant ones
         * will be stored into categoryChanges variable.
         */
        const categoryChanges = R.filter(
          R.compose(
            R.equals(splittedAnchor),
            R.slice(0, splittedAnchor.length),
            R.split("."),
            R.prop("anchor")
          ),
          props.changes
        );

        // Category related layout styles.
        const { components, indentation, strategy, margins } =
          category.layout || {};

        const topMarginInteger =
          margins &&
          margins.top &&
          !R.isNil(categoryStyleMapping.margins[margins.top])
            ? categoryStyleMapping.margins[margins.top]
            : defaultCategoryStyles.margins.top;

        const layoutStrategyMapping = {
          margins: {
            top: {
              default: Number(!!i) * topMarginInteger,
              groups:
                Number(!!i) * Math.max(10 - 2 * props.level, 0) +
                topMarginInteger
            }
          }
        };

        const categoryLayout = {
          margins: {
            top:
              layoutStrategyMapping.margins.top[
                strategy
                  ? strategy.key
                  : defaultCategoryStyles.layoutStrategy.key
              ]
          }
        };

        const categoryStyles = {
          classes: {
            indentation: `pl-${
              !R.isNil(categoryStyleMapping.indentations[indentation])
                ? categoryStyleMapping.indentations[indentation]
                : // Number(!!props.level) returns 0 when props.level is 0 otherwise 1
                  Number(!!props.level) * defaultCategoryStyles.indentation
            }`,
            margins: {
              top: `pt-${categoryLayout.margins.top}`
            },
            custom: R.join(" ", category.styleClasses || [])
          }
        };

        // Component related layout styles.
        const { justification } =
          R.path(["layout", "components"], category) || {};

        const componentStyles = {
          classes: {
            justification:
              justification &&
              !R.isNil(componentStyleMapping.justification[justification])
                ? componentStyleMapping.justification[justification]
                : defaultComponentStyles.justification,
            verticalAlignment:
              componentStyleMapping.verticalAlignment[
                category.alignComponents
              ] || defaultComponentStyles.verticalAlignment
          }
        };

        let componentContainerClasses = R.concat(
          componentContainerBaseClasses,
          R.values(
            R.mapObjIndexed(styleClass => {
              return styleClass;
            }, componentStyles.classes)
          )
        );

        if (components && components.vertical) {
          componentContainerClasses = R.append(
            "items-baseline",
            componentContainerClasses
          );
        } else {
          componentContainerClasses = R.append(
            "sm:flex-row",
            componentContainerClasses
          );
        }

        const categoryTitleClasses = R.join(" ", [
          `py-${topMarginInteger}`,
          i === 0 ? "" : `mt-${2 * topMarginInteger}`
        ]);

        const categoryClasses = R.values(flattenObj(categoryStyles.classes));

        /**
         * A single category can have multiple components. The title section
         * of the category will be rendered first and the components will be
         * looped through after it.
         **/
        return (
          <div
            key={i}
            className={R.join(" ", categoryClasses)}
            data-level={props.level}
            id={anchor}
          >
            {isCategoryTitleVisible && (
              <div className={categoryTitleClasses}>
                <Typography component="h4" variant="h4">
                  {category.code && (
                    <span className="mr-4">{category.code}</span>
                  )}
                  <span>{category.title}</span>
                  {!category.isReadOnly && category.isRequired && (
                    <span className="pr-4">*</span>
                  )}
                </Typography>
              </div>
            )}
            <div className={R.join(" ", componentContainerClasses)}>
              {map(category.components, (component, ii) => {
                const fullAnchor = `${anchor}.${component.anchor}`;
                const fullPath = props.rootPath.concat([i, "components", ii]);
                const changeObj = getChangeObjByAnchor(
                  fullAnchor,
                  props.changes
                );
                const parentComponent =
                  props.parent && props.parent.category.components
                    ? props.parent.category.components[0]
                    : null;
                const parentChangeObj = parentComponent
                  ? getChangeObjByAnchor(
                      `${props.parent.anchor}.${parentComponent.anchor}`,
                      props.changes
                    )
                  : {};
                /**
                 * Override component properties with the change object properties
                 * to display the state after changes.
                 */
                const propsObj = getPropertiesObject(changeObj, component);

                // isAddition and isRemoved exist for styling purposes.
                const isAddition = !!changeObj.properties.isChecked;
                const isRemoved =
                  R.has("isChecked")(changeObj.properties) &&
                  !changeObj.properties.isChecked;
                const labelStyles = Object.assign(
                  {},
                  isAddition ? (propsObj.labelStyles || {}).addition : {},
                  isRemoved ? (propsObj.labelStyles || {}).removal : {},
                  (propsObj.labelStyles || {}).custom || {}
                );
                const styleClasses = component.styleClasses || [];
                const styleClassesStr = R.join(" ", styleClasses);
                const title =
                  propsObj.title +
                  (props.debug
                    ? props.rootPath.concat([i, "components", ii])
                    : "");

                if (propsObj.isVisible === false) {
                  return null;
                }

                const leadingClass = propsObj.isPreviewModeOn
                  ? ""
                  : "leading-none";

                /**
                 * Component is defined in a form structure. There can be
                 * different sort of components and their all need the
                 * proper parameters. If you must add more components on
                 * the following list please define how the component's
                 * callback functions should be handled. And remember to
                 * import the component in the beginning of this file.
                 **/
                return (
                  <React.Fragment key={`item-${ii}`}>
                    {component.name === "CheckboxWithLabel" && (
                      <div className={styleClassesStr}>
                        <CheckboxWithLabel
                          forChangeObject={component.properties.forChangeObject}
                          fullAnchor={fullAnchor}
                          id={fullAnchor}
                          name={component.name}
                          isChecked={propsObj.isChecked}
                          isDisabled={propsObj.isDisabled}
                          isIndeterminate={propsObj.isIndeterminate}
                          isPreviewModeOn={propsObj.isPreviewModeOn}
                          isReadOnly={propsObj.isReadOnly}
                          onChanges={handleChanges}
                          labelStyles={labelStyles}
                        >
                          <div className="flex">
                            {propsObj.code ? (
                              <span className={`${leadingClass}`}>
                                {propsObj.code}
                              </span>
                            ) : null}
                            <p className={`p-0 ml-4 ${leadingClass}`}>
                              {title}
                            </p>
                          </div>
                        </CheckboxWithLabel>
                      </div>
                    )}
                    {component.name === "FormTitle" && (
                      <FormTitle
                        code={propsObj.code}
                        id={fullAnchor}
                        isPreviewModeOn={propsObj.isPreviewModeOn}
                        level={propsObj.level}
                        title={propsObj.title}
                      />
                    )}
                    {component.name === "List" && (
                      <List id={fullAnchor} items={propsObj.items} />
                    )}
                    {component.name === "RadioButtonWithLabel" && (
                      <div className="flex-2">
                        <RadioButtonWithLabel
                          forChangeObject={component.properties.forChangeObject}
                          fullAnchor={fullAnchor}
                          id={fullAnchor}
                          name={propsObj.name}
                          isChecked={propsObj.isChecked}
                          isPreviewModeOn={propsObj.isPreviewModeOn}
                          isReadOnly={propsObj.isReadOnly}
                          onChanges={handleChanges}
                          labelStyles={labelStyles}
                          value={propsObj.value}
                          className="flex-row"
                        >
                          <div className="flex">
                            {propsObj.code ? (
                              <span className={`${leadingClass}`}>
                                {propsObj.code}
                              </span>
                            ) : null}
                            <p className={`p-0 ml-4 ${leadingClass}`}>
                              {title}
                            </p>
                          </div>
                        </RadioButtonWithLabel>
                      </div>
                    )}
                    {component.name === "Dropdown"
                      ? (category => {
                          const previousSibling =
                            category.components[ii - 1] || {};
                          const isPreviousSiblingCheckedByDefault = !!(
                            previousSibling.properties || {}
                          ).isChecked;
                          const previousSiblingFullAnchor = `${anchor}.${previousSibling.anchor}`;
                          const change = getChangeObjByAnchor(
                            previousSiblingFullAnchor,
                            props.changes
                          );
                          const isDisabled =
                            propsObj.isReadOnly ||
                            ((previousSibling.name === "CheckboxWithLabel" ||
                              previousSibling.name ===
                                "RadioButtonWithLabel") &&
                              !(
                                isPreviousSiblingCheckedByDefault ||
                                change.properties.isChecked
                              ));
                          return (
                            <div className={styleClassesStr || "px-2 mb-1"}>
                              <Dropdown
                                forChangeObject={
                                  component.properties.forChangeObject
                                }
                                fullAnchor={fullAnchor}
                                fullWidth={true}
                                id={fullAnchor}
                                isDisabled={isDisabled}
                                isHidden={propsObj.isHidden}
                                isPreviewModeOn={propsObj.isPreviewModeOn}
                                isReadOnly={propsObj.isReadOnly}
                                onChanges={handleChanges}
                                options={propsObj.options}
                                placeholder={propsObj.placeholder}
                                requiredMessage={propsObj.requiredMessage}
                                showValidationErrors={showValidationErrors}
                                value={propsObj.selectedOption}
                              />
                            </div>
                          );
                        })(category)
                      : null}
                    {component.name === "TextBox"
                      ? (() => {
                          const isDisabled =
                            parentComponent &&
                            R.includes(parentComponent.name, [
                              "CheckboxWithLabel",
                              "RadioButtonWithLabel"
                            ]) &&
                            ((!parentComponent.properties.isChecked &&
                              R.isEmpty(parentChangeObj.properties)) ||
                              parentChangeObj.properties.isChecked === false);
                          return (
                            <div className={styleClassesStr || "w-full"}>
                              <TextBox
                                forChangeObject={
                                  component.properties.forChangeObject
                                }
                                fullAnchor={fullAnchor}
                                id={fullAnchor}
                                isDisabled={isDisabled}
                                isErroneous={propsObj.isErroneous}
                                isHidden={isDisabled}
                                isPreviewModeOn={propsObj.isPreviewModeOn}
                                isReadOnly={propsObj.isReadOnly}
                                isRemovable={propsObj.isRemovable}
                                isRequired={propsObj.isRequired}
                                isValid={propsObj.isValid}
                                onChanges={handleChanges}
                                onFocus={onFocus}
                                placeholder={propsObj.placeholder}
                                shouldHaveFocusAt={
                                  props.focusOn &&
                                  R.propEq("anchor", fullAnchor, props.focusOn)
                                    ? R.prop("focusSetAt", props.focusOn)
                                    : undefined
                                }
                                title={propsObj.title}
                                tooltip={propsObj.tooltip}
                                value={propsObj.value}
                                showValidationErrors={showValidationErrors}
                                requiredMessage={propsObj.requiredMessage}
                              />
                            </div>
                          );
                        })()
                      : null}
                    {component.name === "Input"
                      ? (() => {
                          let parentComponent = null;
                          let isDisabled = false;
                          if (
                            props.parent &&
                            props.parent.category.components
                          ) {
                            parentComponent =
                              props.parent.category.components[0];
                            if (parentComponent) {
                              const parentChange = getChangeObjByAnchor(
                                `${props.parent.anchor}.${parentComponent.anchor}`,
                                props.changes
                              );
                              isDisabled =
                                R.includes(parentComponent.name, [
                                  "CheckboxWithLabel",
                                  "RadioButtonWithLabel"
                                ]) &&
                                ((!parentComponent.properties.isChecked &&
                                  R.isEmpty(parentChange.properties)) ||
                                  !parentChange.properties.isChecked);
                            } else {
                              console.warn(
                                "Inputilla",
                                component,
                                propsObj,
                                "ei ole parenttia."
                              );
                            }
                          }
                          return (
                            <div className={styleClassesStr}>
                              <Input
                                forChangeObject={
                                  component.properties.forChangeObject
                                }
                                fullAnchor={fullAnchor}
                                id={fullAnchor}
                                isDisabled={isDisabled}
                                isHidden={propsObj.isHidden}
                                isPreviewModeOn={propsObj.isPreviewModeOn}
                                isReadOnly={propsObj.isReadOnly}
                                isRequired={propsObj.isRequired}
                                isValid={propsObj.isValid}
                                label={propsObj.label}
                                onChanges={handleChanges}
                                error={propsObj.error}
                                fullWidth={propsObj.fullWidth}
                                width={propsObj.width}
                                placeholder={propsObj.placeholder}
                                tooltip={propsObj.tooltip}
                                type={propsObj.type}
                                value={propsObj.value}
                                showValidationErrors={showValidationErrors}
                                requiredMessage={propsObj.requiredMessage}
                              />
                            </div>
                          );
                        })()
                      : null}
                    {component.name === "Attachments"
                      ? (category => {
                          const previousSibling =
                            category.components[ii - 1] || {};
                          const isPreviousSiblingCheckedByDefault = !!(
                            previousSibling.properties || {}
                          ).isChecked;
                          const previousSiblingFullAnchor = `${anchor}.${previousSibling.anchor}`;
                          const change = getChangeObjByAnchor(
                            previousSiblingFullAnchor,
                            props.changes
                          );
                          const isDisabled =
                            (previousSibling.name === "CheckboxWithLabel" ||
                              previousSibling.name ===
                                "RadioButtonWithLabel") &&
                            !(
                              isPreviousSiblingCheckedByDefault ||
                              change.properties.isChecked
                            );
                          let attachments = propsObj.attachments || [];
                          return (
                            <div className={styleClassesStr}>
                              <Attachments
                                id={fullAnchor}
                                isDisabled={isDisabled}
                                onUpdate={handleChanges}
                                payload={{
                                  anchor,
                                  categories: category.categories,
                                  component,
                                  fullPath,
                                  parent: props.parent,
                                  rootPath: props.rootPath,
                                  attachments: attachments
                                }}
                                messages={component.messages}
                                placement={props.placement}
                                isReadOnly={propsObj.isReadOnly}
                                isRequired={propsObj.isRequired}
                                requiredMessage={propsObj.requiredMessage}
                                showValidationErrors={showValidationErrors}
                              />
                            </div>
                          );
                        })(category)
                      : null}
                    {component.name === "StatusTextRow"
                      ? (() => {
                          return (
                            <div className={styleClassesStr}>
                              <StatusTextRow
                                code={propsObj.code}
                                labelStyles={labelStyles}
                                styleClasses={styleClasses}
                                layout={component.layout}
                                statusText={propsObj.statusText}
                                statusTextStyleClasses={
                                  propsObj.statusTextStyleClasses
                                }
                                isHidden={propsObj.isHidden}
                                isReadOnly={propsObj.isReadOnly}
                                isRequired={propsObj.isRequired}
                                isValid={propsObj.isValid}
                                title={propsObj.title}
                              ></StatusTextRow>
                            </div>
                          );
                        })(category)
                      : null}
                    {component.name === "Alert"
                      ? (() => {
                          const hasCheckableParent =
                            parentComponent &&
                            R.includes(parentComponent.name, [
                              "CheckboxWithLabel",
                              "RadioButtonWithLabel"
                            ]);
                          const isHiddenByParentComponent =
                            hasCheckableParent &&
                            ((!parentComponent.properties.isChecked &&
                              R.isEmpty(parentChangeObj.properties)) ||
                              parentChangeObj.properties.isChecked === false);
                          const isVisible = hasCheckableParent
                            ? !isHiddenByParentComponent
                            : props.isVisible;
                          return (
                            <div className={`flex-1 mb-2 ${styleClassesStr}`}>
                              <AlertMessage
                                ariaLabel={propsObj.ariaLabel}
                                handleLinkClick={propsObj.handleLinkClick}
                                id={fullAnchor}
                                isVisible={isVisible}
                                link={propsObj.link}
                                linkText={propsObj.linkText}
                                linkUrl={propsObj.linkUrl}
                                message={propsObj.message}
                                title={propsObj.title}
                                type={propsObj.type}
                              />
                            </div>
                          );
                        })(category)
                      : null}
                    {component.name === "Multiselect"
                      ? (category => {
                          const previousSibling =
                            category.components[ii - 1] || {};
                          const isPreviousSiblingCheckedByDefault = !!(
                            previousSibling.properties || {}
                          ).isChecked;
                          const previousSiblingFullAnchor = `${anchor}.${previousSibling.anchor}`;
                          const change = getChangeObjByAnchor(
                            previousSiblingFullAnchor,
                            props.changes
                          );
                          const isDisabled =
                            (previousSibling.name === "CheckboxWithLabel" ||
                              previousSibling.name ===
                                "RadioButtonWithLabel") &&
                            !(
                              isPreviousSiblingCheckedByDefault ||
                              change.properties.isChecked
                            );
                          return (
                            <div className={`flex-1 ${styleClassesStr}`}>
                              <Multiselect
                                ariaLabel={propsObj.ariaLabel}
                                callback={handleChanges}
                                id={fullAnchor}
                                isDisabled={isDisabled}
                                isMulti={propsObj.isMulti}
                                isRequired={propsObj.isRequired}
                                isReadOnly={propsObj.isReadOnly}
                                isValid={propsObj.isValid}
                                options={propsObj.options}
                                payload={{
                                  anchor,
                                  categories: category.categories,
                                  component,
                                  fullPath,
                                  parent: props.parent,
                                  rootPath: props.rootPath
                                }}
                                placeholder={propsObj.placeholder}
                                value={R.flatten([propsObj.value])}
                                height={heights.SHORT}
                                width={propsObj.width}
                                autoSize={propsObj.autoSize}
                                title={propsObj.title}
                              />
                            </div>
                          );
                        })(category)
                      : null}
                    {component.name === "Autocomplete"
                      ? (category => {
                          const previousSibling =
                            category.components[ii - 1] || {};
                          const isPreviousSiblingCheckedByDefault = !!(
                            previousSibling.properties || {}
                          ).isChecked;
                          const previousSiblingFullAnchor = `${anchor}.${previousSibling.anchor}`;
                          const change = getChangeObjByAnchor(
                            previousSiblingFullAnchor,
                            props.changes
                          );
                          const isDisabled =
                            (previousSibling.name === "CheckboxWithLabel" ||
                              previousSibling.name ===
                                "RadioButtonWithLabel") &&
                            !(
                              isPreviousSiblingCheckedByDefault ||
                              change.properties.isChecked
                            );
                          return (
                            <div className={styleClassesStr || "flex-1"}>
                              <Autocomplete
                                callback={handleChanges}
                                forChangeObject={
                                  component.properties.forChangeObject
                                }
                                fullAnchor={fullAnchor}
                                id={fullAnchor}
                                inputId={propsObj.inputId}
                                isMulti={propsObj.isMulti}
                                isPreviewModeOn={propsObj.isPreviewModeOn}
                                isRequired={propsObj.isRequired}
                                isReadOnly={propsObj.isReadOnly}
                                isValid={propsObj.isValid}
                                isVisible={propsObj.isVisible}
                                options={propsObj.options}
                                placeholder={propsObj.placeholder}
                                value={R.flatten([propsObj.value])}
                                isDisabled={isDisabled}
                                height={heights.SHORT}
                                short={component.short}
                                title={propsObj.title}
                                hideSelectedOptions={
                                  propsObj.hideSelectedOptions
                                }
                              />
                            </div>
                          );
                        })(category)
                      : null}
                    {component.name === "Difference" && (
                      <div className="flex-2">
                        <Difference
                          applyForValue={propsObj.applyForValue}
                          forChangeObject={component.properties.forChangeObject}
                          fullAnchor={fullAnchor}
                          id={fullAnchor}
                          initialValue={propsObj.initialValue}
                          isReadOnly={propsObj.isReadOnly}
                          isRequired={propsObj.isRequired}
                          onChanges={handleChanges}
                          titles={propsObj.titles}
                        />
                      </div>
                    )}
                    {component.name === "HtmlContent" && (
                      <HtmlContent content={propsObj.content} />
                    )}
                    {component.name === "SimpleButton"
                      ? (() => {
                          const isDisabled =
                            parentComponent &&
                            R.includes(parentComponent.name, [
                              "CheckboxWithLabel",
                              "RadioButtonWithLabel"
                            ]) &&
                            ((!parentComponent.properties.isChecked &&
                              R.isEmpty(parentChangeObj.properties)) ||
                              parentChangeObj.properties.isChecked === false);
                          return (
                            <div className={`${styleClassesStr} flex-2`}>
                              <SimpleButton
                                forChangeObject={
                                  component.properties.forChangeObject
                                }
                                fullAnchor={fullAnchor}
                                id={fullAnchor}
                                isDisabled={isDisabled}
                                isHidden={isDisabled}
                                isReadOnly={propsObj.isReadOnly}
                                text={propsObj.text}
                                variant={propsObj.variant}
                                icon={propsObj.icon}
                                iconContainerStyles={
                                  propsObj.iconContainerStyles
                                }
                                iconStyles={propsObj.iconStyles}
                                onClick={component.onClick}
                                payload={{
                                  anchor,
                                  categories: category.categories,
                                  component,
                                  fullPath,
                                  parent: props.parent,
                                  rootPath: props.rootPath
                                }}
                                shouldHaveFocusAt={
                                  props.focusOn &&
                                  R.propEq("anchor", fullAnchor, props.focusOn)
                                    ? R.prop("focusSetAt", props.focusOn)
                                    : undefined
                                }
                              />
                            </div>
                          );
                        })()
                      : null}
                    {component.name === "Datepicker" && (
                      <div className={styleClassesStr}>
                        <Datepicker
                          clearable={propsObj.clearable}
                          disableFuture={propsObj.disableFuture}
                          disablePast={propsObj.disablePast}
                          error={propsObj.error}
                          forChangeObject={component.properties.forChangeObject}
                          fullAnchor={fullAnchor}
                          fullWidth={propsObj.fullWidth}
                          isDisabled={propsObj.isDisabled}
                          isHidden={propsObj.isHidden}
                          isReadOnly={propsObj.isReadOnly}
                          isRequired={propsObj.isRequired}
                          label={propsObj.label}
                          locale={propsObj.locale}
                          minDate={propsObj.minDate}
                          maxDate={propsObj.maxDate}
                          messages={propsObj.localizations}
                          onChanges={handleChanges}
                          placeholder={propsObj.placeholder}
                          requiredMessage={propsObj.requiredMessage}
                          showTodayButton={propsObj.showTodayButton}
                          showValidationErrors={showValidationErrors}
                          value={propsObj.value}
                          variant={propsObj.variant}
                          width={propsObj.width}
                        />
                      </div>
                    )}
                    {component.name === "CategoryFilter" && (
                      <div className={`${styleClassesStr} flex-2`}>
                        <CategoryFilter
                          anchor={propsObj.anchor}
                          changeObjectsByProvince={
                            propsObj.changeObjectsByProvince
                          }
                          isEditViewActive={propsObj.isEditViewActive}
                          isPreviewModeOn={propsObj.isPreviewModeOn}
                          localizations={propsObj.localizations}
                          municipalities={propsObj.municipalities}
                          provinces={propsObj.provinces}
                          provincesWithoutMunicipalities={
                            propsObj.provincesWithoutMunicipalities
                          }
                          showCategoryTitles={propsObj.showCategoryTitles}
                          toggleEditView={propsObj.toggleEditView}
                          onChanges={propsObj.onChanges}
                          nothingInLupa={propsObj.nothingInLupa}
                          koulutustyyppi={propsObj.koulutustyyppi}
                          payload={{
                            anchor,
                            categories: category.categories,
                            component,
                            fullPath,
                            parent: props.parent,
                            rootPath: props.rootPath
                          }}
                        />
                      </div>
                    )}
                    {component.name === "Rajoite" && (
                      <Rajoite
                        id={propsObj.id}
                        index={propsObj.index}
                        kriteerit={propsObj.kriteerit}
                        onModifyRestriction={component.onModifyRestriction}
                        onRemoveRestriction={component.onRemoveRestriction}
                        rajoite={propsObj.rajoite}
                        rajoitusPropValue={propsObj.rajoitusPropValue}
                      />
                    )}
                    {component.name === "RajoitteetList" && (
                      <RajoitteetList
                        areTitlesVisible={propsObj.areTitlesVisible}
                        isBorderVisible={propsObj.isBorderVisible}
                        locale={propsObj.locale}
                        rajoitteet={propsObj.rajoitteet}
                        onModifyRestriction={propsObj.onModifyRestriction}
                        onRemoveRestriction={propsObj.onRemoveRestriction}
                      />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
            {/**
             * Important! If the current category has child categories
             * new instance of the CategorizedList component will be created.
             * The structure can therefore have multiple levels.
             * Please read the wiki dokument about the CategorizedList for
             * more information.
             **/
            category.categories && (
              <CategorizedList
                anchor={anchor}
                focusOn={props.focusOn}
                categories={category.categories}
                changes={categoryChanges}
                debug={props.debug}
                id={`${props.id}-${category.code}`}
                level={props.level + 1}
                parent={{
                  anchor,
                  category,
                  parent: props.parent,
                  rootPath: props.rootPath
                }}
                parentRootPath={props.rootPath}
                rootPath={props.rootPath.concat([i, "categories"])}
                runRootOperations={props.runRootOperations}
                showCategoryTitles={props.showCategoryTitles}
                onChangesUpdate={props.onChangesUpdate}
                onFocus={props.onFocus}
                showValidationErrors={showValidationErrors}
                requiredMessage={props.requiredMessage}
              />
            )}
          </div>
        );
      }).filter(Boolean)}
    </div>
  );
};

CategorizedList.defaultProps = {
  level: 0
};

CategorizedList.propTypes = {
  anchor: PropTypes.string,
  focusOn: PropTypes.object,
  categories: PropTypes.array,
  changes: PropTypes.array,
  debug: PropTypes.bool,
  parentCategory: PropTypes.object,
  path: PropTypes.array,
  runRootOperations: PropTypes.func,
  showCategoryTitles: PropTypes.bool,
  onChangesUpdate: PropTypes.func,
  onChangesRemove: PropTypes.func,
  onFocus: PropTypes.func
};

CategorizedList.displayName = "CategorizedList222";

export default CategorizedList;
