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
  position: SidebarPosition; // "left" or "top"
  onPositionChange: (pos: SidebarPosition) => void;
  /**
   * Updated signature: the second argument ("skipRegenerate") is optional.
   * If it's `true`, the parent can skip regenerating equations.
   */
  onOptionsChange: (newOptions: EquationOptions, skipRegenerate?: boolean) => void;
  onRegenerate: () => void; // Callback to regenerate equations
  options: EquationOptions;
}

const Sidebar: FC<SidebarProps> = ({
  position,
  onPositionChange,
  onOptionsChange,
  onRegenerate,
  options,
}) => {
  const isTop = position === "top";

  // Base container styles
  const baseContainerStyle: React.CSSProperties = {
    width: "100%",
    backgroundColor: "#f0f0f0",
    padding: "1rem",
    boxSizing: "border-box",
    color: "#333",
    display: "flex",
    flexDirection: FLEX_COLUMN,
  };

  // Top bar: we'll allow horizontal scrolling in "top" mode
  const topBar = (
    <div
      style={{
        display: "flex",
        gap: "0.5rem",
        flexWrap: isTop ? FLEX_NOWRAP : FLEX_WRAP,
        marginBottom: "0.5rem",
        overflowX: isTop ? "auto" : "visible",
        // Keeps items in a single horizontal row for top mode, enabling scroll
        whiteSpace: isTop ? "nowrap" : "normal",
      }}
    >
      <div>
        <button
          onClick={() => window.print()}
          style={{
            padding: "0.5rem",
            margin: "0.5rem",
            border: "1px solid #333",
            cursor: "pointer",
          }}
        >
          Print
        </button>
        <button
          onClick={onRegenerate}
          style={{
            padding: "0.5rem",
            margin: "0.5rem",
            border: "1px solid #333",
            cursor: "pointer",
          }}
        >
          Regenerate
        </button>
      </div>
      <div>
        <button
          onClick={() => onPositionChange("left")}
          style={{
            padding: "0.5rem",
            margin: "0.5rem",
            border: "1px solid #333",
            cursor: "pointer",
          }}
        >
          Left
        </button>
        <button
          onClick={() => onPositionChange("top")}
          style={{
            padding: "0.5rem",
            margin: "0.5rem",
            border: "1px solid #333",
            cursor: "pointer",
          }}
        >
          Top
        </button>
      </div>
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

  /**
   * KEY CHANGE: We now pass a second argument "true" to indicate
   * we want to skip regeneration. The parent can check that flag
   * and avoid re-running the equation generator.
   */
  const handleShowAnswersChange = (e: ChangeEvent<HTMLInputElement>) => {
    onOptionsChange({ ...options, showAnswers: e.target.checked }, true);
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
      .map((num) => parseInt(num.trim(), 10))
      .filter((num) => !isNaN(num));

    onOptionsChange({ ...options, exclusionNumbers });
  };

  return (
    <div style={baseContainerStyle}>
      {/* Top Bar (Print/Regenerate + Position Switch) */}
      <div>{topBar}</div>

      {/* Options Container */}
      <div
        style={{
          display: "flex",
          flexDirection: position === "top" ? "row" : "column",
          gap: "1rem",
          flex: 1,
        }}
      >
        {/* Equation Grid Options */}
        <div>
          <label
            style={{
              display: "block",
              marginBottom: "0.5rem",
              marginTop: "0.5rem",
            }}
          >
            <input
              type="checkbox"
              checked={options.showAnswers}
              onChange={handleShowAnswersChange}
            />
            &nbsp;Show Answers
          </label>
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
            Min:
            <input
              type="number"
              value={options.minNumber}
              onChange={handleMinNumberChange}
              style={{ marginLeft: "0.5rem", width: "4rem" }}
            />
          </label>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Max:
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
          <h4 style={{ margin: "0 0 0.5rem" }}>Exclusion Numbers:</h4>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            <input
              type="text"
              value={
                options.exclusionNumbers && options.exclusionNumbers.length > 0
                  ? options.exclusionNumbers.join(", ")
                  : "-2, -1, 0, 1, 2"
              }
              onChange={handleExclusionNumbersChange}
              placeholder="e.g., -2, -1, 0, 1, 2"
              style={{ width: "200px" }}
            />
          </label>
        </div>

        {/* Gap Options */}
        <div>
          <h4 style={{ margin: "0 0 0.5rem" }}>Gap Options</h4>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Row:
            <input
              type="number"
              value={options.rowGap}
              onChange={handleRowGapChange}
              style={{ marginLeft: "0.5rem", width: "4rem" }}
            />
          </label>
          <label style={{ display: "block", marginBottom: "0.5rem" }}>
            Column:
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
