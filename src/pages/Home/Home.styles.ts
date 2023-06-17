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
  flex-direction: row;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 15px;
  width: 100%;
  margin-top: 20px;

  & > *:first-child {
    width: 70%;
  }
`

export const SelectorWrapper = styled.div`
  width: 40%;
`

export const TableInfoWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 15px;
  width: 100%;
`

export const AttributesWrapper = styled.div`
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;
  gap: 15px;
`

export const RelatedTablesWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 15px;
  width: 100%;
`
