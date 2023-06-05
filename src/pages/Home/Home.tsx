import React, { useState } from 'react'

import { TextField, Button, IconButton, Select, SelectItem, Combobox } from '@nexds/web'
import * as Table from '@nexds/web/dist/components/Table' // Table.Root, Table.HeaderRow, Table.HeaderCol, Table.BodyRow, Table.BodyCol, Table.Pagination

import { api } from '../../services/api'
import {
  HomeContainer,
  Filters,
  FiltersSearch,
  FiltersOptions,
  FiltersWrapper,
  FilterSelected,
  Results
} from './Home.styles'

export interface IQuest {
  id: number
  titulo: string
  descricao: string
  categoria: string
  area: number
  tipo: string
}

export function Home() {
  const [filters, setFilters] = useState<string[]>(['', 'titulo', 'descricao', 'categoria', 'area', 'tipo'])

  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [searchBySelected, setSearchBySelected] = useState<string>('')
  const searchByOptions = ['quest', 'area', 'recompensa']
  const [searchResults, setSearchResults] = useState<IQuest[]>([])
  const [isComboboxOpen, setIsComboboxOpen] = useState<boolean>(false)
  // estado que armazena um array de filtros com seus respectivos valores
  const [filtersValues, setFiltersValues] = useState<Record<string, string>>({})

  // função que seta o valor de cada filtro no estado filtersValues (onChange)
  const handleFilterValueChange = (filter: string, value: string) => {
    setFiltersValues({ ...filtersValues, [filter]: value })
  }

  const handleAddFilter = (filter: string) => {
    setSelectedFilters([...selectedFilters, filter])
    setFilters(filters.filter((f) => f !== filter))
  }

  const handleRemoveFilter = (filter: string) => {
    setSelectedFilters(selectedFilters.filter((f) => f !== filter))
    setFilters([...filters, filter])
  }

  const handleSearch = () => {
    const params = Object.keys(filtersValues)
      .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(filtersValues[key])}`)
      .join('&')
    console.log(params)
    api.get(`/quests/filter?${params}`).then((response) => {
      setSearchResults(response.data)
    })
  }

  return (
    <HomeContainer>
      <FiltersSearch>
        <Filters>
          <FiltersWrapper>
            <Combobox
              label="Buscar"
              placeholder="Digite o que deseja buscar"
              leftIcon="Search"
              value={searchBySelected}
              onChange={(e) => setSearchBySelected(e.target.value)}
              onFocus={() => setIsComboboxOpen(true)}
              onBlur={() => setIsComboboxOpen(false)}
            >
              {searchByOptions.map((option) => (
                <SelectItem key={option} label={option} value={option} style={{ zIndex: 100 }} />
              ))}
            </Combobox>
            {selectedFilters.map((filter) => (
              <FilterSelected key={filter}>
                <TextField
                  label={filter}
                  placeholder={`Insira o valor para ${filter}`}
                  value={filtersValues[filter]}
                  onChange={(e) => handleFilterValueChange(filter, e.target.value)}
                />
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
            onFocus={() => setIsComboboxOpen(true)}
            onBlur={() => setIsComboboxOpen(false)}
          >
            {filters.map((filter) => (
              <SelectItem key={filter} label={filter} value={filter} />
            ))}
          </Select>
        </FiltersOptions>
      </FiltersSearch>
      <Button
        label="Buscar"
        color="secondary"
        variant="filled"
        size="sm"
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
        <Table.Root dividers zebra>
          <thead>
            <Table.HeaderRow>
              {searchResults.length > 0 &&
                Object.keys(searchResults[0]).map((key) => (
                  <Table.HeaderCol key={key} label={key} align="center" minWidth="90px" />
                ))}
            </Table.HeaderRow>
          </thead>
          <tbody>
            {searchResults.map((quest) => (
              <Table.BodyRow key={quest.id}>
                <Table.BodyCol content={quest.id.toString() ?? <i>{'null'}</i>} />
                <Table.BodyCol content={quest.titulo ?? <i>{'null'}</i>} />
                <Table.BodyCol content={quest.descricao ?? <i>{'null'}</i>} />
                <Table.BodyCol content={quest.categoria ?? <i>{'null'}</i>} />
                <Table.BodyCol content={quest.area.toString() ?? <i>{'null'}</i>} />
                <Table.BodyCol content={quest.tipo ?? <i>{'null'}</i>} />
              </Table.BodyRow>
            ))}
          </tbody>
        </Table.Root>
      </Results>
    </HomeContainer>
  )
}
