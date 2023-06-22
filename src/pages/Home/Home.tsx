import React, { useState, useEffect } from 'react'

// import { Button, Select, SelectItem, Checkbox } from '@nexds/web'

import { Button, Checkbox, Select, SelectItem, TextField, IconButton } from '@nexds/web'

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
  weaponStatsAttributes
} from '../constants'
import {
  AttributesWrapper,
  BackgroundImage,
  FiltersContainer,
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

export function Home() {
  const [mainTable, setMainTable] = useState<string>('')
  const [tabelasRelacionadas, setTabelasRelacionadas] = useState<string[]>([]) // armazena as tabelas que se relacionam com a tabela principal, para ser exibidas no select
  const [relacionamentosSelecionados, setRelacionamentosSelecionados] = useState<string[]>([]) // armazena os relacionamentos selecionados pelo usuário
  const [filtrosSelecionados, setFiltrosSelecionados] = useState<string[]>([])

  const [showBackdrop, setShowBackdrop] = useState(false)

  useEffect(() => {
    console.log('------------------')
    console.log('mainTable', mainTable)
    console.log('tabelasRelacionadas', tabelasRelacionadas)
    console.log('relacionamentosSelecionados', relacionamentosSelecionados)
    console.log('filtrosSelecionados', filtrosSelecionados)
  }, [mainTable, tabelasRelacionadas, relacionamentosSelecionados, filtrosSelecionados])

  useEffect(() => {
    mainTable === 'quests' && setTabelasRelacionadas(questRelacionamentos)
    mainTable === 'items' && setTabelasRelacionadas(itemRelacionamentos)
  }, [mainTable])

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
                questAttributes.map((attributes) => <Checkbox size="sm" key={attributes} label={attributes} />)}
              {mainTable === 'items' &&
                itemAttributes.map((attributes) => <Checkbox size="sm" key={attributes} label={attributes} />)}
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
          value={filtrosSelecionados}
          onChange={(filters) => setFiltrosSelecionados(filters)}
          onFocus={() => setShowBackdrop(true)}
          onBlur={() => setShowBackdrop(false)}
        >
          {questAttributes.map(
            (
              filtro // TODO: trocar aqui para incluir os atributos de todas as tabelas principais e relacionadas
            ) => (
              <SelectItem key={filtro} value={filtro} label={filtro} size="sm" style={{ zIndex: 5 }} />
            )
          )}
        </Select>
        {filtrosSelecionados.map((filtro) => (
          <FilterWrapper key={filtro}>
            <h2 style={{ width: 250 }}>{filtro}:</h2>
            <Select
              label="Operador"
              size="sm"
              onFocus={() => setShowBackdrop(true)}
              onBlur={() => setShowBackdrop(false)}
            >
              <SelectItem value="equals" label="=" size="sm" style={{ zIndex: 5 }} />
              <SelectItem value="notEquals" label="!=" size="sm" style={{ zIndex: 5 }} />
              <SelectItem value="gt" label=">" size="sm" style={{ zIndex: 5 }} />
              <SelectItem value="gte" label=">=" size="sm" style={{ zIndex: 5 }} />
              <SelectItem value="lt" label="<" size="sm" style={{ zIndex: 5 }} />
              <SelectItem value="lte" label="<=" size="sm" style={{ zIndex: 5 }} />
              <SelectItem value="contains" label="contém" size="sm" style={{ zIndex: 5 }} />
              <SelectItem value="notContains" label="não contém" size="sm" style={{ zIndex: 5 }} />
            </Select>
            <TextField
              label="Valor"
              placeholder="Digite o valor"
              size="sm"
              onFocus={() => setShowBackdrop(true)}
              onBlur={() => setShowBackdrop(false)}
            />
          </FilterWrapper>
        ))}
      </FiltersContainer>
      <Button
        color="primary"
        label="Buscar"
        variant="filled"
        size="sm"
        onPress={() => alert('Buscando...')}
        style={{ alignSelf: 'center', marginTop: 20, opacity: showBackdrop ? 0.5 : 1, zIndex: showBackdrop ? -1 : 0 }}
      />
    </HomeContainer>
  )
}
