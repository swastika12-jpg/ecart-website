function Filters({
  search,
  setSearch,
  category,
  setCategory,
  maxPrice,
  setMaxPrice,
  categories,
}) {
  return (
    <div className="filters-sidebar">
      <div className="filter-group">
        <h4>Search Products</h4>
        <input
          type="text"
          placeholder="Search name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <h4>Category</h4>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="All">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-group">
        <h4>Max Price (₹)</h4>
        <input
          type="number"
          placeholder="Enter max price"
          value={maxPrice || ""}
          onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : 0)}
        />
      </div>
    </div>
  );
}

export default Filters;
