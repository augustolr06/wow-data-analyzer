import React, { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'

import { Checkbox, Select, SelectItem, TextField, IconButton, Combobox, RectangleSkeleton, Button } from '@nexds/web'
import * as Table from '@nexds/web/dist/components/Table' // Table.BodyCol, Table.BodyRow, Table.HeaderCol, Table.HeaderRow, Table.Root

import { getSchema, getEnums, TResult, ISchema, IFilters, IEnums } from '@/services/getSchema'

import { api } from '../../services/api'
// import { getOperatorSymbol } from '../utils/filters'
import { Graph } from '../Graph'
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
  ResultsContainer,
  GraphContainer,
  Tip,
  ButtonsContainer
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

  const resultsRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<HTMLDivElement>(null)

  const [mainTable, setMainTable] = useState<string>('')
  const [relatedTables, setRelatedTables] = useState<string[]>([])
  const [selectedRelationships, setSelectedRelationships] = useState<string[]>([])

  const [attributesToFilter, setAttributesToFilter] = useState<IFilters[]>([])
  const [selectedFilters, setSelectedFilters] = useState<string[]>([])

  const [attributesToSearch, setAttributesToSearch] = useState<string[]>([])

  const [results, setResults] = useState<TResult[]>([])

  const [showGraph, setShowGraph] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const [graphHeaders, setGraphHeaders] = useState<string[]>([])
  const [graphData, setGraphData] = useState<string[][]>([])

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    shouldUnregister: true
  })

  useEffect(() => {
    const run = async () => {
      const schemaAPI = await getSchema()
      console.log('schemaAPI', schemaAPI)
      if (schemaAPI.status === 'error') {
        throw new Error(schemaAPI.message)
      }
      setSchema(schemaAPI)
      const enumsAPI = await getEnums()
      if (enumsAPI.status === 'error') {
        throw new Error(enumsAPI.message)
      }
      setEnums(enumsAPI)
    }
    run()
  }, [])

  useEffect(() => {
    setShowGraph(false)
  }, [mainTable])

  useEffect(() => {
    handleClear(false, false)
    if (mainTable in schema.tableProperties) {
      setRelatedTables(schema.tableProperties[mainTable].relationships)
      setAttributesToFilter(schema.tableProperties[mainTable].filters)
    }
  }, [mainTable])

  useEffect(() => {
    if (results.length > 0) {
      resultsRef.current?.scrollIntoView({ behavior: 'smooth' })
      console.log('results', results)
    }
  }, [results])

  const handleClear = (clearResults?: boolean, clearMainTable?: boolean) => {
    if (clearResults) {
      setResults([])
    }
    if (clearMainTable) {
      setMainTable('')
    }
    setSelectedRelationships([])
    setSelectedFilters([])
    setAttributesToSearch([])
  }

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
      if (response.data.status === 'error') {
        throw new Error(response.data.message)
      }
      setResults(response.data)
      setShowResults(true)
    })
  }

  const handleShowGraph = () => {
    const graphHeaders = Object.keys(results[0])
    const graphData = results.map((result) => Object.values(result))
    setGraphHeaders(graphHeaders)
    setGraphData(graphData)
    setShowGraph(!showGraph)
    graphRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <HeaderImage>
        <img src="/images/wow-header.webp" width={200} />
      </HeaderImage>
      <BackgroundImage />
      {schema.tables.length === 0 ? (
        <HomeContainer>
          <RectangleSkeleton height={800} />
        </HomeContainer>
      ) : (
        <HomeContainer>
          <Tip>
            Dica: para uma melhor experiência com os resultados no gráfico, selecione primeiro o atributo cujos valores
            aparecerão no eixo X. Depois, selecione o atributo cujos valores aparecerão no eixo Y, dando preferência
            para atributos que possuem valores numéricos.
          </Tip>
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
                        size="md"
                        key={`${mainTable}.${attribute}`}
                        label={attribute}
                        checked={attributesToSearch.includes(`${mainTable}.${attribute}`)}
                        onChange={(event) => {
                          event.target.checked
                            ? handleAttributeSelection(mainTable, attribute, 'add')
                            : handleAttributeSelection(mainTable, attribute, 'remove')
                        }}
                      />
                    ))}
                </AttributesWrapper>
                <IconButton icon="Trash" color="ghost" radius="square" size="sm" onClick={() => setMainTable('')} />
              </TableInfoWrapper>
            )}
          </MainTableInfoWrapper>
          {mainTable && relatedTables.length > 0 && (
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
                          size="md"
                          checked={attributesToSearch.includes(`${relationships}.${attribute}`)}
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
              onChange={(filtros) => {
                setSelectedFilters(filtros)
              }}
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
              <FilterWrapper key={`${filter}-${index}`} operatorZIndex={index}>
                <Subtitle style={{ width: 250 }}>{filter.split('.')[1]}</Subtitle>
                {schema.tableProperties[filter.split('.')[0]].filters.map((attribute) => {
                  if (attribute.name === filter) {
                    return (
                      <Combobox
                        key={`${attribute.name}-operator-${index}`}
                        size="sm"
                        error={!!errors[`${filter}.operator`]}
                        helpMessage={errors[`${filter}.operator`] ? 'Este campo não pode ficar vazio' : ''}
                        {...register(`${filter}.operator`, { required: true })}
                      >
                        {attribute.operators.map((operator) => (
                          <SelectItem key={operator.value} value={operator.value} label={operator.value} size="sm" />
                        ))}
                      </Combobox>
                    )
                  } else return <></>
                })}
                {schema.tableProperties[filter.split('.')[0]].filters.map((attribute) => {
                  if (attribute.name === filter) {
                    /* Se o atributo.type for varchar, Deve ser um Textfield padrão */
                    if (attribute.type === 'varchar') {
                      return (
                        <TextField
                          key={`${attribute.name}-value-${index}`}
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
                          key={`${attribute.name}-value-${index}`}
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
                          key={`${attribute.name}-value-${index}`}
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
                    } else if (attribute.type === '_int4') {
                      return (
                        <TextField
                          key={`${attribute.name}-value-${index}`}
                          placeholder="Digito os valores separados por vírgula"
                          size="sm"
                          error={!!errors[`${filter}.value`]}
                          helpMessage={errors[`${filter}.value`] ? 'Este campo não pode ficar vazio' : ''}
                          {...register(`${filter}.value`, { required: true })}
                        />
                      )
                    } else if (attribute.type === '_varchar') {
                      return (
                        <TextField
                          key={`${attribute.name}-value-${index}`}
                          placeholder="Digito os valores separados por | (pipe)"
                          size="sm"
                          error={!!errors[`${filter}.value`]}
                          helpMessage={errors[`${filter}.value`] ? 'Este campo não pode ficar vazio' : ''}
                          {...register(`${filter}.value`, { required: true })}
                        />
                      )
                    }
                  }
                })}
              </FilterWrapper>
            ))}
            <ButtonSubmit type="submit" disabled={mainTable === '' || attributesToSearch.length === 0}>
              Buscar
            </ButtonSubmit>
          </FiltersForm>
          <ButtonsContainer>
            <Button
              color="secondary"
              disabled={results.length === 0}
              variant="outline"
              label={showResults ? 'Esconder Resultados' : 'Mostrar Resultados'}
              size="sm"
              onPress={() => setShowResults(!showResults)}
            />
            <Button
              color="secondary"
              disabled={results.length === 0}
              variant="outline"
              label={showGraph ? 'Esconder Gráfico' : 'Mostrar Gráfico'}
              size="sm"
              onPress={() => (showGraph ? setShowGraph(false) : handleShowGraph())}
            />
          </ButtonsContainer>

          <GraphContainer ref={graphRef}>
            {results.length > 0 && showGraph && (
              <>
                <Title>Gráfico de Resultados</Title>
                <Graph vAxisTitle={mainTable} headers={graphHeaders} data={graphData} />
              </>
            )}
          </GraphContainer>
        </HomeContainer>
      )}
      {showResults && results.length > 0 && (
        <ResultsContainer ref={resultsRef}>
          <Title>Resultados</Title>
          <Table.Root dividers zebra style={{ alignSelf: 'center', width: 'max-content' }}>
            <thead>
              <Table.HeaderRow>
                {Object.keys(results[0])?.map((key) => {
                  if (typeof results[0][key] === 'object') {
                    return (
                      results[0][key] &&
                      Object.keys(results[0][key]).map((item, index) => {
                        if (Number.isNaN(Number(item))) {
                          return (
                            <Table.HeaderCol
                              key={index}
                              label={key === 'area_quest_areaToarea' ? `${item} de area` : `${item} de ${key}`}
                            />
                          )
                        } else if (index === 0) return <Table.HeaderCol key={index} label={`id de ${key}`} />
                      })
                    )
                  } else {
                    return <Table.HeaderCol key={key} label={key} />
                  }
                })}
              </Table.HeaderRow>
            </thead>
            <tbody>
              {results.map((result, index) => (
                <Table.BodyRow key={index}>
                  {Object.values(result).map((value, index) => {
                    if (value.length === 0) {
                      return (
                        <Table.BodyCol
                          key={index}
                          content="[ null ]"
                          align="left"
                          minWidth="80px"
                          style={{ whiteSpace: 'nowrap' }}
                        />
                      )
                    } else {
                      if (typeof value === 'object') {
                        if (!Number.isNaN(Number(Object.keys(value)[0]))) {
                          return (
                            <Table.BodyCol
                              key={index}
                              content={Object.values(value).join(', ')}
                              align="left"
                              minWidth="50px"
                              style={{ whiteSpace: 'nowrap' }}
                            />
                          )
                        } else {
                          return Object.values(value).map((item: any, index) => {
                            return (
                              <Table.BodyCol
                                key={index}
                                content={
                                  item.length === 0 ? '[ null ]' : typeof item === 'object' ? item.join(', ') : item
                                }
                                align="left"
                                minWidth="50px"
                                style={{ whiteSpace: 'nowrap' }}
                              />
                            )
                          })
                        }
                      } else {
                        return (
                          <Table.BodyCol
                            key={index}
                            content={value}
                            align="left"
                            minWidth="80px"
                            style={{ whiteSpace: 'nowrap' }}
                          />
                        )
                      }
                    }
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
