"use client";

import React, { FC } from "react";
import { Equation, EquationOperator } from "../types/EquationTypes";

interface PreviewProps {
  equations: Equation[];
  columns: number;
  /** Per-equation layout: "stacked" renders the equation vertically; "inline" renders in one line. */
  displayLayout: "stacked" | "inline";
  showAnswers: boolean;
  /** New font options */
  fontFamily: string;
  fontSize: number;
  /** New gap options in pixels */
  rowGap: number;
  columnGap: number;
}

const Preview: FC<PreviewProps> = ({
  equations,
  columns,
  displayLayout,
  showAnswers,
  fontFamily,
  fontSize,
  rowGap,
  columnGap,
}) => {
  const operatorToSymbol = (op: EquationOperator) => {
    switch (op) {
      case EquationOperator.ADD:
        return "+";
      case EquationOperator.SUBTRACT:
        return "-";
      case EquationOperator.MULTIPLY:
        return "×";
      case EquationOperator.DIVIDE:
        return "÷";
      default:
        return "?";
    }
  };

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: `repeat(${columns}, 1fr)`,
    rowGap: `${rowGap}rem`,
    columnGap: `${columnGap}rem`,
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        padding: "1rem",
        boxSizing: "border-box",
        backgroundColor: "#ffffff", // white background
        color: "#333", // dark text
        overflow: "auto",
        fontFamily: fontFamily,
        fontSize: `${fontSize}px`,
      }}
    >
      <h2 className="text-sm no-print ">(&quot;Print&quot; to see *printer output*. This is just a preview of the equations.&quot;Show Answers&quot; for an answers copy)</h2>
      {equations.length === 0 ? (
        <p style={{ textAlign: "center" }}>
          No equations to display. Adjust the options!
        </p>
      ) : (
        <div style={gridStyle}>
          {equations.map((eq, idx) => {
            if (displayLayout === "stacked") {
              return (
                <div
                  key={idx}
                  style={{
                    padding: "0.5rem",
                    textAlign: "right",
                  }}
                >
                  <div className="flex justify-between">
                    <div className="flex-1">{eq.leftOperand}</div>
                  </div>
                  <div
                    style={{ fontSize: `${fontSize}px` }}
                    className="flex justify-between"
                  >
                    <div
                      className="flex-1"
                      style={{
                        borderBottom: "1px solid",
                        marginBottom: "0.5rem",
                      }}
                    >
                      {operatorToSymbol(eq.operator)} {eq.rightOperand}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex-1" style={{ minHeight: `${fontSize + 10}px` }}>
                      {showAnswers ? eq.answer : ""}
                    </div>
                  </div>
                </div>
              );
            } else {
              // Inline layout: one line
              return (
                <div
                  key={idx}
                  style={{
                    padding: "0.5rem",
                    textAlign: "center",
                    minWidth: "150px",
                  }}
                >
                  {eq.leftOperand} {operatorToSymbol(eq.operator)} {eq.rightOperand} ={" "}
                  {showAnswers ? eq.answer : "_____"}
                </div>
              );
            }
          })}
        </div>
      )}
    </div>
  );
};

export default Preview;
