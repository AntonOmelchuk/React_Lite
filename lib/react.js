const React = (function () {
  function createElement(type, attributes = {}, ...children) {
    const childrenElement = [...children].filter(childItem => {
      let child;
      if (childItem != null && childItem !== true && childItem !== false) {
        child = childItem instanceof Object ? childItem : createElement('text', { textContent: childItem })
      }
      return child
    })

    return {
      type,
      props: { children: childrenElement, ...attributes },
      children: childrenElement
    }
  }

  return {
    createElement
  }
}());
