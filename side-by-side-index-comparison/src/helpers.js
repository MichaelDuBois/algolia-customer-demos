function extractRankingAttributeName(rankingAttribute) {
  try {
    return rankingAttribute.split('(')[1].split(')')[0];
  } catch (error) {
    return '';
  }
}

function nestedObjectGetUpdate(data, field, value) {
  let schema = data; // a moving reference to internal objects within obj

  if (field.indexOf('.') === -1) {
    return data[field];
  }

  const pList = field.split('.');
  const len = pList.length;
  for (var i = 0; i < len - 1; i++) {
    var elem = pList[i];
    if (!schema[elem]) schema[elem] = {};
    schema = schema[elem];
  }
  if (!value) {
    return schema[pList[len - 1]];
  }
  schema[pList[len - 1]] = value;
}

function formatAttributeValue(value) {
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    return value;
  }
  return Math.floor(value * 1000) / 1000;
}

export {
  extractRankingAttributeName,
  nestedObjectGetUpdate,
  formatAttributeValue,
};
