import algoliasearch from 'algoliasearch'
import instantsearch from 'instantsearch.js'
import { highlight } from 'instantsearch.js/es/helpers'
import { configure, hits, pagination, panel, refinementList, searchBox } from 'instantsearch.js/es/widgets'
import { dateToTimestamp, timestampToDateString } from './utils'

// Datepicker DOM elements
const datePicker = document.querySelector('#datepicker')
const datePickerInput = datePicker.querySelector('input')

// Use today as initial date
datePickerInput.valueAsDate = new Date()

// Format the date filters
const getDateFilters = () => {
  if (!datePickerInput.value) return ''

  const timestamp = dateToTimestamp(datePickerInput.value)
  return `validityStartDateTimestamp <= ${timestamp} AND validityEndDateTimestamp >= ${timestamp}`
}

// Custom search function to append the formatted filters to the request
const searchFunction = helper => {
  helper.setQueryParameter('filters', getDateFilters()).search()
}

const search = instantsearch({
  indexName: 'loropiana.us',
  searchClient: algoliasearch('0UI9MOXMX5', '1d30c6a6ea8a7dfcc9797671c39723db'),
  searchFunction,
})

// Execute search when the date changes
datePickerInput.addEventListener('change', ({ target }) => {
  if (target.value) {
    searchFunction(search.helper)
  }
})

search.addWidgets([
  searchBox({
    container: '#searchbox',
  }),
  hits({
    container: '#hits',
    templates: {
      item: hit => `
        <div class="product-card">
          <img src="${hit.imgfront}" class="product-card__image" />
          <div class="product-card__content">
            <h2>${highlight({ attribute: 'name.en_us.0', hit })}</h2>
            <p>Valid from <span class="badge badge--blue">${timestampToDateString(
              hit.validityStartDateTimestamp
            )}</span></p>
            <p>Valid to <span class="badge badge--green">${timestampToDateString(
              hit.validityEndDateTimestamp
            )}</span></p>
          </div>
        </div>
      `,
    },
  }),
  configure({
    hitsPerPage: 8,
  }),
  panel({
    templates: { header: 'category' },
  })(refinementList)({
    container: '#categories-list',
    attribute: 'categoryFamily.en_us',
  }),
  panel({
    templates: { header: 'color' },
  })(refinementList)({
    container: '#colors-list',
    attribute: 'colorFamily.en_us',
  }),
  pagination({
    container: '#pagination',
    padding: 2,
  }),
])

search.start()
