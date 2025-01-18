// src/app/page.tsx

"use client";

import React, { useState, useEffect } from "react";
import type { NextPage } from "next";
import dynamic from "next/dynamic";

import { EquationGenerator } from "../domain/EquationGenerator";
import { EquationOptions, Equation } from "../types/EquationTypes";
import { SidebarPosition } from "../types/SidebarPositionTypes";
import Sidebar from "../components/Sidebar";
import Preview from "../components/Preview";

// Define a minimal SplitPaneProps interface
interface SplitPaneProps {
  split: 'vertical' | 'horizontal';
  size: number;
  minSize: number;
  maxSize: number;
  onDragFinished: (size: number) => void;
  allowResize: boolean;
  resizerStyle: React.CSSProperties;
  resizerClassName: string;
  children: React.ReactNode;
}

// Dynamically import react-split-pane without SSR and type it correctly
const SplitPane = dynamic(() => import("react-split-pane"), { ssr: false }) as React.ComponentType<SplitPaneProps>;

const HomePage: NextPage = () => {
  const [sidebarPosition, setSidebarPosition] = useState<SidebarPosition>("left");

  // Default options (including new options such as row/column gaps and exclusionNumbers)
  const [equationOptions, setEquationOptions] = useState<EquationOptions>({
    rows: 5,
    columns: 6,
    useAddition: true,
    useSubtraction: true,
    useMultiplication: false,
    useDivision: false,
    equationLayout: "stacked",
    showAnswers: true,
    fontFamily: "Arial",
    fontSize: 16,
    minNumber: -50,
    maxNumber: 50,
    exclusionNumbers: [-2, -1, 0, 1, 2],
    rowGap: 6, // value assumed to be in rem
    columnGap: 4, // value assumed to be in rem
    minAbsoluteAnswer: 5
  });

  const [equations, setEquations] = useState<Equation[]>([]);
  const isHorizontal = sidebarPosition === "left";
  const splitType = isHorizontal ? "vertical" : "horizontal";
  const defaultSize = isHorizontal ? 250 : 150;
  const [paneSize, setPaneSize] = useState<number>(defaultSize);

  useEffect(() => {
    // Regenerate equations when generation-affecting options change.
    try {
      const generator = new EquationGenerator(equationOptions);
      setEquations(generator.generateEquations());
    } catch (error) {
      console.error(error);
      setEquations([]);
    }
  }, [equationOptions]);

  const handleRegenerate = () => {
    try {
      const generator = new EquationGenerator(equationOptions);
      setEquations(generator.generateEquations());
    } catch (error) {
      console.error(error);
      setEquations([]);
    }
  };

  const resizerStyle: React.CSSProperties = isHorizontal
    ? {
        background: "#ddd",
        cursor: "col-resize",
        width: "5px",
        margin: "0 -2px",
        zIndex: 1,
        userSelect: "none",
        WebkitUserSelect: "none",
        msUserSelect: "none",
      }
    : {
        background: "#ddd",
        cursor: "row-resize",
        height: "5px",
        margin: "-2px 0",
        zIndex: 1,
        userSelect: "none",
        WebkitUserSelect: "none",
        msUserSelect: "none",
      };

  const PaneA = (
    <Sidebar
      position={sidebarPosition}
      onPositionChange={setSidebarPosition}
      options={equationOptions}
      onOptionsChange={setEquationOptions}
      onRegenerate={handleRegenerate}
    />
  );

  const PaneB = (
    <Preview
      equations={equations}
      columns={equationOptions.columns}
      displayLayout={equationOptions.equationLayout}
      showAnswers={equationOptions.showAnswers}
      fontFamily={equationOptions.fontFamily}
      fontSize={equationOptions.fontSize}
      rowGap={equationOptions.rowGap}
      columnGap={equationOptions.columnGap}
    />
  );

  return (
    <>
      {/* Interactive Layout (for screen) */}
      <div
        className="no-print"
        style={{
          width: "100vw",
          height: "100vh",
          margin: 0,
          color: "#333",
          userSelect: "none",
          WebkitUserSelect: "none",
          msUserSelect: "none",
        }}
      >
        <SplitPane
          split={splitType}
          size={paneSize}
          minSize={isHorizontal ? 150 : 100}
          maxSize={isHorizontal ? 600 : 400}
          onDragFinished={(newSize: number) => setPaneSize(newSize)}
          allowResize
          resizerStyle={resizerStyle}
          resizerClassName="custom-resizer"
        >
          {PaneA}
          {PaneB}
        </SplitPane>
      </div>

      {/* Print-only Layout: shows only the preview */}
      <div className="print-only" style={{ display: "none" }}>
        <Preview
          equations={equations}
          columns={equationOptions.columns}
          displayLayout={equationOptions.equationLayout}
          showAnswers={equationOptions.showAnswers}
          fontFamily={equationOptions.fontFamily}
          fontSize={equationOptions.fontSize}
          rowGap={equationOptions.rowGap}
          columnGap={equationOptions.columnGap}
        />
      </div>
    </>
  );
};

export default HomePage;
