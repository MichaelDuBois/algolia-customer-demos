/* global instantsearch */

function getHitsOfIndex(index, rule, hitIndex) {
  for (const subIndex of index.getWidgets()) {
    if (subIndex.$$type !== 'ais.index') {
      continue;
    }
    if (subIndex.getIndexId() === rule.indexId) {
      return subIndex
        .getResults()
        .hits.slice(hitIndex, hitIndex + rule.count || 1);
    }
  }
}

function injectHits(items, instance, rules) {
  const indexHitIndices = {};
  for (const rule of rules) {
    indexHitIndices[rule.indexId] = 0;
  }

  return rules.reduce((acc, rule) => {
    const hitIndex = indexHitIndices[rule.indexId];

    const hits = getHitsOfIndex(instance.mainIndex, rule, hitIndex);

    indexHitIndices[rule.indexId] = indexHitIndices[rule.indexId] + 1;

    acc.splice(
      rule.position,
      0,
      hits.length === 1
        ? { ...rule.properties, ...hits[0] }
        : { ...rule.properties, hits: hits.map((hit) => ({ ...hit })) }
    );

    return acc;
  }, items.slice());
}

export default function customHitsWidget({
  container: containerId,
  templates,
  injected,
}) {
  const container = document.querySelector(containerId);
  return {
    $$type: 'customHitsWidget',
    render({ results, instantSearchInstance }) {
      const transformedHits = injectHits(
        results.hits,
        instantSearchInstance,
        injected
      );

      container.innerHTML =
        `<ol>` +
        transformedHits.map((hit) => templates.item(hit)).join('') +
        `</ol>`;
    },
  };
}
