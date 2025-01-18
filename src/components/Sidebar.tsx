// src/components/Sidebar.tsx

"use client";

import React, { FC, ChangeEvent } from "react";
import { SidebarPosition } from "../types/SidebarPositionTypes";
import { EquationOptions, EquationLayout } from "../types/EquationTypes";

// Define explicit constants for CSS literal types
const FLEX_COLUMN: "column" = "column" as const;
const FLEX_NOWRAP: "nowrap" = "nowrap" as const;
const FLEX_WRAP: "wrap" = "wrap" as const;

interface SidebarProps {
  position: SidebarPosition; // Now only "left" or "top" are expected.
  onPositionChange: (pos: SidebarPosition) => void;
  options: EquationOptions;
  onOptionsChange: (newOptions: EquationOptions) => void;
  onRegenerate: () => void; // Callback for regeneration of equations
}

const Sidebar: FC<SidebarProps> = ({
  position,
  onPositionChange,
  options,
  onOptionsChange,
  onRegenerate,
}) => {
  const isTop = position === "top";

  // Base container style for the sidebar.
  const baseContainerStyle: React.CSSProperties = {
    width: "100%",
    backgroundColor: "#f0f0f0",
    padding: "1rem",
    boxSizing: "border-box",
    color: "#333",
    gap: "1rem",
    display: "flex",
    flexDirection: FLEX_COLUMN,
    overflowX: isTop ? "auto" : "visible",
  };

  // Top bar (common for both positions)
  const topBar = (
    <div
      style={{
        display: "flex",
        gap: "0.5rem",
        flexWrap: isTop ? FLEX_NOWRAP : FLEX_WRAP,
        marginBottom: "0.5rem",
      }}
    >
      <button
        onClick={() => window.print()}
        style={{ padding: "0.5rem", border: "1px solid #333" }}
      >
        Print
      </button>
      <button
        onClick={onRegenerate}
        style={{ padding: "0.5rem", border: "1px solid #333" }}
      >
        Regenerate
      </button>
      <button
        onClick={() => onPositionChange("left")}
        style={{ padding: "0.5rem", border: "1px solid #333" }}
      >
        Left
      </button>
      <button
        onClick={() => onPositionChange("top")}
        style={{ padding: "0.5rem", border: "1px solid #333" }}
      >
        Top
      </button>
    </div>
  );

  // Handlers for grid options
  const handleRowsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rows = parseInt(e.target.value, 10) || 0;
    onOptionsChange({ ...options, rows });
  };

  const handleColumnsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const columns = parseInt(e.target.value, 10) || 0;
    onOptionsChange({ ...options, columns });
  };

  const handleLayoutChange = (e: ChangeEvent<HTMLInputElement>) => {
    const layout = e.target.value as EquationLayout;
    onOptionsChange({ ...options, equationLayout: layout });
  };

  const handleShowAnswersChange = (e: ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({ ...options, showAnswers: e.target.checked });
  };

  const handleFontFamilyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onOptionsChange({ ...options, fontFamily: e.target.value });
  };

  const handleFontSizeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const fontSize = parseInt(e.target.value, 10) || 12;
    onOptionsChange({ ...options, fontSize });
  };

  const handleMinNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const minNumber = parseInt(e.target.value, 10) || 0;
    onOptionsChange({ ...options, minNumber });
  };

  const handleMaxNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
    const maxNumber = parseInt(e.target.value, 10) || 0;
    onOptionsChange({ ...options, maxNumber });
  };

  const handleRowGapChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rowGap = parseFloat(e.target.value) || 0;
    onOptionsChange({ ...options, rowGap });
  };

  const handleColumnGapChange = (e: ChangeEvent<HTMLInputElement>) => {
    const columnGap = parseFloat(e.target.value) || 0;
    onOptionsChange({ ...options, columnGap });
  };

  // Handler for exclusion numbers input
  const handleExclusionNumbersChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    // Split by comma, trim spaces, parse to numbers, and filter out NaNs
    const exclusionNumbers = input
      .split(",")
      .map(num => parseInt(num.trim(), 10))
      .filter(num => !isNaN(num));
    onOptionsChange({ ...options, exclusionNumbers });
  };

  return (
    <div style={baseContainerStyle}>
      <div>
        {/* Print and Regenerate Buttons */}
        {topBar}
      </div>
      {/* Options Container */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", flex: 1 }}>
        {/* Equation Grid Options */}
        <div>
          <h4 style={{ margin: "0 0 0.5rem" }}>Equation Grid Options</h4>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Rows:
            <input
              type="number"
              min={1}
              value={options.rows}
              onChange={handleRowsChange}
              style={{ marginLeft: "0.5rem", width: "4rem" }}
            />
          </label>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Columns:
            <input
              type="number"
              min={1}
              value={options.columns}
              onChange={handleColumnsChange}
              style={{ marginLeft: "0.5rem", width: "4rem" }}
            />
          </label>
        </div>

        {/* Display Options */}
        <div>
          <h4 style={{ margin: "0 0 0.5rem" }}>Display Options</h4>
          <div style={{ marginBottom: "0.5rem" }}>
            <label style={{ marginRight: "0.5rem" }}>Layout:</label>
            <label style={{ marginRight: "0.5rem" }}>
              <input
                type="radio"
                name="equationLayout"
                value="stacked"
                checked={options.equationLayout === "stacked"}
                onChange={handleLayoutChange}
              />
              Stacked
            </label>
            <label>
              <input
                type="radio"
                name="equationLayout"
                value="inline"
                checked={options.equationLayout === "inline"}
                onChange={handleLayoutChange}
              />
              Inline
            </label>
          </div>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            <input
              type="checkbox"
              checked={options.showAnswers}
              onChange={handleShowAnswersChange}
            />
            &nbsp;Show Answers
          </label>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Font:
            <select
              value={options.fontFamily}
              onChange={handleFontFamilyChange}
              style={{ marginLeft: "0.5rem" }}
            >
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Courier New">Courier New</option>
              <option value="Verdana">Verdana</option>
              <option value="Georgia">Georgia</option>
            </select>
          </label>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Font Size:
            <input
              type="number"
              value={options.fontSize}
              onChange={handleFontSizeChange}
              style={{ marginLeft: "0.5rem", width: "4rem" }}
            />
          </label>
        </div>

        {/* Number Range Options */}
        <div>
          <h4 style={{ margin: "0 0 0.5rem" }}>Number Range Options</h4>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Min Number:
            <input
              type="number"
              value={options.minNumber}
              onChange={handleMinNumberChange}
              style={{ marginLeft: "0.5rem", width: "4rem" }}
            />
          </label>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Max Number:
            <input
              type="number"
              value={options.maxNumber}
              onChange={handleMaxNumberChange}
              style={{ marginLeft: "0.5rem", width: "4rem" }}
            />
          </label>
        </div>

        {/* Exclusion Numbers */}
        <div>
          <h4 style={{ margin: "0 0 0.5rem" }}>Exclusion Numbers</h4>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Exclude:
            <input
              type="text"
              value={
                options.exclusionNumbers && options.exclusionNumbers.length > 0
                  ? options.exclusionNumbers.join(", ")
                  : "-2, -1, 0, 1, 2"
              }
              onChange={handleExclusionNumbersChange}
              placeholder="e.g., -2, -1, 0, 1, 2"
              style={{ marginLeft: "0.5rem", width: "200px" }}
            />
          </label>
        </div>

        {/* Gap Options */}
        <div>
          <h4 style={{ margin: "0 0 0.5rem" }}>Gap Options</h4>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Row Gap:
            <input
              type="number"
              value={options.rowGap}
              onChange={handleRowGapChange}
              style={{ marginLeft: "0.5rem", width: "4rem" }}
            />
          </label>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Column Gap:
            <input
              type="number"
              value={options.columnGap}
              onChange={handleColumnGapChange}
              style={{ marginLeft: "0.5rem", width: "4rem" }}
            />
          </label>
        </div>

        {/* Operator Options */}
        <div>
          <h4 style={{ margin: "0 0 0.5rem" }}>Operator Options</h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
            <label>
              <input
                type="checkbox"
                checked={options.useAddition}
                onChange={(e) =>
                  onOptionsChange({ ...options, useAddition: e.target.checked })
                }
              />
              &nbsp;Addition
            </label>
            <label>
              <input
                type="checkbox"
                checked={options.useSubtraction}
                onChange={(e) =>
                  onOptionsChange({ ...options, useSubtraction: e.target.checked })
                }
              />
              &nbsp;Subtraction
            </label>
            <label>
              <input
                type="checkbox"
                checked={options.useMultiplication}
                onChange={(e) =>
                  onOptionsChange({ ...options, useMultiplication: e.target.checked })
                }
              />
              &nbsp;Multiplication
            </label>
            <label>
              <input
                type="checkbox"
                checked={options.useDivision}
                onChange={(e) =>
                  onOptionsChange({ ...options, useDivision: e.target.checked })
                }
              />
              &nbsp;Division
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
