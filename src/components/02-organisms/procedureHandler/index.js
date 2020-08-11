import {
  addIndex,
  append,
  assocPath,
  find,
  flatten,
  map,
  path,
  propEq,
  zipObj,
  split
} from "ramda";
import { procedures } from "./procedures";
import cytoscape from "cytoscape";
import cola from "cytoscape-cola";
import moment from "moment";

const isDebugOn = process.env.REACT_APP_DEBUG === "true";

const arrayToObject = (array, keyField) =>
  array.reduce((obj, item) => {
    return assocPath(split(".", item[keyField]), item, obj);
  }, {});

/**
 * Instance of ProcedureHandler can be used to run procedures.
 * A procedure can be linked with other procedures forming a tree. The
 * tree will be parsed by a procedure handler.
 *
 *  Example of a procedure tree:
 *
 *  tallennaJaLahetaMuutospyynto
 *     -- on success --> muutospyynnonTallennusOnnistui
 *                   --> asetaMuutospyynnonTilaksiAvoin
 *     -- on error   --> muutospyynnonLahettaminenEpaonnistui
 *
 *  asetaMuutospyynnonTilaksiAvoin
 *     -- on success --> muutospyynnonLahettaminenOnnistui
 *     -- on error   --> muutospyynnonLahettaminenEpaonnistui
 *
 *  muutospyynnonLahettaminenOnnistui
 *     -- on success --> getUrlOfMuutospyyntojenListaus
 *
 *  For more details see the procedures folder of this project.
 **/

function ProcedureHandler(formatMessage) {
  let results = [];
  function draw(_results) {
    const elements = _results || results;
    if (isDebugOn && elements.length > 0) {
      const container = document.getElementById("cy");
      if (container) {
        const canvas = document.createElement("div");
        canvas.setAttribute(
          "class",
          "z-50 r-0 t-0 bg-gray-100 w-full h-64 border-t border-b border-gray-300"
        );
        canvas.setAttribute("id", `cy-${Math.random()}`);
        const p1 = document.createElement("span");
        p1.setAttribute("class", `absolute`);
        p1.textContent = `Date: ${moment().format(
          "DD:MM:YYYY"
        )} | Time: ${moment().format("HH:mm:ss")}`;
        canvas.appendChild(p1);

        const canvases = container.childNodes;
        if (canvases.length > 4) {
          container.removeChild(container.childNodes[0]);
        }
        container.appendChild(canvas);

        cytoscape.use(cola);

        cytoscape({
          container: canvas,

          boxSelectionEnabled: false,
          autounselectify: true,

          style: cytoscape
            .stylesheet()
            .selector("node")
            .style({
              label: "data(label)"
            })
            .selector("edge")
            .style({
              "curve-style": "bezier",
              "target-arrow-shape": "triangle",
              width: 2,
              "line-color": "#ddd",
              "target-arrow-color": "#00FF00"
            })
            .selector(".highlighted")
            .style({
              shape: "diamond",
              "background-color": "#61bffc",
              "line-color": "#61bffc",
              "target-arrow-color": "#61bffc",
              "transition-property":
                "background-color, line-color, target-arrow-color",
              "transition-duration": "0.5s"
            }),

          elements: {
            nodes: addIndex(map)((result, i) => {
              return {
                data: {
                  id: result.name,
                  label: result.label
                },
                classes: i === 0 ? "highlighted" : ""
              };
            }, elements),
            edges: map(result => {
              return result.source &&
                result.name &&
                find(propEq("name", result.source), elements)
                ? {
                    data: {
                      id: `${result.source}->${result.name}`,
                      source: result.source,
                      target: result.name
                    }
                  }
                : null;
            }, elements).filter(Boolean)
          },

          layout: {
            name: "cola",
            randomize: false,
            fit: true
          }
        });
      } else {
        console.warn(
          "ProcedureHandler can't draw: HTML tag with class 'cy' not found!"
        );
      }
    }
    return true;
  }

  function setResults(_results) {
    results = _results;
    return results;
  }

  async function run(
    name,
    source,
    input = [],
    edges = [],
    nodes = [],
    results = []
  ) {
    const procedureTmp = path(split(".", name), procedures);
    const procedure =
      procedureTmp instanceof Function
        ? procedureTmp(formatMessage)
        : procedureTmp;
    if (procedure) {
      const _nodes = append({ data: { id: name } }, nodes);
      const zipd =
        input.length > 0 && procedure.input
          ? zipObj(procedure.input, input)
          : null;
      const fromRun = await procedure.run(zipd);
      const output = procedure.output
        ? await procedure.output(fromRun)
        : fromRun;
      const nextProcedureNames = procedure.next
        ? procedure.next(fromRun)
        : null;
      results.push({ label: procedure.label, name, source, output });
      /**
       * Let's run the next steps if there are any.
       */
      if (Array.isArray(nextProcedureNames)) {
        results.push(
          await Promise.all(
            map(async procedureName => {
              if (procedureName) {
                const _edges = append(
                  {
                    data: {
                      id: `${name}->${procedureName}`,
                      weight: 1,
                      source: name,
                      target: procedureName
                    }
                  },
                  edges
                );
                /**
                 * A new procedure handler is created here for better
                 * performance. The current procedure tree is branching here.
                 **/

                const procedureHandler = new ProcedureHandler(formatMessage);
                try {
                  return await procedureHandler.parseTree(
                    procedureName,
                    flatten([output]),
                    name,
                    _edges,
                    _nodes,
                    results
                  );
                } catch (err) {
                  console.error(err);
                }
              }
            }, nextProcedureNames)
          )
        );
      }
      return results;
    } else {
      throw new Error(`Can't find the procedure named as ${name}.`);
    }
  }

  async function parseTree(name, source, input) {
    const results = flatten(await run(name, source, input));
    setResults(results);
    return results;
  }

  return {
    /**
     * A procedure tree can be drawn on a canvas. Implementation uses the
     * Cytoscape library for drawing.
     */
    getOutput: (name, _results) => {
      const outputObj = find(propEq("name", name), _results || results) || {};
      return outputObj.output;
    },
    parseTree: async (name, input = [], source = null) => {
      return await parseTree(name, source, input);
    },
    /**
     * Main function.
     */
    run: async (name, input = [], source = null) => {
      const results = await parseTree(name, source, input);
      draw(results);
      return arrayToObject(results, "name");
    }
  };
}

export default ProcedureHandler;
