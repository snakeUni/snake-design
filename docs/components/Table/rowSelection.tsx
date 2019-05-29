import * as React from 'react'
import Table from 'components/Table'

const { useState } = React

const columns = [
  {
    key: 'name',
    title: '姓名'
  },
  {
    key: 'age',
    title: '年龄'
  },
  {
    key: 'address',
    title: '地址'
  }
]

const dataSource = [
  {
    name: '蓝银草',
    age: 18,
    address: '上海市长宁区'
  },
  {
    name: '牧老师',
    age: 28,
    address: '浙江省杭州市'
  },
  {
    name: '武当 张三丰',
    age: 22,
    address: '上海市黄浦区'
  }
]

export default function SimpleTable() {
  const [selectedKeys, setSelectedKeys] = useState([])

  const handleChange = selectedKeys => {
    setSelectedKeys(selectedKeys)
  }
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      rowSelection={{
        selectedRowKeys: selectedKeys,
        onChange: handleChange,
        type: 'checkbox',
        onDisabled: data => data.name === '牧老师'
      }}
    />
  )
}
