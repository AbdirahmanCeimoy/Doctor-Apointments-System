
import React, { useState, useEffect } from "react";



const DataTable = ({ title, columns, data = [], onAddClick, showAddButton = true }) => {
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [entriesPerPage, setEntriesPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (Array.isArray(data)) {
      const filtered = data.filter((item) =>
        Object.values(item).some((val) =>
          String(val).toLowerCase().includes(search.toLowerCase())
        )
      );
      setFilteredData(filtered);
      setCurrentPage(1);
    } else {
      setFilteredData([]); // Fallback if data is undefined or not an array
    }
  }, [search, data]);

  const startIdx = (currentPage - 1) * entriesPerPage;
  const endIdx = startIdx + entriesPerPage;
  const totalPages = Math.ceil(filteredData.length / entriesPerPage);

  return (
    <div className="p-4 bg-white dark:bg-[#1a2035] text-gray-900 dark:text-white rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4">
        <div className="header">
          <h2>{title}</h2>
        </div>
        {showAddButton && onAddClick && (
          <button
            onClick={onAddClick}
            className="bg-[#03045E] text-white px-4 py-2 rounded-lg dark:bg-gray-800 flex items-center"
          >
            <img src="/chart-icons/Vector.png" alt="Add Icon" className="w-5 h-5 mr-2" />
            Add
          </button>
        )}
      </div>

      <div className="flex justify-between items-center mb-4 gap-4 flex-wrap">
        <div>
          <label className="text-sm text-gray-600 dark:text-gray-300">Show&nbsp;</label>
          <select
            value={entriesPerPage}
            onChange={(e) => setEntriesPerPage(Number(e.target.value))}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded px-2 py-1"
          >
            {[5, 10, 25].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>
          <span className="text-sm text-gray-300 ml-1"> entries</span>
        </div>

        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 px-3 py-1 rounded-lg w-full sm:w-64"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full text-left text-sm">
          <thead className="bg-[#03045E] dark:bg-[#1a2035] text-white dark:text-gray-100">
            <tr>
              {columns.map((col, i) => (
                <th key={col.key || i} className="px-4 py-2 uppercase text-xs font-medium">
                  {col.label ?? ''}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredData.slice(startIdx, endIdx).map((row, idx) => (
              <tr key={row._id || idx} className="bg-gray-50 dark:bg-[#1a2035] text-gray-900 dark:text-white">
                {columns.map((col, i) => {
                  const rawValue = col.render
                    ? col.render(row)
                    : (col.key
                        ? col.key.split('.').reduce((obj, key) => obj?.[key], row)
                        : undefined);

                  let cellContent = rawValue;
                  if (rawValue === undefined || rawValue === null || rawValue === "") {
                    cellContent = "-";
                  } else if (Array.isArray(rawValue)) {
                    cellContent = rawValue.join(", ");
                  } else if (typeof rawValue === "object" && !React.isValidElement(rawValue)) {
                    // Prefer _id if present; otherwise stringify a shallow view
                    cellContent = rawValue._id || JSON.stringify(rawValue);
                  }

                  return (
                    <td key={col.key || i} className="px-4 py-2">
                      {cellContent}
                    </td>
                  );
                })}
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan={columns.length} className="px-4 py-4 text-center text-gray-500 dark:text-gray-300">
                  No data found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4 text-sm text-gray-600 dark:text-gray-300">
        <span>
          {filteredData.length === 0
            ? '0 entries'
            : `${startIdx + 1}–${Math.min(endIdx, filteredData.length)} of ${filteredData.length}`}
        </span>
        <div className="flex items-center gap-2">
          <button
            className="px-2 py-1 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-black dark:text-white disabled:bg-gray-200"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            ‹
          </button>
          <span>{currentPage}</span>
          <button
            className="px-2 py-1 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 text-black dark:text-white disabled:bg-gray-200"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            ›
          </button>
        </div>
      </div>
    </div>
  );
};

export default DataTable;
