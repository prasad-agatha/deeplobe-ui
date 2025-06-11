import styled from "styled-components";

export const LayoutWrapper = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  grid-template-rows: 1fr;
  grid-template-areas:
  "dashboard-sidebar dashboard-main";
  height: 100vh;
  overflow: hidden;
`;


export const SidebarWrapper = styled.aside`
  grid-area: dashboard-sidebar;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
`;

export const MainWrapper = styled.main`
  grid-area: dashboard-main;
  box-sizing: border-box;
//   background: #edf0f1;
  overflow-y: auto;
`;

export const ContentWrapper=styled.div`
background: #fafafb;
border-radius: 10px;

`;

export const UploadContainer=styled.div`
/* width: 110px; */
  background: rgba(116, 136, 247, 0.08);
  margin-top: 50px;
  border: 2px dashed rgba(97, 82, 217, 0.6);
  padding: 40px 120px;
  border-radius: 4px;
  cursor: pointer;
`;

export const ResultImageContainer=styled.div`
width: 440px;
height: 247px;

padding : 0px 56px
background: #FFFFFF;
border: 1.5px solid rgba(170, 176, 190, 0.4);
border-radius: 8px;

`;
