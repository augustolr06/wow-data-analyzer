export const tables = ['quests', 'items']

// -------------------------------------------------------------------------------- //

export const questRelacionamentos = ['rewards', 'requirements', 'area']
export const itemRelacionamentos = ['itemClass', 'itemSubClass', 'itemStats', 'weaponStats']

// -------------------------------------------------------------------------------- //

export const questAttributes = ['id', 'title', 'description', 'rewards', 'requirements', 'area']
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

export const rewardsAttributes = ['id', 'experience', 'money', 'reputation', 'items']
export const requirementsAttributes = ['id', 'max_character_level', 'min_character_level', 'faction']
export const areaAttributes = ['id', 'name']

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
