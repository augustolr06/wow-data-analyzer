import React from 'react'

// import { Button, Select, SelectItem, Checkbox } from '@nexds/web'

import { BackgroundImage, HeaderImage, HomeContainer } from './Home.styles'

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
    </HomeContainer>
  )
}
