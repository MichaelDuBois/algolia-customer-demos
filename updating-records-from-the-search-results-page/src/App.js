import { React, useState, useRef } from 'react';
import algoliasearch from 'algoliasearch';
import {
  InstantSearch,
  Configure,
  DynamicWidgets,
  Hits,
  SearchBox,
  RefinementList,
  Pagination,
  Highlight,
  useRefinementList,
  useRange,
  RangeInput,
  HierarchicalMenu,
  useHierarchicalMenu,
  useInstantSearch,
} from 'react-instantsearch-hooks-web';
import {
  Button,
  Field,
  Flags,
  Input,
  Modal,
  TextArea,
  stl,
} from '@algolia/satellite';
import '@algolia/satellite/satellite.min.css';
import { simple } from 'instantsearch.js/es/lib/stateMappings';
import { Panel } from './Panel';
import './App.css';

/* you will need to use the Admin API key in this case because you are making indexing requests
   please note that using Admin API keys is not advisable for publicly accessible instantsearch applications
*/
const searchClient = algoliasearch(
  'Z9XD0WZ7D4',
  '6184ed603065e2a0ca1a6d197fbee4e1'
);

/* you want to point to the index to update by using the initIndex method
 */
const index = searchClient.initIndex('instant_search');

function App() {
  const VirtualRefinementList = (props) => {
    useRefinementList(props);
    return null;
  };

  const VirtualPriceRange = (props) => {
    useRange(props);
    return null;
  };

  const VirtualHierarchicalMenu = (props) => {
    useHierarchicalMenu(props);
    return null;
  };

  const routing = {
    stateMapping: simple(),
  };

  return (
    <div>
      <header className="header">
        <h1 className="header-title">
          <a href="/">react-instantsearch-app</a>
        </h1>
        <p className="header-subtitle">
          using{' '}
          <a href="https://github.com/algolia/react-instantsearch">
            React InstantSearch
          </a>
        </p>
      </header>

      <div className="container">
        <InstantSearch
          searchClient={searchClient}
          indexName="instant_search"
          routing={routing}
        >
          <Configure hitsPerPage={8} />
          <VirtualRefinementList attribute="brand" />
          <VirtualRefinementList attribute="type" />
          <VirtualPriceRange attribute="price" />
          <VirtualHierarchicalMenu
            attributes={[
              'hierarchicalCategories.lvl0',
              'hierarchicalCategories.lvl1',
              'hierarchicalCategories.lvl2',
              'hierarchicalCategories.lvl3',
            ]}
          />
          <div className="search-panel">
            <div className="search-panel__filters">
              <DynamicWidgets>
                <Panel header="Brand">
                  <RefinementList attribute="brand" />
                </Panel>
                <Panel header="Type">
                  <RefinementList attribute="type" />
                </Panel>
                <Panel header="Price">
                  <RangeInput attribute="price" />
                </Panel>
                <Panel header="Categories">
                  <HierarchicalMenu
                    attributes={[
                      'hierarchicalCategories.lvl0',
                      'hierarchicalCategories.lvl1',
                      'hierarchicalCategories.lvl2',
                      'hierarchicalCategories.lvl3',
                    ]}
                  />
                </Panel>
              </DynamicWidgets>
            </div>

            <div className={stl`grow px-4`}>
              <SearchBox
                className="searchbox"
                translations={{
                  placeholder: '',
                }}
              />
              <Hits hitComponent={Hit} />

              <div className="pagination">
                <Pagination />
              </div>
            </div>
          </div>
        </InstantSearch>
      </div>
    </div>
  );
}

/* Hit component with notifications built in ref: https://satellite-storybook.algolia.com/?path=/docs/indicators-flag--basic
 */
function Hit(props) {
  const [notifications, setNotifications] = useState([]);
  const [updating, setUpdating] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // event handler for modal to update the record/s
  const handleToggleModal = (event) => {
    if (event && event.target.outerText === 'Save') {
      setNotifications([
        {
          id: 'update',
          title: 'Update in progress',
          content: 'Please wait while the index is updating',
          loading: true,
          onDismiss: () => setNotifications([]),
        },
      ]);
      setUpdating(true); // disable Save button
      index
        .partialUpdateObject({
          objectID: props.hit.objectID,
          name: titleRef.current.value,
          description: descriptionRef.current.value,
        })
        .wait()
        .then(() => {
          setNotifications([
            {
              id: 'finished',
              title: 'Update finished',
              content: 'Index updated',
              onDismiss: () => setNotifications([]),
              autoDismissAfter: 4500,
            },
          ]);
          setUpdating(false);
          refresh();
          setShowModal((showModal) => !showModal);
        });
    } else {
      setShowModal((showModal) => !showModal);
    }
  };

  // Input and TextArea field references
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);

  // used once the index build finishes to refresh the search results
  const { refresh } = useInstantSearch();
  return (
    <>
      <Flags notifications={notifications} />
      <Modal
        open={showModal}
        title="Edit Record"
        onDismiss={handleToggleModal}
        hideCloseIcon={updating}
      >
        <Field label="Name" labelFor="name">
          <Input ref={titleRef} id="name" defaultValue={props.hit.name}></Input>
        </Field>
        <Field label="Description" labelFor="description">
          <TextArea
            ref={descriptionRef}
            id="description"
            defaultValue={props.hit.description}
          ></TextArea>
        </Field>
        {showModal ? (
          <Button
            variant="primary"
            onClick={handleToggleModal}
            loading={updating}
          >
            Save
          </Button>
        ) : null}
      </Modal>
      <article>
        <h1 className={stl`display-heading`}>
          <Highlight attribute="name" hit={props.hit} />
        </h1>

        <p className={stl`text-grey-600`}>
          <Highlight attribute="description" hit={props.hit} />
        </p>
        <Button
          className="editButton"
          onClick={handleToggleModal}
          disabled={updating}
        >
          Edit
        </Button>
      </article>
    </>
  );
}

export default App;
