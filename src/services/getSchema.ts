import { api } from './api'

export interface IResultsQuest {
  id: number
  title: string
  description: string
  area: number
  rewards: number
  requirements: number
  area_quest_areaToarea: {
    id: number
    name: string
  }
  quest_requirements: {
    id: number
    max_character_level: number
    min_character_level: number
    faction: string
  }
  quest_rewards: {
    id: number
    experience: number
    money: number
    item: number[]
    reputations: number[]
  }
  [key: string]: string | number | number[] | any
}

export interface IResultsItem {
  id: number
  binding: string
  durability: number
  inventory_type: string
  is_equippable: boolean
  is_stackable: boolean
  item_class: string
  item_stats: number
  item_sub_class: string
  level: number
  max_count: number
  name: string
  purchase_price: number
  purchase_quantity: number
  quality: string
  required_level: number
  sell_price: number
  spells: number[]
  unique_equipped: boolean
  weapon_stats: number
  item_stats_item_item_statsToitem_stats: {
    id: number
    agility: number
    avoidance: number
    critical_strike: number
    fire_resistance: number
    frost_resistance: number
    haste: number
    intellect: number
    leech: number
    mana: number
    mastery: number
    nature_resistance: number
    parry: number
    shadow_resistance: number
    stamina: number
    strength: number
    versatility: number
  }
  weapon_stats_item_weapon_statsToweapon_stats: {
    id: number
    min_damage: number
    max_damage: number
    damage_class: string
  }

  [key: string]: string | number | boolean | number[] | any
}

export interface IResultsQuestRewards {
  id: number
  experience: number
  money: number
  item: number[]
  reputations: number[]
  [key: string]: string | number | number[] | any
}

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
}

export interface IEnums {
  bindingtype: string[]
  inventorytype: string[]
  itemclass: string[]
  itemsubclass: string[]
  damagetype: string[]

  [key: string]: string[]
}

export interface ISchema {
  tables: string[]
  tableProperties: TTable
}

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
    const filters = await getFilters(table)

    // cada tabela deve incluir, nos filtros, os atributos das tabelas relacionadas

    for (const relationship of relationships) {
      const relatedColumns = (await getColumns(relationship)).columns.filter((column) => column !== 'id')
      for (const relatedColumn of relatedColumns) {
        filters.push({
          name: `${relationship}.${relatedColumn}`,
          type: 'string'
        })
      }
    }

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
