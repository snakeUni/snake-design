import * as React from 'react'
import { TableProps } from 'types/table'
import TableHead from './tableHead'
import TableCol from './colGroup'
import TableBody from './tableBody'
import reducer from './reducer'
import { getColumnsByFixed } from './util'

import './index.scss'

const { useReducer } = React

const prefixCls = 'snake-table'

export default function Table<T>({
  dataSource = [],
  columns = [],
  rowKey,
  rowClassName,
  scroll,
  ...rest
}: TableProps<T>) {
  const initialFilters = () => {
    const filters = columns.reduce((pre, cur) => {
      if (cur.filters) {
        pre[cur.key] = []
      }
      return pre
    }, {})
    return filters
  }

  const [state, dispatch] = useReducer(reducer, {
    sortColumn: null,
    filterColumn: null,
    filters: initialFilters(),
    sortOrder: ''
  })

  const getSortFn = () => {
    const { sortColumn, sortOrder } = state
    if (sortColumn) {
      const sorter = sortColumn.sorter
      if (typeof sorter === 'function') {
        return (a, b) => {
          const result = sorter(a, b)
          if (result !== 0) {
            return sortOrder === 'desc' ? -result : result
          }
          return 0
        }
      }
    }
  }

  const findColumn = (filterKey: string | number) => {
    let column = null
    for (let i = 0; i < columns.length; i++) {
      if (columns[i].key === filterKey) {
        column = columns[i]
        break
      }
    }
    return column
  }

  const transferData = () => {
    const { filters, sortOrder } = state
    let cloneDataSource = [...dataSource]
    const sortFn = getSortFn()
    if (sortFn) {
      cloneDataSource = sortOrder ? cloneDataSource.sort(sortFn) : cloneDataSource
    }
    if (filters) {
      Object.keys(filters).forEach(filterKey => {
        const column = findColumn(filterKey)
        if (!column) {
          return
        }
        let values = filters[filterKey]
        if (values.length === 0) {
          return
        }
        const onFilter = column.onFilter
        cloneDataSource = onFilter
          ? cloneDataSource.filter(record => {
              return onFilter(values, record)
            })
          : cloneDataSource
      })
    }
    return cloneDataSource
  }

  const getTableColProps = (cloneColumns = columns) => {
    return {
      prefixCls,
      columns: cloneColumns,
      ...rest
    }
  }

  const getTableHeadProps = (cloneColumns = columns) => {
    return {
      prefixCls,
      columns: cloneColumns,
      dataSource,
      filters: state.filters,
      dispatch: dispatch,
      sortOrder: state.sortOrder,
      ...rest
    }
  }

  const getTableBodyProps = (cloneColumns = columns) => {
    return {
      prefixCls,
      columns: cloneColumns,
      dataSource: transferData(),
      rowKey,
      rowClassName,
      ...rest
    }
  }

  const renderNormalTable = ({ cloneColumns = columns, hasHead = true, hasBody = true }) => {
    return (
      <>
        <TableCol {...getTableColProps(cloneColumns)} />
        {hasHead ? <TableHead {...getTableHeadProps(cloneColumns)} /> : null}
        {hasBody ? <TableBody {...getTableBodyProps(cloneColumns)} /> : null}
      </>
    )
  }

  const renderScrollY = (cloneColumns = columns) => {
    return (
      <div className={`${prefixCls}-scroll`}>
        <div
          className={`${prefixCls}-scroll-header`}
          style={{
            width: scroll && scroll.x
          }}
        >
          <table style={{ width: scroll && scroll.x }}>
            {renderNormalTable({ cloneColumns, hasBody: false })}
          </table>
        </div>
        <div
          className={`${prefixCls}-scroll-body`}
          style={{ height: scroll && scroll.y, width: scroll && scroll.x }}
        >
          <table style={{ width: scroll && scroll.x }}>
            {renderNormalTable({ cloneColumns, hasHead: false })}
          </table>
        </div>
      </div>
    )
  }

  const renderFixedTable = (fixed: string) => {
    const fixedColumns = getColumnsByFixed(columns)
    const currentColumns = fixedColumns[fixed]
    if (currentColumns && currentColumns.length > 0) {
      return (
        <div className={`${prefixCls}-scroll-${fixed}`}>
          {scroll.y ? (
            renderScrollY(currentColumns)
          ) : (
            <table>{renderNormalTable({ cloneColumns: currentColumns })}</table>
          )}
        </div>
      )
    }
    return null
  }

  const renderScrollX = () => {
    return (
      <div className={`${prefixCls}-content`}>
        {scroll.y ? (
          renderScrollY()
        ) : (
          <div className={`${prefixCls}-scroll`}>
            <table style={{ width: scroll.x }}>{renderNormalTable({})}</table>
          </div>
        )}
        {renderFixedTable('left')}
        {renderFixedTable('right')}
      </div>
    )
  }

  const renderTable = () => {
    if (scroll) {
      if (scroll.y && !scroll.x) {
        return renderScrollY()
      }
      return renderScrollX()
    } else {
      return <table>{renderNormalTable({})}</table>
    }
  }

  return <div className={prefixCls}>{renderTable()}</div>
}
