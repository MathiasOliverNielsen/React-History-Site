import { Header } from "../components/Header";

export const ByDatePage = () => {
  const handleDateSearch = (date: string) => {
    console.log("Searching for date:", date);
    // TODO: Implement date search logic
  };

  return (
    <>
      <Header pageType="bydate" backgroundImage="/images/background.jpg" onDateSearch={handleDateSearch} showCornerTriangles={false} />
    </>
  );
};
