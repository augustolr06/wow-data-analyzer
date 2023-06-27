export const tables = ['quests', 'items']

// -------------------------------------------------------------------------------- //

export const questRelacionamentos = ['rewards', 'requirements', 'area']
export const itemRelacionamentos = ['itemClass', 'itemSubClass', 'itemStats', 'weaponStats']

// -------------------------------------------------------------------------------- //

export const questAttributes = ['id', 'title', 'description', 'rewards', 'requirements', 'area']
export const rewardsAttributes = ['id', 'experience', 'money', 'reputation', 'items']
export const requirementsAttributes = ['id', 'max_character_level', 'min_character_level', 'faction']
export const areaAttributes = ['id', 'name']
export const questFilters = [
  'quests.title',
  'rewards.experience',
  'rewards.money',
  'requirements.max_character_level',
  'requirements.min_character_level',
  'requirements.faction',
  'area.name'
]

export const itemAttributes = [
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
export const itemClassAttributes = ['id', 'name']
export const itemSubClassAttributes = ['id', 'name']
export const itemStatsAttributes = [
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
export const weaponStatsAttributes = ['minDamage', 'maxDamage', 'damageClass']
export const itemFilters = [
  'items.binding',
  'items.durability',
  'items.level',
  'items.maxCount',
  'items.name',
  'items.purchasePrice',
  'itemSubClass.name',
  'itemClass.name',
  'itemStats.agility',
  'itemStats.avoidance',
  'itemStats.intellect',
  'itemStats.leech',
  'itemStats.parry',
  'itemStats.stamina',
  'itemStats.strength',
  'weaponStats.minDamage',
  'weaponStats.maxDamage',
  'weaponStats.damageClass'
]
