import { useEffect, useState } from "react";
import Search from "./Search";
import { getSearch } from "../Service/api";
import { Card } from "./Card";
const Home = () => {
  const [searchQuery, setSearchQuery] = useState(""); // State untuk query pencarian
  const [searchResults, setSearchResults] = useState([]); // State untuk hasil pencarian

  const handleSearch = (event) => {
    setSearchQuery(event.target.value); // Mengupdate query pencarian saat input berubah
  };

  useEffect(() => {
    // Fungsi yang akan dipanggil saat komponen dimuat atau query pencarian berubah
    if (searchQuery.length > 4) {
      // Memastikan query tidak kosong
      getSearch(searchQuery) // Panggil fungsi getSearch dengan query
        .then((data) => {
          setSearchResults(data.results);
          console.log(data.results); // Mengupdate hasil pencarian dengan data dari API
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } else {
      // Kosongkan hasil pencarian jika query kosong
      setSearchResults([]);
    }
  }, [searchQuery]); // Bergantung pada perubahan searchQuery
  return (
    <>
      <Search handleSearch={handleSearch} searchQuery={searchQuery} />

      {searchResults.length > 0 && <Card label={searchResults} />}

      {!searchResults.length && <div>tidak menampilkan apapun</div>}
    </>
  );
};

export default Home;
