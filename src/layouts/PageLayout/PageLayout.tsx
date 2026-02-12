import { ReactNode } from 'react';
import { Header } from '../../components/Header';
import { ThemeToggle } from '../../components/ThemeToggle';
import { BackToTop } from '../../components/BackToTop';
import styles from './PageLayout.module.scss';

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        {children}
      </main>
      <ThemeToggle />
      <BackToTop />
    </div>
  );
}
