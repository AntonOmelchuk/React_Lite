const React = (function () {
  function createElement(type, attributes = {}, ...children) {
    const childElements = [].concat(...children).reduce(
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
    diff(vdom, root, oldDom)
  }

  function diff(vdom, root, oldDom) {
    const oldVDom = oldDom && oldDom._virtualElement
    const oldComponent = oldDom && oldDom.component

    if (!oldDom) {
      mountElement(vdom, root, oldDom)
    } else if (typeof vdom.type === 'function') {
      diffComponent(vdom, oldComponent, root, oldDom)
    } else if (oldVDom && oldVDom.type === vdom.type) {
      if (oldVDom.type === 'text') {
        updateTextNode(oldDom, vdom, oldVDom)
      } else {
        updateDomNode(oldDom, vdom, oldVDom)
      }

      // set ref to new vdom
      oldDom._virtualElement = vdom

      vdom.children.forEach((child, i) => diff(child, oldDom, oldDom.childNodes[i]))

      // remove extra nodes
      const oldNodes = oldDom.childNodes

      if (oldNodes.length > vdom.children.length) {
        for (let i = oldNodes.length - 1; i >= vdom.children.length; i -= 1) {
          unmountNode(oldNodes[i])
        }
      }
    }
  }

  function isSameComponentType(oldComponent, newVirtualElement) {
    return oldComponent && newVirtualElement.type === oldComponent.constructor
  }

  function updateComponent(newVirtualElement, oldComponent, root, domElement) {
    oldComponent.componentWillRecieveProps(newVirtualElement.props)
    if (oldComponent.shouldComponentUpdate(newVirtualElement.props)) {
      const prevProps = oldComponent.props

      oldComponent.componentWillUpdate(
        newVirtualElement.props,
        oldComponent.state
      )

      oldComponent.updateProps(newVirtualElement.props)

      const nextElement = oldComponent.render()
      nextElement.component = oldComponent

      diff(nextElement, root, domElement, oldComponent)
    }
  }

  function diffComponent(newVElement, oldComponent, root, domElement) {
    if (isSameComponentType(oldComponent, newVElement)) {
      updateComponent(newVElement, oldComponent, root, domElement)
    } else {
      mountElement(newVElement, root, domElement)
    }
  }

  function updateTextNode(domElement, vdom, oldDom) {
    if (vdom.props.textContent !== oldDom.props.textContent) {
      domElement.textContent = vdom.props.textContent
    }

    domElement._virtualElement = vdom
  }

  function unmountNode(domElement) {
    domElement.remove()
  }

  function mountElement(vdom, root, oldDom) {
    if (isFunction(vdom)) {
      return mountComponent(vdom, root, oldDom)
    }
    return mountNodeElement(vdom, root, oldDom)
  }

  function isFunction(obj) {
    return obj && typeof obj.type === 'function'
  }

  function isFunctionalComponent(vnode) {
    const nodeType = vnode && vnode.type
    return nodeType && isFunction(vnode) && !(nodeType.prototype && nodeType.prototype.render)
  }

  function mountNodeElement(vdom, root, oldDomElement, parentComponent) {
    const { type, props, children } = vdom
    let newDomElement = null
    const nextSibling = oldDomElement && oldDomElement.nextSibling

    if (type === 'text') {
      newDomElement = document.createTextNode(props.textContent)
    } else {
      newDomElement = document.createElement(type)
      updateDomNode(newDomElement, props)
    }

    newDomElement._virtualElement = vdom

    // Remove old dom

    if (oldDomElement) {
      unmountNode(oldDomElement, parentComponent)
    }

    if (nextSibling) {
      root.innerBefore(newDomElement, nextSibling)
    } else {
      root.appendChild(newDomElement)
    }

    const { component } = vdom

    if (component) {
      component.setDomElement(newDomElement)
    }

    children.forEach(child => mountElement(child, newDomElement))
  }

  function buildFunctionalComponent(vnode, context) {
    return vnode.type(vnode.props || {})
  }

  function buildStatefulComponent(vElement) {
    const component = new vElement.type(vElement.props)
    const nextElement = component.render()

    nextElement.component = component

    return nextElement
  }

  function mountComponent(vdom, root, oldDomElement) {
    let nextVDom = null
    let newDomElement = null

    if (isFunctionalComponent(vdom)) {
      nextVDom = buildFunctionalComponent(vdom)
    } else {
      nextVDom = buildStatefulComponent(vdom)
    }

    if (isFunction(nextVDom)) {
      return mountComponent(nextVDom, root, oldDomElement)
    }
    newDomElement = mountElement(nextVDom, root, oldDomElement)

    return newDomElement
  }

  // set attributes and events for dom element
  function updateDomNode(domElement, newProps = {}, oldProps = {}) {
    Object.keys(newProps).forEach(propName => {
      const newProp = newProps[propName]
      const oldProp = oldProps[propName]
      // check for new props
      if (newProp !== oldProp) {
        // add events
        if (propName.slice(0, 2) === 'on') {
          const eventName = propName.toLowerCase().slice(2)
          domElement.addEventListener(eventName, newProp, false)
          // remove prev events
          if (oldProp) {
            domElement.removeEventListener(eventName, oldProp, false)
          }
        } else if (propName === 'value' || propName === 'checked') {
          // this spec attr can't be set with setAttr
          domElement[propName] = newProp
        } else if (propName !== 'children') {
          if (propName === 'className') {
            domElement.setAttribute('class', newProps[propName])
          } else {
            domElement.setAttribute(propName, newProps[propName])
          }
        }
      }
    })
    // remove old props
    Object.keys(oldProps).forEach(propName => {
      const newProp = newProps[propName]
      const oldProp = oldProps[propName]

      if (!newProp) {
        if (propName.slice(0, 2) === 'on') {
          domElement.removeEventListener(propName, oldProp, false)
        } else if (propName !== 'children') {
          domElement.removeAttribute(propName)
        }
      }
    })
  }

  class Component {
    constructor(props) {
      this.props = props
      this.state = {}
      this.prevState = {}
    }

    setState(nextState) {
      if (!this.prevState) this.prevState = this.state

      this.state = { ...this.state, ...nextState }

      const dom = this.getDomElement()
      const container = dom.parentNode

      const newVDom = this.render()

      diff(newVDom, container, dom)
    }

    setDomElement(dom) {
      this._dom = dom
    }

    getDomElement() {
      return this._dom
    }

    updateProps() {
      this.props = props
    }

    componentWillMount() {}

    componentDidMount() {}

    componentWillRecieveProps(nextProps) {}

    shouldComponentUpdate(nextProps, nextState) {
      return nextProps != this.props || nextState != this.state
    }

    componentWillUpdate() {}

    componentDidUpdate() {}

    componentWillUnmount() {}
  }

  return {
    createElement,
    render,
    Component
  }
}());
