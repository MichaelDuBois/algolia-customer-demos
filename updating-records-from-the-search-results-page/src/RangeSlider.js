import React from 'react';
import connectRange from 'instantsearch.js/es/connectors/range/connectRange';
import { useConnector } from 'react-instantsearch-hooks-web';

const useRangeSlider = (props) => {
  return useConnector(connectRange, props);
};

export function RangeSlider(props) {
  const { start, range, canRefine, refine } = useRangeSlider(props);

  return <>{/* Your JSX */}range slide</>;
}
