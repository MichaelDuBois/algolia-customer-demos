import React from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import PropTypes from "prop-types";
import {
  connectInfiniteHits,
  connectHitInsights,
} from "react-instantsearch-native";
import Highlight from "./Highlight";
import aa from "search-insights";

// Configuration Variables
const algoliaConfig = {
  appId: "7ZG60VY5PI",
  apiKey: "0193e3c91560bd60e79141331ed1f13e",
  indexName: "mpl_users", // Replace with your index name
};

// Initialize Algolia Insights
aa("init", {
  appId: algoliaConfig.appId,
  apiKey: algoliaConfig.apiKey,
});
aa("setUserToken", "foo");

const styles = StyleSheet.create({
  separator: {
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  item: {
    padding: 10,
    flexDirection: "column",
  },
  titleText: {
    fontWeight: "bold",
  },
});

// Hit component for each search result
const Hit = ({ hit, insights }) => (
  <TouchableOpacity
    onPress={() => {
      insights("clickedObjectIDsAfterSearch", {
        eventName: "Clicked on game",
        index: algoliaConfig.indexName,
        objectIDs: [hit.objectID],
        positions: [hit.__position],
        queryID: hit.__queryID,
      });
    }}
    style={styles.item}
  >
    <Text style={styles.titleText}>{hit.userName}</Text>
  </TouchableOpacity>
); //Change the above hit field to a value in the record to be seen in the results

const ConnectedInsightHit = connectHitInsights(aa)(Hit);

// Component for rendering infinite hits
const InfiniteHits = ({ hits, hasMore, refine }) => (
  <FlatList
    data={hits}
    keyExtractor={(item, index) => index.toString()}
    ItemSeparatorComponent={() => <View style={styles.separator} />}
    onEndReached={() => hasMore && refine()}
    renderItem={({ item }) => <ConnectedInsightHit hit={item} />}
  />
);

InfiniteHits.propTypes = {
  hits: PropTypes.arrayOf(PropTypes.object).isRequired,
  hasMore: PropTypes.bool.isRequired,
  refine: PropTypes.func.isRequired,
};

export default connectInfiniteHits(InfiniteHits);
