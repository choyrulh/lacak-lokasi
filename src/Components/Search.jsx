export function Search({ handleSearch, searchQuery }) {
  return (
    <div className="m- px-30 flex flex-col rounded-full bg-[#333333]  mt-1">
      <input
        type="text"
        placeholder="Search Movie"
        id="name"
        name="name"
        autoComplete="name"
        onChange={handleSearch}
        className="bg-transparent px-2 w-full outline-none"
        value={searchQuery}
      />
    </div>
  );
}

export default Search;
