import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Checkbox, Select, SelectItem, TextField, IconButton, Combobox, RectangleSkeleton } from '@nexds/web'
import * as Table from '@nexds/web/dist/components/Table' // Table.BodyCol, Table.BodyRow, Table.HeaderCol, Table.HeaderRow, Table.Root

import { getSchema, getEnums, ISchema, IFilters, IEnums } from '@/services/getSchema'

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

const operators = [
  'equals',
  'not',
  'in',
  'notIn',
  'lt',
  'lte',
  'gt',
  'gte',
  'contains',
  'search',
  'startsWith',
  'endsWith'
]

export function Home() {
  const [schema, setSchema] = useState<ISchema>({
    tables: [],
    tableProperties: {}
  })

  const [enums, setEnums] = useState<IEnums>({
    bindingtype: [],
    inventorytype: [],
    itemclass: [],
    itemsubclass: [],
    damagetype: []
  })

  const tables = schema.tables.slice()

  const [mainTable, setMainTable] = useState<string>('')
  const [relatedTables, setRelatedTables] = useState<string[]>([])
  const [selectedRelationships, setSelectedRelationships] = useState<string[]>([])

  const [attributesToFilter, setAttributesToFilter] = useState<IFilters[]>([])
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  const [attributesToSearch, setAttributesToSearch] = useState<string[]>([])

  const [results, setResults] = useState<any[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm()

  useEffect(() => {
    const run = async () => {
      const schemaAPI = await getSchema()
      setSchema(schemaAPI)
      const enumsAPI = await getEnums()
      setEnums(enumsAPI)
    }
    run()
  }, [])

  useEffect(() => {
    setRelatedTables([])
    setSelectedRelationships([])
    setSelectedFilters([])
    setAttributesToSearch([])
    setAttributesToFilter([])
    setResults([])

    if (mainTable in schema.tableProperties) {
      setRelatedTables(schema.tableProperties[mainTable].relationships)
      setAttributesToFilter(schema.tableProperties[mainTable].filters)
    }
  }, [mainTable])

  const handleAttributeSelection = (table: string, attribute: string, action: 'add' | 'remove') => {
    if (action === 'add') {
      setAttributesToSearch((prevState) => [...prevState, `${table}.${attribute}`])
    } else if (action === 'remove') {
      setAttributesToSearch((prevState) => prevState.filter((attr) => attr !== `${table}.${attribute}`))
    }
  }

  const handleAddFiltersFormData = (data: formData) => {
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
    const paramAttributes = attributesToSearch.join(',')
    const paramFilters = filtersToSearch.map((filter) => filter.replace(/ /g, '%20')).join(',')
    let url = `/${mainTable}/filters?attributes=${paramAttributes}`
    if (paramFilters) {
      url += `&filters=${paramFilters}`
    }
    await api.get(url).then((response) => {
      setResults(response.data)
    })
  }

  return (
    <>
      <HeaderImage>
        <img src="/images/wow-header.webp" width={200} />
      </HeaderImage>
      <BackgroundImage />
      {schema.tables.length === 0 ? (
        <HomeContainer>
          <RectangleSkeleton height={400} />
        </HomeContainer>
      ) : (
        <HomeContainer>
          <Title>Consulta</Title>
          <MainTableInfoWrapper>
            <Select
              label="O que você deseja consultar?"
              placeholder="Selecione uma opção"
              size="sm"
              value={mainTable}
              helpGutter={false}
              onChange={(table) => {
                setMainTable(table)
              }}
            >
              {tables.map((table) => (
                <SelectItem key={table} value={table} label={table} size="sm" />
              ))}
            </Select>
            {mainTable && (
              <TableInfoWrapper>
                <Subtitle>{mainTable}: </Subtitle>
                <AttributesWrapper>
                  {schema.tableProperties[mainTable].attributes &&
                    schema.tableProperties[mainTable].attributes.map((attribute) => (
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
                    {schema.tableProperties[relationships].attributes &&
                      schema.tableProperties[relationships].attributes.map((attribute) => (
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
                  key={attribute.name}
                  value={attribute.name}
                  label={`${attribute.name.split('.')[1]} de ${attribute.name.split('.')[0]}`}
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
                <Combobox helpGutter={false} size="sm" {...register(`${filter}.operator`, { required: true })}>
                  {operators.map((operator) => (
                    <SelectItem key={operator} value={operator} label={operator} size="sm" />
                  ))}
                </Combobox>
                {schema.tableProperties[filter.split('.')[0]].filters.map((attribute) => {
                  if (attribute.name === filter) {
                    /* Se o atributo.type for varchar, Deve ser um Textfield padrão */
                    if (attribute.type === 'varchar') {
                      return (
                        <TextField
                          key={attribute.name}
                          placeholder="Digite o valor"
                          size="sm"
                          error={!!errors[`${filter}.value`]}
                          helpMessage={errors[`${filter}.value`] ? 'Este campo não pode ficar vazio' : ''}
                          {...register(`${filter}.value`, { required: true })}
                        />
                      )
                    } else if (attribute.type === 'int4') {
                      /* Se o atributo.type for int4, o TextField deve ser um number */
                      return (
                        <TextField
                          key={attribute.name}
                          placeholder="Digite o valor"
                          size="sm"
                          error={!!errors[`${filter}.value`]}
                          helpMessage={errors[`${filter}.value`] ? 'Este campo aceita apenas números' : ''}
                          {...register(`${filter}.value`, { required: true, valueAsNumber: true })}
                        />
                      )
                    } else if (Object.keys(enums).includes(attribute.type)) {
                      /* Se o atributo.type pertencer a uma das chaves de enum, deve deve ser um Combobox, onde os SelectItems serão os valores do array enum.[nome daquele atributo.type] */
                      return (
                        <Combobox
                          key={attribute.name}
                          placeholder="Escolha uma opção"
                          size="sm"
                          error={!!errors[`${filter}.value`]}
                          helpMessage={errors[`${filter}.value`] ? 'Este campo não pode ficar vazio' : ''}
                          {...register(`${filter}.value`, { required: true })}
                        >
                          {enums[attribute.type].map((value) => (
                            <SelectItem key={value} value={value} label={value} size="sm" />
                          ))}
                        </Combobox>
                      )
                    }
                  }
                })}
              </FilterWrapper>
            ))}
            <ButtonSubmit
              type="submit"
              onClick={() => {
                const newAttributesToSearch = schema.tableProperties[mainTable].attributes.map((attribute) => {
                  if (attribute.includes('area')) {
                    return attribute.replace('area', 'area_quest_areaToarea')
                  }
                  return attribute
                })
                if (attributesToSearch.length === 0) {
                  console.log('newAttributesToSearch', newAttributesToSearch)
                  setAttributesToSearch(newAttributesToSearch)
                }
              }}
            >
              Buscar
            </ButtonSubmit>
          </FiltersForm>
        </HomeContainer>
      )}
      {results.length > 0 && (
        <ResultsContainer>
          <Title>Resultados</Title>
          <Table.Root dividers zebra>
            <thead>
              <Table.HeaderRow>
                {attributesToSearch.map((attribute) => (
                  <Table.HeaderCol key={attribute} label={attribute.split('.')[1]} />
                ))}
              </Table.HeaderRow>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <Table.BodyRow key={index}>
                  {attributesToSearch.map((attribute) => {
                    return typeof result[attribute.split('.')[0]] === 'object' ? (
                      <Table.BodyCol
                        key={attribute}
                        align="left"
                        minWidth="90px"
                        content={result[attribute.split('.')[0]][attribute.split('.')[1]] ?? 'null'}
                      />
                    ) : (
                      <Table.BodyCol
                        key={attribute}
                        align="left"
                        minWidth="90px"
                        content={result[attribute.split('.')[1]] ?? 'null'}
                      />
                    )
                  })}
                </Table.BodyRow>
              ))}
            </tbody>
          </Table.Root>
        </ResultsContainer>
      )}
    </>
  )
}
