(function () {
  "use strict";

  /*
   * Rendering contract
   * ------------------
   * - Node color, radius, and the number inside each node encode how many listed
   *   publications include that person.
   * - Line width encodes how many publications a pair of people share.
   * - The default view shows every focus-person link plus recurring co-author
   *   links; selecting a person reveals all of that person's one-off links too.
   *
   * Publication and author updates belong in
   * `_data/collaboration_publications.yml`, whose header documents the format.
   */
  var SVG_NS = "http://www.w3.org/2000/svg";
  var GRAPH_WIDTH = 620;
  var GRAPH_HEIGHT = 520;
  var CENTER_X = GRAPH_WIDTH / 2;
  var CENTER_Y = GRAPH_HEIGHT / 2;

  function onReady(callback) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", callback);
      return;
    }

    callback();
  }

  function createElement(tagName, className, text) {
    var element = document.createElement(tagName);

    if (className) {
      element.className = className;
    }

    if (typeof text === "string") {
      element.textContent = text;
    }

    return element;
  }

  function createSvgElement(tagName, attributes) {
    var element = document.createElementNS(SVG_NS, tagName);

    Object.keys(attributes || {}).forEach(function (name) {
      element.setAttribute(name, String(attributes[name]));
    });

    return element;
  }

  function uniqueNames(authors) {
    var seen = {};

    return (authors || []).map(function (author) {
      return String(author || "").trim();
    }).filter(function (author) {
      if (!author || seen[author]) {
        return false;
      }

      seen[author] = true;
      return true;
    });
  }

  function buildNetwork(publications) {
    var nodesByName = {};
    var edgesByKey = {};

    publications.forEach(function (publication, publicationIndex) {
      var authors = uniqueNames(publication.authors);

      authors.forEach(function (author) {
        if (!nodesByName[author]) {
          nodesByName[author] = {
            name: author,
            count: 0,
            firstPublicationIndex: publicationIndex,
            collaborators: {}
          };
        }

        nodesByName[author].count += 1;
      });

      authors.forEach(function (source, sourceIndex) {
        authors.slice(sourceIndex + 1).forEach(function (target) {
          var ordered = [source, target].sort();
          var key = ordered[0] + "\u0000" + ordered[1];

          if (!edgesByKey[key]) {
            edgesByKey[key] = {
              key: key,
              source: nodesByName[ordered[0]],
              target: nodesByName[ordered[1]],
              weight: 0
            };
          }

          edgesByKey[key].weight += 1;
        });
      });
    });

    var nodes = Object.keys(nodesByName).map(function (name) {
      return nodesByName[name];
    });
    var edges = Object.keys(edgesByKey).map(function (key) {
      var edge = edgesByKey[key];

      edge.source.collaborators[edge.target.name] = edge;
      edge.target.collaborators[edge.source.name] = edge;
      return edge;
    });

    return {
      nodes: nodes,
      edges: edges,
      nodesByName: nodesByName
    };
  }

  function compareByCount(left, right) {
    return right.count - left.count ||
      left.firstPublicationIndex - right.firstPublicationIndex ||
      left.name.localeCompare(right.name);
  }

  function placeRing(nodes, radiusX, radiusY, rotation) {
    nodes.sort(compareByCount).forEach(function (node, index) {
      var angle = rotation + (Math.PI * 2 * index / nodes.length);

      node.x = CENTER_X + Math.cos(angle) * radiusX;
      node.y = CENTER_Y + Math.sin(angle) * radiusY;
    });
  }

  function positionNodes(nodes, focusPerson) {
    var inner = [];
    var middle = [];
    var outer = [];

    nodes.forEach(function (node) {
      if (node.name === focusPerson) {
        node.x = CENTER_X;
        node.y = CENTER_Y;
      } else if (node.count >= 4) {
        inner.push(node);
      } else if (node.count >= 2) {
        middle.push(node);
      } else {
        outer.push(node);
      }
    });

    placeRing(inner, 118, 100, -Math.PI / 2);
    placeRing(middle, 205, 164, -Math.PI * 0.4);
    placeRing(outer, 276, 224, -Math.PI * 0.45);
  }

  function interpolateColor(count, maximum) {
    var start = [213, 240, 245];
    var end = [4, 67, 109];
    var ratio = maximum <= 1 ? 1 : (count - 1) / (maximum - 1);
    var eased = Math.pow(ratio, 0.58);
    var channels = start.map(function (value, index) {
      return Math.round(value + (end[index] - value) * eased);
    });

    return "rgb(" + channels.join(",") + ")";
  }

  function nodeRadius(count, maximum, isFocusPerson) {
    if (isFocusPerson) {
      return 25;
    }

    return Math.min(21, 7 + 3.15 * Math.sqrt(count));
  }

  function edgePath(edge) {
    var source = edge.source;
    var target = edge.target;
    var midpointX = (source.x + target.x) / 2;
    var midpointY = (source.y + target.y) / 2;
    var deltaX = target.x - source.x;
    var deltaY = target.y - source.y;
    var length = Math.sqrt(deltaX * deltaX + deltaY * deltaY) || 1;
    var hash = edge.key.split("").reduce(function (total, character) {
      return total + character.charCodeAt(0);
    }, 0);
    var curve = edge.weight > 1 && source.x !== CENTER_X && target.x !== CENTER_X ?
      (hash % 2 ? 1 : -1) * Math.min(10, length * 0.035) :
      0;
    var controlX = midpointX - deltaY / length * curve;
    var controlY = midpointY + deltaX / length * curve;

    return "M " + source.x.toFixed(2) + " " + source.y.toFixed(2) +
      " Q " + controlX.toFixed(2) + " " + controlY.toFixed(2) +
      " " + target.x.toFixed(2) + " " + target.y.toFixed(2);
  }

  function labelPosition(node, radius) {
    var deltaX = node.x - CENTER_X;
    var deltaY = node.y - CENTER_Y;

    if (Math.abs(deltaX) < 38) {
      return {
        x: 0,
        y: deltaY < 0 ? -(radius + 8) : radius + 15,
        anchor: "middle"
      };
    }

    return {
      x: deltaX < 0 ? -(radius + 7) : radius + 7,
      y: 4,
      anchor: deltaX < 0 ? "end" : "start"
    };
  }

  function pluralize(count, singular, plural) {
    return count + " " + (count === 1 ? singular : plural);
  }

  function renderLegend(container, maximum) {
    var values = [1, Math.max(2, Math.ceil(maximum / 4)), Math.max(3, Math.ceil(maximum / 2)), maximum];
    var uniqueValues = values.filter(function (value, index) {
      return values.indexOf(value) === index;
    });
    var title = createElement("span", "collaboration-legend-title", "Publication count");

    container.textContent = "";
    container.appendChild(title);

    uniqueValues.forEach(function (value) {
      var item = createElement("span", "collaboration-legend-item");
      var dot = createElement("span", "collaboration-legend-dot");

      dot.style.backgroundColor = interpolateColor(value, maximum);
      dot.setAttribute("aria-hidden", "true");
      item.appendChild(dot);
      item.appendChild(document.createTextNode(String(value)));
      container.appendChild(item);
    });

    var edgeItem = createElement("span", "collaboration-legend-edge");
    var edgeSample = createElement("span", "collaboration-legend-line");

    edgeSample.setAttribute("aria-hidden", "true");
    edgeItem.appendChild(edgeSample);
    edgeItem.appendChild(document.createTextNode("line width = shared papers"));
    container.appendChild(edgeItem);
  }

  function populateSelector(select, nodes, focusPerson) {
    select.textContent = "";

    nodes.slice().sort(compareByCount).forEach(function (node) {
      var option = document.createElement("option");

      option.value = node.name;
      option.textContent = node.name + " — " +
        pluralize(node.count, "paper", "papers");
      option.selected = node.name === focusPerson;
      select.appendChild(option);
    });
  }

  function renderDetails(container, status, node) {
    var heading = createElement("div", "collaboration-person-heading");
    var countBadge = createElement("span", "collaboration-person-count", String(node.count));
    var headingText = createElement("div", "collaboration-person-heading-text");
    var name = createElement("h4", "collaboration-person-name", node.name);
    var collaboratorCount = Object.keys(node.collaborators).length;
    var summary = createElement(
      "p",
      "collaboration-person-summary",
      pluralize(node.count, "publication", "publications") +
        " · " +
        pluralize(collaboratorCount, "collaborator", "collaborators")
    );
    var collaborators = Object.keys(node.collaborators).map(function (collaboratorName) {
      var edge = node.collaborators[collaboratorName];

      return {
        name: collaboratorName,
        weight: edge.weight
      };
    }).sort(function (left, right) {
      return right.weight - left.weight || left.name.localeCompare(right.name);
    }).slice(0, 4);
    var collaboratorSection = createElement("div", "collaboration-strongest");
    var collaboratorLabel = createElement("p", "collaboration-detail-label", "Strongest links");
    var chips = createElement("div", "collaboration-chip-list");

    container.textContent = "";
    countBadge.setAttribute("aria-hidden", "true");
    headingText.appendChild(name);
    headingText.appendChild(summary);
    heading.appendChild(countBadge);
    heading.appendChild(headingText);
    container.appendChild(heading);

    collaborators.forEach(function (collaborator) {
      var chip = createElement(
        "span",
        "collaboration-chip",
        collaborator.name + " ×" + collaborator.weight
      );

      chips.appendChild(chip);
    });

    collaboratorSection.appendChild(collaboratorLabel);
    collaboratorSection.appendChild(chips);
    container.appendChild(collaboratorSection);

    status.textContent = node.name + " selected: " +
      pluralize(node.count, "publication", "publications") + " and " +
      pluralize(collaboratorCount, "collaborator", "collaborators") + ".";
  }

  function initGraph(root) {
    var dataElement = root.querySelector("[data-collaboration-graph-data]");
    var svg = root.querySelector("[data-collaboration-svg]");
    var fallback = root.querySelector("[data-collaboration-fallback]");
    var details = root.querySelector("[data-collaboration-details]");
    var status = root.querySelector("[data-collaboration-status]");
    var select = root.querySelector("[data-collaboration-select]");
    var reset = root.querySelector("[data-collaboration-reset]");
    var legend = root.querySelector("[data-collaboration-legend]");
    var meta = root.querySelector("[data-collaboration-meta]");
    var tooltip = root.querySelector("[data-collaboration-tooltip]");
    var canvas = root.querySelector(".collaboration-graph-canvas");
    var rawData;

    if (!dataElement || !svg || !details || !status || !select || !legend || !tooltip || !canvas) {
      return;
    }

    try {
      rawData = JSON.parse(dataElement.textContent);
    } catch (error) {
      root.classList.add("has-error");
      return;
    }

    var publications = Array.isArray(rawData.publications) ? rawData.publications : [];
    var focusPerson = String(rawData.focus_person || "").trim();
    var network = buildNetwork(publications);

    if (!publications.length || !network.nodes.length) {
      root.classList.add("has-error");
      return;
    }

    if (!network.nodesByName[focusPerson]) {
      focusPerson = network.nodes.slice().sort(compareByCount)[0].name;
    }

    var maximum = Math.max.apply(null, network.nodes.map(function (node) {
      return node.count;
    }));
    var selectedName = focusPerson;
    var nodeElements = {};
    var edgeElements = [];

    positionNodes(network.nodes, focusPerson);
    populateSelector(select, network.nodes, focusPerson);
    renderLegend(legend, maximum);

    if (meta) {
      meta.textContent = publications.length + " papers · " +
        network.nodes.length + " authors · " +
        network.edges.length + " connections";
    }

    root.setAttribute("data-node-count", String(network.nodes.length));
    root.setAttribute("data-edge-count", String(network.edges.length));
    root.setAttribute("data-paper-count", String(publications.length));

    var defs = createSvgElement("defs");
    var pattern = createSvgElement("pattern", {
      id: "collaboration-dot-pattern",
      width: 24,
      height: 24,
      patternUnits: "userSpaceOnUse"
    });
    var patternDot = createSvgElement("circle", {
      cx: 2,
      cy: 2,
      r: 1,
      class: "collaboration-pattern-dot"
    });

    pattern.appendChild(patternDot);
    defs.appendChild(pattern);
    svg.appendChild(defs);
    svg.appendChild(createSvgElement("rect", {
      x: 0,
      y: 0,
      width: GRAPH_WIDTH,
      height: GRAPH_HEIGHT,
      class: "collaboration-graph-background"
    }));

    [
      { rx: 118, ry: 100 },
      { rx: 205, ry: 164 },
      { rx: 276, ry: 224 }
    ].forEach(function (orbit) {
      svg.appendChild(createSvgElement("ellipse", {
        cx: CENTER_X,
        cy: CENTER_Y,
        rx: orbit.rx,
        ry: orbit.ry,
        class: "collaboration-orbit"
      }));
    });

    var edgeLayer = createSvgElement("g", {
      class: "collaboration-edge-layer",
      "aria-hidden": "true"
    });
    var nodeLayer = createSvgElement("g", {
      class: "collaboration-node-layer",
      "aria-hidden": "true"
    });

    network.edges.slice().sort(function (left, right) {
      return left.weight - right.weight;
    }).forEach(function (edge) {
      var isFocusEdge = edge.source.name === focusPerson || edge.target.name === focusPerson;
      var isDefaultVisible = isFocusEdge || edge.weight >= 2;
      var path = createSvgElement("path", {
        d: edgePath(edge),
        class: "collaboration-edge " +
          (edge.weight >= 2 ? "is-repeated " : "is-single ") +
          (isDefaultVisible ? "is-default-visible" : "is-context-only"),
        "data-source": edge.source.name,
        "data-target": edge.target.name,
        "data-weight": edge.weight,
        "stroke-width": Math.min(3.7, 0.75 + 0.72 * Math.sqrt(edge.weight))
      });

      edgeLayer.appendChild(path);
      edgeElements.push({
        data: edge,
        element: path
      });
    });

    network.nodes.forEach(function (node) {
      var isFocusPerson = node.name === focusPerson;
      var radius = nodeRadius(node.count, maximum, isFocusPerson);
      var label = labelPosition(node, radius);
      var group = createSvgElement("g", {
        class: "collaboration-node " +
          (node.count >= 4 || isFocusPerson ? "has-persistent-label" : ""),
        transform: "translate(" + node.x.toFixed(2) + " " + node.y.toFixed(2) + ")",
        "data-person": node.name,
        "data-count": node.count
      });
      var hitArea = createSvgElement("circle", {
        r: Math.max(22, radius + 6),
        class: "collaboration-node-hit"
      });
      var focusRing = createSvgElement("circle", {
        r: radius + 5,
        class: "collaboration-node-ring"
      });
      var circle = createSvgElement("circle", {
        r: radius,
        class: "collaboration-node-circle",
        fill: interpolateColor(node.count, maximum)
      });
      var count = createSvgElement("text", {
        x: 0,
        y: 0,
        dy: "0.34em",
        class: "collaboration-node-count " +
          (node.count >= Math.ceil(maximum * 0.28) ? "is-light" : "is-dark"),
        "text-anchor": "middle"
      });
      var name = createSvgElement("text", {
        x: label.x,
        y: label.y,
        class: "collaboration-node-label",
        "text-anchor": label.anchor
      });

      count.textContent = String(node.count);
      name.textContent = node.name;
      group.appendChild(hitArea);
      group.appendChild(focusRing);
      group.appendChild(circle);
      group.appendChild(count);
      group.appendChild(name);
      nodeLayer.appendChild(group);
      nodeElements[node.name] = group;

      function showTooltip(event) {
        var canvasRect = canvas.getBoundingClientRect();

        tooltip.textContent = node.name + " · " +
          pluralize(node.count, "publication", "publications");
        tooltip.hidden = false;

        var tooltipRect = tooltip.getBoundingClientRect();
        var left = Math.min(
          canvasRect.width - tooltipRect.width - 8,
          Math.max(8, event.clientX - canvasRect.left + 12)
        );
        var top = Math.min(
          canvasRect.height - tooltipRect.height - 8,
          Math.max(8, event.clientY - canvasRect.top + 12)
        );

        tooltip.style.left = left + "px";
        tooltip.style.top = top + "px";
      }

      group.addEventListener("pointerenter", function (event) {
        applyVisualFocus(node.name);
        showTooltip(event);
      });
      group.addEventListener("pointermove", showTooltip);
      group.addEventListener("pointerleave", function () {
        tooltip.hidden = true;
        applyVisualFocus(selectedName);
      });
      group.addEventListener("click", function () {
        selectPerson(node.name);
      });
    });

    svg.appendChild(edgeLayer);
    svg.appendChild(nodeLayer);

    function applyVisualFocus(personName) {
      var node = network.nodesByName[personName];
      var connected = {};
      var isOverview = personName === focusPerson;

      if (!node) {
        return;
      }

      connected[personName] = true;
      root.classList.toggle("is-overview", isOverview);

      edgeElements.forEach(function (item) {
        var edge = item.data;
        var element = item.element;
        var isIncident = edge.source.name === personName || edge.target.name === personName;

        if (isIncident) {
          connected[edge.source.name] = true;
          connected[edge.target.name] = true;
        }

        element.classList.toggle("is-active", isIncident);
        element.classList.toggle(
          "is-muted",
          isOverview ? !isIncident && edge.weight < 2 : !isIncident
        );
      });

      network.nodes.forEach(function (candidate) {
        var element = nodeElements[candidate.name];

        element.classList.toggle("is-context", candidate.name === personName);
        element.classList.toggle("is-neighbor", candidate.name !== personName && !!connected[candidate.name]);
        element.classList.toggle("is-muted", !isOverview && !connected[candidate.name]);
        element.classList.toggle("is-selected", candidate.name === selectedName);
      });
    }

    function selectPerson(personName) {
      var node = network.nodesByName[personName];

      if (!node) {
        return;
      }

      selectedName = personName;
      select.value = personName;
      renderDetails(details, status, node);
      applyVisualFocus(personName);
    }

    select.addEventListener("change", function () {
      selectPerson(select.value);
    });

    if (reset) {
      reset.addEventListener("click", function () {
        selectPerson(focusPerson);
      });
    }

    svg.addEventListener("click", function (event) {
      if (event.target.classList.contains("collaboration-graph-background")) {
        selectPerson(focusPerson);
      }
    });

    root.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && selectedName !== focusPerson) {
        selectPerson(focusPerson);
        select.focus();
      }
    });

    selectPerson(focusPerson);
    root.classList.add("is-ready");

    if (fallback) {
      fallback.hidden = true;
    }
  }

  onReady(function () {
    document.querySelectorAll("[data-collaboration-graph]").forEach(initGraph);
  });
})();
