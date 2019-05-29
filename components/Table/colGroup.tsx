import * as React from 'react'
import { ColGroupProps } from 'types/table.d'

export default function ColGroup<T>({ columns, rowSelection }: ColGroupProps<T>) {
  return (
    <colgroup>
      {rowSelection ? <col style={{ width: 60 }} /> : null}
      {columns.map((column, index) => {
        return <col style={{ width: column.width, minWidth: column.width }} key={`col-${index}`} />
      })}
    </colgroup>
  )
}
