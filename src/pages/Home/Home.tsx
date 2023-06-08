import React, { useState } from 'react'

import { TextField, Button, IconButton, Select, SelectItem } from '@nexds/web'
import * as Table from '@nexds/web/dist/components/Table' // Table.Root, Table.HeaderRow, Table.HeaderCol, Table.BodyRow, Table.BodyCol, Table.Pagination

import { api } from '../../services/api'
import {
  IQuest,
  IItem,
  questFilters,
  questFiltersAdvanced,
  itemFilters,
  itemFiltersAdvanced,
  areaOptions,
  rewardsOptions,
  requirementsOptions,
  itemClassOptions,
  itemSubClassOptions,
  itemStatsOptions,
  weaponStatsOptions,
  searchByOptions
} from './constants/dataInfo'
import {
  BackgroundImage,
  HeaderImage,
  HomeContainer,
  Filters,
  FiltersSearch,
  FiltersOptions,
  FiltersWrapper,
  SimpleFilterSelected,
  AdvancedFilterSelected,
  Results
} from './Home.styles'

export function Home() {
  const [simpleSelectedFilters, setSimpleSelectedFilters] = useState<string[]>([])
  const [selectedAdvancedFilters, setSelectedAdvancedFilters] = useState<string[]>([])
  const [selectedSearchBy, setSelectedSearchBy] = useState<string>('')
  const [questResults, setQuestResults] = useState<IQuest[]>([])
  const [itemResults, setItemResults] = useState<IItem[]>([])
  const [isComboboxOpen, setIsComboboxOpen] = useState<boolean>(false)
  // estado que armazena um array de filtros com seus respectivos valores
  const [filtersValues, setFiltersValues] = useState<Record<string, string>>({})

  // função que seta o valor de cada filtro no estado filtersValues (onChange)
  const handleFilterValueChange = (filter: string, value: string) => {
    setFiltersValues({ ...filtersValues, [filter]: value })
  }

  const handleAddFilter = (filter: string) => {
    if (selectedSearchBy === 'quest') {
      if (questFiltersAdvanced.includes(filter)) {
        setSelectedAdvancedFilters([...selectedAdvancedFilters, filter])
      } else {
        setSimpleSelectedFilters([...simpleSelectedFilters, filter])
      }
    } else if (selectedSearchBy === 'item') {
      if (itemFiltersAdvanced.includes(filter)) {
        setSelectedAdvancedFilters([...selectedAdvancedFilters, filter])
      } else {
        setSimpleSelectedFilters([...simpleSelectedFilters, filter])
      }
    }
  }

  const handleRemoveFilter = (filter: string) => {
    if (selectedSearchBy === 'quest') {
      setSimpleSelectedFilters(simpleSelectedFilters.filter((selectedFilter) => selectedFilter !== filter))
      if (questFiltersAdvanced.includes(filter)) {
        setSelectedAdvancedFilters(selectedAdvancedFilters.filter((selectedFilter) => selectedFilter !== filter))
      }
    } else if (selectedSearchBy === 'item') {
      setSimpleSelectedFilters(simpleSelectedFilters.filter((selectedFilter) => selectedFilter !== filter))
      if (itemFiltersAdvanced.includes(filter)) {
        setSelectedAdvancedFilters(selectedAdvancedFilters.filter((selectedFilter) => selectedFilter !== filter))
      }
    }
  }

  const handleSearch = () => {
    // direcionar a busca para a função de busca avançada ou simples
    if (selectedAdvancedFilters.length > 0) {
      handleAdvancedSearch()
    }
    if (selectedAdvancedFilters.length === 0) {
      handleSimpleSearch()
    }
  }

  const handleSimpleSearch = () => {
    if (selectedSearchBy === 'quest') {
      console.log(filtersValues)
      if (!filtersValues) {
        api.get('/quests').then((response) => {
          setQuestResults(response.data)
        })
      } else {
        const params = Object.keys(filtersValues)
          .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(filtersValues[key])}`)
          .join('&')
        api.get(`/quests/simple-filter?${params}`).then((response) => {
          setQuestResults(response.data)
        })
      }
    } else if (selectedSearchBy === 'item') {
      if (!filtersValues) {
        api.get('/items').then((response) => {
          setItemResults(response.data)
        })
      }
      const params = Object.keys(filtersValues)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(filtersValues[key])}`)
        .join('&')
      api.get(`/items/filter?${params}`).then((response) => {
        setItemResults(response.data)
      })
    }
  }

  const handleAdvancedSearch = () => {}

  return (
    <HomeContainer>
      <HeaderImage>
        <img src="/images/wow-header.webp" width={300} />
      </HeaderImage>
      <BackgroundImage />
      <FiltersSearch>
        <Filters>
          <FiltersWrapper>
            <Select
              label="Buscar"
              placeholder="escolha o que você quer mostrar"
              leftIcon="Search"
              value={selectedSearchBy}
              onChange={(option) => setSelectedSearchBy(option)}
              onFocus={() => setIsComboboxOpen(true)}
              onBlur={() => setIsComboboxOpen(false)}
            >
              {searchByOptions.map((option) => (
                <SelectItem key={option} label={option} value={option} style={{ zIndex: 100 }} />
              ))}
            </Select>
            {simpleSelectedFilters.map((filter) => (
              <SimpleFilterSelected key={filter}>
                <TextField
                  label={filter}
                  placeholder={`Insira o valor para ${filter}`}
                  value={filtersValues[filter]}
                  onChange={(e) => handleFilterValueChange(filter, e.target.value)}
                />
                <IconButton icon="Trash" color="ghost" size="sm" onClick={() => handleRemoveFilter(filter)} />
              </SimpleFilterSelected>
            ))}
            {selectedAdvancedFilters.map((filter) => (
              <AdvancedFilterSelected key={filter}>
                <Select
                  label={filter}
                  placeholder={`Selecione uma opção para ${filter}`}
                  leftIcon="Funnel"
                  maxDropdownRows={4}
                  maxBoxRows={4}
                  value={filtersValues[filter]}
                  size="md"
                  onChange={(value) => handleFilterValueChange(filter, value)}
                  onFocus={() => setIsComboboxOpen(true)}
                  onBlur={() => setIsComboboxOpen(false)}
                >
                  {filter === 'area' ? (
                    areaOptions.map((option) => (
                      <SelectItem key={option} label={option} value={option} style={{ zIndex: 100 }} />
                    ))
                  ) : filter === 'rewards' ? (
                    rewardsOptions.map((option) => (
                      <SelectItem key={option} label={option} value={option} style={{ zIndex: 100 }} />
                    ))
                  ) : filter === 'requirements' ? (
                    requirementsOptions.map((option) => (
                      <SelectItem key={option} label={option} value={option} style={{ zIndex: 100 }} />
                    ))
                  ) : filter === 'itemClass' ? (
                    itemClassOptions.map((option) => (
                      <SelectItem key={option} label={option} value={option} style={{ zIndex: 100 }} />
                    ))
                  ) : filter === 'itemSubClass' ? (
                    itemSubClassOptions.map((option) => (
                      <SelectItem key={option} label={option} value={option} style={{ zIndex: 100 }} />
                    ))
                  ) : filter === 'itemStats' ? (
                    itemStatsOptions.map((option) => (
                      <SelectItem key={option} label={option} value={option} style={{ zIndex: 100 }} />
                    ))
                  ) : filter === 'WeaponStats' ? (
                    weaponStatsOptions.map((option) => (
                      <SelectItem key={option} label={option} value={option} style={{ zIndex: 100 }} />
                    ))
                  ) : (
                    <SelectItem key={filter} label="Nenhuma opção disponível" value="" style={{ zIndex: 100 }} />
                  )}
                </Select>
                <TextField
                  label="Valor"
                  placeholder={'Insira o valor'}
                  value={filtersValues[filter]}
                  onChange={(e) => handleFilterValueChange(filter, e.target.value)}
                />
                <IconButton icon="Trash" color="ghost" size="sm" onClick={() => handleRemoveFilter(filter)} />
              </AdvancedFilterSelected>
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
            value={'Escolha...'}
            size="md"
            onChange={(filter) => filter !== '' && handleAddFilter(filter)}
            onFocus={() => setIsComboboxOpen(true)}
            onBlur={() => setIsComboboxOpen(false)}
          >
            {selectedSearchBy === '' ? (
              <SelectItem label="Nenhum filtro disponível" value="Nenhum filtro disponível" style={{ zIndex: 100 }} />
            ) : selectedSearchBy === 'quest' ? (
              questFilters
                .filter((filter) => !simpleSelectedFilters.includes(filter))
                .map((filter) => <SelectItem key={filter} label={filter} value={filter} style={{ zIndex: 100 }} />)
            ) : selectedSearchBy === 'item' ? (
              itemFilters
                .filter((filter) => !simpleSelectedFilters.includes(filter))
                .map((filter) => <SelectItem key={filter} label={filter} value={filter} style={{ zIndex: 100 }} />)
            ) : null}
          </Select>
        </FiltersOptions>
      </FiltersSearch>
      <Button
        label="Buscar"
        color="secondary"
        variant="filled"
        size="sm"
        disabled={selectedSearchBy === '' || isComboboxOpen}
        onPress={handleSearch}
        style={{
          opacity: isComboboxOpen ? 0.5 : 1,
          zIndex: isComboboxOpen ? -1 : 0
        }}
      />
      <Results
        style={{
          opacity: isComboboxOpen ? 0.5 : 1,
          zIndex: isComboboxOpen ? -1 : 0
        }}
      >
        {selectedSearchBy === 'item' && (
          <Table.Root dividers zebra>
            <thead>
              <Table.HeaderRow>
                {questResults.length > 0 &&
                  Object.keys(questResults[0]).map((key) => (
                    <Table.HeaderCol key={key} label={key} align="center" minWidth="90px" />
                  ))}
              </Table.HeaderRow>
            </thead>
            <tbody>
              {questResults.map((quest) => (
                <Table.BodyRow key={quest.id}>
                  {Object.keys(quest).map((key) => {
                    const questKey = key as keyof IQuest
                    return <Table.BodyCol key={key} content={quest[questKey] ?? <i>{'null'}</i>} />
                  })}
                </Table.BodyRow>
              ))}
            </tbody>
          </Table.Root>
        )}
        {selectedSearchBy === 'quest' && (
          <Table.Root dividers zebra>
            <thead>
              <Table.HeaderRow>
                {itemResults.length > 0 &&
                  Object.keys(itemResults[0]).map((key) => (
                    <Table.HeaderCol key={key} label={key} align="center" minWidth="90px" />
                  ))}
              </Table.HeaderRow>
            </thead>
            <tbody>
              {itemResults.map((item) => (
                <Table.BodyRow key={item.id}>
                  {Object.keys(item).map((key) => {
                    const itemKey = key as keyof IItem
                    return <Table.BodyCol key={key} content={item[itemKey] ?? <i>{'null'}</i>} />
                  })}
                </Table.BodyRow>
              ))}
            </tbody>
          </Table.Root>
        )}
      </Results>
    </HomeContainer>
  )
}
