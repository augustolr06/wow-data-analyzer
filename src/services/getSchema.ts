import { api } from './api'

export type TResult = Record<string, any>

export interface ITableProperties {
  attributes: string[]
  relationships: string[]
  filters: IFilters[]
}

export type TTable = Record<string, ITableProperties>

interface ITables {
  tables: string[]
}

interface IColumns {
  columns: string[]
}

interface IRelationships {
  relationships: string[]
}

export interface IFilters {
  name: string
  type: string
  operators: string[]
}

export interface IEnums {
  bindingtype: string[]
  inventorytype: string[]
  itemclass: string[]
  itemsubclass: string[]
  damagetype: string[]
  status?: 'idle' | 'loading' | 'success' | 'error'
  message?: string

  [key: string]: string[]
}

export interface ISchema {
  tables: string[]
  tableProperties: TTable
  status?: 'idle' | 'loading' | 'success' | 'error'
  message?: string
}

const operators = [
  'equals',
  'not',
  'has',
  'hasEvery',
  'in',
  'notIn',
  'lt',
  'lte',
  'gt',
  'gte',
  'contains',
  'search',
  'startsWith',
  'endsWith'
]

// 1. Obter os nomes das tabelas do banco através do endpoint general/tables
// 2. Obter os nomes das colunas de cada tabela através do endpoint general/columns
// 3. Obter os nomes das relações de cada tabela através do endpoint general/relationships
// 4. Obter os filtros de cada tabela através do endpoint general/filters
// 5. Obter os valores de todos os enums e armazenar em um objeto de acordo com o type TEnums
// 6. Armazenar os dados em um objeto de acordo com a interface ISchema

// 1:
const getTables = async (): Promise<ITables> => {
  const response = await api.get('/general/tables')
  return response.data
}

// 2:
const getColumns = async (table: string): Promise<IColumns> => {
  const response = await api.get(`/general/columns/${table}`)
  return response.data
}

// 3:
const getRelationships = async (table: string): Promise<IRelationships> => {
  const response = await api.get(`/general/relationships/${table}`)
  return response.data
}

// 4:
const getFilters = async (table: string): Promise<IFilters[]> => {
  const response = await api.get(`/general/filters/${table}`)
  return response.data
}

// 5:

export const getEnums = async (): Promise<IEnums> => {
  const response = await api.get('/general/enums')
  return {
    bindingtype: response.data.bindingtype.filter((bindingtype: string) => bindingtype !== ''),
    inventorytype: response.data.inventorytype.filter((inventorytype: string) => inventorytype !== ''),
    itemclass: response.data.itemclass.filter((itemclass: string) => itemclass !== ''),
    itemsubclass: response.data.itemsubclass.filter((itemsubclass: string) => itemsubclass !== ''),
    damagetype: response.data.damagetype.filter((damagetype: string) => damagetype !== '')
  }
}

// 6:
export const getSchema = async (): Promise<ISchema> => {
  const tables = (await getTables()).tables

  if (!tables) {
    throw new Error('Não foi possível obter os nomes das tabelas')
  }

  const tableProperties: TTable = {}

  for (const table of tables) {
    const columns = (await getColumns(table)).columns
    const relationships = (await getRelationships(table)).relationships.filter((relationship) => relationship !== null)
    const filtersAPI = await getFilters(table)

    // cada tabela deve incluir, nos filtros, os atributos das tabelas relacionadas

    for (const relationship of relationships) {
      const relatedColumns = (await getColumns(relationship)).columns.filter((column) => column !== 'id')
      for (const relatedColumn of relatedColumns) {
        filtersAPI.push({
          name: `${relationship}.${relatedColumn}`,
          type: 'string'
        })
      }
    }
    const filters = filtersAPI.map((filter) => {
      if (filter.type.startsWith('_')) {
        filter.operators = ['has', 'hasEvery']
      } else {
        filter.operators = operators
      }
      return filter
    })

    tableProperties[table] = {
      attributes: columns,
      relationships,
      filters
    }
  }

  return {
    tables,
    tableProperties
  }
}
