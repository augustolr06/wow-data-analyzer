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
  Quests
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
  // criar um estado que armazena um array de filtros com seus respectivos valores
  const [filtersValues, setFiltersValues] = useState<Record<string, string>>({})

  // criar uma função que seta o valor de cada filtro no estado filtersValues (onChange)
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
    // api
    //   .get('/quests', {
    //     params: {
    //       name: searchBySelected,
    //       filters: selectedFilters
    //     }
    //   })
    //   .then((response) => {
    //     setSearchResults(response.data)
    //   })

    /*
      testando se os valores dos filtros estão sendo armazenados corretamente */
    console.log(filtersValues)
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
                  placeholder={`Digite o ${filter}`}
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
      <Quests
        style={{
          opacity: isComboboxOpen ? 0.5 : 1,
          zIndex: isComboboxOpen ? -1 : 0
        }}
      >
        <Table.Root dividers>
          <thead>
            <Table.HeaderRow>
              {filters.map((filter) => (
                <Table.HeaderCol key={filter} label={filter} align="center" minWidth="100px" />
              ))}
            </Table.HeaderRow>
          </thead>
          <tbody>
            {searchResults.map((quest) => (
              <Table.BodyRow key={quest.id}>
                <Table.BodyCol content={quest.titulo} />
                <Table.BodyCol content={quest.descricao} />
                <Table.BodyCol content={quest.categoria} />
                <Table.BodyCol content={quest.area} />
                <Table.BodyCol content={quest.tipo} />
              </Table.BodyRow>
            ))}
          </tbody>
        </Table.Root>
      </Quests>
    </HomeContainer>
  )
}
