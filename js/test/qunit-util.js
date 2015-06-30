(function(D, W) {
/*
======== A Handy Little QUnit Reference ========
http://api.qunitjs.com/

Test methods:
  module(name, {[setup][ ,teardown]})
  test(name, callback)
  expect(numberOfAssertions)
  stop(increment)
  start(decrement)
Test assertions:
  ok(value, [message])
  equal(actual, expected, [message])
  notEqual(actual, expected, [message])
  deepEqual(actual, expected, [message])
  notDeepEqual(actual, expected, [message])
  strictEqual(actual, expected, [message])
  notStrictEqual(actual, expected, [message])
  throws(block, [expected], [message])
*/
    W.exists = function exists(query, desc) {
        var element = D.query(query);
        ok(element, 'expected to find '+(desc||query));
        return element;
    }

    W.visible = function visible(element, desc, not) {
        if (typeof element === "string") {
            element = exists(element, desc);
        }
        if (element) {
            var test = not ? notEqual : equal;
            test(getVisualStatus(element), "visible", (desc||'')+'should be visible ');
        }
        return element;
    }
    W.hidden = function hidden(element, desc) {
        return visible(element, desc, true);
    }

    W.getElementVisualStatus = function getElementVisualStatus(element) {
        var style = W.getComputedStyle(element);
        if (style.display === "none") {
            return "none";
        }
        if (style.visibility === "hidden") {
            return "hidden";
        }
        return "visible";
    }

    W.getVisualStatus = function getVisualStatus(element) {
        var status = getElementVisualStatus(element);
        if (status !== "visible") {
            return status;
        }
        while (status === "visible") {
            element = element.parentNode;
            if (element instanceof Document) {
                return status;
            }
            if (!(element instanceof Element)) {
                status = "detached";
            } else {
                status = getElementVisualStatus(element);
            }
        }
        return "parent."+status;
    }

}(document, window));
