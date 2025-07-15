import { makeid, makestr } from "@/src/utils/common";
import { useState } from "react";

type ColumnType = {
  id: number;
  size: number;
};

type RowType = {
  id: number;
  columns: ColumnType[];
};

export default function DynamicGrid() {
  const [rows, setRows] = useState<RowType[]>([]);
  const [selectedCols, setSelectedCols] = useState(3);

  const addRow = () => {
    setRows([
      ...rows,
      {
        id: makeid(5),
        columns: Array(selectedCols)
          .fill(0)
          .map(() => ({ id: makeid(6), size: 12 / selectedCols })),
      },
    ]);
  };

  const addColumn = (rowId: number, size: number) => {
    setRows(
      rows.map((row) =>
        row.id === rowId
          ? { ...row, columns: [...row.columns, { id: makeid(6), size }] }
          : row
      )
    );
  };

  const swapColumns = (rowId: number, indexA: number, indexB: number) => {
    setRows(
      rows.map((row) => {
        if (row.id !== rowId) return row;
        const newColumns = [...row.columns];
        [newColumns[indexA], newColumns[indexB]] = [
          newColumns[indexB],
          newColumns[indexA],
        ];
        return { ...row, columns: newColumns };
      })
    );
  };

  const removeRow = (rowId: number) => {
    if (confirm("Are you sure you want to delete this row!")) {
      setRows(rows.filter((row) => row.id !== rowId));
    }
  };

  const removeColumn = (rowId: number, colId: number) => {
    if (confirm("Are you sure you want to delete this column!")) {
      setRows(
        rows.map((row) =>
          row.id === rowId
            ? { ...row, columns: row.columns.filter((col) => col.id !== colId) }
            : row
        )
      );
    }
  };

  const elementList = [
    { id: 1, name: "Heading 1", tagName: "h1", data: "" },
    { id: 2, name: "Heading 2", tagName: "h2", data: "" },
    { id: 3, name: "Heading 3", tagName: "h3", data: "" },
    { id: 4, name: "Paragraph", tagName: "p", data: "" },
    { id: 5, name: "Image", tagName: "img", data: "" },
    { id: 6, name: "Button", tagName: "button", data: "" },
    { id: 7, name: "Editor", tagName: "editor", data: "" },
  ];

  return (
    <div className="p-5">
      {/* Controls */}
      <div className="flex items-center space-x-2 mb-5">
        <label className="font-medium">Columns:</label>
        <select
          className="border px-3 py-1 rounded"
          value={selectedCols}
          onChange={(e) => setSelectedCols(parseInt(e.target.value))}
        >
          {[...Array(12)].map((_, i) => (
            <option key={i} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
        <button
          onClick={addRow}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Row
        </button>
      </div>

      {/* Grid Display */}
      <div className="space-y-5">
        {rows.map((row) => (
          <div key={row.id} className="border p-3 rounded bg-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold">Row {row.id}</span>
              <button
                onClick={() => removeRow(row.id)}
                className="text-red-500 text-sm"
              >
                Delete Row
              </button>
            </div>

            {/* Column Controls */}
            <div className="mb-2 flex space-x-2">
              <select
                className="border px-2 py-1 rounded"
                onChange={(e) => addColumn(row.id, parseInt(e.target.value))}
              >
                <option value="">Add Column</option>
                {[...Array(12)].map((_, i) => (
                  <option key={i} value={i + 1}>
                    Size {i + 1}
                  </option>
                ))}
              </select>
            </div>

            {/* Columns */}
            <div className="grid grid-cols-12 gap-2">
              {row.columns.map((col, index) => (
                <div
                  key={col.id}
                  className={`bg-white border p-2 rounded col-span-${col.size} grid-col-${col.size}`}
                >
                  <div className="flex justify-between items-center">
                    <span>Col {col.id}</span>
                    <button
                      onClick={() => removeColumn(row.id, col.id)}
                      className="text-red-500 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="">
                    <select
                      className="border px-1 py-1 rounded text-xs"
                      onChange={(e) =>
                        addColumn(row.id, parseInt(e.target.value))
                      }
                    >
                      <option value="">Add Element</option>
                      {elementList.map((_, i) => (
                        <option key={i} value={i + 1}>
                          {_.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  {/* Swap Buttons */}
                  {index > 0 && (
                    <button
                      onClick={() => swapColumns(row.id, index, index - 1)}
                      className="text-blue-500 text-xs mt-1"
                    >
                      ⬆ Swap Up
                    </button>
                  )}
                  {index < row.columns.length - 1 && (
                    <button
                      onClick={() => swapColumns(row.id, index, index + 1)}
                      className="text-blue-500 text-xs ml-2"
                    >
                      ⬇ Swap Down
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
