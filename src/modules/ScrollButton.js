const scrollToTopButtonSelector = '[data-js-scroll-to-top]'

class ScrollButton {

  stateClasses = {
    isVisible: 'is-visible',
  }

  constructor(rootElement) {
    this.scrollToTopButtonElement = rootElement
    this.scrollThreshold = 300

    this.bindEvents()
    this.checkScrollPosition()
  }

  checkScrollPosition() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop

    if (scrollTop > this.scrollThreshold) {
      this.show()
    } else {
      this.hide()
    }
  }

  show() {
    this.scrollToTopButtonElement.classList.add(this.stateClasses.isVisible)
  }

  hide() {
    this.scrollToTopButtonElement.classList.remove(this.stateClasses.isVisible)
  }

  onScrollToTopButtonElement() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  bindEvents() {
    this.scrollToTopButtonElement.addEventListener('click', () => this.onScrollToTopButtonElement())
    window.addEventListener('scroll', () => this.checkScrollPosition())
  }
}

class ScrollButtonCollection {
  constructor() {
    this.init()
  }

  init() {
    document.querySelectorAll(scrollToTopButtonSelector).forEach((element) => {
      new ScrollButton(element)
    })
  }
}

export default ScrollButtonCollection