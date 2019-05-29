import * as React from 'react'
import cx from 'classnames'
import { TableRowProps, Column, RowSelection } from 'types/table'
import TableCell from './tableCell'
import Checkbox from '../Checkbox'
import Radio from '../Radio'

const { useCallback } = React
const { item: CheckboxItem } = Checkbox
const { item: RadioItem } = Radio

export default function TableRow<T>({
  data,
  columns = [],
  prefixCls = 'snake-table',
  className,
  rowSelection,
  rowKey,
  index,
  dataSource
}: TableRowProps<T>) {
  const getChildren = (column: Column<T>, index: number) => {
    const render = column.render
    if (render) {
      return render(data, data[column.key], index)
    }
    return data[column.key]
  }

  const getClassStr = useCallback(() => {
    return cx(`${prefixCls}-row`, className)
  }, [prefixCls, className])

  const getSelectedKey = (data, index) => {
    if (rowKey) {
      return rowKey(data)
    }
    return index
  }

  const handleChange = (
    checked: boolean,
    { selectedRowKeys, onChange, onSelect }: RowSelection<T>,
    selectedKey: string | number,
    type
  ) => {
    let newSelectedRowKeys = []
    if (checked) {
      newSelectedRowKeys =
        type === 'checkbox' ? selectedRowKeys.concat(selectedKey) : [].concat(selectedKey)
    } else {
      newSelectedRowKeys = [...selectedRowKeys]
      newSelectedRowKeys.splice(selectedRowKeys.indexOf(selectedKey), 1)
    }
    const selectedRows = dataSource.filter((data, index) => {
      const selectedKey = getSelectedKey(data, index)
      return newSelectedRowKeys.includes(selectedKey)
    })
    onChange && onChange(newSelectedRowKeys, selectedRows)
    onSelect && onSelect(data, newSelectedRowKeys, checked)
  }

  const renderRowSelection = () => {
    if (rowSelection) {
      const type = rowSelection.type
      const onDisabled = rowSelection.onDisabled
      const selectedKey = getSelectedKey(data, index)
      const selectedRowKeys = rowSelection.selectedRowKeys
      const checked = selectedRowKeys.includes(selectedKey)
      const disabled = onDisabled ? onDisabled(data) : false
      return (
        <TableCell prefixCls={`${prefixCls}-row`}>
          {type === 'checkbox' ? (
            <CheckboxItem
              checked={checked}
              onChange={checked => handleChange(checked, rowSelection, selectedKey, 'checkbox')}
              disabled={disabled}
            />
          ) : (
            <RadioItem
              checked={checked}
              onChange={checked => handleChange(checked, rowSelection, selectedKey, 'radio')}
              disabled={disabled}
            />
          )}
        </TableCell>
      )
    }
    return null
  }

  return (
    <tr className={getClassStr()}>
      {renderRowSelection()}
      {columns.map((column, index) => {
        const { key } = column
        const children = getChildren(column, index)
        return (
          <TableCell key={`${key}-tr-td-${index}`} prefixCls={`${prefixCls}-row`}>
            {children}
          </TableCell>
        )
      })}
    </tr>
  )
}
