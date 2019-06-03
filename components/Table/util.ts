const groupBy = (arr, fn) =>
  arr.map(typeof fn === 'function' ? fn : val => val[fn]).reduce((acc, val, i) => {
    acc[val] = (acc[val] || []).concat(arr[i])
    return acc
  }, {})

const getColumnsByFixed = array => {
  return groupBy(array, 'fixed')
}

function Vnode(value) {
  this.value = value
  this.next = null
}

function getFirstNode() {
  const firstNode = new Vnode('desc')
  const secondNode = new Vnode('asc')
  const thirdNode = new Vnode('')
  firstNode.next = secondNode
  secondNode.next = thirdNode
  thirdNode.next = firstNode
  return firstNode
}

export { getColumnsByFixed, Vnode, getFirstNode }
