import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;

    font-family: 'Ubuntu', sans-serif;
    line-height: 1.5;
    font-weight: 400;

    font-synthesis: none;
    text-rendering: optimizeLegibility;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    -webkit-text-size-adjust: 100%;
  }
  body {
    min-height: 100vh;
    background: ${({ theme }) => theme.colors.secondaryD1};
    color: ${({ theme }) => theme.colors.neutralL5};
    -webkit-font-smoothing: antialiased;
    font-size: 1rem;

  &::-webkit-scrollbar {
    width: 8px !important;
  }
  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.colors.secondaryL2};
  }
  }

  body, input, textarea, button {
  }

  ul, li {
    list-style: none;
  }

  button {
    cursor: pointer;
  }
`