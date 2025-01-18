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
  split: "vertical" | "horizontal";
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

  // Default equation options (including fields like row/column gaps, exclusionNumbers, etc.)
  const [equationOptions, setEquationOptions] = useState<EquationOptions>({
    rows: 6,
    columns: 5,
    useAddition: true,
    useSubtraction: true,
    useMultiplication: false,
    useDivision: false,
    equationLayout: "stacked",
    showAnswers: true, // Toggling this won't regenerate automatically (see effect below)
    fontFamily: "Arial",
    fontSize: 17,
    minNumber: -50,
    maxNumber: 50,
    exclusionNumbers: [-2, -1, 0, 1, 2],
    rowGap: 4, // (assumed rem)
    columnGap: 6, // (assumed rem)
    minAbsoluteAnswer: 5,
  });

  const [equations, setEquations] = useState<Equation[]>([]);
  const isHorizontal = sidebarPosition === "left";
  const splitType = isHorizontal ? "vertical" : "horizontal";
  const defaultSize = isHorizontal ? 250 : 150;
  const [paneSize, setPaneSize] = useState<number>(defaultSize);

  /**
   * We store the last set of options used to generate equations.
   * We'll compare everything except the "showAnswers" field
   * to decide if we must re-generate.
   */
  const [lastGenOptions, setLastGenOptions] = useState<EquationOptions>(equationOptions);

  /**
   * 1) On mount, generate an initial set of equations.
   */
  useEffect(() => {
    handleRegenerate(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * 2) Whenever equationOptions changes, compare them (minus showAnswers)
   *    to lastGenOptions (minus showAnswers). If different, regenerate.
   */
  useEffect(() => {
    // Compare "equationOptions minus showAnswers" to "lastGenOptions minus showAnswers"
    const { showAnswers: _newShowAnswers, ...otherNew } = equationOptions;
    const { showAnswers: _oldShowAnswers, ...otherOld } = lastGenOptions;

    const hasChanged = JSON.stringify(otherNew) !== JSON.stringify(otherOld);

    if (hasChanged) {
      // Something besides showAnswers changed, so regenerate
      try {
        const generator = new EquationGenerator(equationOptions);
        setEquations(generator.generateEquations());
      } catch (error) {
        console.error(error);
        setEquations([]);
      }
      // Update the "lastGenOptions"
      setLastGenOptions(equationOptions);
    }
    // else: if the only difference is showAnswers, skip regenerating
  }, [equationOptions, lastGenOptions]);

  /**
   * Manually regenerates the equations (e.g., when user clicks "Regenerate").
   * Also updates lastGenOptions to keep them in sync.
   */
  const handleRegenerate = () => {
    try {
      const generator = new EquationGenerator(equationOptions);
      setEquations(generator.generateEquations());
      setLastGenOptions(equationOptions);
    } catch (error) {
      console.error(error);
      setEquations([]);
    }
  };

  // The styles for the SplitPane resizer
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
          minSize={isHorizontal ? 250 : 250}
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
