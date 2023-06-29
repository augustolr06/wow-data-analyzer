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
  opacity: 0.1;
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
  align-items: center;
  justify-content: flex-start;
  min-height: calc(100vh - 20px);

  width: 70%;
  max-width: 1600px;
  margin: 0 auto;
  gap: 15px;
`

export const Title = styled.h2`
  font-size: 25px;
  font-weight: 700;
  background-color: ${(props) => `${props.theme.colors.secondaryD3}60`};
  text-align: center;
  border-radius: 10px;
  width: 100%;
`

export const Subtitle = styled.h3`
  font-size: 18px;
  font-weight: 700;
  text-align: flex-start;
`

export const Selector = styled.div`
  width: 100%;
  z-index: 5;
`

export const MainTableInfoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 15px;
  width: 100%;

  & > *:first-child {
    z-index: 61;
  }
`

export const RelatedTablesWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
`

export const TableInfoWrapper = styled.div`
  min-width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.colors.secondaryD1};
`

export const AttributesWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 15px;
`

export const FiltersContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  gap: 15px;
  width: 100%;
  margin-top: 80px;

  & > *:nth-child(2) {
    z-index: 60;
  }
`

export const FiltersForm = styled.form`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
`

interface FilterWrapperProps {
  operatorZIndex?: number
}

export const FilterWrapper = styled.div<FilterWrapperProps>`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  width: 100%;

  & > *:first-child {
    flex: 1;
    overflow: hidden;
    text-decoration: none;
    text-overflow: ellipsis;
  }

  & > *:nth-child(2) {
    flex: 1;
    z-index: calc(50 - ${(props) => props.operatorZIndex});
  }

  & > *:nth-child(3) {
    flex: 1;
  }
`

export const ButtonSubmit = styled.button`
  width: 100px;
  height: 40px;
  border-radius: 5px;
  border: none;
  padding: 5px 10px;
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.neutralL5};
  ${(props) => props.theme.fonts.labelMD};
  transition: all 0.2s ease-in-out;

  align-self: center;
  margin-top: 20px;

  &:hover {
    background-color: ${(props) => props.theme.colors.primaryL1};
  }
`

export const ResultsContainer = styled.div``
