import algoliasearch from 'algoliasearch'

export const client = algoliasearch('latency', '6be0576ff61c053d5f9a3225e2a90f76')
export const index = client.initIndex('instant_search')
