import { Header } from "../components/Header";

export const SincePage = () => {
  const handleYearSearch = (startYear: string, endYear?: string) => {
    console.log("Searching from year:", startYear, "to:", endYear);
    // TODO: Implement year search logic
  };

  return (
    <>
      <Header pageType="since" backgroundImage="/images/background.jpg" onYearSearch={handleYearSearch} showCornerTriangles={true} />
    </>
  );
};
