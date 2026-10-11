import algoliasearch from 'algoliasearch'
import autocomplete from 'autocomplete.js'

// Constants (env variables)
const APP_ID = '0UI9MOXMX5'
const PUBLIC_API_KEY = '1d30c6a6ea8a7dfcc9797671c39723db'
const PRODUCTS_INDEX = 'fendi.it.en'
const QUERY_SUGGESTIONS_INDEX = 'fendi.it.en_qs'

// Initialize client and indices
const searchClient = algoliasearch(APP_ID, PUBLIC_API_KEY)
const productsIndex = searchClient.initIndex(PRODUCTS_INDEX)
const querySuggestionsIndex = searchClient.initIndex(QUERY_SUGGESTIONS_INDEX)

const options = {
  debug: true, // keep dropdown always open
}

const search = autocomplete('#search-input', options, [
  // Query suggestions
  {
    source: autocomplete.sources.hits(querySuggestionsIndex, { hitsPerPage: 3 }),
    name: 'querySuggestions',
    templates: {
      suggestion: (item) => item._highlightResult.query.value,
    },
  },
  // Products
  {
    source: autocomplete.sources.hits(productsIndex, { hitsPerPage: 6 }),
    name: 'products',
    templates: {
      suggestion: (item) => {
        const { image_groups, name, price, short_description } = item
        const imageUrl = `${image_groups[0].images[0].dis_base_link}?bgc=246%2C246%2C246&wid=603&hei=603&sw=603&sh=603`

        return `
          <div class="product-card">
            <img class="product-card__image" src="${imageUrl}" alt="${name}">
            <div class="product-card__body">
              <p>${name}</p>
              <p>${short_description}</p>
              ${price ? `<p>${price.EUR}€</p>` : '(Price not available)'}
            </div>
          </div>
        `
      },
    },
  },
]).on('autocomplete:selected', (event, item, dataset) => {
  event.preventDefault() // avoid closing the dropdown

  // Autocomplete on click
  if (dataset === 'querySuggestions') {
    search.autocomplete.setVal(item.query)
  }
})
