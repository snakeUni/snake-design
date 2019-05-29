import * as React from 'react'
import { TableProps } from 'types/table'
import TableHead from './tableHead'
import TableCol from './colGroup'
import TableBody from './tableBody'

import './index.scss'

const prefixCls = 'snake-table'

export default function Table<T>({
  dataSource = [],
  columns = [],
  rowKey,
  rowClassName,
  ...rest
}: TableProps<T>) {
  const getTableColProps = () => {
    return {
      prefixCls,
      columns,
      ...rest
    }
  }

  const getTableHeadProps = () => {
    return {
      prefixCls,
      columns,
      dataSource,
      ...rest
    }
  }

  const getTableBodyProps = () => {
    return {
      prefixCls,
      columns,
      dataSource,
      rowKey,
      rowClassName,
      ...rest
    }
  }

  return (
    <table className={prefixCls}>
      <TableCol {...getTableColProps()} />
      <TableHead {...getTableHeadProps()} />
      <TableBody {...getTableBodyProps()} />
    </table>
  )
}
