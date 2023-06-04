import React, { useState } from 'react'

import { TextField, Button, IconButton, Select, SelectItem } from '@nexds/web'
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
  const [filters, setFilters] = useState<string[]>(['titulo', 'descricao', 'categoria', 'area', 'tipo'])

  const [selectedFilters, setSelectedFilters] = useState<string[]>([])
  const [search, setSearch] = useState('')
  const [searchResults, setSearchResults] = useState<IQuest[]>([])

  // teste com erros capturados pelo axios
  const [thereIsError, setThereIsError] = useState(false)

  const handleAddFilter = (filter: string) => {
    setSelectedFilters([...selectedFilters, filter])
    setFilters(filters.filter((f) => f !== filter))
  }

  const handleRemoveFilter = (filter: string) => {
    setSelectedFilters(selectedFilters.filter((f) => f !== filter))
    setFilters([...filters, filter])
  }

  const handleSearch = () => {
    api
      .get('/quests', {
        params: {
          name: search,
          filters: selectedFilters
        }
      })
      .then((response) => {
        setSearchResults(response.data)
      })
  }

  const handleGetOneQuests = () => {
    api
      .get('/quest/313')
      .then((response) => {
        setSearchResults([response.data])
        setThereIsError(false)
      })
      .catch((error) => {
        console.log(error)
        setThereIsError(true)
      })
  }

  return (
    <HomeContainer>
      <Button
        color={thereIsError ? 'danger' : 'primary'}
        variant="filled"
        size="sm"
        label={thereIsError ? 'Erro' : 'Buscar Quest'}
        onPress={handleGetOneQuests}
      />
      <FiltersSearch>
        <Filters>
          <FiltersWrapper>
            <TextField
              label="Título da Quest"
              placeholder="Buscar pelo título"
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
