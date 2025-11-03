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

    loaderSelector: `[data-js-loader]`,
  }

  stateClasses = {
    isLoading: 'is-loading',
  }

  constructor(rootElement) {
    this.inputWrapperElement = rootElement
    this.luckyButtonElement = document.querySelector(this.selectors.luckyButtonSelector)
    this.searchButtonElement = document.querySelector(this.selectors.searchButtonSelector)
    this.imagesContainerElement = document.querySelector(this.selectors.imagesContainerSelector)

    this.emptyMessageElement = document.querySelector(this.selectors.emptyMessageSelector)
    this.errorMessageElement = document.querySelector(this.selectors.errorMessageSelector)

    this.loaderElement = document.querySelector(this.selectors.loaderSelector)

    this.tags = []

    // Подписываемся на событие изменения тегов из модуля Tags
    this.inputWrapperElement.addEventListener('tagsChanged', (event) => {
      this.tags = event.detail.tags
    })

    this.hideErrorMessage()
    this.updateEmptyMessageVisibility()
    this.bindEvents()
  }

  // Показывает индикатор загрузки
  showLoader() {
    this.loaderElement.classList.add(this.stateClasses.isLoading)
  }

  // Скрывает индикатор загрузки
  hideLoader() {
    this.loaderElement.classList.remove(this.stateClasses.isLoading)
  }

  // Обновляет видимость сообщения "Здесь появятся изображения котиков!"
  updateEmptyMessageVisibility() {
    const haveImage = (this.imagesContainerElement.children.length - 2) > 0
    const hasError = !this.errorMessageElement.hasAttribute('empty')

    if (haveImage || hasError) {
      this.emptyMessageElement.setAttribute('empty', '')
    } else {
      this.emptyMessageElement.removeAttribute('empty')
    }
  }

  // Создает элемент списка с изображением и добавляет его на страницу
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

  // Создает элемент изображения из blob и обрабатывает события загрузки
  createImgElement(blob) {
    const url = URL.createObjectURL(blob)
    const img = new Image()
    img.className = 'cat-image'
    img.src = url
    img.alt = 'Изображение кота'
    img.title = 'Изображение кота'
    img.onload = () => {
      this.hideLoader()
      this.createListElementImage(img)
    }
    img.onerror = () => {
      this.hideLoader()
      this.showErrorMessage('Ошибка загрузки изображения')
    }
  }

  // Выполняет запрос для получения случайного изображения кота
  fetchLucky() {
    this.hideErrorMessage()
    this.showLoader()

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
        this.hideLoader()
      })
  }

  // Обработчик клика по кнопке "Мне повезет!"
  onLuckyButtonClick(event) {
    event.preventDefault()
    this.fetchLucky()
  }

  // Показывает сообщение об ошибке с разными текстами в зависимости от типа ошибки
  showErrorMessage(error) {
    this.errorMessageElement.removeAttribute('empty')

    const errorCode = error.message
    let errorText = ''

    if (errorCode === '404') {
      errorText = 'Изображение с такими тегами не найдено! Код ошибки: 404'
    } else if (errorCode === 'Ошибка загрузки изображения') {
      errorText = 'Не удалось загрузить изображение. Попробуйте ещё раз.'
    } else {
      errorText = `Произошла ошибка при загрузке. Код ошибки: ${errorCode}`
    }

    this.errorMessageElement.textContent = errorText
    this.updateEmptyMessageVisibility()
  }

  // Скрывает сообщение об ошибке
  hideErrorMessage() {
    this.errorMessageElement.setAttribute('empty', '')
    this.updateEmptyMessageVisibility()
  }

  // Выполняет запрос для получения изображения кота по выбранным тегам
  fetchSearch() {
    // Если тегов нет - получаем случайного кота
    if (this.tags.length === 0) {
      this.fetchLucky()
      return
    }

    this.hideErrorMessage()
    this.showLoader()

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
        this.hideLoader()
      })
  }

  // Обработчик клика по кнопке "Найти кота!"
  onSearchButtonClick(event) {
    event.preventDefault()
    this.fetchSearch()
  }

  // Привязывает все обработчики событий
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