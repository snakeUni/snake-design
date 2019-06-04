import * as React from 'react'
import Table from 'components/Table'

const columns = [
  {
    key: 'name',
    title: '姓名',
    fixed: 'left' as any,
    width: 100
  },
  {
    key: 'age',
    title: '年龄',
    width: 100
  },
  {
    key: 'address',
    title: '地址',
    width: 200
  },
  {
    key: 'hobby',
    title: '爱好'
  },
  {
    key: 'skill',
    title: '技能',
    fixed: 'right' as any,
    width: 100
  }
]

const dataSource = [
  {
    name: '蓝银草',
    age: 18,
    address: '上海市长宁区',
    hobby: 'sing, dance, rap',
    skill: 'code'
  },
  {
    name: '牧老师',
    age: 28,
    address: '浙江省杭州市',
    hobby: 'sing, dance, rap',
    skill: 'code'
  },
  {
    name: '牧老师1',
    age: 29,
    address: '浙江省杭州市',
    hobby: 'sing, dance, rap',
    skill: 'code'
  },
  {
    name: '牧老师2',
    age: 30,
    address: '浙江省杭州市',
    hobby: 'sing, dance, rap',
    skill: 'code'
  },
  {
    name: '牧老师3',
    age: 27,
    address: '浙江省杭州市',
    hobby: 'sing, dance, rap',
    skill: 'code'
  },
  {
    name: '武当 张三丰',
    age: 22,
    address: '上海市黄浦区',
    hobby: 'sing, dance, rap',
    skill: 'code'
  }
]

export default function FixedHeader() {
  return (
    <div style={{ width: 1000 }}>
      <Table columns={columns} dataSource={dataSource} scroll={{ x: 1200, y: 200 }} />
    </div>
  )
}
