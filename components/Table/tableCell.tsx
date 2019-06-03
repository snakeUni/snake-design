import * as React from 'react'
import cx from 'classnames'
import { TableCellProps, Column } from 'types/table'
import Dropdown from '../Dropdown'
import Icon from '../Icon'
import Checkbox from '../Checkbox'
import Radio from '../Radio'
import { getFirstNode } from './util'

const { item: CheckboxItem } = Checkbox
const { item: RadioItem } = Radio

const firstNode = getFirstNode()

const { useState, useRef } = React

export default function TableCell<T>({
  tag: Tag = 'td',
  children,
  column,
  prefixCls = 'snake-table',
  filters,
  dispatch,
  sortOrder
}: TableCellProps<T>) {
  const [visible, setVisible] = useState(false)
  const [cloneFilters, setFilters] = useState(
    filters ? JSON.parse(JSON.stringify(filters)) : filters
  )
  const nodeRef = useRef(firstNode)

  const getPrefixCls = () => {
    const align = column && column.align
    return cx(`${prefixCls}-column`, {
      [`${prefixCls}-column-${align}`]: align,
      [`${prefixCls}-column-has-sorters`]: column && column.sorter
    })
  }

  const handleChange = (checked: boolean, type: string, value: string | number) => {
    const key = column.key
    const newFilters = { ...cloneFilters }
    if (checked) {
      type === 'checkbox' ? newFilters[key].push(value) : (newFilters[key] = [].concat(value))
    } else {
      newFilters[key].splice(newFilters[key].indexOf(value), 1)
    }
    setFilters(newFilters)
  }

  const handleClick = (type: string) => {
    setVisible(false)
    if (type === 'ok') {
      // 进行深拷贝, 否则会改变引用的值
      dispatch({ type: 'UPDATE_FILTERS', payload: JSON.parse(JSON.stringify(cloneFilters)) })
    } else {
      // 进行深拷贝, 否则会改变引用的值
      const filters = { ...cloneFilters }
      filters[column.key] = []
      setFilters(filters)
      dispatch({ type: 'UPDATE_FILTERS', payload: JSON.parse(JSON.stringify(filters)) })
    }
  }

  const handleClickSorter = () => {
    if (!column || !column.sorter) return
    dispatch({ type: 'UPDATE_SORT_ORDER', payload: nodeRef.current.value })
    dispatch({ type: 'UPDATE_SORT_COLUMN', payload: { ...column } })
    nodeRef.current = nodeRef.current.next
  }

  const activeColor = (type: string) => {
    if (type === sortOrder) return '#01C1B2'
  }

  const renderSorter = () => {
    if (column && column.sorter) {
      return (
        <div className={`${prefixCls}-column-sorter`} title="排序">
          <div className={`${prefixCls}-column-sorter-item ${prefixCls}-column-sorter-up`}>
            <Icon type="caret-up" color={activeColor('asc')} />
          </div>
          <div className={`${prefixCls}-column-sorter-item ${prefixCls}-column-sorter-down`}>
            <Icon type="caret-down" color={activeColor('desc')} />
          </div>
        </div>
      )
    }
    return null
  }

  const renderCell = () => {
    return <span className={`${prefixCls}-column-title`}>{children}</span>
  }

  const renderDropdown = (column: Column<T>) => {
    if (column.filterDropdown) {
      return column.filterDropdown
    }
    const columnFilters = column.filters
    const filterMultiple = column.filterMultiple
    return (
      <div className={`${prefixCls}-column-dropdown`}>
        <ul className={`${prefixCls}-column-dropdown-menu`}>
          {columnFilters.map(filter => {
            return (
              <li key={filter.value} className={`${prefixCls}-column-dropdown-item`}>
                {filterMultiple ? (
                  <CheckboxItem
                    onChange={checked => handleChange(checked, 'checkbox', filter.value)}
                    checked={cloneFilters[column.key].includes(filter.value)}
                  >
                    {filter.label}
                  </CheckboxItem>
                ) : (
                  <RadioItem
                    onChange={checked => handleChange(checked, 'radio', filter.value)}
                    checked={cloneFilters[column.key].includes(filter.value)}
                  >
                    {filter.label}
                  </RadioItem>
                )}
              </li>
            )
          })}
        </ul>
        <div className={`${prefixCls}-column-filter-option`}>
          <div role="button" className={`${prefixCls}-btn`} onClick={() => handleClick('ok')}>
            确认
          </div>
          <div role="button" className={`${prefixCls}-btn`} onClick={() => handleClick('cancel')}>
            取消
          </div>
        </div>
      </div>
    )
  }

  const renderFilter = () => {
    if (column && column.filters) {
      return (
        <Dropdown
          content={renderDropdown(column)}
          wrapperStyle={{ marginLeft: 'auto' }}
          visible={visible}
          onVisibleChange={visible => setVisible(visible)}
          placement="bottomRight"
          trigger="click"
        >
          <div className={`${prefixCls}-column-filter`} title="筛选">
            <Icon type="filter" />
          </div>
        </Dropdown>
      )
    }
    return null
  }

  return (
    <Tag className={getPrefixCls()} onClick={handleClickSorter}>
      <div className={`${prefixCls}-column-head`}>
        {renderCell()}
        {renderSorter()}
        {renderFilter()}
      </div>
    </Tag>
  )
}
