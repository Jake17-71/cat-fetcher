const inputWrapperSelector = '[data-js-input-wrapper]'

class Fetch {

  selectors = {
    luckyButtonSelector: `[data-js-lucky-button]`,
    searchButtonSelector: `[data-js-search-button]`,

    responseSelector: `[data-js-response]`,
    imagesContainerSelector: `[data-js-images-container]`,
    imageSelector: `[data-js-image]`,

    emptyMessageSelector: '[data-js-empty-message]',
    errorMessageSelector: `[data-js-error-message]`,

  }

  constructor(rootElement) {
    this.inputWrapperElement = rootElement
    this.luckyButtonElement = document.querySelector(this.selectors.luckyButtonSelector)
    this.searchButtonElement = document.querySelector(this.selectors.searchButtonSelector)
    this.responseElement = document.querySelector(this.selectors.responseSelector)
    this.imagesContainerElement = document.querySelector(this.selectors.imagesContainerSelector)

    this.emptyMessageElement = document.querySelector(this.selectors.emptyMessageSelector)
    this.errorMessageElement = document.querySelector(this.selectors.errorMessageSelector)

    this.tags = []

    this.inputWrapperElement.addEventListener('tagsChanged', (event) => {
       this.tags = event.detail.tags
      console.log('Selected tags:', this.tags)
    })

    this.hideErrorMessage()
    this.updateEmptyMessageVisibility()
    this.bindEvents()
  }

  updateEmptyMessageVisibility() {
    const haveImage = (this.imagesContainerElement.children.length - 2) > 0
    const hasError = !this.errorMessageElement.hasAttribute('empty')

    if (haveImage || hasError) {
      this.emptyMessageElement.setAttribute('empty', '')
    } else {
      this.emptyMessageElement.removeAttribute('empty')
    }
  }

  createListElementImage(img) {
    const liElement = document.createElement('li')
    liElement.className = 'response__image'
    liElement.setAttribute('data-js-image', '')
    liElement.appendChild(img)
    this.imagesContainerElement.appendChild(liElement)

    // Автоматически прокручиваем к новому элементу
    liElement.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })

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
    // Скрываем сообщение об ошибке перед новым запросом
    this.hideErrorMessage()

    fetch('https://cataas.com/cat?type=medium')
      .then(response => {
        if (!response.ok) {
          throw new Error(`${response.status}`)
        }
        return response.blob()
      })
      .then(blob => this.createImgElement(blob))
      .catch(error => {
        console.log(error)
        this.showErrorMessage(error)
      })
  }

  onLuckyButtonClick(event) {
    event.preventDefault()
    this.fetchLucky()
  }

  showErrorMessage(error) {
    this.errorMessageElement.removeAttribute('empty')
    this.errorMessageElement.textContent = 'Изображение с такими тегами не найдено! Код ошибки: ' + `${error}`
    this.updateEmptyMessageVisibility()
  }

  hideErrorMessage() {
    this.errorMessageElement.setAttribute('empty', '')
    this.updateEmptyMessageVisibility()
  }

  fetchSearch() {
    // Если тегов нет - получаем случайного кота
    if (this.tags.length === 0) {
      this.fetchLucky()
      return
    }

    this.hideErrorMessage()

    const tagsString = this.tags.join(',')
    const url = `https://cataas.com/cat/${tagsString}?type=medium`

    fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`${response.status}`)
        }
        return response.blob()
      })
      .then(blob => this.createImgElement(blob))
      .catch(error => {
        console.log(error)
        this.showErrorMessage(error)
      })
  }

  onSearchButtonClick(event) {
    event.preventDefault()
    this.fetchSearch()
  }

  bindEvents() {
    this.luckyButtonElement.addEventListener('click', (event) => this.onLuckyButtonClick(event))
    this.searchButtonElement.addEventListener('click', (event) => this.onSearchButtonClick(event))
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