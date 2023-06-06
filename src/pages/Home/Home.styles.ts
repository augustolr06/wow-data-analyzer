import styled from 'styled-components'

export const BackgroundImage = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;

  width: 100%;
  height: 100%;
  background-image: url('/images/wow-bg-1.jpg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
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
  align-items: center;
  justify-content: flex-start;
  min-height: calc(100vh - 20px);
  padding: 16px;

  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
`

export const FiltersSearch = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  gap: 16px;

  width: 100%;
`

export const Filters = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  flex: 1;
  max-width: 1600px;
  margin: 0 auto;
`

export const FiltersWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  width: 100%;

  & > :first-child {
    max-width: 1300px;
  }
`

export const FilterSelected = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;

  width: 100%;
  max-width: 1600px;
  margin: 0 auto;
`

export const FiltersOptions = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  width: 200px;
`

export const Results = styled.div`
  width: 100%;
  min-width: fit-content;
  max-width: 1600px;

  & i {
    color: ${({ theme }) => theme.colors.secondaryL2};
  }
`

export const TagsWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  width: max-content;
`
