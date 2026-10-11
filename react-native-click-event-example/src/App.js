import React from "react";
import { StyleSheet, View, StatusBar } from "react-native";
import algoliasearch from "algoliasearch/lite";
import { InstantSearch, Configure } from "react-instantsearch-native";
import SearchBox from "./SearchBox";
import InfiniteHits from "./InfiniteHits";

// Configuration Variables
const appId = "7ZG60VY5PI";
const apiKey = "0193e3c91560bd60e79141331ed1f13e";
const indexName = "mpl_users";
// Replace with your index name

// Initialize Algolia Search Client
const searchClient = algoliasearch(appId, apiKey);

// Main App Component
const App = () => (
  <View style={styles.container}>
    <StatusBar barStyle="light-content" />
    <InstantSearch searchClient={searchClient} indexName={indexName}>
      <Configure hitsPerPage={16} responseFields={["*"]} clickAnalytics />
      <SearchBox />
      <InfiniteHits />
    </InstantSearch>
  </View>
);

// Styles for the App component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingTop: StatusBar.currentHeight || 0,
  },
});

export default App;
