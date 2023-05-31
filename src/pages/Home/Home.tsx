import React, { useState } from 'react'

import { TextField, Button, IconButton, Select, SelectItem, Pill } from '@nexds/web'
import * as Table from '@nexds/web/dist/components/Table' // Table.Root, Table.HeaderRow, Table.HeaderCol, Table.BodyRow, Table.BodyCol, Table.Pagination

import {
  HomeContainer,
  Filters,
  FiltersSearch,
  FiltersOptions,
  FiltersWrapper,
  FilterSelected,
  Quests,
  TagsWrapper
} from './Home.styles'

// Essa tela deve ter uma área onde o usuário pode escolher vários filtros para encontrar a quest que ele deseja.
// Deve ter um botão para adicionar novos filtros.
// Esse botão abre uma opção de escolha de filtros. Ao clicar em um filtro, ele é adicionado na tela.
// Deve ter um botão para remover filtros.
// Deve ter um botão de buscar, que ao ser clicado, deve fazer uma requisição para a API e retornar as quests que atendem aos filtros.
// Deve ter uma área onde são exibidas as quests encontradas.

export function Home() {
  const quests = [
    {
      id: 1,
      name: 'Quest 1',
      description: 'Description 1',
      level: 1,
      reward: 100,
      questType: 'quest',
      questStatus: 'open',
      questCategory: 'category',
      questSubCategory: 'sub category',
      questTags: ['tag1', 'tag2']
    },
    {
      id: 2,
      name: 'Quest 2',
      description: 'Description 2',
      level: 2,
      reward: 200,
      questType: 'quest',
      questStatus: 'open',
      questCategory: 'category',
      questSubCategory: 'sub category',
      questTags: ['tag1', 'tag2']
    },
    {
      id: 3,
      name: 'Quest 3',
      description: 'Description 3',
      level: 3,
      reward: 300,
      questType: 'quest',
      questStatus: 'open',
      questCategory: 'category',
      questSubCategory: 'sub category',
      questTags: ['tag1', 'tag2']
    },
    {
      id: 4,
      name: 'Quest 4',
      description: 'Description 4',
      level: 4,
      reward: 400,
      questType: 'quest',
      questStatus: 'open',
      questCategory: 'category',
      questSubCategory: 'sub category',
      questTags: ['tag1', 'tag2']
    },
    {
      id: 5,
      name: 'Quest 5',
      description: 'Description 5',
      level: 5,
      reward: 500,
      questType: 'quest',
      questStatus: 'open',
      questCategory: 'category',
      questSubCategory: 'sub category',
      questTags: ['tag1', 'tag2']
    }
  ]

  const [filters, setFilters] = useState<string[]>([
    'Quest Type',
    'Quest Status',
    'Quest Category',
    'Quest Sub Category',
    'Quest Tags'
  ])

  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState<typeof quests>([])

  const handleAddFilter = (filter: string) => {
    setSelectedFilters([...selectedFilters, filter])
    setFilters(filters.filter((f) => f !== filter))
  }

  const handleRemoveFilter = (filter: string) => {
    setSelectedFilters(selectedFilters.filter((f) => f !== filter))
    setFilters([...filters, filter])
  }

  const handleSearch = () => {
    const results = quests.filter((q) => q.name.toLowerCase().includes(search)) // ARRUMAR ESSA LÓGICA PARA IGNIORAR CASE
    setSearchResults(results)
  }

  return (
    <HomeContainer>
      <FiltersSearch>
        <Filters>
          <FiltersWrapper>
            <TextField
              label="Nome da Quest"
              placeholder="Buscar por nome"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {selectedFilters.map((filter) => (
              <FilterSelected key={filter}>
                <TextField label={filter} onChange={() => handleRemoveFilter(filter)} />
                <IconButton icon="Trash" color="ghost" size="sm" onClick={() => handleRemoveFilter(filter)} />
              </FilterSelected>
            ))}
          </FiltersWrapper>
        </Filters>
        <FiltersOptions>
          <Select
            label="Adicionar Filtros"
            placeholder="Selecione um filtro"
            leftIcon="Funnel"
            maxDropdownRows={4}
            maxBoxRows={4}
            value={''}
            size="md"
            onChange={(filter) => filter !== '' && handleAddFilter(filter)}
          >
            {filters.map((filter) => (
              <SelectItem key={filter} label={filter} value={filter} />
            ))}
          </Select>
        </FiltersOptions>
      </FiltersSearch>
      <Button label="Buscar" color="secondary" variant="filled" size="sm" onPress={handleSearch} />
      <Quests>
        <Table.Root dividers>
          <Table.HeaderRow>
            <Table.HeaderCol label="Nome" align="center" minWidth="100px" />
            <Table.HeaderCol label="Descrição" align="center" minWidth="100px" />
            <Table.HeaderCol label="Nível" align="center" minWidth="100px" />
            <Table.HeaderCol label="Recompensa" align="center" minWidth="100px" />
            <Table.HeaderCol label="Tipo" align="center" minWidth="100px" />
            <Table.HeaderCol label="Status" align="center" minWidth="100px" />
            <Table.HeaderCol label="Categoria" align="center" minWidth="100px" />
            <Table.HeaderCol label="Sub Categoria" align="center" minWidth="100px" />
            <Table.HeaderCol label="Tags" align="center" minWidth="100px" />
          </Table.HeaderRow>
          {searchResults.map((quest) => (
            <Table.BodyRow key={quest.id}>
              <Table.BodyCol content={quest.name} />
              <Table.BodyCol content={quest.description} />
              <Table.BodyCol content={quest.level} />
              <Table.BodyCol content={quest.reward} />
              <Table.BodyCol content={quest.questType} />
              <Table.BodyCol content={quest.questStatus} />
              <Table.BodyCol content={quest.questCategory} />
              <Table.BodyCol content={quest.questSubCategory} />
              <Table.BodyCol
                minWidth={`${100 * quest.questTags.length}px`}
                align="left"
                content={
                  <TagsWrapper>
                    {quest.questTags.map((tag) => (
                      <Pill key={tag} label={tag} variant="filled" color="#454545" />
                    ))}
                  </TagsWrapper>
                }
              />
            </Table.BodyRow>
          ))}
        </Table.Root>
      </Quests>
    </HomeContainer>
  )
}
