import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useRefinementList } from 'react-instantsearch-hooks-web'
import { index } from '../search'
import Panel from './panel'

const fetchAllItems = async (facet) => {
  try {
    const { facets } = await index.search('', {
      facets: [facet],
      responseFields: ['facets'],
    })

    return Object.keys(facets[facet]).map((value) => ({
      count: facets[facet][value],
      isRefined: false,
      isDisabled: false,
      value,
      label: value,
      highlighted: value,
    }))
  } catch {
    return []
  }
}

const RefinementListItem = ({ count, isDisabled, isRefined, label, onClick, value }) => {
  const refinementListClass = useMemo(() => {
    const classes = ['ais-RefinementList-item']
    if (isRefined) classes.push('ais-RefinementList-item--selected')
    if (isDisabled) classes.push('ais-RefinementList-item--disabled')
    return classes.join(' ')
  }, [isDisabled, isRefined])

  return (
    <li className={refinementListClass}>
      <label className="ais-RefinementList-label" onChange={() => onClick(value)}>
        <input className="ais-RefinementList-checkbox" type="checkbox" disabled={isDisabled} value={value} />
        <span className="ais-RefinementList-labelText">{label}</span>
        <span className="ais-RefinementList-count">{count}</span>
      </label>
    </li>
  )
}

const RefinementList = ({ attribute, limit = 100, showAll = false, ...props }) => {
  const [allItems, setAllItems] = useState<any[]>([])
  const { items, refine } = useRefinementList({ attribute, limit, ...props })

  useEffect(() => {
    if (!showAll) return
    ;(async () => {
      // The effect itself can't be asynchronous, but an async IIFE can be used
      const totalItems = await fetchAllItems(attribute)
      setAllItems(totalItems)
    })()
  }, [attribute, showAll])

  const transformedItems = useMemo(() => {
    if (!showAll || allItems.length === 0) return items

    return (
      allItems
        .map((_item) => {
          const item = items.find((i) => i.value === _item.value)
          return item
            ? {
                ...item,
                isDisabled: false,
              }
            : {
                ..._item,
                count: 0,
                isDisabled: true,
              }
        })
        // Sort by refined, count or alphabetically
        .sort((a, b) => b.isRefined - a.isRefined || b.count - a.count || a.value.localeCompare(b.value))
    )
  }, [allItems, items, showAll])

  const onItemClick = useCallback(
    (value) => {
      if (!value) return
      refine(value)
    },
    [refine]
  )

  return (
    <Panel header={attribute}>
      <div className="ais-RefinementList" {...props}>
        <ul className="ais-RefinementList-list">
          {transformedItems.slice(0, limit).map((item) => (
            <RefinementListItem {...item} onClick={onItemClick} key={item.value} />
          ))}
        </ul>
      </div>
    </Panel>
  )
}

export default RefinementList
