import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Checkbox, Select, SelectItem, TextField, IconButton, Combobox } from '@nexds/web'
import * as Table from '@nexds/web/dist/components/Table' // Table.BodyCol, Table.BodyRow, Table.HeaderCol, Table.HeaderRow, Table.Root

import { schemaHardcoded } from '@/services/getSchema'

import { api } from '../../services/api'
// import { getOperatorSymbol } from '../utils/filters'
import {
  AttributesWrapper,
  BackgroundImage,
  ButtonSubmit,
  FiltersContainer,
  FiltersForm,
  FilterWrapper,
  HeaderImage,
  HomeContainer,
  MainTableInfoWrapper,
  RelatedTablesWrapper,
  TableInfoWrapper,
  Title,
  Subtitle,
  Selector,
  ResultsContainer
} from './Home.styles'

/*
    1. Buscar no banco de dados as tabelas que existem.
    2. Ao selecionar uma tabela, buscar no banco de dados quais as tabelas que se relacionam com ela.
    3. Junto a isso, buscar os atributos que existem em cada tabela.
    4. Ao decorrer da interação do usuário, ir salvando as informações em um objeto.
    4.1. O objeto deve ter a seguinte estrutura:
    {
      atributos: ['nomedaTabela.atributo1', 'nomedaTabela.atributo2', 'nomedaTabela.atributo3'],
      filtros: ['nomedaTabela.atributo1.operador.espaço.valor', 'nomedaTabela.atributo2.operador.espaço.valor']
    }
    5. Ao clicar em "Buscar", deve ser feita uma requisição para o backend com as informações do objeto.
    5.1. Deve haver uma função que transforme o objeto em uma string de parâmetros.
    5.2. A string de parâmetros deve ser enviada para o backend pelo método GET através de api.get(`/{nomeDaTabelaPrincipal}?{stringDeParametros}`)
    6. O backend vai receber a string de parâmetros, transformar em um objeto e fazer a busca no banco de dados.
    7. O backend vai retornar um array de objetos com as informações que o usuário pediu.
    8. O frontend vai receber o array de objetos e exibir na tela.
*/

/*
    1. A mainTable diz qual API deve ser chamada.
*/

type attributeData = {
  operator: string
  value: string
}

type tableData = Record<string, attributeData>

type formData = Record<string, tableData>

export function Home() {
  const tables = schemaHardcoded.tables.slice()

  const [mainTable, setMainTable] = useState<string>('') // armazena a tabela principal selecionada pelo usuário
  const [relatedTables, setRelatedTables] = useState<string[]>([])
  const [selectedRelationships, setSelectedRelationships] = useState<string[]>([])

  const [attributesToFilter, setAttributesToFilter] = useState<string[]>([]) // armazena os atributos que podem ser filtrados
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  // Para a API de quests:
  const [attributesToSearch, setAttributesToSearch] = useState<string[]>([])

  const [results, setResults] = useState<any[]>([])

  const { register, handleSubmit } = useForm()

  const handleAddFiltersFormData = (data: formData) => {
    console.log('data', data)
    const formattedFilters = Object.entries(data)
      .map((table) => {
        const [tableName, tableData]: [string, tableData] = table
        return Object.entries(tableData).map((attribute) => {
          const [attributeName, attributeData]: [string, attributeData] = attribute
          return `${tableName}.${attributeName}.${attributeData.operator}.${attributeData.value}`
        })
      })
      .flat()
    handleSearch(formattedFilters)
  }

  const handleSearch = async (filtersToSearch: string[]) => {
    console.log('filtersToSearch', filtersToSearch)
    const paramAttributes = attributesToSearch.join(',')
    const paramFilters = filtersToSearch.map((filter) => filter.replace(/ /g, '%20')).join(',')
    let url = `/${mainTable}s/filters?attributes=${paramAttributes}`
    if (paramFilters) {
      url += `&filters=${paramFilters}`
    }
    console.log(url)
    await api.get(url).then((response) => {
      // setResults(response.data)
      console.log('response.data', response.data)
    })
  }

  useEffect(() => {
    setRelatedTables([])
    setSelectedRelationships([])
    setSelectedFilters([])
    setAttributesToSearch([])
    setAttributesToFilter([])

    if (mainTable in schemaHardcoded.tableProperties) {
      setRelatedTables(schemaHardcoded.tableProperties[mainTable].relationships)
      setAttributesToFilter(schemaHardcoded.tableProperties[mainTable].filters)
    }
  }, [mainTable])

  const handleAttributeSelection = (table: string, attribute: string, action: 'add' | 'remove') => {
    if (action === 'add') {
      setAttributesToSearch((prevState) => [...prevState, `${table}.${attribute}`])
    } else if (action === 'remove') {
      setAttributesToSearch((prevState) => prevState.filter((attr) => attr !== `${table}.${attribute}`))
    }
  }

  useEffect(() => {
    console.log('attributesToSearch', attributesToSearch)
    console.log('selectedFilters', selectedFilters)
  }, [attributesToSearch, selectedFilters])

  return (
    <HomeContainer>
      <HeaderImage>
        <img src="/images/wow-header.webp" width={200} />
      </HeaderImage>
      <BackgroundImage />
      <Title>Consulta</Title>
      <MainTableInfoWrapper>
        <Select
          label="O que você deseja consultar?"
          placeholder="Selecione uma opção"
          size="sm"
          value={mainTable}
          helpGutter={false}
          onChange={(table) => setMainTable(table)}
        >
          {tables.map((table) => (
            <SelectItem key={table} value={table} label={table} size="sm" />
          ))}
        </Select>
        {mainTable && (
          <TableInfoWrapper>
            <Subtitle>{mainTable}: </Subtitle>
            <AttributesWrapper>
              {schemaHardcoded.tableProperties[mainTable].attributes &&
                schemaHardcoded.tableProperties[mainTable].attributes.map((attribute) => (
                  <Checkbox
                    size="sm"
                    key={attribute}
                    label={attribute}
                    onChange={(event) =>
                      event.target.checked
                        ? handleAttributeSelection(mainTable, attribute, 'add')
                        : handleAttributeSelection(mainTable, attribute, 'remove')
                    }
                  />
                ))}
            </AttributesWrapper>
            <IconButton icon="Trash" color="ghost" radius="square" size="sm" onClick={() => setMainTable('')} />
          </TableInfoWrapper>
        )}
      </MainTableInfoWrapper>
      {mainTable && (
        <Selector>
          <Select
            label="Deseja adicionar mais informações?"
            placeholder="Selecionar"
            size="sm"
            multiple
            value={selectedRelationships}
            helpGutter={false}
            onChange={(relationships) => setSelectedRelationships(relationships)}
          >
            {relatedTables.map((table) => (
              <SelectItem key={table} value={table} label={table} size="sm" style={{ zIndex: 5 }} />
            ))}
          </Select>
        </Selector>
      )}
      <RelatedTablesWrapper>
        {selectedRelationships.length > 0 &&
          selectedRelationships.map((relationships) => (
            <TableInfoWrapper key={relationships}>
              <Subtitle>{relationships}: </Subtitle>
              <AttributesWrapper>
                {schemaHardcoded.tableProperties[relationships].attributes &&
                  schemaHardcoded.tableProperties[relationships].attributes.map((attribute) => (
                    <Checkbox
                      key={attribute}
                      label={attribute}
                      size="sm"
                      onChange={(event) =>
                        event.target.checked
                          ? handleAttributeSelection(relationships, attribute, 'add')
                          : handleAttributeSelection(relationships, attribute, 'remove')
                      }
                    />
                  ))}
              </AttributesWrapper>
              <IconButton
                icon="Trash"
                color="ghost"
                radius="square"
                size="sm"
                onClick={() => {
                  setSelectedRelationships(selectedRelationships.filter((table) => table !== relationships))
                  setAttributesToSearch(attributesToSearch.filter((attr) => !attr.includes(relationships)))
                }}
              />
            </TableInfoWrapper>
          ))}
      </RelatedTablesWrapper>
      <FiltersContainer>
        <Title>Filtros</Title>
        <Select
          label="Selecione o atributo"
          placeholder="Selecionar"
          helpMessage={selectedFilters.length > 0 ? 'dica: para remover um filtro basta clicar nele acima' : ''}
          size="sm"
          multiple
          maxDropdownRows={5}
          value={selectedFilters}
          onChange={(filtros) => setSelectedFilters(filtros)}
        >
          {attributesToFilter.map((attribute) => (
            <SelectItem
              key={attribute}
              value={attribute}
              label={attribute.split('.')[1]}
              size="sm"
              style={{ zIndex: 5 }}
            />
          ))}
        </Select>
      </FiltersContainer>
      <FiltersForm onSubmit={handleSubmit(handleAddFiltersFormData)}>
        {selectedFilters.length > 0 && (
          <FilterWrapper>
            <Title>Atributo</Title>
            <Title style={{ zIndex: 0 }}>Operador</Title>
            <Title>Valor</Title>
          </FilterWrapper>
        )}
        {selectedFilters.map((filter, index) => (
          <FilterWrapper key={filter} operatorZIndex={index}>
            <Subtitle style={{ width: 250 }}>{filter.split('.')[1]}</Subtitle>
            <Combobox
              helpGutter={false}
              size="sm"
              pattern="(equals|notEquals|gt|gte|lt|lte|contains|notContains)"
              {...register(`${filter}.operator`, { required: true })}
            >
              <SelectItem value="equals" label="equals" size="sm" />
              <SelectItem value="notEquals" label="notEquals" size="sm" />
              <SelectItem value="gt" label="gt" size="sm" />
              <SelectItem value="gte" label="gte" size="sm" />
              <SelectItem value="lt" label="lt" size="sm" />
              <SelectItem value="lte" label="lte" size="sm" />
              <SelectItem value="contains" label="contains" size="sm" />
              <SelectItem value="notContains" label="notContains" size="sm" />
            </Combobox>
            <TextField size="sm" {...register(`${filter}.value`, { required: true })} helpGutter={false} />
          </FilterWrapper>
        ))}
        <ButtonSubmit type="submit">Buscar</ButtonSubmit>
      </FiltersForm>
      {results.length > 0 && (
        <ResultsContainer>
          <Title>Resultados</Title>
          <Table.Root>
            <header>
              <Table.HeaderRow>
                {attributesToSearch.map((attribute) => (
                  <Table.HeaderCol key={attribute} label={attribute.split('.')[1]} />
                ))}
              </Table.HeaderRow>
            </header>
            <body>
              {results.map((result) => (
                <Table.BodyRow key={result.id}>
                  {attributesToSearch.map((attribute) => (
                    <Table.BodyCol key={attribute} content={result[attribute.split('.')[1]]} />
                  ))}
                </Table.BodyRow>
              ))}
            </body>
          </Table.Root>
        </ResultsContainer>
      )}
    </HomeContainer>
  )
}
