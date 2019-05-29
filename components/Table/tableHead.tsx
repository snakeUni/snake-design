import * as React from 'react'
import TableCell from './tableCell'
import { TableHeadProps, RowSelection } from 'types/table'
import Checkbox from '../Checkbox'

const { item: CheckboxItem } = Checkbox

export default function TableHead<T>({
  columns = [],
  prefixCls = 'snake-table',
  rowSelection,
  dataSource,
  rowKey
}: TableHeadProps<T>) {
  const getSelectedKey = (data, index) => {
    if (rowKey) {
      return rowKey(data)
    }
    return index
  }

  const getAvailableRows = (onDisabled?: (record: T) => boolean) => {
    let selectedRows = [...dataSource]
    if (onDisabled) {
      selectedRows = dataSource.filter(data => !onDisabled(data))
    }
    return selectedRows
  }

  const handleChange = (
    checked: boolean,
    { onChange, onSelectAll, onDisabled }: RowSelection<T>
  ) => {
    let selectedKeys = []
    let selectedRows = []
    if (checked) {
      selectedRows = getAvailableRows(onDisabled)
      dataSource.forEach((data, index) => {
        const isDisabled = onDisabled ? onDisabled(data) : false
        const selectedKey = getSelectedKey(data, index)
        if (!isDisabled) {
          selectedRows.push(data)
          selectedKeys.push(selectedKey)
        }
      })
    } else {
      selectedRows = []
      selectedKeys = []
    }

    onChange && onChange(selectedKeys, selectedRows)
    onSelectAll && onSelectAll(selectedRows, checked)
  }

  const renderRowSelection = () => {
    if (rowSelection) {
      const type = rowSelection.type
      const selectedRowKeys = rowSelection.selectedRowKeys
      const checked = selectedRowKeys.length === getAvailableRows(rowSelection.onDisabled).length
      return type === 'checkbox' ? (
        <TableCell tag="th" key="thead-checkbox" prefixCls={`${prefixCls}-thead`}>
          <CheckboxItem
            onChange={checked => handleChange(checked, rowSelection)}
            checked={checked}
          />
        </TableCell>
      ) : (
        <TableCell tag="th" prefixCls={`${prefixCls}-thead`} />
      )
    }
    return null
  }
  return (
    <thead className={`${prefixCls}-thead`}>
      <tr>
        {renderRowSelection()}
        {columns.map(column => {
          return (
            <TableCell tag="th" key={column.key} column={column} prefixCls={`${prefixCls}-thead`}>
              {column.title}
            </TableCell>
          )
        })}
      </tr>
    </thead>
  )
}
