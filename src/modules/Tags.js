const rootSelector = '[data-js-input-wrapper]'

class Tags {
  selectors = {
    root: rootSelector,
    inputSelector: `[data-js-tag-input]`,
    suggestionsListSelector: `[data-js-suggestions]`,
    suggestionItemsSelector: `[data-js-suggestion-item]`,

    selectedTagsListSelector: `[data-js-selected-tags]`,
    tagSelector: `[data-js-tag]`,
  }

  attributes = {
    ariaExpanded: 'aria-expanded',
    hidden: 'hidden',
    ariaSelected: 'aria-selected',
  }

  constructor(rootElement) {
    this.rootElement = rootElement
    this.inputElement = this.rootElement.querySelector(this.selectors.inputSelector)
    this.suggestionsListElement = this.rootElement.querySelector(this.selectors.suggestionsListSelector)
    this.suggestionItemElements = Array.from(this.rootElement.querySelectorAll(this.selectors.suggestionItemsSelector))

    this.selectedTags = new Set()
    this.selectedTagsListElement = document.querySelector(this.selectors.selectedTagsListSelector)

    this.updateSelectedTagsVisibility()
    this.bindEvents()
  }

  // Фильтрует список предложений по введенному тексту
  handleInputChange() {
    const inputValue = this.inputElement.value.toLowerCase()
    let visibleCount = 0

    this.suggestionItemElements.forEach((item) => {
      const value = item.textContent.trim().toLowerCase()

      if (!value.startsWith(inputValue)) {
        item.setAttribute('hidden', '')
      } else {
        item.removeAttribute('hidden')
        visibleCount++
      }
    })

    if (visibleCount === 0) {
      this.suggestionsListElement.setAttribute('data-empty', '')
    } else {
      this.suggestionsListElement.removeAttribute('data-empty')
    }
  }

  // Показывает список предложений при фокусе на input
  handleInputFocus() {
    this.showSuggestions()
  }

  // Скрывает список предложений при потере фокуса, если фокус ушел за пределы компонента
  handleInputBlur(event) {
    const focusMovedTo = event.relatedTarget

    if (focusMovedTo && this.suggestionsListElement.contains(focusMovedTo)) {
      return
    }

    this.hideSuggestions()
  }

  // Скрывает список предложений при потере фокуса с любого элемента внутри списка
  handleSuggestionsBlur(event) {
    const focusMovedTo = event.relatedTarget

    if (focusMovedTo === this.inputElement || this.suggestionsListElement.contains(focusMovedTo)) {
      return
    }

    this.hideSuggestions()
  }

  // Показывает выпадающий список предложений
  showSuggestions() {
    this.inputElement.setAttribute(`${this.attributes.ariaExpanded}`, 'true')
    this.suggestionsListElement.removeAttribute('hidden')
  }

  // Скрывает выпадающий список предложений
  hideSuggestions() {
    this.inputElement.setAttribute(`${this.attributes.ariaExpanded}`, 'false')
    this.suggestionsListElement.setAttribute('hidden', '')
  }

  // Обновляет видимость контейнера с выбранными тегами
  updateSelectedTagsVisibility() {
    if (this.selectedTags.size === 0) {
      this.selectedTagsListElement.setAttribute('empty', '')
    } else {
      this.selectedTagsListElement.removeAttribute('empty')
    }
  }

  // Создает DOM-элемент тега и добавляет его в список
  createTagElement(value) {
    const tagElement = document.createElement('li')
    tagElement.className = "cat-filter__tag"
    tagElement.dataset.jsTag = value

    tagElement.innerHTML = `
      <span>${value}</span>
       <button
          type="button"
          class="cat-filter__tag-remove"
          aria-label="Удалить тег ${value}"
       ></button>
    `

    // Добавляем обработчик клика для удаления тега
    tagElement.addEventListener('click', () => this.removeTag(value, tagElement))

    this.selectedTagsListElement.appendChild(tagElement)
  }

  // Добавляет тег в список выбранных
  addTag(suggestionElement) {
    const value = suggestionElement.dataset.jsSuggestionItem.trim().toLowerCase()

    if (this.selectedTags.has(value)) return

    this.selectedTags.add(value)
    this.createTagElement(value)
    this.updateSelectedTagsVisibility()
  }

  // Удаляет тег из списка выбранных
  removeTag(value, tagElement) {
    tagElement.remove()
    this.selectedTags.delete(value)
    this.updateSelectedTagsVisibility()

    // Снимаем выделение с соответствующего элемента в предложениях
    const suggestionItem = this.suggestionItemElements.find(
      (element) => element.dataset.jsSuggestionItem === value
    )

    if (suggestionItem) {
      suggestionItem.setAttribute(`${this.attributes.ariaSelected}`, 'false')
    }
  }

  // Получает массив выбранных тегов
  getSelectedTags() {
    return Array.from(this.selectedTags)
  }

  // Привязывает обработчики событий к элементу предложения
  bindSuggestionItemEvents(item) {
    // Обработка по клику
    item.addEventListener('click', () => {
      item.setAttribute(`${this.attributes.ariaSelected}`, 'true')
      this.addTag(item)
    })

    // Обработка по нажатию Enter
    item.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        item.setAttribute(`${this.attributes.ariaSelected}`, 'true')
        this.addTag(item)
      }
    })
  }

  // Привязывает все обработчики событий
  bindEvents() {
    this.inputElement.addEventListener('focus', () => this.handleInputFocus())
    this.inputElement.addEventListener('blur', (event) => this.handleInputBlur(event))
    this.suggestionsListElement.addEventListener('blur', (event) => this.handleSuggestionsBlur(event), true)
    this.inputElement.addEventListener('input', () => this.handleInputChange())
    this.suggestionItemElements.forEach((item) => this.bindSuggestionItemEvents(item))
  }
}

class TagsCollection {
  constructor() {
    this.init()
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new Tags(element)
    })
  }
}

export default TagsCollection