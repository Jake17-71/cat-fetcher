const inputWrapperSelector = '[data-js-input-wrapper]'

class Fetch {

  selectors = {
    luckyButtonSelector: `[data-js-lucky-button]`,
    searchButtonSelector: `[data-js-search-button]`,

    responseSelector: `[data-js-response]`,
    imagesContainerSelector: `[data-js-images-container]`,
    imageSelector: `[data-js-image]`,

    emptyMessage: '[data-js-empty-message]',

  }

  constructor(rootElement) {
    this.inputWrapperElement = rootElement
    this.luckyButtonElement = document.querySelector(this.selectors.luckyButtonSelector)
    this.searchButtonElement = document.querySelector(this.selectors.searchButtonSelector)
    this.responseElement = document.querySelector(this.selectors.responseSelector)
    this.imagesContainerElement = document.querySelector(this.selectors.imagesContainerSelector)
    this.imageElement = document.querySelector(this.selectors.imageSelector)

    this.emptyMessage = document.querySelector(this.selectors.emptyMessage)


    this.inputWrapperElement.addEventListener('tagsChanged', (event) => {
      const tags = event.detail.tags
      console.log('Selected tags:', tags)
    })

    this.updateEmptyMessageVisibility()
    this.bindEvents()
  }

  updateEmptyMessageVisibility() {
    const haveImage = (this.imagesContainerElement.children.length - 1) > 0
    if (haveImage) {
      this.emptyMessage.setAttribute('empty', '')
    } else {
      this.emptyMessage.removeAttribute('empty')
    }
  }

  createListElementImage(img) {
    const liElement = document.createElement('li')
    liElement.className = 'response__image'
    liElement.setAttribute('data-js-image', '')
    liElement.appendChild(img)
    this.imagesContainerElement.appendChild(liElement)

    this.updateEmptyMessageVisibility()
  }

  createImgElement(blob) {
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.className = 'cat-image'
    img.src = url
    img.alt = 'Изображение кота'
    img.title = 'Изображение кота'
    img.onload = () => {
      this.createListElementImage(img)
    }
  }

  fetchLucky() {
    fetch('https://cataas.com/cat?type=medium')
      .then(response => response.blob())
      .then(blob => this.createImgElement(blob))
      .catch(error => console.log("Ошибка:" + error))
  }

  onLuckyButtonClick() {
    this.fetchLucky()
  }

  bindEvents() {
    this.luckyButtonElement.addEventListener('click', () => this.onLuckyButtonClick())
  }
}

class FetchCollection {
  constructor() {
    this.init()
  }

  init() {
    document.querySelectorAll(inputWrapperSelector).forEach((element) => {
      new Fetch(element)
    })
  }
}

export default FetchCollection