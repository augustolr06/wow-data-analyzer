import styled from 'styled-components'

export const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;

  width: 100%;
  height: 300vh;
  background-image: url('/images/wow-bg-1.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: repeat-y;
  background-attachment: fixed;
  opacity: 0.2;
`

export const HeaderImage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-height: fit-content;
`

export const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  min-height: calc(100vh - 20px);
  padding: 16px;

  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
  gap: 15px;
`

interface BackdropProps {
  show: boolean
}

export const Backdrop = styled.div<BackdropProps>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.colors.secondaryD3};
  z-index: ${(props) => (props.show ? 4 : -1)};
  opacity: ${(props) => (props.show ? 0.5 : 0)};
`

export const MainTableInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 15px;
  width: 100%;

  & > *:first-child {
    width: 70%;
  }
`

export const SelectorWrapper = styled.div`
  width: 40%;
`

export const Divider = styled.hr`
  margin: 15px 0 20px;
  width: 98%;
  align-self: center;
  border: 1px solid ${(props) => props.theme.colors.secondaryL2};
  opacity: 0;
`

export const RelatedTablesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
`

export const TableInfoWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  background-color: ${(props) => `${props.theme.colors.neutralL0}30`};
`

export const AttributesWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
  gap: 15px;
`

export const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 15px;
  width: 50%;
`

export const FilterWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 15px;
  width: 100%;

  & > *:nth-child(2) {
    width: 20%;
  }
`

export const TitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 15px;
`
