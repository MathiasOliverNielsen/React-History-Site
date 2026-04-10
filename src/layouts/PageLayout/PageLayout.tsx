import type { ReactNode } from "react";
import { Header } from "../../components/Header/Header";
import { ThemeToggle } from "../../components/ThemeToggle/ThemeToggle";
import { BackToTop } from "../../components/BackToTop/BackToTop";
import styles from "./PageLayout.module.scss";

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>{children}</main>
      <ThemeToggle />
      <BackToTop />
    </div>
  );
}
