import * as React from 'react'
import Table from 'components/Table'

const columns = [
  {
    key: 'name',
    title: '姓名'
  },
  {
    key: 'age',
    title: '年龄',
    sorter: (a, b) => a.age - b.age,
    filters: [{ label: '18岁', value: 18 }, { label: '28岁', value: 28 }],
    onFilter: (value: Array<string | number>, record) => {
      console.log(value, record)
      return value.includes(record.age)
    }
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

export default function SortFilter() {
  return <Table columns={columns} dataSource={dataSource} />
}
