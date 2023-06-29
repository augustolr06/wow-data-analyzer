// import { api } from './api'

export interface ITableProperties {
  attributes: string[]
  relationships: string[]
  filters: string[]
}

export type TTable = Record<string, ITableProperties>

export interface ISchema {
  tables: string[]
  tableProperties: TTable
}

export const schemaHardcoded: ISchema = {
  tables: ['quest', 'item', 'quest_rewards', 'quest_requirements', 'area', 'item_stats', 'weapon_stats'],
  tableProperties: {
    quest: {
      attributes: ['id', 'title', 'description', 'rewards', 'requirements', 'area'],
      relationships: ['quest_rewards', 'quest_requirements', 'area'],
      filters: [
        'quest.title',
        'rewards.experience',
        'rewards.money',
        'requirements.max_character_level',
        'requirements.min_character_level',
        'requirements.faction',
        'area.name'
      ]
    },
    item: {
      attributes: [
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
      ],
      relationships: ['item_stats', 'weapon_stats'],
      filters: [
        'item.binding',
        'item.durability',
        'item.level',
        'item.maxCount',
        'item.name',
        'item.purchasePrice',
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
    },
    quest_rewards: {
      attributes: ['id', 'experience', 'money', 'reputations', 'items'],
      relationships: ['item'],
      filters: ['quest_rewards.experience', 'quest_rewards.money', 'item.name']
    },
    quest_requirements: {
      attributes: ['id', 'min_character_level', 'max_character_level', 'faction'],
      relationships: [''],
      filters: [
        'quest_requirements.min_character_level',
        'quest_requirements.max_character_level',
        'quest_requirements.faction'
      ]
    },
    area: {
      attributes: ['id', 'name'],
      relationships: [''],
      filters: ['id', 'area.name']
    },
    item_stats: {
      attributes: [
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
      ],
      relationships: [''],
      filters: [
        'itemStats.agility',
        'itemStats.avoidance',
        'itemStats.intellect',
        'itemStats.leech',
        'itemStats.parry',
        'itemStats.stamina',
        'itemStats.strength'
      ]
    },
    weapon_stats: {
      attributes: ['id', 'min_damage', 'max_damage', 'damage_class'],
      relationships: [''],
      filters: ['weaponStats.minDamage', 'weaponStats.maxDamage', 'weaponStats.damageClass']
    }
  }
}
