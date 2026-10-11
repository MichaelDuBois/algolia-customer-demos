import algoliasearch from 'algoliasearch/lite';
import React, { Component, useState } from 'react';
import {
  InstantSearch,
  Hits,
  SearchBox,
  Pagination,
  Highlight,
  ClearRefinements,
  RefinementList,
  Configure,
  Stats,
  RangeInput,
  connectToggleRefinement,
  connectStateResults,
} from 'react-instantsearch-dom';
import PropTypes from 'prop-types';
import './App.css';
import loadingImage from '../public/loading.gif';
import SkeletonCardGrid from './Components/SkeletonCardGrid';
import CustomHits from './Components/CustomHits';

const searchClient = algoliasearch(
  '94IA10ZQ15',
  '81c06064842fb5879c0e4526377f44b1'
);

const NoResultsState = ({ searchResults }) => {
  const hasResults = searchResults && searchResults.nbHits !== 0;

  if (!hasResults && hasResults != null) {
    return (
      <div>
        <div class="no-results" hidden={hasResults}>
          <h2>No results found!</h2>
          <h3>
            Sorry, we can't find any products that match your query. Please
            enter another query and try again.
          </h3>
          <a href="https://www.algolia.com">
            <button class="button-27" role="button">
              GO TO OUR SITE
            </button>
          </a>
        </div>
      </div>
    );
  } else {
    return null;
  }
};

const NoResults = connectStateResults(NoResultsState);

const LoadingIndicatorState = ({ isSearchStalled, searchResults }) => {
  const hasResults = searchResults && searchResults.nbHits !== 0;
  console.log('isSearchStalled: ', isSearchStalled);

  if (isSearchStalled || hasResults == null) {
    return <SkeletonCardGrid />;
  } else {
    return <CustomHits />;
  }
};

const LoadingIndicator = connectStateResults(LoadingIndicatorState);

class App extends Component {
  render() {
    return (
      <div className="ais-InstantSearch">
        <h1>React InstantSearch e-commerce demo</h1>
        <InstantSearch
          indexName="ecommerce"
          searchClient={searchClient}
          stalledSearchDelay={1}
          routing={true}
        >
          <div className="left-panel">
            <ClearRefinements />

            <CustomToggleRefinement
              attribute="free_shipping"
              label="Free shipping"
              value={true}
              defaultRefinement={true}
            />
            <h2>Brands</h2>
            <RefinementList attribute="brand" searchable={true} />
            <h2>Categories</h2>
            <RefinementList
              attribute="categories"
              showMore={true}
              searchable={true}
            />
            <h2>Price</h2>
            <RangeInput attribute="price" />
            <Configure
              hitsPerPage={8}
              optionalFilters={
                'brand:Apple OR brand:Google AND categories:Cell Phones and categories:All Laptops'
              }
            />
          </div>
          <div className="right-panel">
            <SearchBox />
            <Stats />
            <NoResults />
            {/* <LoadingIndicator /> */}
            <CustomHits />
            <Pagination />
          </div>
        </InstantSearch>
      </div>
    );
  }
}

// function Hit(props) {
//   return (
//     <div>
//       <img src={props.hit.image} align="left" alt={props.hit.name} />
//       <div className="hit-name">
//         <Highlight attribute="name" hit={props.hit} />
//       </div>
//       <div className="hit-description">
//         <Highlight attribute="description" hit={props.hit} />
//       </div>
//       <div className="hit-price">${props.hit.price}</div>
//     </div>
//   );
// }

// Hit.propTypes = {
//   hit: PropTypes.object.isRequired,
// };

const ToggleRefinement2 = ({
  currentRefinement,
  label,
  count,
  refine,
  createURL,
}) => {
  const [isToggled, toggle] = useState(currentRefinement);

  const callback = () => {
    toggle(!isToggled);
    //  onClick(!isToggled)
    refine(!isToggled);
  };

  return (
    <div>
      <p>{label}</p>
      <label id="label">
        <input
          type="checkbox"
          id="checkbox"
          defaultChecked={isToggled}
          onClick={callback}
        />
        <span id="span" />
      </label>
    </div>
  );
};

const CustomToggleRefinement = connectToggleRefinement(ToggleRefinement2);

export default App;
