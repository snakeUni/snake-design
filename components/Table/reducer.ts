import { Column, Action } from 'types/table'

export interface State<T> {
  sortColumn: Column<T> | null
  filterColumn: Column<T> | null
  filters: Filters
  sortOrder: string
}

export interface Filters {
  [key: string]: (string | number)[]
}

export default function reducer<T>(state: State<T>, action: Action<T>): State<T> {
  switch (action.type) {
    case 'UPDATE_FILTERS': {
      return {
        ...state,
        filters: action.payload as Filters
      }
    }
    case 'UPDATE_FILTER_COLUMN': {
      return {
        ...state,
        filterColumn: action.payload as Column<T>
      }
    }
    case 'UPDATE_SORT_COLUMN': {
      return {
        ...state,
        sortColumn: action.payload as Column<T>
      }
    }
    case 'UPDATE_SORT_ORDER': {
      return {
        ...state,
        sortOrder: action.payload as string
      }
    }
    default: {
      return state
    }
  }
}
