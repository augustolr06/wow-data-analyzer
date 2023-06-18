import React, { useState } from 'react'

// import { Button, Select, SelectItem, Checkbox } from '@nexds/web'

import { Button, Checkbox, Select, SelectItem, TextField, IconButton } from '@nexds/web'

import {
  AttributesWrapper,
  BackgroundImage,
  Divider,
  FiltersContainer,
  FilterWrapper,
  HeaderImage,
  HomeContainer,
  MainTableInfoWrapper,
  RelatedTablesWrapper,
  SelectorWrapper,
  TableInfoWrapper,
  TitleWrapper
} from './Home.styles'

/*
    1. Buscar no banco de dados as tabelas que existem.
    2. Ao selecionar uma tabela, buscar no banco de dados quais as tabelas que se relacionam com ela.
    3. Junto a isso, buscar os atributos que existem em cada tabela.
    4. Ao decorrer da interação do usuário, ir salvando as informações em um objeto.
    4.1. O objeto deve ter a seguinte estrutura:
    {
      atributos: ['nomedaTabela.atributo1', 'nomedaTabela.atributo2', 'nomedaTabela.atributo3'],
      tabelas: ['nomedaTabela1', 'nomedaTabela2', 'nomedaTabela3'],
      filtros: ['nomedaTabela.atributo1.operador.espaço.valor', 'nomedaTabela.atributo2.operador.espaço.valor']
    }
    5. Ao clicar em "Buscar", deve ser feita uma requisição para o backend com as informações do objeto.
    5.1. Deve haver uma função que transforme o objeto em uma string de parâmetros.
    5.2. A string de parâmetros deve ser enviada para o backend pelo método GET através de api.get(`/{nomeDaTabelaPrincipal}?{stringDeParametros}`)
    6. O backend vai receber a string de parâmetros, transformar em um objeto e fazer a busca no banco de dados.
    7. O backend vai retornar um array de objetos com as informações que o usuário pediu.
    8. O frontend vai receber o array de objetos e exibir na tela.
   */

export function Home() {
  const tables = ['Tabela1', 'Tabela2', 'Tabela3']
  const attributes = ['Atributo1', 'Atributo2', 'Atributo3']
  const relacionamentos = ['Relacionamento1', 'Relacionamento2', 'Relacionamento3']
  const atributosRelacionamento1 = ['AR1-1', 'AR1-2', 'AR1-3']
  const atributosRelacionamento2 = ['AR2-1', 'AR2-2', 'AR2-3']
  const atributosRelacionamento3 = ['AR3-1', 'AR3-2', 'AR3-3']
  const filtros = ['Filtro1', 'Filtro2', 'Filtro3']

  const [tabelaPrincipal, setTabelaPrincipal] = useState('')
  const [tabelasRelacionadas, setTabelasRelacionadas] = useState<string[]>([])
  const [filtrosSelecionados, setFiltrosSelecionados] = useState<string[]>([])

  const [showBackdrop, setShowBackdrop] = useState(false)

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
          onFocus={() => setShowBackdrop(true)}
          onBlur={() => setShowBackdrop(false)}
          onChange={(table) => {
            setTabelaPrincipal(table)
            setTabelasRelacionadas([])
          }}
        >
          {tables.map((table) => (
            <SelectItem key={table} value={table} label={table} size="sm" style={{ zIndex: 5 }} />
          ))}
        </Select>
        {tabelaPrincipal && (
          <AttributesWrapper style={{ opacity: showBackdrop ? 0.5 : 1, zIndex: showBackdrop ? -1 : 0 }}>
            <h2>{tabelaPrincipal}</h2>
            {attributes.map((attributes) => (
              <Checkbox size="sm" key={attributes} label={attributes} />
            ))}
          </AttributesWrapper>
        )}
      </MainTableInfoWrapper>
      {tabelaPrincipal && <Divider style={{ opacity: showBackdrop ? 0.5 : 1, zIndex: showBackdrop ? -1 : 0 }} />}
      {tabelaPrincipal && (
        <SelectorWrapper>
          <Select
            label={"Selecione as tabelas que se relacionam com a tabela '" + tabelaPrincipal + "'"}
            placeholder="Selecionar"
            size="sm"
            multiple
            value={tabelasRelacionadas}
            onFocus={() => setShowBackdrop(true)}
            onBlur={() => setShowBackdrop(false)}
            onChange={(tables) => setTabelasRelacionadas(tables)}
          >
            {relacionamentos.map((tabela) => (
              <SelectItem key={tabela} value={tabela} label={tabela} size="sm" style={{ zIndex: 5 }} />
            ))}
          </Select>
        </SelectorWrapper>
      )}
      <RelatedTablesWrapper>
        {tabelasRelacionadas.includes('Relacionamento1') && (
          <TableInfoWrapper style={{ opacity: showBackdrop ? 0.5 : 1, zIndex: showBackdrop ? -1 : 0 }}>
            <TitleWrapper>
              <h2>Relacionamento 1</h2>
              <IconButton
                icon="Close"
                color="ghost"
                size="sm"
                onClick={() =>
                  setTabelasRelacionadas(tabelasRelacionadas.filter((tabela) => tabela !== 'Relacionamento1'))
                }
              />
            </TitleWrapper>
            <AttributesWrapper>
              {atributosRelacionamento1.map((atributo) => (
                <Checkbox key={atributo} label={atributo} size="sm" />
              ))}
            </AttributesWrapper>
          </TableInfoWrapper>
        )}
        {tabelasRelacionadas.includes('Relacionamento2') && (
          <TableInfoWrapper style={{ opacity: showBackdrop ? 0.5 : 1, zIndex: showBackdrop ? -1 : 0 }}>
            <TitleWrapper>
              <h2>Relacionamento 2</h2>
              <IconButton
                icon="Close"
                color="ghost"
                size="sm"
                onClick={() =>
                  setTabelasRelacionadas(tabelasRelacionadas.filter((tabela) => tabela !== 'Relacionamento2'))
                }
              />
            </TitleWrapper>
            <AttributesWrapper>
              {atributosRelacionamento2.map((atributo) => (
                <Checkbox key={atributo} label={atributo} size="sm" />
              ))}
            </AttributesWrapper>
          </TableInfoWrapper>
        )}
        {tabelasRelacionadas.includes('Relacionamento3') && (
          <TableInfoWrapper style={{ opacity: showBackdrop ? 0.5 : 1, zIndex: showBackdrop ? -1 : 0 }}>
            <TitleWrapper>
              <h2>Relacionamento 3</h2>
              <IconButton
                icon="Close"
                color="ghost"
                size="sm"
                onClick={() =>
                  setTabelasRelacionadas(tabelasRelacionadas.filter((tabela) => tabela !== 'Relacionamento3'))
                }
              />
            </TitleWrapper>
            <AttributesWrapper>
              {atributosRelacionamento3.map((atributo) => (
                <Checkbox key={atributo} label={atributo} size="sm" />
              ))}
            </AttributesWrapper>
          </TableInfoWrapper>
        )}
      </RelatedTablesWrapper>
      <Divider style={{ opacity: showBackdrop ? 0.5 : 1, zIndex: showBackdrop ? -1 : 0 }} />
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
          {filtros.map((filtro) => (
            <SelectItem key={filtro} value={filtro} label={filtro} size="sm" style={{ zIndex: 5 }} />
          ))}
        </Select>
        {filtrosSelecionados.map((filtro) => (
          <FilterWrapper key={filtro}>
            <h2>{filtro}:</h2>
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
      <Divider style={{ opacity: showBackdrop ? 0.5 : 1, zIndex: showBackdrop ? -1 : 0 }} />
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
