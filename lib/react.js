// 2. createElement Basic Implementation
// 3. createElement Handle true/false short circuiting
// 4. createElement remove undefined nodes
// 5. rendering native DOM elements along with children

const React = (function () {
  function createElement(type, attributes = {}, ...children) {
    const childElements = [...children].reduce(
      (acc, child) => {
        if (child != null && child !== true && child !== false) {
          child instanceof Object ? acc.push(child) : acc.push(createElement('text', { textContent: child }));
        }
        return acc;
      },
      []
    );
    return {
      type,
      children: childElements,
      props: { children: childElements, ...attributes }
    }
  }

  const render = function (vdom, root, oldDom = root.firstChild) {
    if (!oldDom) {
      mountElement(vdom, root, oldDom)
    }
  }

  const mountElement = function (vdom, root, oldDom) {
    return mountNodeElement(vdom, root, oldDom)
  }

  const mountNodeElement = function (vdom, root, oldDomElement, parentComponent) {
    let newDomElement = null
    const nextSibling = oldDomElement && oldDomElement.nextSibling

    if (vdom.type === 'text') {
      newDomElement = document.createTextNode(vdom.props.textContent)
    } else {
      newDomElement = document.createElement(vdom.type)
    }

    if (nextSibling) {
      root.innerBefore(newDomElement, nextSibling)
    } else {
      root.appendChild(newDomElement)
    }

    vdom.children.forEach(child => mountElement(child, newDomElement))
  }

  return {
    createElement,
    render
  }
}());
