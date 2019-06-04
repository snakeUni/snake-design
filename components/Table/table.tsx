import * as React from 'react'
import { TableProps } from 'types/table'
import TableHead from './tableHead'
import TableCol from './colGroup'
import TableBody from './tableBody'
import reducer from './reducer'
import { getColumnsByFixed } from './util'

import './index.scss'

const { useReducer, useRef } = React

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

  const scrollBody = useRef<HTMLDivElement>()
  const scrollHead = useRef<HTMLDivElement>()
  const scrollLeft = useRef<HTMLDivElement>()
  const scrollRight = useRef<HTMLDivElement>()
  const tablePositionName = useRef<HTMLDivElement>()
  const lastScrollTop = useRef()
  const lastScrollLeft = useRef()

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

  const getScroll = (fixed: string) => {
    if (fixed === 'left') {
      return scrollLeft
    } else if (fixed === 'right') {
      return scrollRight
    }
    return scrollBody
  }

  const setPositionClassName = () => {
    let position = 'left'
    const scrollLeft = scrollBody.current.scrollLeft === 0
    const scrollRight =
      scrollBody.current.scrollLeft + 1 >=
      scrollBody.current.children[0].getBoundingClientRect().width -
        scrollBody.current.getBoundingClientRect().width
    if (scrollLeft && scrollRight) {
      position = 'both'
    } else if (scrollLeft) {
      position = 'left'
    } else if (scrollRight) {
      position = 'right'
    } else {
      position = 'middle'
    }
    tablePositionName.current.className = `${prefixCls}-content ${prefixCls}-position-${position}`
  }

  const handleBodyScrollTop = (e: React.UIEvent<HTMLDivElement>) => {
    if (e.currentTarget !== e.target) return
    const target = e.target
    const scrollTop = (target as any).scrollTop
    if (scrollTop !== lastScrollTop.current && scroll.y) {
      if (scrollLeft.current && target !== scrollLeft.current) {
        scrollLeft.current.scrollTop = scrollTop
      }
      if (scrollRight.current && target !== scrollRight.current) {
        scrollRight.current.scrollTop = scrollTop
      }
      if (scrollBody.current && target !== scrollBody.current) {
        scrollBody.current.scrollTop = scrollTop
      }
    }
    // 记住位置 防抖动
    lastScrollTop.current = scrollTop
  }

  const handleBodyScrollLeft = (e: React.UIEvent<HTMLDivElement>) => {
    if (e.currentTarget !== e.target) {
      return
    }
    const target = e.target
    const scrollLeft = (target as any).scrollLeft
    if (scrollLeft !== lastScrollLeft.current && scroll.x) {
      if (target === scrollBody.current && scrollHead) {
        scrollHead.current.scrollLeft = scrollLeft
      } else if (target === scrollHead.current && scrollBody) {
        scrollBody.current.scrollLeft = scrollLeft
      }
      setPositionClassName()
    }
    // 记住位置 防抖动
    lastScrollLeft.current = scrollLeft
  }

  const handleBodyScroll = (e: React.UIEvent<HTMLDivElement>) => {
    handleBodyScrollTop(e)
    handleBodyScrollLeft(e)
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

  const renderScrollY = (cloneColumns = columns, fixed = 'noFixed') => {
    const style: React.CSSProperties = {}
    // fixed = 'noFixed' 不属于固定列的部分
    if (fixed === 'noFixed') {
      style.width = scroll && scroll.x
    }
    return (
      <div className={`${prefixCls}-scroll`}>
        <div
          className={`${prefixCls}-scroll-header`}
          ref={fixed === 'noFixed' ? scrollHead : null}
          onScroll={fixed === 'noFixed' ? handleBodyScrollLeft : undefined}
        >
          <table style={style}>{renderNormalTable({ cloneColumns, hasBody: false })}</table>
        </div>
        <div
          className={`${prefixCls}-scroll-body`}
          style={{ height: scroll && scroll.y }}
          ref={getScroll(fixed)}
          onScroll={handleBodyScroll}
        >
          <table style={style}>{renderNormalTable({ cloneColumns, hasHead: false })}</table>
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
            renderScrollY(currentColumns, fixed)
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
      <div className={`${prefixCls}-content ${prefixCls}-position-left`} ref={tablePositionName}>
        {scroll.y ? (
          renderScrollY()
        ) : (
          <div className={`${prefixCls}-scroll`} ref={scrollBody} onScroll={setPositionClassName}>
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
