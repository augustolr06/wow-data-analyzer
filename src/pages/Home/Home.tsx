import React, { useState } from 'react'

// import { Button, Select, SelectItem, Checkbox } from '@nexds/web'

import { Checkbox, Select, SelectItem } from '@nexds/web'

import {
  AttributesWrapper,
  BackgroundImage,
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
  const tabelas = ['Tabela1', 'Tabela2', 'Tabela3']
  const atributos = ['Atributo1', 'Atributo2', 'Atributo3']
  const relacionamentos = ['Relacionamento1', 'Relacionamento2', 'Relacionamento3']
  const atributosRelacionamento1 = ['AR1-1', 'AR1-2', 'AR1-3']
  const atributosRelacionamento2 = ['AR2-1', 'AR2-2', 'AR2-3']
  const atributosRelacionamento3 = ['AR3-1', 'AR3-2', 'AR3-3']

  const [tabelaPrincipal, setTabelaPrincipal] = useState('')
  const [tabelasRelacionadas, setTabelasRelacionadas] = useState<string[]>([])

  const [showBackdrop, setShowBackdrop] = useState(false)

  return (
    <HomeContainer>
      <HeaderImage>
        <img src="/images/wow-header.webp" width={200} />
      </HeaderImage>
      <BackgroundImage />
      {/* Selecione a tabela principal: dar uma opção das tabelas que existem no banco. */}
      {/* Ao selecionar, dar opção de escolher os atributos que deseja mostrar. */}
      {/* Exibir um componente que dê opção das tabelas que se relacionam com ela. */}
      {/* Ao selecionar uma opção, exibir ao lado dando opção para escolher os atributos que deseja mostrar. */}
      {/* O usuário deve selecionar os filtros. */}
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
          {tabelas.map((tabela) => (
            <SelectItem key={tabela} value={tabela} label={tabela} size="sm" style={{ zIndex: 5 }} />
          ))}
        </Select>
        {tabelaPrincipal && (
          <AttributesWrapper style={{ opacity: showBackdrop ? 0.5 : 1, zIndex: showBackdrop ? -1 : 0 }}>
            <h2>{tabelaPrincipal}</h2>
            {atributos.map((atributo) => (
              <Checkbox size="sm" key={atributo} label={atributo} />
            ))}
          </AttributesWrapper>
        )}
      </MainTableInfoWrapper>
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
            <h2>Relacionamento 1</h2>
            <AttributesWrapper>
              {atributosRelacionamento1.map((atributo) => (
                <Checkbox key={atributo} label={atributo} size="sm" />
              ))}
            </AttributesWrapper>
          </TableInfoWrapper>
        )}
        {tabelasRelacionadas.includes('Relacionamento2') && (
          <TableInfoWrapper style={{ opacity: showBackdrop ? 0.5 : 1, zIndex: showBackdrop ? -1 : 0 }}>
            <h2>Relacionamento 2</h2>
            <AttributesWrapper>
              {atributosRelacionamento2.map((atributo) => (
                <Checkbox key={atributo} label={atributo} size="sm" />
              ))}
            </AttributesWrapper>
          </TableInfoWrapper>
        )}
        {tabelasRelacionadas.includes('Relacionamento3') && (
          <TableInfoWrapper style={{ opacity: showBackdrop ? 0.5 : 1, zIndex: showBackdrop ? -1 : 0 }}>
            <h2>Relacionamento 3</h2>
            <AttributesWrapper>
              {atributosRelacionamento3.map((atributo) => (
                <Checkbox key={atributo} label={atributo} size="sm" />
              ))}
            </AttributesWrapper>
          </TableInfoWrapper>
        )}
      </RelatedTablesWrapper>
    </HomeContainer>
  )
}
