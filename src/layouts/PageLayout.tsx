import type { ReactNode } from "react";
import styled from "styled-components";
// Page layout wrapper component

interface PageLayoutProps {
  children: ReactNode;
  className?: string;
}

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Main = styled.main`
  width: 100%;
  flex: 1;
`;

export const PageLayout = ({ children, className }: PageLayoutProps) => {
  return (
    <LayoutContainer className={className}>
      <Main>{children}</Main>
    </LayoutContainer>
  );
};
