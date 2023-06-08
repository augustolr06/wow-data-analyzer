export interface IQuest {
  id: number
  title: string
  area: number
  description: string
  requirements: number
  rewards: number
}

export const questFilters = ['title', 'area', 'description', 'requirements', 'rewards']
export const questFiltersAdvanced = ['area', 'requirements', 'rewards']
export const areaOptions = ['id', 'name']

export const rewardsOptions = ['id', 'experience', 'money', 'reputations', 'items']
export const requirementsOptions = ['id', 'maxCharacterLevel', 'minCharacterLevel', 'faction']

export interface IItem {
  id: number
  binding: string
  durability: number
  inventoryType: string
  isEquippable: boolean
  isStackable: boolean
  itemClass: number
  itemSubClass: number
  itemStats: number
  level: number
  maxCount: number
  name: string
  purchasePrice: number
  purchaseQuantity: number
  quality: number
  requiredLevel: number
  sellPrice: number
  spells: number[]
  uniqueEquipped: boolean
  weaponStats: number
}

export const itemFilters = [
  'binding',
  'durability',
  'inventoryType',
  'isEquippable',
  'isStackable',
  'itemClass',
  'itemSubClass',
  'itemStats',
  'level',
  'maxCount',
  'name',
  'purchasePrice',
  'purchaseQuantity',
  'quality',
  'requiredLevel',
  'sellPrice',
  'spells',
  'uniqueEquipped',
  'weaponStats'
]

export const itemFiltersAdvanced = ['itemClass', 'itemSubClass', 'itemStats', 'weaponStats']
export const itemClassOptions = ['id', 'name']
export const itemSubClassOptions = ['id', 'name']
export const itemStatsOptions = [
  'id',
  'agility',
  'avoidance',
  'criticalStrike',
  'fireResistance',
  'frostResistance',
  'haste',
  'intellect',
  'leech',
  'mana',
  'mastery',
  'natureResistance',
  'parry',
  'shadowResistance',
  'stamina',
  'strength',
  'versatility'
]
export const weaponStatsOptions = ['minDamage', 'maxDamage', 'damageClass']

export const searchByOptions = ['quest', 'item']
