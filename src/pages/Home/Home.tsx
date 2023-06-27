import React, { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { Checkbox, Select, SelectItem, TextField, IconButton, Combobox } from '@nexds/web'

import {
  tables,
  questAttributes,
  questRelacionamentos,
  itemRelacionamentos,
  itemAttributes,
  areaAttributes,
  rewardsAttributes,
  requirementsAttributes,
  itemClassAttributes,
  itemStatsAttributes,
  itemSubClassAttributes,
  weaponStatsAttributes,
  questFilters,
  itemFilters
} from '../constants'
import { getOperatorSymbol } from '../utils/filters'
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
  SelectorWrapper,
  TableInfoWrapper
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
  const [mainTable, setMainTable] = useState<string>('')
  const [tabelasRelacionadas, setTabelasRelacionadas] = useState<string[]>([]) // armazena as tabelas que se relacionam com a tabela principal, para ser exibidas no select
  const [relacionamentosSelecionados, setRelacionamentosSelecionados] = useState<string[]>([]) // armazena os relacionamentos selecionados pelo usuário
  const [attributesToFilter, setAttributesToFilter] = useState<string[]>([]) // armazena os atributos que podem ser filtrados
  const [filtrosSelecionados, setFiltrosSelecionados] = useState<string[]>([])

  const [showBackdrop, setShowBackdrop] = useState(false)

  // Para a API de quests:
  const [attributesToSearch, setAttributesToSearch] = useState<string[]>([])
  const [filtersToSearch, setFiltersToSearch] = useState<string[]>([])

  const { register, handleSubmit } = useForm()

  const handleAddFiltersFormData = (data: formData) => {
    const formattedFilters = Object.entries(data)
      .map((table) => {
        const [tableName, tableData]: [string, tableData] = table
        return Object.entries(tableData).map((attribute) => {
          const [attributeName, attributeData]: [string, attributeData] = attribute
          return `${tableName}.${attributeName}.${getOperatorSymbol(attributeData.operator)}.${attributeData.value}`
        })
      })
      .flat()

    console.log('formattedFilters: ', formattedFilters)
    setFiltersToSearch(formattedFilters)
  }

  useEffect(() => {
    if (mainTable === 'quests') {
      setTabelasRelacionadas(questRelacionamentos)
      setAttributesToFilter(questFilters)
    } else if (mainTable === 'items') {
      setTabelasRelacionadas(itemRelacionamentos)
      setAttributesToFilter(itemFilters)
    }
  }, [mainTable])

  const handleAddSelectedAttribute = (table: string, attribute: string) => {
    const newAttribute = table + '.' + attribute
    setAttributesToSearch((prevState) => [...prevState, newAttribute])
  }

  return (
    <HomeContainer>
      <HeaderImage>
        <img src="/images/wow-header.webp" width={200} />
      </HeaderImage>
      <BackgroundImage />
      <MainTableInfoWrapper>
        <Select
          label="Selecione a tabela principal"
          placeholder="Selecione uma opção"
          size="sm"
          helpGutter={false}
          onFocus={() => setShowBackdrop(true)}
          onBlur={() => setShowBackdrop(false)}
          onChange={(table) => {
            setMainTable(table)
            setTabelasRelacionadas([])
          }}
        >
          {tables.map((table) => (
            <SelectItem key={table} value={table} label={table} size="sm" style={{ zIndex: 5 }} />
          ))}
        </Select>
        {mainTable && (
          <TableInfoWrapper>
            <AttributesWrapper style={{ opacity: showBackdrop ? 0.5 : 1, zIndex: showBackdrop ? -1 : 0 }}>
              <h2>{mainTable}: </h2>
              {mainTable === 'quests' &&
                questAttributes.map((attribute) => (
                  <Checkbox
                    size="sm"
                    key={attribute}
                    label={attribute}
                    onChange={() => handleAddSelectedAttribute('quests', attribute)}
                  />
                ))}
              {mainTable === 'items' &&
                itemAttributes.map((attribute) => (
                  <Checkbox
                    size="sm"
                    key={attribute}
                    label={attribute}
                    onChange={() => handleAddSelectedAttribute('items', attribute)}
                  />
                ))}
            </AttributesWrapper>
          </TableInfoWrapper>
        )}
      </MainTableInfoWrapper>
      {mainTable && (
        <SelectorWrapper>
          <Select
            label={"Selecione as tabelas que se relacionam com a tabela '" + mainTable + "'"}
            placeholder="Selecionar"
            size="sm"
            multiple
            helpGutter={false}
            onFocus={() => setShowBackdrop(true)}
            onBlur={() => setShowBackdrop(false)}
            onChange={(tables) => setRelacionamentosSelecionados(tables)}
          >
            {tabelasRelacionadas.map((table) => (
              <SelectItem key={table} value={table} label={table} size="sm" style={{ zIndex: 5 }} />
            ))}
          </Select>
        </SelectorWrapper>
      )}
      <RelatedTablesWrapper>
        {relacionamentosSelecionados.map((relacionamento) => (
          <TableInfoWrapper
            key={relacionamento}
            style={{ opacity: showBackdrop ? 0.5 : 1, zIndex: showBackdrop ? -1 : 0 }}
          >
            <AttributesWrapper>
              <h2>{relacionamento}: </h2>
              {mainTable === 'quests' &&
                (relacionamento === 'rewards'
                  ? rewardsAttributes.map((attribute) => <Checkbox key={attribute} label={attribute} size="sm" />)
                  : relacionamento === 'requirements'
                  ? requirementsAttributes.map((attribute) => <Checkbox key={attribute} label={attribute} size="sm" />)
                  : relacionamento === 'area'
                  ? areaAttributes.map((attribute) => <Checkbox key={attribute} label={attribute} size="sm" />)
                  : null)}
              {mainTable === 'items' &&
                (relacionamento === 'itemClass'
                  ? itemClassAttributes.map((attribute) => <Checkbox key={attribute} label={attribute} size="sm" />)
                  : relacionamento === 'itemSubClass'
                  ? itemSubClassAttributes.map((attribute) => <Checkbox key={attribute} label={attribute} size="sm" />)
                  : relacionamento === 'itemStats'
                  ? itemStatsAttributes.map((attribute) => <Checkbox key={attribute} label={attribute} size="sm" />)
                  : relacionamento === 'weaponStats'
                  ? weaponStatsAttributes.map((attribute) => <Checkbox key={attribute} label={attribute} size="sm" />)
                  : null)}
            </AttributesWrapper>
            <IconButton
              icon="Trash"
              color="ghost"
              radius="square"
              size="sm"
              onClick={() =>
                setRelacionamentosSelecionados(
                  relacionamentosSelecionados.filter((tabela) => tabela !== relacionamento)
                )
              }
              style={{ alignSelf: 'flex-end' }}
            />
          </TableInfoWrapper>
        ))}
      </RelatedTablesWrapper>
      <FiltersContainer>
        <h2>Filtros</h2>
        <Select
          label="Selecione o atributo"
          placeholder="Selecionar"
          size="sm"
          multiple
          maxDropdownRows={5}
          value={filtrosSelecionados}
          onChange={(filtros) => setFiltrosSelecionados(filtros)}
          onFocus={() => setShowBackdrop(true)}
          onBlur={() => setShowBackdrop(false)}
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
        {filtrosSelecionados.map((filtro) => (
          <FilterWrapper key={filtro}>
            <h2 style={{ width: 250 }}>{filtro.split('.')[1]}:</h2>
            <Combobox
              helpGutter={false}
              label="Operador"
              size="sm"
              required
              {...register(`${filtro}.operator`)}
              onFocus={() => setShowBackdrop(true)}
              onBlur={() => setShowBackdrop(false)}
            >
              <SelectItem value="equals" label="=" size="sm" />
              <SelectItem value="notEquals" label="!=" size="sm" />
              <SelectItem value="gt" label=">" size="sm" />
              <SelectItem value="gte" label=">=" size="sm" />
              <SelectItem value="lt" label="<" size="sm" />
              <SelectItem value="lte" label="<=" size="sm" />
              <SelectItem value="contains" label="contém" size="sm" />
              <SelectItem value="notContains" label="não contém" size="sm" />
            </Combobox>
            <TextField
              label="Valor"
              placeholder="Digite o valor"
              size="sm"
              required
              {...register(`${filtro}.value`)}
              onFocus={() => setShowBackdrop(true)}
              onBlur={() => setShowBackdrop(false)}
              helpGutter={false}
            />
          </FilterWrapper>
        ))}
        <ButtonSubmit
          type="submit"
          onClick={() => alert('Buscando...')}
          style={{
            opacity: showBackdrop ? 0.5 : 1,
            zIndex: showBackdrop ? -1 : 0
          }}
        >
          Buscar
        </ButtonSubmit>
      </FiltersForm>
    </HomeContainer>
  )
}
