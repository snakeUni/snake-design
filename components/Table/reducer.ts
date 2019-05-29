import { Column } from 'types/table'

interface State<T> {
  sortColumn: Column<T>
  filterColumn: Column<T>
  filters: Column<T>[]
}

type ActionType = 'UPDATE_SORT_COLUMN' | 'UPDATE_FILTER_COLUMN' | 'UPDATE_FILTERS'

interface Action {
  type: ActionType
  payload: any
}

export default function reducer<T>(state: State<T>, action: Action) {
  switch (action.type) {
    case 'UPDATE_FILTERS': {
      return {
        ...state,
        filters: action.payload
      }
    }
    case 'UPDATE_FILTER_COLUMN': {
      return {
        ...state,
        filterColumn: action.payload
      }
    }
    case 'UPDATE_SORT_COLUMN': {
      return {
        ...state,
        sortColumn: action.payload
      }
    }
    default: {
      return state
    }
  }
}
