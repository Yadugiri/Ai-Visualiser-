/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  GoogleGenAI,
  Modality,
  GenerateContentResponse,
  Type,
} from '@google/genai';
import JSZip from 'https://cdn.skypack.dev/jszip';

/**
 * A helper function to safely get a DOM element by its ID.
 * Throws a detailed error if the element is not found, helping to debug issues.
 * @param id The ID of the element to find.
 * @returns The found DOM element.
 */
function getElement<T extends HTMLElement>(id: string): T {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Fatal Error: UI element with id '${id}' not found.`);
  }
  return element as T;
}

// --- DOM Element References ---
let mainContainer: HTMLElement;
let mainContentWrapper: HTMLDivElement;
let sidebarBackdrop: HTMLDivElement;
let closePromptPanelBtn: HTMLButtonElement;
// Tab elements
let sketchTabBtn: HTMLButtonElement;
let generatedTabBtn: HTMLButtonElement;
let sketchContent: HTMLDivElement;
let generatedContent: HTMLDivElement;
// Canvas & Image elements
let beforeCanvas: HTMLCanvasElement;
let gridCanvas: HTMLCanvasElement;
let perspectiveCanvas: HTMLCanvasElement;
let afterImage: HTMLImageElement;
let backgroundImageDisplay: HTMLImageElement;
let beforeImagePlaceholder: HTMLDivElement;
let importFileInput: HTMLInputElement;
// Buttons & Inputs
let generateBtn: HTMLButtonElement;
let promptInput: HTMLTextAreaElement;
let loader: HTMLDivElement;
let errorMessage: HTMLParagraphElement;
let outputContainer: HTMLDivElement;
let downloadSketchBtn: HTMLButtonElement;
let downloadImageBtn: HTMLButtonElement;
let togglePromptBtn: HTMLButtonElement;
let beforeImageContainer: HTMLDivElement;
let colorPicker: HTMLInputElement;
let colorPickerLabel: HTMLLabelElement;
let eraserBtn: HTMLButtonElement;
let clearSketchBtn: HTMLButtonElement;
let clearAllBtn: HTMLButtonElement;
let importBtn: HTMLButtonElement;
let eraserCursorPreview: HTMLDivElement;
// --- New Toolbar elements ---
let selectToolBtn: HTMLButtonElement;
let panToolBtn: HTMLButtonElement;
let activeShapeToolBtn: HTMLButtonElement;
let activeShapeToolIcon: HTMLElement;
let shapeToolOptions: HTMLDivElement;
// Drawing Tools Dropdown
let drawingToolGroup: HTMLDivElement;
let activeDrawingToolBtn: HTMLButtonElement;
let activeDrawingToolIcon: HTMLElement;
let drawingToolOptions: HTMLDivElement;
let sketchToolBtn: HTMLButtonElement;
let lineToolBtn: HTMLButtonElement;
let frenchCurveToolBtn: HTMLButtonElement;
// Other Tools
let rectToolBtn: HTMLButtonElement;
let circleToolBtn: HTMLButtonElement;
let textToolBtn: HTMLButtonElement;
let undoBtn: HTMLButtonElement;
let redoBtn: HTMLButtonElement;
let deleteShapeBtn: HTMLButtonElement;
let brushSizeSlider: HTMLInputElement;
let brushSizeLabel: HTMLLabelElement;
// Shape Context Tools
let shapeContextTools: HTMLDivElement;
let flipHorizontalBtn: HTMLButtonElement;
let flipVerticalBtn: HTMLButtonElement;
// Tool Options Panel
let brushOptions: HTMLDivElement;
let fillOptions: HTMLDivElement;
let fillToggleBtn: HTMLButtonElement;
let solidColorFillBtn: HTMLLabelElement;
let fillColorPicker: HTMLInputElement;
let fillColorPreview: HTMLSpanElement;
let patternUploadBtn: HTMLButtonElement;
let patternUploadInput: HTMLInputElement;
let linearGradientBtn: HTMLButtonElement;
let radialGradientBtn: HTMLButtonElement;
let gradientColorOptions: HTMLDivElement;
let gradientColor1Picker: HTMLInputElement;
let gradientColor1Label: HTMLLabelElement;
let gradientColor1Preview: HTMLSpanElement;
let gradientColor2Picker: HTMLInputElement;
let gradientColor2Label: HTMLLabelElement;
let gradientColor2Preview: HTMLSpanElement;
let lineStyleOptions: HTMLDivElement;
let textOptions: HTMLDivElement;
let textColorLabel: HTMLLabelElement;
let fontFamilySelect: HTMLSelectElement;
let fontSizeInput: HTMLInputElement;
let fontWeightBtn: HTMLButtonElement;
let fontStyleBtn: HTMLButtonElement;
let alignLeftBtn: HTMLButtonElement;
let alignCenterBtn: HTMLButtonElement;
let alignRightBtn: HTMLButtonElement;
// Freehand style controls
let solidLineBtn: HTMLButtonElement;
let hiddenLineBtn: HTMLButtonElement;
// Zoom/Pan/Snap Buttons
let resetViewBtn: HTMLButtonElement;
let snapToolGroup: HTMLDivElement;
let snapToggleBtn: HTMLButtonElement;
let snapOptions: HTMLDivElement;
let snapToGridBtn: HTMLButtonElement;
let snapToObjectsBtn: HTMLButtonElement;
// Perspective Tools
let perspectiveToolGroup: HTMLDivElement;
let activePerspectiveTool: HTMLButtonElement;
let perspectiveToolOptions: HTMLDivElement;
let onePointToolBtn: HTMLButtonElement;
let twoPointToolBtn: HTMLButtonElement;
let toggleGuidesBtn: HTMLButtonElement;
let clearPerspectiveBtn: HTMLButtonElement;
let perspectiveSetupMessage: HTMLDivElement;
let vanishingLineSlider: HTMLInputElement;
let vanishingLineCountLabel: HTMLSpanElement;
let vanishingAngleSlider: HTMLInputElement;
let vanishingAngleLabel: HTMLSpanElement;
// Grammar Correction elements
let grammarSuggestionContainer: HTMLDivElement;
let suggestionText: HTMLSpanElement;
let acceptSuggestionBtn: HTMLButtonElement;
let rejectSuggestionBtn: HTMLButtonElement;
// Prompt Display elements
let promptDisplayContainer: HTMLDivElement;
let promptDisplayText: HTMLParagraphElement;
let reusePromptBtn: HTMLButtonElement;
// Saved Prompts elements
let savePromptBtn: HTMLButtonElement;
let downloadPromptsBtn: HTMLButtonElement;
let savedPromptsPanel: HTMLDivElement;
let savedPromptsList: HTMLUListElement;
let savedPromptsToggle: HTMLButtonElement;
let noSavedPromptsMessage: HTMLParagraphElement;
// Prompt Ideation Panel elements
let togglePromptPanelBtn: HTMLButtonElement;
let promptIdeaInput: HTMLTextAreaElement;
let generateVariationsBtn: HTMLButtonElement;
let promptVariationsList: HTMLUListElement;
let promptVariationsPlaceholder: HTMLParagraphElement;
let promptPanelLoader: HTMLDivElement;
// Session Management
let saveSessionBtn: HTMLButtonElement;
// Image History elements
let historyPanel: HTMLElement;
let historyList: HTMLUListElement;
let noHistoryMessage: HTMLParagraphElement;
let historyToggleBtn: HTMLButtonElement;
// Save History Modal
let saveHistoryModal: HTMLDivElement;
let saveAllBtn: HTMLButtonElement;
let dismissModalBtn: HTMLButtonElement;
// Camera Modal elements
let cameraBtn: HTMLButtonElement;
let cameraModal: HTMLDivElement;
let cameraFeed: HTMLVideoElement;
let cameraCaptureCanvas: HTMLCanvasElement;
let captureBtn: HTMLButtonElement;
let closeCameraBtn: HTMLButtonElement;
// Layers Panel elements
let layersPanel: HTMLElement;
let layersList: HTMLUListElement;
let addLayerBtn: HTMLButtonElement;
let deleteLayerBtn: HTMLButtonElement;
let layersToggleBtn: HTMLButtonElement;
// On-canvas text editor
let textEditor: HTMLTextAreaElement | null = null;

// --- State Variables ---
let isSliderDragging = false; // For comparison slider
let ctx: CanvasRenderingContext2D | null = null;
let perspectiveCtx: CanvasRenderingContext2D | null = null;
let isDrawing = false;
let isDrawingShape = false;
let currentTool:
  | 'select'
  | 'pan'
  | 'sketch'
  | 'line'
  | 'eraser'
  | 'rectangle'
  | 'french-curve'
  | 'circle'
  | 'text' = 'sketch';
let lineStyle: 'solid' | 'hidden' = 'solid';
let isFillEnabled = false;
let fillType: 'solid' | 'linear' | 'radial' | 'pattern' = 'solid';
let gradientColor1 = '#ffffff';
let gradientColor2 = '#000000';
let selectedPatternImage: HTMLImageElement | null = null;
const patternImages: Record<string, HTMLImageElement> = {};
let userPatterns: Record<string, string> = {}; // For session saving { key: dataURL }
let lineStartPoint: { x: number; y: number } | null = null;
let shapeStartPoint: { x: number; y: number } | null = null;
let lastPoint: { x: number; y: number } | null = null;
let lastMidPoint: Point | null = null;

// --- Layer State ---
type Layer = {
  id: number;
  name: string;
  isVisible: boolean;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
};

let layers: Layer[] = [];
let activeLayerId: number | null = null;
let nextLayerId = 0;

type HistoryState = {
  layers: {
    id: number;
    name: string;
    isVisible: boolean;
    imageData: ImageData;
  }[];
  shapes: Shape[];
  activeLayerId: number | null;
};
let historyStack: HistoryState[] = [];
let historyIndex = -1;
// Grid & Snap state
type Point = { x: number; y: number };
const GRID_SIZE = 20;
let snapToGrid = true;
let snapToObjects = true;

// Zoom & Pan state
let scale = 1;
let offsetX = 0;
let offsetY = 0;
let isPanning = false;
let panStart = { x: 0, y: 0 };
let isSpacebarDown = false;
let isShiftDown = false;
const MIN_SCALE = 0.2;
const MAX_SCALE = 10;
const tempCanvas = document.createElement('canvas'); // For offscreen operations
const tempCtx = tempCanvas.getContext('2d');

let isCheckingGrammar = false;
let lastSuccessfulPrompt: string | null = null;
let savedPrompts: string[] = [];
const SAVED_PROMPTS_KEY = 'ai-design-vis-saved-prompts';

// Image History State
type HistoryEntry = {
  dataUrl: string; // with prompt
  originalUrl: string; // without prompt
  prompt: string;
};
let imageHistory: HistoryEntry[] = [];
const MAX_HISTORY_IMAGES = 5;

// Camera state
let cameraStream: MediaStream | null = null;

// Generated Image State
let originalImageUrl: string | null = null;
let imageUrlWithPrompt: string | null = null;
let lastCompositeImageUrl: string | null = null;
let isPromptVisible = true;

// --- Perspective State ---
let perspectiveMode: 'none' | '1-point' | '2-point' = 'none';
let horizonLineY: number | null = null;
let vanishingPoints: Point[] = [];
let perspectiveSetupState: {
  isActive: boolean;
  type: '1-point' | '2-point';
  step: 'set-horizon' | 'set-vp1' | 'set-vp2';
} = { isActive: false, type: '1-point', step: 'set-horizon' };
let showPerspectiveGuides = true;
let vanishingLineCount = 8;
let vanishingLineSpread = 1.5;
let draggedVPIndex: number | null = null;

// --- Shape object manipulation state ---
type Shape = {
  id: number;
  layerId: number;
  type: 'rectangle' | 'french-curve' | 'circle' | 'text';
  // Bounding box for rect/circle; start, c1, c2, end for curve; top-left for text
  points: Point[];
  strokeColor: string;
  strokeWidth: number;
  isFilled: boolean;
  fillType: 'solid' | 'linear' | 'radial' | 'pattern';
  fillColor: string;
  gradientColor1: string;
  gradientColor2: string;
  patternName: string | null;
  // Text-specific properties
  text?: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: 'normal' | 'bold';
  fontStyle?: 'normal' | 'italic';
  textAlign?: 'left' | 'center' | 'right';
};

let shapes: Shape[] = [];
let selectedShapeId: number | null = null;
let nextShapeId = 0;
let hoveredHandle: string | null = null;
let draggedHandle: string | null = null;
let isDraggingShape = false;
let isCtrlDown = false; // Reserved for future use (e.g., skewing)
let dragStartPoint: Point | null = null;
let originalShapeState: Shape | null = null; // For resizing logic
let clipboard: Shape | null = null;

/** Updates the size and appearance of the custom eraser cursor. */
function updateEraserCursor() {
    if (!eraserCursorPreview) return;
    const size = parseFloat(brushSizeSlider.value) * scale;
    eraserCursorPreview.style.width = `${size}px`;
    eraserCursorPreview.style.height = `${size}px`;
}

/** Updates visibility of contextual tools for shapes (delete, transform). */
function updateShapeContextToolsVisibility() {
    if (selectedShapeId !== null) {
        shapeContextTools.classList.remove('hidden');
    } else {
        shapeContextTools.classList.add('hidden');
    }
}


// --- Perspective Tools ---

/** Updates the on-screen message to guide the user through perspective setup. */
function updatePerspectiveMessage() {
  if (!perspectiveSetupMessage) return;
  if (!perspectiveSetupState.isActive) {
    perspectiveSetupMessage.classList.add('hidden');
    return;
  }
  perspectiveSetupMessage.classList.remove('hidden');
  switch (perspectiveSetupState.step) {
    case 'set-horizon':
      perspectiveSetupMessage.textContent = 'Click to set the horizon line.';
      break;
    case 'set-vp1':
      perspectiveSetupMessage.textContent = `Click on the horizon to set ${
        perspectiveSetupState.type === '1-point' ? 'the' : 'the first'
      } vanishing point.`;
      break;
    case 'set-vp2':
      perspectiveSetupMessage.textContent =
        'Click on the horizon to set the second vanishing point.';
      break;
  }
}

/** Draws the perspective guides (horizon, vanishing points) on its dedicated canvas. */
function drawPerspectiveGuides() {
  if (!perspectiveCtx || !perspectiveCanvas) return;

  // 1. Clear perspective canvas
  perspectiveCtx.save();
  perspectiveCtx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform before clearing
  perspectiveCtx.clearRect(
    0,
    0,
    perspectiveCanvas.width,
    perspectiveCanvas.height,
  );
  perspectiveCtx.restore();

  if (
    !showPerspectiveGuides ||
    (perspectiveMode === 'none' && !perspectiveSetupState.isActive)
  ) {
    return;
  }

  // 2. Apply view transform and draw guides
  perspectiveCtx.save();
  perspectiveCtx.translate(offsetX, offsetY);
  perspectiveCtx.scale(scale, scale);

  const viewMinX = -offsetX / scale;
  const viewMinY = -offsetY / scale;
  const viewMaxX = (perspectiveCanvas.width - offsetX) / scale;
  const viewMaxY = (perspectiveCanvas.height - offsetY) / scale;

  perspectiveCtx.lineWidth = 1 / scale;
  perspectiveCtx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
  perspectiveCtx.setLineDash([5 / scale, 5 / scale]);

  // Draw horizon line
  if (horizonLineY !== null) {
    perspectiveCtx.beginPath();
    perspectiveCtx.moveTo(viewMinX, horizonLineY);
    perspectiveCtx.lineTo(viewMaxX, horizonLineY);
    perspectiveCtx.stroke();
  }

  // Draw receding guide lines from vanishing points
  if (vanishingPoints.length > 0) {
    vanishingPoints.forEach((vp) => {
      // Draw lines to top and bottom edges
      const lineCount = vanishingLineCount > 1 ? vanishingLineCount : 2; // ensure at least 2 lines

      const viewWidth = viewMaxX - viewMinX;
      const spreadWidth = viewWidth * vanishingLineSpread;
      const viewCenterX = viewMinX + viewWidth / 2;
      const startX = viewCenterX - spreadWidth / 2;

      for (let i = 0; i <= lineCount; i++) {
        const x = startX + (i / lineCount) * spreadWidth;

        // Line to top edge
        perspectiveCtx.beginPath();
        perspectiveCtx.moveTo(vp.x, vp.y);
        perspectiveCtx.lineTo(x, viewMinY);
        perspectiveCtx.stroke();

        // Line to bottom edge
        perspectiveCtx.beginPath();
        perspectiveCtx.moveTo(vp.x, vp.y);
        perspectiveCtx.lineTo(x, viewMaxY);
        perspectiveCtx.stroke();
      }
    });
  }

  perspectiveCtx.setLineDash([]); // Reset for solid VP indicators

  // Draw enhanced vanishing point indicators
  vanishingPoints.forEach((vp) => {
    const size = 10 / scale;
    perspectiveCtx.strokeStyle = 'rgba(255, 0, 0, 0.9)';
    perspectiveCtx.fillStyle = 'rgba(255, 0, 0, 0.5)';
    perspectiveCtx.lineWidth = 1.5 / scale;

    // Draw a circle
    perspectiveCtx.beginPath();
    perspectiveCtx.arc(vp.x, vp.y, size / 2, 0, 2 * Math.PI);
    perspectiveCtx.fill();
    perspectiveCtx.stroke();

    // Draw crosshairs that extend beyond the circle
    perspectiveCtx.lineWidth = 1 / scale;
    perspectiveCtx.beginPath();
    perspectiveCtx.moveTo(vp.x - size, vp.y);
    perspectiveCtx.lineTo(vp.x + size, vp.y); // Horizontal line
    perspectiveCtx.moveTo(vp.x, vp.y - size);
    perspectiveCtx.lineTo(vp.x, vp.y + size); // Vertical line
    perspectiveCtx.stroke();
  });

  perspectiveCtx.restore();
}

/** Toggles the visibility of the perspective guides. */
function togglePerspectiveGuides() {
  showPerspectiveGuides = !showPerspectiveGuides;
  toggleGuidesBtn.classList.toggle('active', showPerspectiveGuides);
  redrawAll();
}

/** Resets all perspective state and clears the guides. */
function clearPerspective() {
  perspectiveMode = 'none';
  horizonLineY = null;
  vanishingPoints = [];
  perspectiveSetupState.isActive = false;
  updatePerspectiveMessage();
  redrawAll();
}

/** Initiates the interactive process for setting up perspective guides. */
function startPerspectiveSetup(type: '1-point' | '2-point') {
  clearPerspective(); // Start fresh
  perspectiveSetupState = {
    isActive: true,
    type,
    step: 'set-horizon',
  };
  updatePerspectiveMessage();
}

/** Handles mouse clicks during the interactive perspective setup process. */
function handlePerspectiveSetupClick(pos: Point) {
  if (!perspectiveSetupState.isActive) return;

  switch (perspectiveSetupState.step) {
    case 'set-horizon':
      horizonLineY = pos.y;
      perspectiveSetupState.step = 'set-vp1';
      break;
    case 'set-vp1':
      if (horizonLineY !== null) {
        vanishingPoints.push({ x: pos.x, y: horizonLineY });
        if (perspectiveSetupState.type === '1-point') {
          perspectiveMode = '1-point';
          perspectiveSetupState.isActive = false;
        } else {
          perspectiveSetupState.step = 'set-vp2';
        }
      }
      break;
    case 'set-vp2':
      if (horizonLineY !== null) {
        vanishingPoints.push({ x: pos.x, y: horizonLineY });
        perspectiveMode = '2-point';
        perspectiveSetupState.isActive = false;
      }
      break;
  }
  updatePerspectiveMessage();
  redrawAll(); // Redraws guides via drawPerspectiveGuides
}

/**
 * Finds the closest point on an infinite line to a given point.
 * @param p The point to check.
 * @param a The start of the line.
 * @param b A second point on the line, defining its direction.
 * @returns The closest point on the line.
 */
function getClosestPointOnRay(p: Point, a: Point, b: Point): Point {
  const atob = { x: b.x - a.x, y: b.y - a.y };
  const atop = { x: p.x - a.x, y: p.y - a.y };
  const lenSq = atob.x * atob.x + atob.y * atob.y;
  if (lenSq === 0) return a;
  const dot = atop.x * atob.x + atop.y * atob.y;
  const t = dot / lenSq;
  return {
    x: a.x + atob.x * t,
    y: a.y + atob.y * t,
  };
}

/**
 * Snaps a point to the active perspective guides or to an orthographic line.
 * @param startPoint The starting point of the line being drawn.
 * @param currentPoint The current cursor position.
 * @returns The new snapped cursor position.
 */
function getLineSnapToPerspective(
  startPoint: Point,
  currentPoint: Point,
): Point {
  if (perspectiveMode === 'none' || vanishingPoints.length === 0) {
    return currentPoint;
  }

  let bestSnapPoint = currentPoint;
  let minDistance = Infinity;

  const SNAP_THRESHOLD = 20 / scale;

  // Check snapping to perspective lines from each VP
  vanishingPoints.forEach((vp) => {
    // The perspective line is the one passing through the VP and the line's start point.
    const projectedPoint = getClosestPointOnRay(currentPoint, vp, startPoint);
    const d = distance(currentPoint, projectedPoint);

    if (d < minDistance && d < SNAP_THRESHOLD) {
      minDistance = d;
      bestSnapPoint = projectedPoint;
    }
  });

  // Check snapping to vertical or horizontal lines (orthographic)
  // Vertical line
  const verticalSnapPoint = { x: startPoint.x, y: currentPoint.y };
  let d = distance(currentPoint, verticalSnapPoint);
  if (d < minDistance && d < SNAP_THRESHOLD) {
    minDistance = d;
    bestSnapPoint = verticalSnapPoint;
  }

  // Horizontal line
  const horizontalSnapPoint = { x: currentPoint.x, y: startPoint.y };
  d = distance(currentPoint, horizontalSnapPoint);
  if (d < minDistance && d < SNAP_THRESHOLD) {
    minDistance = d;
    bestSnapPoint = horizontalSnapPoint;
  }

  return bestSnapPoint;
}

/**
 * Converts a hex color string to an rgba string.
 * @param hex - The hex color (e.g., "#RRGGBB").
 * @param alpha - The alpha transparency value (0 to 1).
 * @returns The rgba color string.
 */
function hexToRgba(hex: string, alpha: number): string {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) {
    return `rgba(0, 0, 0, ${alpha})`; // Return a default color if hex is invalid
  }

  const r = parseInt(result[1], 16);
  const g = parseInt(result[2], 16);
  const b = parseInt(result[3], 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/**
 * Calculates the distance between two points.
 * @param p1 The first point.
 * @param p2 The second point.
 * @returns The distance.
 */
function distance(p1: Point, p2: Point): number {
  return Math.sqrt((p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2);
}

/**
 * Gets the snapped coordinates based on the current mouse position and active snap settings.
 * @param point The current mouse coordinates.
 * @returns The potentially modified (snapped) coordinates.
 */
function getSnappedCoords(point: Point): Point {
  const SNAP_DISTANCE = 10 / scale;
  let snappedPoint = { ...point };
  let bestSnapDist = SNAP_DISTANCE;

  // 1. Snap to objects first (higher priority)
  if (snapToObjects) {
    for (const shape of shapes) {
      if (selectedShapeId !== null && shape.id === selectedShapeId) continue; // Don't snap to self
      const handles = getHandlesForShape(shape);
      for (const handleName in handles) {
        const handlePos = handles[handleName];
        const d = distance(point, handlePos);
        if (d < bestSnapDist) {
          bestSnapDist = d;
          snappedPoint = { ...handlePos };
        }
      }
    }
  }

  // 2. If not snapped to an object, try snapping to the grid
  if (bestSnapDist === SNAP_DISTANCE && snapToGrid) {
    const gridX = Math.round(point.x / GRID_SIZE) * GRID_SIZE;
    const gridY = Math.round(point.y / GRID_SIZE) * GRID_SIZE;
    const gridPoint = { x: gridX, y: gridY };
    const d = distance(point, gridPoint);
    if (d < bestSnapDist) {
      // No need to update bestSnapDist, as this is the final check
      snappedPoint = gridPoint;
    }
  }

  return snappedPoint;
}

/**
 * Gets the canvas coordinates from a mouse or touch event, accounting for pan and zoom.
 * @param e The mouse or touch event.
 * @returns The transformed {x, y} coordinates on the canvas.
 */
function getCoords(e: MouseEvent | TouchEvent): Point {
  if (!beforeCanvas) return { x: 0, y: 0 }; // Should not happen after init
  const rect = beforeCanvas.getBoundingClientRect();
  let clientX: number;
  let clientY: number;

  if (window.TouchEvent && e instanceof TouchEvent) {
    const touch = e.touches[0] || e.changedTouches[0];
    clientX = touch.clientX;
    clientY = touch.clientY;
  } else {
    const mouseEvent = e as MouseEvent;
    clientX = mouseEvent.clientX;
    clientY = mouseEvent.clientY;
  }

  const viewX = clientX - rect.left;
  const viewY = clientY - rect.top;

  // Transform view coordinates to world (canvas) coordinates
  const worldX = (viewX - offsetX) / scale;
  const worldY = (viewY - offsetY) / scale;

  return { x: worldX, y: worldY };
}

// --- Image History ---

/** Renders the list of saved prompts into the side panel. */
function renderImageHistory() {
  if (!historyList || !noHistoryMessage) return;
  historyList.innerHTML = '';
  noHistoryMessage.classList.toggle('hidden', imageHistory.length > 0);

  imageHistory.forEach((entry, index) => {
    const li = document.createElement('li');
    li.className = 'history-item';
    li.dataset.index = String(index);
    li.innerHTML = `
      <img src="${entry.dataUrl}" alt="Generated image ${index + 1}">
      <div class="history-item-overlay">
        <p>${entry.prompt}</p>
        <button class="btn-secondary reuse-history-btn"><i class="fa-solid fa-arrow-up-from-bracket"></i> Reuse</button>
      </div>
    `;
    historyList.appendChild(li);
  });
}

// --- Drawing Tools ---

/** Cancels the current shape (rectangle/circle) drawing. */
function cancelShapeDrawing() {
  isDrawingShape = false;
  shapeStartPoint = null;
  redrawAll(); // Redraw to remove any preview
}

// --- Perspective and View ---

/** Resets zoom and pan to the default state. */
function handleResetView() {
  scale = 1;
  offsetX = 0;
  offsetY = 0;
  if (currentTool === 'eraser') {
    updateEraserCursor();
  }
  redrawAll();
}

// --- Saved Prompts ---

/** Loads saved prompts from localStorage. */
function loadPromptsFromStorage() {
  const storedPrompts = localStorage.getItem(SAVED_PROMPTS_KEY);
  savedPrompts = storedPrompts ? JSON.parse(storedPrompts) : [];
}

/** Saves the current prompts array to localStorage. */
function savePromptsToStorage() {
  localStorage.setItem(SAVED_PROMPTS_KEY, JSON.stringify(savedPrompts));
}

/** Renders the list of saved prompts into the side panel. */
function renderSavedPrompts() {
  savedPromptsList.innerHTML = '';
  noSavedPromptsMessage.classList.toggle('hidden', savedPrompts.length > 0);

  savedPrompts.forEach((prompt) => {
    const li = document.createElement('li');
    li.className = 'saved-prompt-item';
    // Use textContent to prevent XSS issues with user-provided prompts
    const p = document.createElement('p');
    p.className = 'prompt-text';
    p.textContent = prompt;

    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'prompt-actions';
    actionsDiv.innerHTML = `
      <button class="use-prompt-btn btn-secondary" title="Use this prompt"><i class="fa-solid fa-arrow-up-from-bracket"></i> Use</button>
      <button class="delete-prompt-btn btn-secondary" title="Delete this prompt"><i class="fa-solid fa-trash"></i></button>
    `;

    li.appendChild(p);
    li.appendChild(actionsDiv);
    savedPromptsList.appendChild(li);
  });
}

/** Handles the click event to save the current prompt. */
function handleSaveCurrentPrompt() {
  const textToSave = promptInput.value.trim();
  if (textToSave && !savedPrompts.includes(textToSave)) {
    savedPrompts.unshift(textToSave); // Add to the top of the list
    savePromptsToStorage();
    renderSavedPrompts();
  }
}

/** Handles the click event to download all saved prompts as a text file. */
function handleDownloadPrompts() {
  if (savedPrompts.length === 0) {
    // Optionally, show a small message or just do nothing.
    console.log('No prompts to download.');
    return;
  }

  const content = savedPrompts.join('\n\n---\n\n');
  const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'saved-prompts.txt';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Updates the enabled/disabled state of the undo/redo buttons.
 */
function updateUndoRedoButtons() {
  if (!undoBtn || !redoBtn) return;
  undoBtn.disabled = historyIndex <= 0;
  redoBtn.disabled = historyIndex >= historyStack.length - 1;
}

/**
 * Saves the current canvas state to the history stack for undo/redo.
 */
function saveHistoryState() {
  if (!beforeCanvas) return;
  // If we have undone, and now draw something new,
  // we should clear the 'redo' history.
  if (historyIndex < historyStack.length - 1) {
    historyStack = historyStack.slice(0, historyIndex + 1);
  }

  const MAX_HISTORY_SIZE = 30;
  if (historyStack.length >= MAX_HISTORY_SIZE) {
    // Remove the oldest state to keep memory usage in check
    historyStack.splice(0, historyStack.length - MAX_HISTORY_SIZE + 1);
  }

  // Create a deep copy of the current state
  const newHistoryState: HistoryState = {
    layers: layers.map(layer => ({
      id: layer.id,
      name: layer.name,
      isVisible: layer.isVisible,
      imageData: layer.ctx.getImageData(0, 0, layer.canvas.width, layer.canvas.height),
    })),
    shapes: JSON.parse(JSON.stringify(shapes)),
    activeLayerId: activeLayerId,
  };

  historyStack.push(newHistoryState);
  historyIndex = historyStack.length - 1;

  updateUndoRedoButtons();
}


/**
 * Reverts the canvas to the previous state in the history.
 */
function handleUndo() {
  if (historyIndex > 0) {
    historyIndex--;
    restoreHistoryState();
    updateUndoRedoButtons();
  }
}

/**
 * Re-applies an undone canvas state from the history.
 */
function handleRedo() {
  if (historyIndex < historyStack.length - 1) {
    historyIndex++;
    restoreHistoryState();
    updateUndoRedoButtons();
  }
}

/**
 * Restores the canvas state from the current history index.
 */
function restoreHistoryState() {
    const stateToRestore = historyStack[historyIndex];
    if (!stateToRestore) return;

    // Create a map for quick lookups
    const layerStateMap = new Map(stateToRestore.layers.map(l => [l.id, l]));
    
    // Update existing layers and remove deleted ones
    layers = layers.filter(layer => layerStateMap.has(layer.id));
    
    layers.forEach(layer => {
        const state = layerStateMap.get(layer.id)!;
        layer.name = state.name;
        layer.isVisible = state.isVisible;
        layer.ctx.putImageData(state.imageData, 0, 0);
    });

    // Add new layers
    stateToRestore.layers.forEach(state => {
        if (!layers.some(l => l.id === state.id)) {
            const newLayer = createLayer(state.name, state.id);
            newLayer.isVisible = state.isVisible;
            newLayer.ctx.putImageData(state.imageData, 0, 0);
            layers.push(newLayer);
        }
    });

    // Sort layers to match history order
    layers.sort((a, b) => {
        const indexA = stateToRestore.layers.findIndex(l => l.id === a.id);
        const indexB = stateToRestore.layers.findIndex(l => l.id === b.id);
        return indexA - indexB;
    });

    shapes = JSON.parse(JSON.stringify(stateToRestore.shapes));
    activeLayerId = stateToRestore.activeLayerId;

    renderLayersPanel();
    redrawAll();
}

/**
 * Commits all interactive shapes to their respective layer canvases.
 */
function commitAllShapes() {
  if (shapes.length === 0) return;
  
  const shapesToCommit = [...shapes];
  shapes = [];
  selectedShapeId = null;
  updateShapeContextToolsVisibility();
  updateToolOptions();

  shapesToCommit.forEach(shape => {
    const layer = layers.find(l => l.id === shape.layerId);
    if (layer) {
      drawShape(layer.ctx, shape);
    }
  });

  if (shapesToCommit.length > 0) {
    saveHistoryState();
  }
  redrawAll();
}

/**
 * Flips the selected shape horizontally or vertically.
 * @param direction The axis to flip across.
 */
function handleFlip(direction: 'horizontal' | 'vertical') {
    if (selectedShapeId === null) return;

    const shape = shapes.find(s => s.id === selectedShapeId);
    if (!shape || shape.type === 'text') return; // Cannot flip text this way

    // 1. Calculate bounding box and center
    const allX = shape.points.map(p => p.x);
    const allY = shape.points.map(p => p.y);
    const minX = Math.min(...allX);
    const minY = Math.min(...allY);
    const maxX = Math.max(...allX);
    const maxY = Math.max(...allY);
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    // 2. Flip each point relative to the center
    shape.points = shape.points.map(p => {
        if (direction === 'horizontal') {
            return { x: centerX - (p.x - centerX), y: p.y };
        } else { // vertical
            return { x: p.x, y: centerY - (p.y - centerY) };
        }
    });

    // 3. Redraw and save history
    saveHistoryState();
    redrawAll();
}


/**
 * Deletes the currently selected shape from the canvas and history.
 */
function handleDeleteSelectedShape() {
  if (selectedShapeId === null) return;

  shapes = shapes.filter((shape) => shape.id !== selectedShapeId);
  selectedShapeId = null;

  updateToolOptions();
  updateShapeContextToolsVisibility();
  redrawAll();
  saveHistoryState(); // Save the state after deletion
}

/**
 * Copies the selected shape to the internal clipboard.
 */
function handleCopy() {
  if (selectedShapeId === null) return;
  const selectedShape = shapes.find((s) => s.id === selectedShapeId);
  if (selectedShape) {
    clipboard = JSON.parse(JSON.stringify(selectedShape));
  }
}

/**
 * Pastes the shape from the internal clipboard onto the active layer.
 */
function handlePaste() {
  if (!clipboard || activeLayerId === null) return;
  const shapeToPaste: Shape = JSON.parse(JSON.stringify(clipboard));
  shapeToPaste.id = nextShapeId++;
  shapeToPaste.layerId = activeLayerId;
  const PASTE_OFFSET = 20 / scale;
  shapeToPaste.points = shapeToPaste.points.map(p => ({
    x: p.x + PASTE_OFFSET,
    y: p.y + PASTE_OFFSET,
  }));
  shapes.push(shapeToPaste);
  selectedShapeId = shapeToPaste.id;
  updateToolOptions();
  updateShapeContextToolsVisibility();
  saveHistoryState();
  redrawAll();
}


/**
 * Clears only the sketch from the active layer.
 */
function handleClearSketch() {
  if (activeLayerId === null) return;

  const activeLayer = layers.find(l => l.id === activeLayerId);
  if (!activeLayer) return;

  // Clear raster content on the active layer's canvas
  activeLayer.ctx.clearRect(0, 0, activeLayer.canvas.width, activeLayer.canvas.height);

  // Remove shapes associated with the active layer
  shapes = shapes.filter(shape => shape.layerId !== activeLayerId);

  // If the cleared layer had the selected shape, deselect it
  if (selectedShapeId !== null && !shapes.some(s => s.id === selectedShapeId)) {
    selectedShapeId = null;
    updateShapeContextToolsVisibility();
    updateToolOptions();
  }
  
  saveHistoryState();
  redrawAll();
}


/**
 * Clears the entire canvas including background image, sketches, and masks.
 */
function handleClearAll() {
  // Clear background image
  backgroundImageDisplay.src = '';
  backgroundImageDisplay.classList.add('hidden');
  beforeImagePlaceholder.classList.remove('hidden');

  // Clear layers and history
  layers = [];
  historyStack = [];
  historyIndex = -1;
  addNewLayer('Layer 1'); // Create a new default layer
  saveHistoryState(); 

  // Clear interactive shapes
  shapes = [];
  selectedShapeId = null;
  updateShapeContextToolsVisibility();
  updateToolOptions();
  cancelShapeDrawing();

  // Clear perspective
  clearPerspective();

  handleResetView(); // Reset zoom and pan

  // Clear image history
  imageHistory = [];
  renderImageHistory();

  // Reset UI
  afterImage.src = '';
  removeComparisonSlider();
  downloadSketchBtn.classList.add('hidden');
  downloadImageBtn.classList.add('hidden');
  togglePromptBtn.classList.add('hidden');
  promptDisplayContainer.classList.add('hidden');
  lastSuccessfulPrompt = null;
  originalImageUrl = null;
  imageUrlWithPrompt = null;
  lastCompositeImageUrl = null;
  
  redrawAll();
  renderLayersPanel();
}


/**
 * Sets the UI to a loading state.
 * @param isLoading - Whether the loading state should be enabled.
 */
function setLoading(isLoading: boolean) {
  loader.classList.toggle('hidden', !isLoading);
  generateBtn.disabled = isLoading;
  if (isLoading) {
    afterImage.classList.add('hidden');
    // Always hide download buttons during load
    downloadSketchBtn.classList.add('hidden');
    downloadImageBtn.classList.add('hidden');
    togglePromptBtn.classList.add('hidden');
  }
}

/**
 * Removes the comparison slider from the DOM.
 */
function removeComparisonSlider() {
  const slider = document.getElementById('comparison-container');
  if (slider) {
    slider.remove();
  }
  afterImage.classList.add('hidden');
}

/**
 * Displays an error message to the user.
 * @param message - The error message to display.
 */
function setError(message: string) {
  setLoading(false);
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
  outputContainer.classList.add('error');
  promptDisplayContainer.classList.add('hidden');
  lastSuccessfulPrompt = null;
  removeComparisonSlider();
  afterImage.src = ''; // Explicitly clear src on error
  downloadSketchBtn.classList.add('hidden');
  downloadImageBtn.classList.add('hidden');
  togglePromptBtn.classList.add('hidden');
}

/**
 * Sets up the interactive comparison slider.
 * @param beforeSrc - The src for the 'before' image (from canvas).
 * @param afterSrc - The src for the 'after' image.
 */
function setupComparisonSlider(beforeSrc: string, afterSrc: string) {
  removeComparisonSlider();
  afterImage.classList.add('hidden');

  const container = document.createElement('div');
  container.id = 'comparison-container';
  container.className = 'comparison-container';

  const beforeImg = document.createElement('img');
  beforeImg.src = beforeSrc;
  beforeImg.alt = 'Original image with sketches';

  const afterImg = document.createElement('img');
  afterImg.src = afterSrc;
  afterImg.alt = 'Generated image for comparison';
  afterImg.className = 'comparison-after-image';

  const handle = document.createElement('div');
  handle.className = 'comparison-slider-handle';
  handle.innerHTML = `<div class="comparison-slider-grabber"><i class="fa-solid fa-left-right"></i></div>`;

  container.appendChild(beforeImg);
  container.appendChild(afterImg);
  container.appendChild(handle);
  outputContainer.appendChild(container);

  const sliderMoveHandler = (e: MouseEvent | TouchEvent) => {
    if (!isSliderDragging) return;
    const rect = container.getBoundingClientRect();
    const x =
      (e instanceof MouseEvent ? e.clientX : e.touches[0].clientX) - rect.left;
    const position = Math.max(0, Math.min(x, rect.width));
    const percentage = (position / rect.width) * 100;
    handle.style.left = `${percentage}%`;
    afterImg.style.clipPath = `inset(0 ${100 - percentage}% 0 0)`;
  };

  const sliderEndHandler = () => {
    isSliderDragging = false;
    document.removeEventListener('mousemove', sliderMoveHandler);
    document.removeEventListener('mouseup', sliderEndHandler);
    document.removeEventListener('touchmove', sliderMoveHandler);
    document.removeEventListener('touchend', sliderEndHandler);
  };

  const sliderStartHandler = (e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    isSliderDragging = true;
    document.addEventListener('mousemove', sliderMoveHandler);
    document.addEventListener('mouseup', sliderEndHandler);
    document.addEventListener('touchmove', sliderMoveHandler);
    document.addEventListener('touchend', sliderEndHandler);
  };

  handle.addEventListener('mousedown', sliderStartHandler);
  handle.addEventListener('touchstart', sliderStartHandler, { passive: false });
}

/**
 * Draws a single shape object onto a canvas context.
 * @param context The rendering context.
 * @param shape The shape to draw.
 */
function drawShape(context: CanvasRenderingContext2D, shape: Shape) {
  // Don't draw the text shape if it's currently being edited
  if (textEditor && selectedShapeId === shape.id) {
    return;
  }
  
  context.save();
  context.strokeStyle = shape.strokeColor;
  context.lineWidth = shape.strokeWidth;

  if (shape.type === 'rectangle') {
    const [p1, p2, p3, p4] = shape.points;
    context.beginPath();
    context.moveTo(p1.x, p1.y);
    context.lineTo(p2.x, p2.y);
    context.lineTo(p3.x, p3.y);
    context.lineTo(p4.x, p4.y);
    context.closePath();
  } else if (shape.type === 'french-curve') {
    const [start, c1, c2, end] = shape.points;
    context.beginPath();
    context.moveTo(start.x, start.y);
    context.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, end.x, end.y);
    if (shape.isFilled) {
      context.closePath(); // Connect end to start for filling
    }
  } else if (shape.type === 'circle') {
    const [p1, , p3] = shape.points; // Top-left and bottom-right
    const centerX = (p1.x + p3.x) / 2;
    const centerY = (p1.y + p3.y) / 2;
    const radiusX = Math.abs(p3.x - p1.x) / 2;
    const radiusY = Math.abs(p3.y - p1.y) / 2;
    context.beginPath();
    context.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
    context.closePath();
  } else if (shape.type === 'text') {
    context.fillStyle = shape.strokeColor; // Use stroke color for text
    context.font = `${shape.fontStyle} ${shape.fontWeight} ${shape.fontSize}px ${shape.fontFamily}`;
    context.textAlign = shape.textAlign!;
    context.textBaseline = 'top';

    const lines = (shape.text || '').split('\n');
    const lineHeight = shape.fontSize! * 1.2;
    lines.forEach((line, index) => {
      context.fillText(line, shape.points[0].x, shape.points[0].y + (index * lineHeight));
    });

    // Text doesn't have a stroke in this implementation, so we exit here
    context.restore();
    return;
  }


  if (shape.isFilled) {
    const allX = shape.points.map((p) => p.x);
    const allY = shape.points.map((p) => p.y);
    const minX = Math.min(...allX);
    const minY = Math.min(...allY);
    const maxX = Math.max(...allX);
    const maxY = Math.max(...allY);
    const bounds = { x: minX, y: minY, w: maxX - minX, h: maxY - minY };

    // Temporarily set global fill state from shape properties to reuse the applyFillStyle function
    const originalFillType = fillType;
    const originalSelectedPattern = selectedPatternImage;
    const originalFillColor = fillColorPicker.value;
    const originalGradientColor1 = gradientColor1;
    const originalGradientColor2 = gradientColor2;

    fillType = shape.fillType;
    if (shape.patternName) {
      selectedPatternImage = patternImages[shape.patternName];
    }
    fillColorPicker.value = shape.fillColor;
    gradientColor1 = shape.gradientColor1;
    gradientColor2 = shape.gradientColor2;

    applyFillStyle(context, bounds);
    context.fill();

    // Restore global state
    fillType = originalFillType;
    selectedPatternImage = originalSelectedPattern;
    fillColorPicker.value = originalFillColor;
    gradientColor1 = originalGradientColor1;
    gradientColor2 = originalGradientColor2;
  }
  context.stroke();
  context.restore();
}

/** Draws the background grid if enabled. */
function drawGrid() {
  const gridCtx = gridCanvas.getContext('2d');
  if (!gridCtx) return;

  // 1. Clear grid canvas completely
  gridCtx.save();
  gridCtx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform before clearing
  gridCtx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
  gridCtx.restore();

  // Exit if grid is disabled
  if (!snapToGrid) return;

  // 2. Apply view transform and draw grid
  gridCtx.save();
  gridCtx.translate(offsetX, offsetY);
  gridCtx.scale(scale, scale);

  gridCtx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
  gridCtx.lineWidth = 1 / scale;

  // Calculate visible area in world coordinates
  const viewMinX = -offsetX / scale;
  const viewMinY = -offsetY / scale;
  const viewMaxX = (gridCanvas.width - offsetX) / scale;
  const viewMaxY = (gridCanvas.height - offsetY) / scale;

  const startX = Math.floor(viewMinX / GRID_SIZE) * GRID_SIZE;
  const startY = Math.floor(viewMinY / GRID_SIZE) * GRID_SIZE;

  // Draw vertical lines
  for (let x = startX; x < viewMaxX; x += GRID_SIZE) {
    gridCtx.beginPath();
    gridCtx.moveTo(x, viewMinY);
    gridCtx.lineTo(x, viewMaxY);
    gridCtx.stroke();
  }

  // Draw horizontal lines
  for (let y = startY; y < viewMaxY; y += GRID_SIZE) {
    gridCtx.beginPath();
    gridCtx.moveTo(viewMinX, y);
    gridCtx.lineTo(viewMaxX, y);
    gridCtx.stroke();
  }

  gridCtx.restore();
}


/** Redraws all canvas layers with the current transformations. */
function redrawAll() {
  if (!ctx || !beforeCanvas) return;

  // 1. Clear main canvas without any transformation
  ctx.save();
  ctx.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
  ctx.clearRect(0, 0, beforeCanvas.width, beforeCanvas.height);
  ctx.restore();
  
  // Draw the grid and guides on their separate canvases
  drawGrid();
  drawPerspectiveGuides();

  // 2. Apply the current view transform to the main context
  ctx.save();
  ctx.translate(offsetX, offsetY);
  ctx.scale(scale, scale);

  // 3. Draw a rectangle showing the canvas boundary
  ctx.save();
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.lineWidth = 1 / scale;
  ctx.setLineDash([5 / scale, 5 / scale]);
  ctx.strokeRect(0, 0, beforeCanvas.width, beforeCanvas.height);
  ctx.restore();


  // 4. Redraw content from layers
  // Iterate from bottom to top
  for (const layer of layers) {
    if (layer.isVisible) {
      // a) Draw the layer's committed raster content
      ctx.drawImage(layer.canvas, 0, 0);
      
      // b) Draw interactive shapes belonging to this layer
      shapes.filter(s => s.layerId === layer.id).forEach(shape => drawShape(ctx, shape));
    }
  }

  // c) Draw handles for selected shape (on top of everything)
  if (selectedShapeId !== null) {
    const selectedShape = shapes.find((s) => s.id === selectedShapeId);
    if (selectedShape) {
      const handles = getHandlesForShape(selectedShape);
      const handleSize = 8 / scale;

      if (selectedShape.type === 'rectangle' || selectedShape.type === 'circle') {
        const [p1, p2, p3, p4] = selectedShape.points;
        // Bounding box (now the shape outline)
        ctx.strokeStyle = 'rgba(0, 120, 255, 0.8)';
        ctx.lineWidth = 1 / scale;
        ctx.setLineDash([4 / scale, 4 / scale]);
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.lineTo(p3.x, p3.y);
        ctx.lineTo(p4.x, p4.y);
        ctx.closePath();
        ctx.stroke();
        ctx.setLineDash([]);
      } else if (selectedShape.type === 'french-curve') {
        const [start, c1, c2, end] = selectedShape.points;
        // Curve outline
        ctx.strokeStyle = 'rgba(0, 120, 255, 0.8)';
        ctx.lineWidth = 1 / scale;
        ctx.setLineDash([4 / scale, 4 / scale]);
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, end.x, end.y);
        ctx.stroke();

        // Lines to control points
        ctx.strokeStyle = 'rgba(0, 120, 255, 0.5)';
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(c1.x, c1.y);
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(c2.x, c2.y);
        ctx.stroke();
        ctx.setLineDash([]);
      } else if (selectedShape.type === 'text') {
        const {x, y, width, height} = getTextBoundingBox(selectedShape);
        ctx.strokeStyle = 'rgba(0, 120, 255, 0.8)';
        ctx.lineWidth = 1 / scale;
        ctx.setLineDash([4 / scale, 4 / scale]);
        ctx.strokeRect(x, y, width, height);
        ctx.setLineDash([]);
      }


      // Handles
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = 'rgba(0, 120, 255, 1)';
      ctx.lineWidth = 2 / scale;
      for (const handleName in handles) {
        const pos = handles[handleName];
        ctx.beginPath();
        if (
          selectedShape.type === 'french-curve' &&
          (handleName === 'c1' || handleName === 'c2')
        ) {
          // Control points as circles
          ctx.arc(pos.x, pos.y, handleSize / 2, 0, 2 * Math.PI);
        } else {
          // Rectangle corners and curve start/end points as squares
          ctx.rect(
            pos.x - handleSize / 2,
            pos.y - handleSize / 2,
            handleSize,
            handleSize,
          );
        }
        ctx.fill();
        ctx.stroke();
      }
    }
  }

  // 5. Restore context to its original state
  ctx.restore();
}

/**
 * Finds the closest point on a line segment to a given point.
 * @param p The point.
 * @param a The start of the line segment.
 * @param b The end of the line segment.
 * @returns The closest point on the segment.
 */
function getClosestPointOnSegment(p: Point, a: Point, b: Point): Point {
  const atob = { x: b.x - a.x, y: b.y - a.y };
  const atop = { x: p.x - a.x, y: p.y - a.y };
  const len = atob.x * atob.x + atob.y * atob.y;
  let dot = atop.x * atob.x + atop.y * atob.y;
  const t = Math.min(1, Math.max(0, dot / len));
  dot = (b.x - a.x) * (p.y - a.y) - (b.y - a.y) * (p.x - a.x);
  return {
    x: a.x + atob.x * t,
    y: a.y + atob.y * t,
  };
}

/**
 * Applies the currently selected fill style (solid, gradient, or pattern) to the canvas context.
 * @param context The rendering context to apply the style to.
 * @param shapeBounds The bounding box of the shape being drawn.
 */
function applyFillStyle(
  context: CanvasRenderingContext2D,
  shapeBounds: { x: number; y: number; w: number; h: number },
) {
  switch (fillType) {
    case 'solid':
      context.fillStyle = fillColorPicker.value;
      break;
    case 'linear': {
      const gradient = context.createLinearGradient(
        shapeBounds.x,
        shapeBounds.y,
        shapeBounds.x + shapeBounds.w,
        shapeBounds.y + shapeBounds.h,
      );
      gradient.addColorStop(0, gradientColor1);
      gradient.addColorStop(1, gradientColor2);
      context.fillStyle = gradient;
      break;
    }
    case 'radial': {
      const centerX = shapeBounds.x + shapeBounds.w / 2;
      const centerY = shapeBounds.y + shapeBounds.h / 2;
      const radius = Math.max(shapeBounds.w, shapeBounds.h) / 2;
      const gradient = context.createRadialGradient(
        centerX,
        centerY,
        0,
        centerX,
        centerY,
        radius,
      );
      gradient.addColorStop(0, gradientColor1);
      gradient.addColorStop(1, gradientColor2);
      context.fillStyle = gradient;
      break;
    }
    case 'pattern':
      if (selectedPatternImage && selectedPatternImage.complete) {
        const pattern = context.createPattern(selectedPatternImage, 'repeat');
        if (pattern) {
          context.fillStyle = pattern;
        }
      } else {
        // Fallback to solid if pattern not loaded
        context.fillStyle = fillColorPicker.value;
      }
      break;
  }
}

/**
 * Updates the UI to show the options for the currently selected tool.
 */
function updateToolOptions() {
  const selectedShape = shapes.find((s) => s.id === selectedShapeId);
  const tool = selectedShapeId !== null ? 'select' : currentTool;

  // Hide all option panels first
  brushOptions.classList.add('hidden');
  fillOptions.classList.add('hidden');
  lineStyleOptions.classList.add('hidden');
  textOptions.classList.add('hidden');
  gradientColorOptions.classList.add('hidden');
  shapeContextTools.classList.add('hidden');

  const shapeType = selectedShape?.type;
  const toolOrShapeType = shapeType ?? currentTool;

  // Show the relevant panel
  if (['sketch', 'eraser'].includes(toolOrShapeType)) {
    brushOptions.classList.remove('hidden');
  } else if (['line', 'rectangle', 'french-curve', 'circle'].includes(toolOrShapeType)) {
    brushOptions.classList.remove('hidden'); // For the stroke
    lineStyleOptions.classList.remove('hidden'); // Show line style for shapes
    fillOptions.classList.remove('hidden');
    if (tool === 'select') shapeContextTools.classList.remove('hidden');

    // Determine current fill state and type
    const fillState = selectedShape ? selectedShape.isFilled : isFillEnabled;
    const currentFillType = selectedShape ? selectedShape.fillType : fillType;

    // Sync fill toggle button
    fillToggleBtn.classList.toggle('active', fillState);
    const icon = fillToggleBtn.querySelector('i');
    if (icon) {
      icon.className = `fa-solid ${fillState ? 'fa-droplet' : 'fa-droplet-slash'}`;
    }

    // Sync fill type buttons active state
    solidColorFillBtn.classList.toggle('active', currentFillType === 'solid');
    linearGradientBtn.classList.toggle('active', currentFillType === 'linear');
    radialGradientBtn.classList.toggle('active', currentFillType === 'radial');
    patternUploadBtn.classList.toggle('active', currentFillType === 'pattern');

    // Show/hide gradient pickers
    if (currentFillType === 'linear' || currentFillType === 'radial') {
        gradientColorOptions.classList.remove('hidden');
    }

    // Update control values from selected shape or global state
    if (selectedShape) {
      brushSizeSlider.value = String(selectedShape.strokeWidth);
      brushSizeLabel.textContent = String(selectedShape.strokeWidth);
      colorPicker.value = selectedShape.strokeColor;
      colorPickerLabel.style.setProperty('--picker-color', selectedShape.strokeColor);
      fillColorPicker.value = selectedShape.fillColor;
      fillColorPreview.style.setProperty('--fill-color', selectedShape.fillColor);
      gradientColor1Picker.value = selectedShape.gradientColor1;
      gradientColor1Preview.style.setProperty('--gradient-color-1', selectedShape.gradientColor1);
      gradientColor2Picker.value = selectedShape.gradientColor2;
      gradientColor2Preview.style.setProperty('--gradient-color-2', selectedShape.gradientColor2);
    } else {
      fillColorPicker.value = fillColorPicker.value;
      fillColorPreview.style.setProperty('--fill-color', fillColorPicker.value);
      gradientColor1Picker.value = gradientColor1;
      gradientColor1Preview.style.setProperty('--gradient-color-1', gradientColor1);
      gradientColor2Picker.value = gradientColor2;
      gradientColor2Preview.style.setProperty('--gradient-color-2', gradientColor2);
    }

  } else if (toolOrShapeType === 'text') {
    textOptions.classList.remove('hidden');
     if (tool === 'select') shapeContextTools.classList.remove('hidden');
    // Sync text controls with selected text shape
    if (selectedShape) {
        colorPicker.value = selectedShape.strokeColor;
        textColorLabel.style.setProperty('--picker-color', selectedShape.strokeColor);
        fontFamilySelect.value = selectedShape.fontFamily || 'Roboto';
        fontSizeInput.value = String(selectedShape.fontSize || 16);
        fontWeightBtn.classList.toggle('active', selectedShape.fontWeight === 'bold');
        fontStyleBtn.classList.toggle('active', selectedShape.fontStyle === 'italic');
        alignLeftBtn.classList.toggle('active', selectedShape.textAlign === 'left');
        alignCenterBtn.classList.toggle('active', selectedShape.textAlign === 'center');
        alignRightBtn.classList.toggle('active', selectedShape.textAlign === 'right');
    }
  } else if (tool === 'select' && selectedShapeId !== null) {
      shapeContextTools.classList.remove('hidden');
  }
}


/**
 * Handles the selection of a drawing or shape tool.
 * @param toolName The name of the tool to activate.
 */
function selectTool(
  toolName: 'select' | 'pan' | 'sketch' | 'line' | 'eraser' | 'rectangle' | 'french-curve' | 'circle' | 'text',
) {
  // Deselect any active shape before switching tool, but don't commit it.
  if (toolName !== 'select') {
    if (selectedShapeId !== null) {
      selectedShapeId = null;
      redrawAll(); // To remove selection handles
    }
  }
  
  hideTextEditor();

  // If we are in the middle of drawing a shape, cancel it before switching.
  if (isDrawingShape) {
    cancelShapeDrawing();
  }

  currentTool = toolName;
  isDrawingShape = ['rectangle', 'french-curve', 'circle'].includes(toolName);

  // Update UI for tool buttons
  const allToolButtons = document.querySelectorAll('#left-toolbar .tool-btn');
  allToolButtons.forEach((btn) => btn.classList.remove('active'));

  const drawingTools = ['sketch', 'line', 'french-curve'];
  const shapeTools = ['rectangle', 'circle'];

  let toolButton: HTMLElement | null = null;
  if (drawingTools.includes(toolName)) {
    toolButton = document.getElementById(`${toolName}-tool-btn`);
    const icon = toolButton?.querySelector('i');
    if (toolButton && icon) {
      activeDrawingToolIcon.className = icon.className;
      activeDrawingToolBtn.title = toolButton.title;
    }
    activeDrawingToolBtn.classList.add('active');
  } else if (shapeTools.includes(toolName)) {
      toolButton = document.getElementById(`${toolName}-tool-btn`);
      const icon = toolButton?.querySelector('i');
      if(toolButton && icon) {
          activeShapeToolIcon.className = icon.className;
          activeShapeToolBtn.title = toolButton.title;
      }
      activeShapeToolBtn.classList.add('active');
  } else {
    // Eraser, Rectangle, Circle, Text, Select, Pan, Zoom
    const buttonId = `${toolName}-tool-btn`
    toolButton = document.getElementById(buttonId)
  }
  toolButton?.classList.add('active');

  // Handle custom cursors
  if (currentTool === 'eraser') {
    beforeCanvas.style.cursor = 'none';
    updateEraserCursor();
  } else if (currentTool === 'text') {
    beforeCanvas.style.cursor = 'text';
    eraserCursorPreview.classList.add('hidden');
  } else if (currentTool === 'pan') {
    beforeCanvas.style.cursor = 'grab';
     eraserCursorPreview.classList.add('hidden');
  } else {
    eraserCursorPreview.classList.add('hidden');
    beforeCanvas.style.cursor = 'default';
  }

  updateToolOptions();
}

/**
 * Draws a smooth curve between two points using quadratic Bezier curves.
 * @param p1 Start point.
 * @param p2 Control point.
 * @param p3 End point.
 */
function drawCurve(ctx: CanvasRenderingContext2D, p1: Point, p2: Point, p3: Point) {
  if (!ctx) return;
  ctx.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
}


/**
 * Gets the positions of the resize handles for a shape.
 * @param shape The shape object.
 * @returns An object with handle names and their coordinates.
 */
function getHandlesForShape(shape: Shape): Record<string, Point> {
  if (shape.type === 'rectangle' || shape.type === 'circle') {
    const [tl, tr, br, bl] = shape.points;
    return { tl, tr, br, bl };
  } else if (shape.type === 'french-curve') {
    const [start, c1, c2, end] = shape.points;
    return { start, c1, c2, end };
  }
  return {};
}

/**
 * Calculates the bounding box of a text shape.
 * @param shape The text shape.
 * @returns The bounding box {x, y, width, height}.
 */
function getTextBoundingBox(shape: Shape): { x: number; y: number; width: number; height: number; } {
    if (shape.type !== 'text' || !tempCtx) {
        return { x: 0, y: 0, width: 0, height: 0 };
    }
    
    tempCtx.font = `${shape.fontStyle} ${shape.fontWeight} ${shape.fontSize}px ${shape.fontFamily}`;
    const lines = (shape.text || '').split('\n');
    const lineHeight = shape.fontSize! * 1.2;
    const height = lines.length * lineHeight;

    let maxWidth = 0;
    lines.forEach(line => {
        const metrics = tempCtx.measureText(line);
        if (metrics.width > maxWidth) {
            maxWidth = metrics.width;
        }
    });

    let x = shape.points[0].x;
    if (shape.textAlign === 'center') {
        x -= maxWidth / 2;
    } else if (shape.textAlign === 'right') {
        x -= maxWidth;
    }

    return { x: x, y: shape.points[0].y, width: maxWidth, height: height };
}


/**
 * Checks if a point is inside a polygon using the ray-casting algorithm.
 * @param point The point to check.
 * @param shape The shape to check against.
 * @returns True if the point is inside.
 */
function isPointInShape(point: Point, shape: Shape): boolean {
  if (shape.type === 'rectangle') {
    const { x, y } = point;
    const vs = shape.points;
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      const xi = vs[i].x;
      const yi = vs[i].y;
      const xj = vs[j].x;
      const yj = vs[j].y;

      const intersect =
        yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  } else if (shape.type === 'circle') {
    const [p1, , p3] = shape.points; // Top-left and bottom-right
    const cx = (p1.x + p3.x) / 2;
    const cy = (p1.y + p3.y) / 2;
    const rx = Math.abs(p3.x - p1.x) / 2;
    const ry = Math.abs(p3.y - p1.y) / 2;
    // Check if point is inside ellipse
    if (rx <= 0 || ry <= 0) return false;
    return ((point.x - cx) / rx) ** 2 + ((point.y - cy) / ry) ** 2 <= 1;
  } else if (shape.type === 'french-curve') {
    const [start, c1, c2, end] = shape.points;

    // If filled, check if inside the filled area using isPointInPath
    if (shape.isFilled) {
      const offscreenCanvas = document.createElement('canvas');
      const offscreenCtx = offscreenCanvas.getContext('2d');
      if (!offscreenCtx) return false;

      offscreenCtx.beginPath();
      offscreenCtx.moveTo(start.x, start.y);
      offscreenCtx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, end.x, end.y);
      offscreenCtx.closePath(); // Connects end to start for a closed shape
      return offscreenCtx.isPointInPath(point.x, point.y);
    }

    // If not filled, check for proximity to the curve's line
    const threshold = 10 / scale;
    for (let t = 0; t <= 1; t += 0.05) {
      const mt = 1 - t;
      const mt2 = mt * mt;
      const t2 = t * t;

      const x =
        mt2 * mt * start.x +
        3 * mt2 * t * c1.x +
        3 * mt * t2 * c2.x +
        t2 * t * end.x;
      const y =
        mt2 * mt * start.y +
        3 * mt2 * t * c1.y +
        3 * mt * t2 * c2.y +
        t2 * t * end.y;

      if (distance({ x, y }, point) < threshold) {
        return true;
      }
    }
    return false;
  } else if (shape.type === 'text') {
    const box = getTextBoundingBox(shape);
    return point.x >= box.x && point.x <= box.x + box.width &&
           point.y >= box.y && point.y <= box.y + box.height;
  }

  return false;
}

/**
 * Handles the start of a drawing action (mousedown or touchstart).
 * @param e The mouse or touch event.
 */
function startDrawing(e: MouseEvent | TouchEvent) {
  e.preventDefault();
  hideTextEditor();

  const rawPos = getCoords(e);
  let pos = getSnappedCoords(rawPos);

  if (isSpacebarDown || currentTool === 'pan') {
    isPanning = true;
    panStart = rawPos; // Use raw position for panning
    beforeImageContainer.classList.add('panning');
    beforeCanvas.style.cursor = 'grabbing';
    return;
  }
  
  // Check for dragging a vanishing point
  if (perspectiveMode !== 'none' && !perspectiveSetupState.isActive) {
    for (let i = 0; i < vanishingPoints.length; i++) {
        if (distance(rawPos, vanishingPoints[i]) < 15 / scale) {
            draggedVPIndex = i;
            isDrawing = true;
            beforeCanvas.style.cursor = 'move';
            return;
        }
    }
  }


  if (perspectiveSetupState.isActive) {
    handlePerspectiveSetupClick(rawPos);
    return;
  }

  const activeLayer = layers.find(l => l.id === activeLayerId);
  if (!activeLayer) return;

  if (currentTool === 'select') {
     // 1. Check for interaction with the currently selected shape
    if (selectedShapeId !== null) {
      const selectedShape = shapes.find((s) => s.id === selectedShapeId);
      if (selectedShape && selectedShape.layerId === activeLayer.id) {
        const handles = getHandlesForShape(selectedShape);
        // Check handles first
        for (const handleName in handles) {
          if (distance(rawPos, handles[handleName]) < 10 / scale) {
            isDrawing = true;
            draggedHandle = handleName;
            dragStartPoint = pos;
            originalShapeState = JSON.parse(JSON.stringify(selectedShape));
            return;
          }
        }
        // Check if dragging the shape itself
        if (isPointInShape(rawPos, selectedShape)) {
          isDrawing = true;
          isDraggingShape = true;
          dragStartPoint = pos;
          originalShapeState = JSON.parse(JSON.stringify(selectedShape));
          return;
        }
      }
    }
    // 2. If no interaction with selected shape, check for selecting a NEW shape
    // Iterate in reverse to select the top-most shape
    for (let i = shapes.length - 1; i >= 0; i--) {
      const shape = shapes[i];
      // Only allow selecting shapes on the active and visible layer
      if (shape.layerId === activeLayer.id && isPointInShape(rawPos, shape)) {
        // Found a shape to select
        if (selectedShapeId !== shape.id) {
          selectedShapeId = shape.id;
        }
        // Start dragging the newly selected shape
        isDrawing = true;
        isDraggingShape = true;
        dragStartPoint = pos;
        originalShapeState = JSON.parse(JSON.stringify(shape));
        updateToolOptions();
        redrawAll();
        return; // Exit after selecting and starting drag
      }
    }
    // 3. If we clicked on empty canvas, deselect any selected shape
    if (selectedShapeId !== null) {
      selectedShapeId = null;
      updateToolOptions();
      redrawAll();
    }
    return; // End of 'select' tool logic
  }

  
  // No drawing if there's no active layer
  if (!activeLayer) return;

  // 4. Proceed with the current tool to draw a new element
  beforeImagePlaceholder.classList.add('hidden');
  if (isPanning) return;

  if (currentTool === 'text') {
    createTextObject(pos);
    return; // Text creation is a single click, no dragging
  }


  isDrawing = true;
  
  const drawCtx = activeLayer.ctx;
  drawCtx.save();
  drawCtx.translate(offsetX, offsetY);
  drawCtx.scale(scale, scale);

  if (currentTool === 'sketch' || currentTool === 'eraser') {
    drawCtx.beginPath();
    lastPoint = pos;
    lastMidPoint = pos;
    drawCtx.moveTo(pos.x, pos.y);
  } else if (currentTool === 'line') {
    lineStartPoint = pos;
  } else if (['rectangle', 'french-curve', 'circle'].includes(currentTool)) {
    isDrawingShape = true;
    shapeStartPoint = pos;
  }
}

/**
 * Handles the drawing action as the mouse or touch moves.
 * @param e The mouse or touch event.
 */
function draw(e: MouseEvent | TouchEvent) {
  e.preventDefault();
  
  // Get view coordinates for custom cursors, relative to the container
  const rect = beforeImageContainer.getBoundingClientRect();
  const clientX = (e instanceof MouseEvent ? e.clientX : (e.touches[0] || e.changedTouches[0]).clientX);
  const clientY = (e instanceof MouseEvent ? e.clientY : (e.touches[0] || e.changedTouches[0]).clientY);
  const viewX = clientX - rect.left;
  const viewY = clientY - rect.top;

  const rawPos = getCoords(e);
  let pos = getSnappedCoords(rawPos);

  // --- Update cursor ---
  let newCursor = 'default';
  
  if (currentTool === 'eraser') {
    newCursor = 'none';
    eraserCursorPreview.style.left = `${viewX}px`;
    eraserCursorPreview.style.top = `${viewY}px`;
  } else if (currentTool === 'text') {
    newCursor = 'text';
  } else if (currentTool === 'pan') {
    newCursor = isPanning ? 'grabbing' : 'grab';
  } else {
      let isOverVP = false;
      if (perspectiveMode !== 'none' && !perspectiveSetupState.isActive) {
          for (const vp of vanishingPoints) {
              if (distance(rawPos, vp) < 15 / scale) {
                  isOverVP = true;
                  break;
              }
          }
      }

      if (isOverVP) {
          newCursor = 'move';
      } else if (isSpacebarDown) {
        newCursor = 'grabbing';
      } else if (currentTool === 'select' && selectedShapeId !== null) {
        const selectedShape = shapes.find((s) => s.id === selectedShapeId);
        if (selectedShape && selectedShape.layerId === activeLayerId) {
          const handles = getHandlesForShape(selectedShape);
          hoveredHandle = null;
          for (const handleName in handles) {
            if (distance(rawPos, handles[handleName]) < 10 / scale) {
              hoveredHandle = handleName;
              break;
            }
          }
          if (hoveredHandle) {
            if (
              (selectedShape.type === 'rectangle' || selectedShape.type === 'circle') &&
              ['tl', 'br'].includes(hoveredHandle)
            ) {
              newCursor = 'nwse-resize';
            } else if (
              (selectedShape.type === 'rectangle' || selectedShape.type === 'circle') &&
              ['tr', 'bl'].includes(hoveredHandle)
            ) {
              newCursor = 'nesw-resize';
            } else {
              newCursor = 'move';
            }
          } else if (isPointInShape(rawPos, selectedShape)) {
            newCursor = 'move';
          }
        }
      } else if (perspectiveSetupState.isActive) {
        newCursor = 'crosshair';
      }
  }
  if (beforeCanvas.style.cursor !== newCursor) {
      beforeCanvas.style.cursor = newCursor;
  }


  if (isPanning) {
    const dx = rawPos.x - panStart.x;
    const dy = rawPos.y - panStart.y;
    offsetX += dx * scale;
    offsetY += dy * scale;
    redrawAll();
    return;
  }

  if (!isDrawing) return;

  // --- Vanishing Point Dragging ---
  if (draggedVPIndex !== null && horizonLineY !== null) {
    // Clamp VP dragging to the visible canvas frame
    const viewMinX = -offsetX / scale;
    const viewMaxX = (beforeCanvas.width - offsetX) / scale;
    const clampedX = Math.max(viewMinX, Math.min(rawPos.x, viewMaxX));

    vanishingPoints[draggedVPIndex] = { x: clampedX, y: horizonLineY };
    redrawAll();
    return;
  }

  const activeLayer = layers.find(l => l.id === activeLayerId);
  if (!activeLayer) return;

  const drawCtx = activeLayer.ctx;

  // SKEW / DRAG existing shape
  if (draggedHandle && originalShapeState && selectedShapeId !== null) {
    const shape = shapes.find((s) => s.id === selectedShapeId);
    if (shape && shape.type !== 'text') {
      let handleMap: Record<string, number> = {};
      if (shape.type === 'rectangle' || shape.type === 'circle') {
        handleMap = { tl: 0, tr: 1, br: 2, bl: 3 };
      } else if (shape.type === 'french-curve') {
        handleMap = { start: 0, c1: 1, c2: 2, end: 3 };
      }
      const pointIndex = handleMap[draggedHandle];
      if (pointIndex !== undefined) {
        shape.points[pointIndex] = pos;
      }
      redrawAll();
    }
  } else if (isDraggingShape && originalShapeState && selectedShapeId !== null) {
    const shape = shapes.find((s) => s.id === selectedShapeId);
    if (shape) {
      const dx = pos.x - dragStartPoint!.x;
      const dy = pos.y - dragStartPoint!.y;
      const originalPoints = (originalShapeState as Shape).points;
      shape.points = originalPoints.map((p) => ({
        x: p.x + dx,
        y: p.y + dy,
      }));
      redrawAll();
    }
  } else if (currentTool === 'sketch' || currentTool === 'eraser') {
    if (!lastPoint || !lastMidPoint) return;

    drawCtx.globalCompositeOperation =
      currentTool === 'eraser' ? 'destination-out' : 'source-over';
    drawCtx.strokeStyle = colorPicker.value;
    drawCtx.lineWidth = parseFloat(brushSizeSlider.value);
    drawCtx.lineCap = 'round';
    drawCtx.lineJoin = 'round';

    const midPoint = {
      x: (lastPoint.x + pos.x) / 2,
      y: (lastPoint.y + pos.y) / 2,
    };
    drawCtx.beginPath();
    drawCtx.moveTo(lastMidPoint.x, lastMidPoint.y);
    drawCurve(drawCtx, lastMidPoint, lastPoint, midPoint);
    drawCtx.stroke();

    lastPoint = pos;
    lastMidPoint = midPoint;
    redrawAll(); // Redraw main canvas to show update
  } else if (currentTool === 'line' && lineStartPoint) {
    if (perspectiveMode !== 'none') {
        pos = getLineSnapToPerspective(lineStartPoint, pos);
    }
    redrawAll();
    if (!ctx) return;
    
    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);
    ctx.beginPath();
    ctx.moveTo(lineStartPoint.x, lineStartPoint.y);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = colorPicker.value;
    ctx.lineWidth = parseFloat(brushSizeSlider.value);
    if (lineStyle === 'hidden') {
      ctx.setLineDash([10, 10]);
    } else {
      ctx.setLineDash([]);
    }
    ctx.stroke();
    ctx.restore();
  } else if (isDrawingShape && shapeStartPoint) {
    redrawAll();
    if (!ctx) return;

    ctx.save();
    ctx.translate(offsetX, offsetY);
    ctx.scale(scale, scale);
    
    let endPoint = { ...pos };
    if (['rectangle', 'circle'].includes(currentTool) && isShiftDown) {
        const dx = Math.abs(pos.x - shapeStartPoint.x);
        const dy = Math.abs(pos.y - shapeStartPoint.y);
        const size = Math.max(dx, dy);
        endPoint.x = shapeStartPoint.x + (size * Math.sign(pos.x - shapeStartPoint.x));
        endPoint.y = shapeStartPoint.y + (size * Math.sign(pos.y - shapeStartPoint.y));
    }

    if (currentTool === 'rectangle' || currentTool === 'circle') {
        const x = Math.min(shapeStartPoint.x, endPoint.x);
        const y = Math.min(shapeStartPoint.y, endPoint.y);
        const width = Math.abs(endPoint.x - shapeStartPoint.x);
        const height = Math.abs(endPoint.y - shapeStartPoint.y);
        const bounds = { x, y, w: width, h: height };
        
        ctx.strokeStyle = colorPicker.value;
        ctx.lineWidth = parseFloat(brushSizeSlider.value);
        if (lineStyle === 'hidden') ctx.setLineDash([10, 10]);

        ctx.beginPath();
        if (currentTool === 'rectangle') {
            ctx.rect(x, y, width, height);
        } else { // Circle
            ctx.ellipse(x + width/2, y + height/2, width/2, height/2, 0, 0, 2 * Math.PI);
        }
        ctx.closePath();
        
        if (isFillEnabled) {
            applyFillStyle(ctx, bounds);
            ctx.fill();
        }
        ctx.stroke();

    } else if (currentTool === 'french-curve') {
        const start = shapeStartPoint;
        const end = pos;
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const c1 = { x: start.x + dx * 0.25, y: start.y + dy * 0.75 };
        const c2 = { x: start.x + dx * 0.75, y: start.y + dy * 0.25 };

        ctx.strokeStyle = colorPicker.value;
        ctx.lineWidth = parseFloat(brushSizeSlider.value);

        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, end.x, end.y);

        if (isFillEnabled) {
          ctx.closePath();
          const allX = [start.x, c1.x, c2.x, end.x];
          const allY = [start.y, c1.y, c2.y, end.y];
          const minX = Math.min(...allX);
          const minY = Math.min(...allY);
          const maxX = Math.max(...allX);
          const maxY = Math.max(...allY);
          const bounds = { x: minX, y: minY, w: maxX - minX, h: maxY - minY };
          applyFillStyle(ctx, bounds);
          ctx.fill();
        }
        ctx.stroke();
    }
    
    ctx.restore();
  }
}

/**
 * Handles the end of a drawing action (mouseup, mouseleave, touchend).
 */
function stopDrawing(e: MouseEvent | TouchEvent) {
  const activeLayer = layers.find(l => l.id === activeLayerId);
  if (activeLayer) {
    activeLayer.ctx.restore();
  }
  
  if (isPanning) {
    isPanning = false;
    beforeImageContainer.classList.remove('panning');
     if (currentTool === 'pan') {
      beforeCanvas.style.cursor = 'grab';
    }
  }

  if (!isDrawing) return;
  isDrawing = false;
  
  if (draggedVPIndex !== null) {
    draggedVPIndex = null;
    saveHistoryState(); // Save state after moving a VP
  }

  if (draggedHandle || isDraggingShape) {
    saveHistoryState(); // Save state after transforming a shape
  }
  
  if (!activeLayer) return;
  
  const drawCtx = activeLayer.ctx;

  let rawPos = getCoords(e);
  let pos = getSnappedCoords(rawPos);

  // Finalize NEW shape drawing
  if (isDrawingShape && shapeStartPoint) {
    redrawAll(); 

    const dist = distance(shapeStartPoint, pos);

    if (dist > 5) {
      let newShape: Shape | null = null;

      const commonShapeProps = {
        layerId: activeLayer.id,
        strokeWidth: parseFloat(brushSizeSlider.value),
        strokeColor: colorPicker.value,
        isFilled: isFillEnabled,
        fillType: fillType,
        fillColor: fillColorPicker.value,
        gradientColor1: gradientColor1,
        gradientColor2: gradientColor2,
        patternName: selectedPatternImage
          ? Object.entries(patternImages).find(
              ([, img]) => img === selectedPatternImage,
            )?.[0] || null
          : null,
      };

      if (currentTool === 'rectangle' || currentTool === 'circle') {
        let endX = pos.x;
        let endY = pos.y;
        if (isShiftDown) {
          const dx = Math.abs(endX - shapeStartPoint.x);
          const dy = Math.abs(endY - shapeStartPoint.y);
          const size = Math.max(dx, dy);
          endX = shapeStartPoint.x + (size * Math.sign(endX - shapeStartPoint.x));
          endY = shapeStartPoint.y + (size * Math.sign(endY - shapeStartPoint.y));
        }

        const startX = Math.min(shapeStartPoint.x, endX);
        const startY = Math.min(shapeStartPoint.y, endY);
        const finalWidth = Math.abs(endX - shapeStartPoint.x);
        const finalHeight = Math.abs(endY - shapeStartPoint.y);

        newShape = {
          id: nextShapeId++,
          type: currentTool,
          points: [
            { x: startX, y: startY }, // tl
            { x: startX + finalWidth, y: startY }, // tr
            { x: startX + finalWidth, y: startY + finalHeight }, // br
            { x: startX, y: startY + finalHeight }, // bl
          ],
          ...commonShapeProps,
        };
      } else if (currentTool === 'french-curve') {
        const start = shapeStartPoint;
        const end = pos;
        const dx = end.x - start.x;
        const dy = end.y - start.y;
        const c1 = { x: start.x + dx * 0.25, y: start.y + dy * 0.75 };
        const c2 = { x: start.x + dx * 0.75, y: start.y + dy * 0.25 };
        newShape = {
          id: nextShapeId++,
          type: 'french-curve',
          points: [start, c1, c2, end],
          ...commonShapeProps,
        };
      }

      if (newShape) {
        shapes.push(newShape);
        selectedShapeId = newShape.id;
        selectTool('select');
        updateShapeContextToolsVisibility();
        saveHistoryState();
      }
    }

    shapeStartPoint = null;
    isDrawingShape = false;
    redrawAll();
  } else if (currentTool === 'sketch' || currentTool === 'eraser') {
    drawCtx.closePath();
    saveHistoryState();
  } else if (currentTool === 'line' && lineStartPoint) {
    if (perspectiveMode !== 'none') {
        pos = getLineSnapToPerspective(lineStartPoint, pos);
    }
    
    drawCtx.beginPath();
    drawCtx.moveTo(lineStartPoint.x, lineStartPoint.y);
    drawCtx.lineTo(pos.x, pos.y);
    drawCtx.strokeStyle = colorPicker.value;
    drawCtx.lineWidth = parseFloat(brushSizeSlider.value);
    drawCtx.lineCap = 'round';
    if (lineStyle === 'hidden') {
      drawCtx.setLineDash([10, 10]);
    } else {
      drawCtx.setLineDash([]);
    }
    drawCtx.stroke();
    drawCtx.setLineDash([]); // Reset for other tools
    lineStartPoint = null;
    saveHistoryState();
    redrawAll();
  }

  // Reset all dragging states
  draggedHandle = null;
  isDraggingShape = false;
  dragStartPoint = null;
  originalShapeState = null;
}

/**
 * Handles file selection for import.
 * @param event The file input change event.
 */
function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;
  const file = target.files[0];
  loadFile(file);
}

/**
 * Handles file drop for import.
 * @param event The drag event.
 */
function handleFileDrop(event: DragEvent) {
  event.preventDefault();
  event.stopPropagation();
  beforeImageContainer.classList.remove('dragover');
  if (event.dataTransfer && event.dataTransfer.files.length > 0) {
    const file = event.dataTransfer.files[0];
    loadFile(file);
  }
}

/**
 * Loads a file (image or JSON session) and updates the canvas/state.
 * @param file The file to load.
 */
function loadFile(file: File) {
  const reader = new FileReader();
  if (file.type.startsWith('image/')) {
    reader.onload = (e) => {
      handleClearAll();
      const img = new Image();
      img.onload = () => {
        // Resize canvas to match image aspect ratio, fitting within the container
        const containerRect = beforeImageContainer.getBoundingClientRect();
        const containerAspectRatio = containerRect.width / containerRect.height;
        const imageAspectRatio = img.width / img.height;

        let newWidth, newHeight;
        if (imageAspectRatio > containerAspectRatio) {
          newWidth = containerRect.width;
          newHeight = containerRect.width / imageAspectRatio;
        } else {
          newHeight = containerRect.height;
          newWidth = containerRect.height * imageAspectRatio;
        }
        
        resizeAllCanvases(newWidth, newHeight);

        // Use the image as a background
        backgroundImageDisplay.src = e.target?.result as string;
        backgroundImageDisplay.classList.remove('hidden');
        beforeImagePlaceholder.classList.add('hidden');
        saveHistoryState();
        redrawAll(); // Redraw with the new size
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  } else if (file.type === 'application/json') {
    reader.onload = (e) => {
      try {
        const sessionData = JSON.parse(e.target?.result as string);
        // Add more validation for layer data later
        if (!sessionData.width || !sessionData.height) {
          throw new Error('Invalid session file format.');
        }
        handleClearAll(); // This creates a default layer
        
        resizeAllCanvases(sessionData.width, sessionData.height);

        // Load background image if it exists
        if (sessionData.background) {
          backgroundImageDisplay.src = sessionData.background;
          backgroundImageDisplay.classList.remove('hidden');
          beforeImagePlaceholder.classList.add('hidden');
        }

        const layerLoadPromises = (sessionData.layers || []).map((layerData: any) => {
            return new Promise<{ layer: Layer }>(resolve => {
                const newLayer = createLayer(layerData.name, layerData.id);
                newLayer.isVisible = layerData.isVisible;
                const img = new Image();
                img.onload = () => {
                    newLayer.ctx.drawImage(img, 0, 0);
                    resolve({ layer: newLayer });
                };
                img.src = layerData.dataURL;
            });
        });

        userPatterns = {};
        const patternLoadPromises: Promise<void>[] = [];
        if (sessionData.userPatterns) {
            for (const key in sessionData.userPatterns) {
                const dataURL = sessionData.userPatterns[key];
                userPatterns[key] = dataURL;
        
                const promise = new Promise<void>(resolve => {
                    const img = new Image();
                    img.onload = () => {
                        patternImages[key] = img;
                        resolve();
                    };
                    img.src = dataURL;
                });
                patternLoadPromises.push(promise);
            }
        }

        Promise.all([...layerLoadPromises, ...patternLoadPromises]).then((resolved) => {
            const loadedLayers = (resolved.filter(r => r && r.layer) as {layer: Layer}[]).map(r => r.layer);
            
            loadedLayers.sort((a, b) => {
                const indexA = sessionData.layers.findIndex((l:any) => l.id === a.id);
                const indexB = sessionData.layers.findIndex((l:any) => l.id === b.id);
                return indexA - indexB;
            });
            
            layers = loadedLayers.length > 0 ? loadedLayers : layers;
            shapes = sessionData.shapes || [];
            selectLayer(sessionData.activeLayerId || (layers.length > 0 ? layers[0].id : null));
            saveHistoryState();
            redrawAll();
        });
        
        // Load prompt
        if (sessionData.prompt) {
          promptInput.value = sessionData.prompt;
        }
      } catch (err) {
        console.error('Error loading session:', err);
        setError(
          err instanceof Error ? err.message : 'Could not load session file.',
        );
      }
    };
    reader.readAsText(file);
  } else {
    setError('Unsupported file type. Please use an image or a .json session file.');
  }
  // Reset the input so the same file can be loaded again
  importFileInput.value = '';
}

/**
 * Saves the current session state to a JSON file.
 */
async function saveSession() {
  if (!beforeCanvas || !ctx) return;
  commitAllShapes();
  try {
    const sessionData = {
      width: beforeCanvas.width,
      height: beforeCanvas.height,
      background:
        backgroundImageDisplay.src &&
        !backgroundImageDisplay.classList.contains('hidden')
          ? backgroundImageDisplay.src
          : null,
      layers: layers.map(layer => ({
        id: layer.id,
        name: layer.name,
        isVisible: layer.isVisible,
        dataURL: layer.canvas.toDataURL('image/png')
      })),
      shapes: shapes,
      userPatterns: userPatterns,
      activeLayerId: activeLayerId,
      prompt: promptInput.value,
    };
    const jsonString = JSON.stringify(sessionData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-visualiser-session-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('Failed to save session:', err);
    setError('Could not save the session file.');
  }
}

/**
 * Adds the generated image to the history panel.
 * @param dataUrl The data URL of the generated image with prompt.
 * @param originalUrl The data URL of the generated image without prompt.
 * @param prompt The prompt used to generate the image.
 */
function addImageToHistory(dataUrl: string, originalUrl: string, prompt: string) {
  // If history is full, show the modal instead of just adding
  if (imageHistory.length >= MAX_HISTORY_IMAGES) {
    saveHistoryModal.classList.remove('hidden');
    return;
  }

  // Add new entry to the start of the array
  imageHistory.unshift({ dataUrl, originalUrl, prompt });
  renderImageHistory();
}

/**
 * Downloads all images in the history as a zip file.
 */
async function downloadHistory() {
  if (imageHistory.length === 0) return;
  const zip = new JSZip();
  let counter = 1;
  for (const entry of imageHistory) {
    // Download original image (without prompt)
    const response = await fetch(entry.originalUrl);
    const blob = await response.blob();
    const filename = `generated_${counter++}.png`;
    zip.file(filename, blob);
    const promptFilename = `generated_${counter - 1}_prompt.txt`;
    zip.file(promptFilename, entry.prompt);
  }
  const content = await zip.generateAsync({ type: 'blob' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(content);
  link.download = 'ai_visualiser_history.zip';
  link.click();
  URL.revokeObjectURL(link.href);

  // Clear history after saving
  imageHistory = [];
  renderImageHistory();
}

/**
 * Generates a prompt variation using the Gemini API.
 */
async function generatePromptVariations() {
  const coreIdea = promptIdeaInput.value.trim();
  if (!coreIdea) {
    promptVariationsPlaceholder.textContent =
      'Please enter a core idea first.';
    return;
  }

  promptPanelLoader.classList.remove('hidden');
  promptVariationsList.innerHTML = '';
  promptVariationsPlaceholder.classList.add('hidden');

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate 5 detailed, creative, comma-separated prompts for an AI image generator based on the core idea: "${coreIdea}". The prompts should be suitable for generating architectural or interior design visualizations. Focus on lighting, materials, style, and mood.`,
    });

    const variationsText = response.text;
    const variations = variationsText
      .split(',')
      .map((p) => p.trim())
      .filter((p) => p.length > 0);

    promptVariationsList.innerHTML = ''; // Clear again in case of multiple clicks
    variations.forEach((variation) => {
      const li = document.createElement('li');
      li.className = 'prompt-variation-item';
      const p = document.createElement('p');
      p.textContent = variation;
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'actions';
      const useBtn = document.createElement('button');
      useBtn.className = 'btn-secondary use-variation-btn';
      useBtn.innerHTML = `<i class="fa-solid fa-arrow-up-from-bracket"></i> Use`;
      useBtn.onclick = () => {
        promptInput.value = variation;
        promptInput.focus();
        promptInput.dispatchEvent(new Event('input')); // Trigger grammar check
      };
      actionsDiv.appendChild(useBtn);
      li.appendChild(p);
      li.appendChild(actionsDiv);
      promptVariationsList.appendChild(li);
    });
  } catch (error) {
    console.error('Error generating prompt variations:', error);
    promptVariationsPlaceholder.textContent =
      'Sorry, there was an error generating ideas.';
    promptVariationsPlaceholder.classList.remove('hidden');
  } finally {
    promptPanelLoader.classList.add('hidden');
  }
}

/**
 * Checks the prompt for grammar and suggests corrections.
 */
async function checkGrammar() {
  const currentPrompt = promptInput.value.trim();
  if (
    !currentPrompt ||
    isCheckingGrammar ||
    currentPrompt === lastSuccessfulPrompt
  ) {
    grammarSuggestionContainer.classList.add('hidden');
    return;
  }

  isCheckingGrammar = true;

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Correct the grammar of the following text, keeping the meaning the same. Only return the corrected text, with no extra explanation or quotation marks: "${currentPrompt}"`,
    });
    const correctedPrompt = response.text.trim();

    if (
      correctedPrompt &&
      correctedPrompt.toLowerCase() !== currentPrompt.toLowerCase()
    ) {
      suggestionText.textContent = correctedPrompt;
      grammarSuggestionContainer.classList.remove('hidden');
    } else {
      grammarSuggestionContainer.classList.add('hidden');
    }
  } catch (error) {
    console.error('Grammar check failed:', error);
    grammarSuggestionContainer.classList.add('hidden');
  } finally {
    isCheckingGrammar = false;
  }
}

/**
 * Creates a composite image from the background and all visible layers.
 * @returns A Promise that resolves with a Blob of the composite image.
 */
function createCompositeImageBlob(): Promise<Blob> {
  return new Promise((resolve, reject) => {
    commitAllShapes();

    const compositeCanvas = document.createElement('canvas');
    const compositeCtx = compositeCanvas.getContext('2d');
    if (!compositeCtx) {
      return reject(new Error('Could not create composite canvas context.'));
    }

    compositeCanvas.width = beforeCanvas.width;
    compositeCanvas.height = beforeCanvas.height;

    compositeCtx.fillStyle = '#FFFFFF';
    compositeCtx.fillRect(0, 0, compositeCanvas.width, compositeCanvas.height);

    if (
      backgroundImageDisplay.src &&
      !backgroundImageDisplay.classList.contains('hidden')
    ) {
      compositeCtx.drawImage(
        backgroundImageDisplay,
        0,
        0,
        compositeCanvas.width,
        compositeCanvas.height,
      );
    }
    
    // Draw all visible layers in order
    layers.forEach(layer => {
      if (layer.isVisible) {
        compositeCtx.drawImage(layer.canvas, 0, 0);
      }
    });

    compositeCanvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to create blob from composite canvas.'));
      }
    }, 'image/png');
  });
}


/**
 * Converts a Blob to a Base64 encoded string.
 * @param blob The Blob to convert.
 * @returns A Promise that resolves with the Base64 string.
 */
function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        // The result includes the data URL prefix, which we need to remove.
        const base64String = reader.result.split(',')[1];
        resolve(base64String);
      } else {
        reject(new Error('Failed to read blob as Base64 string.'));
      }
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Calculates the lines and total height for wrapped text without drawing it.
 * @param context The canvas rendering context.
 * @param text The text to wrap.
 * @param maxWidth The maximum width for a line of text.
 * @param lineHeight The height of each line.
 * @returns An object containing the wrapped lines and the total height.
 */
function measureAndWrapText(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  lineHeight: number,
): { lines: string[]; totalHeight: number } {
  const words = text.split(' ');
  const lines: string[] = [];
  let currentLine = '';

  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine + words[i] + ' ';
    const metrics = context.measureText(testLine);
    if (metrics.width > maxWidth && i > 0) {
      lines.push(currentLine.trim());
      currentLine = words[i] + ' ';
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine.trim());

  return { lines, totalHeight: lines.length * lineHeight };
}

/**
 * Draws pre-wrapped text onto the canvas.
 * @param context The canvas rendering context.
 * @param wrappedText An object containing the lines of text.
 * @param x The starting x coordinate.
 * @param y The starting y coordinate for the first line.
 * @param lineHeight The height of each line.
 */
function drawWrappedText(
  context: CanvasRenderingContext2D,
  wrappedText: { lines: string[] },
  x: number,
  y: number,
  lineHeight: number,
) {
  wrappedText.lines.forEach((line, index) => {
    context.fillText(line, x, y + index * lineHeight);
  });
}

/**
 * Renders the provided prompt text onto an image with an aesthetic overlay.
 * @param imageUrl The base64 data URL of the source image.
 * @param text The prompt text to add.
 * @returns A Promise that resolves with the new base64 data URL of the modified image.
 */
async function addTextToImage(
  imageUrl: string,
  text: string,
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return reject(
          new Error('Could not get canvas context for text rendering.'),
        );
      }

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      // --- Aesthetic Styling ---
      const baseFontSize = Math.max(14, Math.round(canvas.height / 55));
      const labelFontSize = baseFontSize * 0.75;
      const promptFontSize = baseFontSize;

      const padding = promptFontSize * 1.5;
      const labelMarginBottom = labelFontSize * 0.5;
      const maxWidth = canvas.width - padding * 2;
      const promptLineHeight = promptFontSize * 1.35;

      // --- Measure Prompt Text ---
      ctx.font = `400 ${promptFontSize}px Roboto, sans-serif`;
      const promptMetrics = measureAndWrapText(
        ctx,
        text,
        maxWidth,
        promptLineHeight,
      );

      // --- Calculate total height for the background ---
      const totalTextHeight =
        labelFontSize + labelMarginBottom + promptMetrics.totalHeight;
      const backgroundHeight = totalTextHeight + padding * 2;
      const backgroundYStart = canvas.height - backgroundHeight;

      // --- Draw Faded Gradient Background ---
      const gradient = ctx.createLinearGradient(
        0,
        backgroundYStart,
        0,
        canvas.height,
      );
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(0.2, 'rgba(0, 0, 0, 0.5)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.75)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, backgroundYStart, canvas.width, backgroundHeight);

      // --- Draw Text ---
      ctx.textBaseline = 'top';
      const textX = padding;
      let currentY = canvas.height - backgroundHeight + padding;

      // 1. Draw Label
      ctx.font = `700 ${labelFontSize}px Roboto, sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.fillText('PROMPT', textX, currentY);
      currentY += labelFontSize + labelMarginBottom;

      // 2. Draw Prompt
      ctx.font = `400 ${promptFontSize}px Roboto, sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
      drawWrappedText(ctx, promptMetrics, textX, currentY, promptLineHeight);

      resolve(canvas.toDataURL('image/png'));
    };
    img.onerror = () => {
      reject(new Error('Failed to load image for text rendering.'));
    };
    img.src = imageUrl;
  });
}

/**
 * Toggles the visibility of the prompt overlay on the generated image.
 */
function handleTogglePrompt() {
  if (!originalImageUrl || !imageUrlWithPrompt) return;

  isPromptVisible = !isPromptVisible;

  // The active image can be in the comparison slider or the main after-image element
  const comparisonContainer = document.getElementById('comparison-container');
  let afterImg: HTMLImageElement | null = afterImage; // Default to main image
  if (comparisonContainer) {
    afterImg = comparisonContainer.querySelector(
      '.comparison-after-image',
    ) as HTMLImageElement | null;
  }

  if (afterImg) {
    afterImg.src = isPromptVisible ? imageUrlWithPrompt : originalImageUrl;
  }

  // Update button text and icon
  if (isPromptVisible) {
    togglePromptBtn.innerHTML = `<i class="fa-solid fa-eye-slash"></i>`;
    togglePromptBtn.title = 'Hide prompt on image';
  } else {
    togglePromptBtn.innerHTML = `<i class="fa-solid fa-eye"></i>`;
    togglePromptBtn.title = 'Show prompt on image';
  }
}

/**
 * Main function to generate the image using the Gemini API.
 */
async function generateImage() {
  if (!beforeCanvas || !ctx) return;
  const prompt = promptInput.value.trim();
  if (!prompt) {
    setError('Please enter a prompt.');
    return;
  }

  setLoading(true);
  errorMessage.classList.add('hidden');
  outputContainer.classList.remove('error');
  generatedTabBtn.click();

  try {
    const compositeBlob = await createCompositeImageBlob();
    const base64Image = await blobToBase64(compositeBlob);

    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: 'image/png',
            },
          },
          { text: prompt },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const firstPart = response.candidates?.[0]?.content?.parts?.[0];
    if (firstPart && firstPart.inlineData) {
      const base64Result = firstPart.inlineData.data;
      const imageUrl = `data:image/png;base64,${base64Result}`;

      originalImageUrl = imageUrl;
      imageUrlWithPrompt = await addTextToImage(imageUrl, prompt);
      isPromptVisible = true;
      
      const beforeUrl = URL.createObjectURL(compositeBlob);
      lastCompositeImageUrl = beforeUrl;

      setupComparisonSlider(beforeUrl, imageUrlWithPrompt);
      lastSuccessfulPrompt = prompt;
      promptDisplayContainer.classList.remove('hidden');
      promptDisplayText.textContent = prompt;

      downloadSketchBtn.classList.remove('hidden');
      downloadImageBtn.classList.remove('hidden');
      togglePromptBtn.classList.remove('hidden');
      
      togglePromptBtn.innerHTML = `<i class="fa-solid fa-eye-slash"></i>`;
      togglePromptBtn.title = 'Hide prompt on image';

      // Add to history
      addImageToHistory(imageUrlWithPrompt, originalImageUrl, prompt);
    } else {
      throw new Error('No image data found in the API response.');
    }
  } catch (error: unknown) {
    console.error('Error generating image:', error);
    const message =
      error instanceof Error
        ? error.message
        : 'An unknown error occurred during image generation.';
    setError(`Generation Failed: ${message}`);
  } finally {
    setLoading(false);
  }
}

/**
 * Downloads the composite sketch image that was sent to the API.
 */
function downloadSketchImage() {
  if (!lastCompositeImageUrl) {
    setError('No sketch image available to download.');
    return;
  }
  const a = document.createElement('a');
  a.download = `sketch-${Date.now()}.png`;
  a.href = lastCompositeImageUrl;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

/**
 * Downloads the generated image, with or without the prompt overlay,
 * based on the current visibility state.
 */
function handleDownloadImage() {
  const imageUrl = isPromptVisible ? imageUrlWithPrompt : originalImageUrl;
  const filename = isPromptVisible
    ? `with-prompt-${Date.now()}.png`
    : `generated-image-${Date.now()}.png`;

  if (imageUrl) {
    const a = document.createElement('a');
    a.download = filename;
    a.href = imageUrl;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } else {
    setError('No image available to download.');
  }
}


/**
 * Opens the camera, streams video to the modal, and handles capture.
 */
async function startCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
  }

  try {
    // First, try for the environment camera
    cameraStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' },
    });
  } catch (err) {
    console.warn('Could not get environment camera, trying fallback:', err);
    try {
      // If the first attempt fails, try for any camera
      cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
    } catch (fallbackErr) {
      console.error('Error accessing any camera:', fallbackErr);
      let errorMessage = 'Could not access the camera. Please ensure you have given permission.';
      // Check for specific error types to give better feedback
      if (fallbackErr instanceof Error) {
        if (fallbackErr.name === 'NotFoundError' || fallbackErr.name === 'DevicesNotFoundError') {
          errorMessage = 'No camera could be found on your device.';
        } else if (fallbackErr.name === 'NotAllowedError' || fallbackErr.name === 'PermissionDeniedError') {
          errorMessage = 'Camera access was denied. Please check your browser settings.';
        }
      }
      setError(errorMessage);
      return; // Exit the function if no camera stream is available
    }
  }

  // If a stream was successfully obtained (from either attempt)
  cameraModal.classList.remove('hidden');
  cameraFeed.srcObject = cameraStream;
}


/**
 * Closes the camera modal and stops the video stream.
 */
function closeCamera() {
  if (cameraStream) {
    cameraStream.getTracks().forEach((track) => track.stop());
  }
  cameraStream = null;
  cameraModal.classList.add('hidden');
}

/**
 * Captures a frame from the camera feed and loads it as the background image.
 */
function captureImage() {
  const context = cameraCaptureCanvas.getContext('2d');
  if (!context || !cameraFeed) return;

  cameraCaptureCanvas.width = cameraFeed.videoWidth;
  cameraCaptureCanvas.height = cameraFeed.videoHeight;
  context.drawImage(
    cameraFeed,
    0,
    0,
    cameraCaptureCanvas.width,
    cameraCaptureCanvas.height,
  );

  const dataUrl = cameraCaptureCanvas.toDataURL('image/png');

  // Use the loadFile logic to handle setting the background
  fetch(dataUrl)
    .then((res) => res.blob())
    .then((blob) => {
      const file = new File([blob], 'camera-capture.png', { type: 'image/png' });
      loadFile(file);
    });

  closeCamera();
}

/**
 * Resizes all canvases (main, grid, perspective, and all layer canvases).
 * @param width The new width.
 * @param height The new height.
 */
function resizeAllCanvases(width: number, height: number) {
  [beforeCanvas, gridCanvas, perspectiveCanvas].forEach(c => {
    c.width = width;
    c.height = height;
  });
  layers.forEach(layer => {
    const imageData = layer.ctx.getImageData(0, 0, layer.canvas.width, layer.canvas.height);
    layer.canvas.width = width;
    layer.canvas.height = height;
    layer.ctx.putImageData(imageData, 0, 0);
  });
}

/**
 * Initializes the application, sets up canvases and event listeners.
 */
function init() {
  try {
    // --- DOM Element Lookups ---
    mainContainer = getElement('main-container');
    mainContentWrapper = getElement('main-content-wrapper');
    sidebarBackdrop = getElement('sidebar-backdrop');
    closePromptPanelBtn = getElement('close-prompt-panel-btn');
    sketchTabBtn = getElement('sketch-tab-btn');
    generatedTabBtn = getElement('generated-tab-btn');
    sketchContent = getElement('sketch-content');
    generatedContent = getElement('generated-content');
    beforeCanvas = getElement('before-canvas');
    gridCanvas = getElement('grid-canvas');
    perspectiveCanvas = getElement('perspective-canvas');
    afterImage = getElement('after-image');
    backgroundImageDisplay = getElement('background-image-display');
    beforeImagePlaceholder = getElement('before-image-placeholder');
    importFileInput = getElement('import-file-input');
    generateBtn = getElement('generate-btn');
    promptInput = getElement('prompt-input');
    loader = getElement('loader');
    errorMessage = getElement('error-message');
    outputContainer = getElement('output-container');
    downloadSketchBtn = getElement('download-sketch-btn');
    downloadImageBtn = getElement('download-image-btn');
    togglePromptBtn = getElement('toggle-prompt-btn');
    beforeImageContainer = getElement('before-image-container');
    colorPicker = getElement('color-picker');
    colorPickerLabel = getElement('color-picker-label');
    eraserBtn = getElement('eraser-btn');
    clearSketchBtn = getElement('clear-sketch-btn');
    clearAllBtn = getElement('clear-all-btn');
    importBtn = getElement('import-btn');
    eraserCursorPreview = getElement('eraser-cursor-preview');
    // New Toolbar elements
    selectToolBtn = getElement('select-tool-btn');
    panToolBtn = getElement('pan-tool-btn');
    activeShapeToolBtn = getElement('active-shape-tool');
    activeShapeToolIcon = getElement('active-shape-tool-icon');
    shapeToolOptions = getElement('shape-tool-options');
    //
    drawingToolGroup = getElement('drawing-tool-group');
    activeDrawingToolBtn = getElement('active-drawing-tool');
    activeDrawingToolIcon = getElement('active-drawing-tool-icon');
    drawingToolOptions = getElement('drawing-tool-options');
    sketchToolBtn = getElement('sketch-tool-btn');
    lineToolBtn = getElement('line-tool-btn');
    frenchCurveToolBtn = getElement('french-curve-tool-btn');
    rectToolBtn = getElement('rectangle-tool-btn');
    circleToolBtn = getElement('circle-tool-btn');
    textToolBtn = getElement('text-tool-btn');
    undoBtn = getElement('undo-btn');
    redoBtn = getElement('redo-btn');
    deleteShapeBtn = getElement('delete-shape-btn');
    shapeContextTools = getElement('shape-context-tools');
    flipHorizontalBtn = getElement('flip-horizontal-btn');
    flipVerticalBtn = getElement('flip-vertical-btn');
    brushSizeSlider = getElement('brush-size');
    brushSizeLabel = getElement('brush-size-label');
    brushOptions = getElement('brush-options');
    fillOptions = getElement('fill-options');
    fillToggleBtn = getElement('fill-toggle-btn');
    solidColorFillBtn = getElement('solid-color-fill-btn');
    fillColorPicker = getElement('fill-color-picker');
    fillColorPreview = getElement('fill-color-preview');
    patternUploadBtn = getElement('pattern-upload-btn');
    patternUploadInput = getElement('pattern-upload-input');
    linearGradientBtn = getElement('linear-gradient-btn');
    radialGradientBtn = getElement('radial-gradient-btn');
    gradientColorOptions = getElement('gradient-color-options');
    gradientColor1Picker = getElement('gradient-color-1');
    gradientColor1Label = getElement('gradient-color-1-label');
    gradientColor1Preview = getElement('gradient-color-1-preview');
    gradientColor2Picker = getElement('gradient-color-2');
    gradientColor2Label = getElement('gradient-color-2-label');
    gradientColor2Preview = getElement('gradient-color-2-preview');
    lineStyleOptions = getElement('line-style-options');
    textOptions = getElement('text-options');
    textColorLabel = getElement('text-color-label');
    fontFamilySelect = getElement('font-family-select');
    fontSizeInput = getElement('font-size-input');
    fontWeightBtn = getElement('font-weight-btn');
    fontStyleBtn = getElement('font-style-btn');
    alignLeftBtn = getElement('align-left-btn');
    alignCenterBtn = getElement('align-center-btn');
    alignRightBtn = getElement('align-right-btn');
    solidLineBtn = getElement('solid-line-btn');
    hiddenLineBtn = getElement('hidden-line-btn');
    resetViewBtn = getElement('reset-view-btn');
    snapToolGroup = getElement('snap-tool-group');
    snapToggleBtn = getElement('snap-toggle-btn');
    snapOptions = getElement('snap-options');
    snapToGridBtn = getElement('snap-to-grid-btn');
    snapToObjectsBtn = getElement('snap-to-objects-btn');
    perspectiveToolGroup = getElement('perspective-tool-group');
    activePerspectiveTool = getElement('active-perspective-tool');
    perspectiveToolOptions = getElement('perspective-tool-options');
    onePointToolBtn = getElement('one-point-tool-btn');
    twoPointToolBtn = getElement('two-point-tool-btn');
    toggleGuidesBtn = getElement('toggle-guides-btn');
    clearPerspectiveBtn = getElement('clear-perspective-btn');
    perspectiveSetupMessage = getElement('perspective-setup-message');
    vanishingLineSlider = getElement('vanishing-line-slider');
    vanishingLineCountLabel = getElement('vanishing-line-count-label');
    vanishingAngleSlider = getElement('vanishing-angle-slider');
    vanishingAngleLabel = getElement('vanishing-angle-label');
    grammarSuggestionContainer = getElement('grammar-suggestion-container');
    suggestionText = getElement('suggestion-text');
    acceptSuggestionBtn = getElement('accept-suggestion-btn');
    rejectSuggestionBtn = getElement('reject-suggestion-btn');
    promptDisplayContainer = getElement('prompt-display-container');
    promptDisplayText = getElement('prompt-display-text');
    reusePromptBtn = getElement('reuse-prompt-btn');
    savePromptBtn = getElement('save-prompt-btn');
    downloadPromptsBtn = getElement('download-prompts-btn');
    savedPromptsPanel = getElement('saved-prompts-panel');
    savedPromptsList = getElement('saved-prompts-list');
    savedPromptsToggle = getElement('saved-prompts-toggle');
    noSavedPromptsMessage = getElement('no-saved-prompts-message');
    togglePromptPanelBtn = getElement('toggle-prompt-panel-btn');
    promptIdeaInput = getElement('prompt-idea-input');
    generateVariationsBtn = getElement('generate-variations-btn');
    promptVariationsList = getElement('prompt-variations-list');
    promptVariationsPlaceholder = getElement('prompt-variations-placeholder');
    promptPanelLoader = getElement('prompt-panel-loader');
    saveSessionBtn = getElement('save-session-btn');
    historyPanel = getElement('history-panel');
    historyList = getElement('history-list');
    noHistoryMessage = getElement('no-history-message');
    historyToggleBtn = getElement('history-toggle-btn');
    saveHistoryModal = getElement('save-history-modal');
    saveAllBtn = getElement('save-all-btn');
    dismissModalBtn = getElement('dismiss-modal-btn');
    cameraBtn = getElement('camera-btn');
    cameraModal = getElement('camera-modal');
    cameraFeed = getElement('camera-feed');
    cameraCaptureCanvas = getElement('camera-capture-canvas');
    captureBtn = getElement('capture-btn');
    closeCameraBtn = getElement('close-camera-btn');
    layersPanel = getElement('layers-panel');
    layersList = getElement('layers-list');
    addLayerBtn = getElement('add-layer-btn');
    deleteLayerBtn = getElement('delete-layer-btn');
    layersToggleBtn = getElement('layers-toggle-btn');


    // --- Canvas Setup ---
    ctx = beforeCanvas.getContext('2d', { willReadFrequently: true });
    perspectiveCtx = perspectiveCanvas.getContext('2d');
    if (!ctx || !perspectiveCtx) {
      throw new Error('Could not get canvas contexts.');
    }

    // Use a flag to ensure the initial history state is saved only once
    let isInitialized = false;

    // Set canvas size using ResizeObserver to avoid race conditions with DOM layout.
    // This ensures the canvas has a non-zero size before we try to get its image data.
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;

        // A non-zero size is required for canvas operations.
        if (width > 0 && height > 0) {
          // Check if a background image is setting the canvas dimensions.
          const hasBackgroundImage =
            !backgroundImageDisplay.classList.contains('hidden');

          if (!hasBackgroundImage) {
            resizeAllCanvases(width, height);
            redrawAll();
          }

          if (!isInitialized) {
            addNewLayer('Layer 1');
            saveHistoryState();
            isInitialized = true;
          }
        }
      }
    });
    resizeObserver.observe(beforeImageContainer);

    // --- Event Listeners ---
    // Drawing
    beforeCanvas.addEventListener('mousedown', startDrawing);
    beforeCanvas.addEventListener('mousemove', draw);
    beforeCanvas.addEventListener('mouseup', stopDrawing);
    beforeCanvas.addEventListener('mouseleave', stopDrawing);
    beforeCanvas.addEventListener('touchstart', startDrawing, {
      passive: false,
    });
    beforeCanvas.addEventListener('touchmove', draw, { passive: false });
    beforeCanvas.addEventListener('touchend', stopDrawing);
    beforeCanvas.addEventListener('dblclick', handleDoubleClick);


    // Custom cursor visibility
    beforeImageContainer.addEventListener('mouseenter', () => {
        if (currentTool === 'eraser') {
            eraserCursorPreview.classList.remove('hidden');
        }
    });
    beforeImageContainer.addEventListener('mouseleave', () => {
        eraserCursorPreview.classList.add('hidden');
    });

    // Main Actions
    generateBtn.addEventListener('click', generateImage);
    promptInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        generateImage();
      }
    });
    downloadSketchBtn.addEventListener('click', downloadSketchImage);
    downloadImageBtn.addEventListener('click', handleDownloadImage);
    togglePromptBtn.addEventListener('click', handleTogglePrompt);
    importBtn.addEventListener('click', () => importFileInput.click());
    importFileInput.addEventListener('change', handleFileSelect);
    saveSessionBtn.addEventListener('click', saveSession);

    // Drag and Drop
    beforeImageContainer.addEventListener('dragover', (e) => {
      e.preventDefault();
      e.stopPropagation();
      beforeImageContainer.classList.add('dragover');
    });
    beforeImageContainer.addEventListener('dragleave', (e) => {
      e.preventDefault();
      e.stopPropagation();
      beforeImageContainer.classList.remove('dragover');
    });
    beforeImageContainer.addEventListener('drop', handleFileDrop);

    // Tool Selection
    selectToolBtn.addEventListener('click', () => selectTool('select'));
    panToolBtn.addEventListener('click', () => selectTool('pan'));
    sketchToolBtn.addEventListener('click', () => selectTool('sketch'));
    lineToolBtn.addEventListener('click', () => selectTool('line'));
    frenchCurveToolBtn.addEventListener('click', () =>
      selectTool('french-curve'),
    );
    rectToolBtn.addEventListener('click', () => selectTool('rectangle'));
    circleToolBtn.addEventListener('click', () => selectTool('circle'));
    textToolBtn.addEventListener('click', () => selectTool('text'));
    eraserBtn.addEventListener('click', () => selectTool('eraser'));
    clearSketchBtn.addEventListener('click', handleClearSketch);
    clearAllBtn.addEventListener('click', handleClearAll);
    undoBtn.addEventListener('click', handleUndo);
    redoBtn.addEventListener('click', handleRedo);
    deleteShapeBtn.addEventListener('click', handleDeleteSelectedShape);
    flipHorizontalBtn.addEventListener('click', () => handleFlip('horizontal'));
    flipVerticalBtn.addEventListener('click', () => handleFlip('vertical'));


    // Perspective Tools
    onePointToolBtn.addEventListener('click', () => startPerspectiveSetup('1-point'));
    twoPointToolBtn.addEventListener('click', () => startPerspectiveSetup('2-point'));
    toggleGuidesBtn.addEventListener('click', togglePerspectiveGuides);
    clearPerspectiveBtn.addEventListener('click', clearPerspective);
    vanishingLineSlider.addEventListener('input', () => {
      vanishingLineCount = parseInt(vanishingLineSlider.value, 10);
      vanishingLineCountLabel.textContent = String(vanishingLineCount);
      redrawAll();
    });
    vanishingAngleSlider.addEventListener('input', () => {
      vanishingLineSpread = parseFloat(vanishingAngleSlider.value);
      vanishingAngleLabel.textContent = vanishingLineSpread.toFixed(1);
      redrawAll();
    });


    // Dropdown Toggles
    activeDrawingToolBtn.addEventListener('click', () =>
      drawingToolOptions.classList.toggle('hidden'),
    );
     activeShapeToolBtn.addEventListener('click', () =>
      shapeToolOptions.classList.toggle('hidden'),
    );
    snapToggleBtn.addEventListener('click', () =>
      snapOptions.classList.toggle('hidden'),
    );
    activePerspectiveTool.addEventListener('click', () =>
        perspectiveToolOptions.classList.toggle('hidden'),
    );


    document.addEventListener('click', (e) => {
      if (
        !drawingToolGroup.contains(e.target as Node) &&
        !drawingToolOptions.classList.contains('hidden')
      ) {
        drawingToolOptions.classList.add('hidden');
      }
       if (
        !shapeToolOptions.parentElement!.contains(e.target as Node) &&
        !shapeToolOptions.classList.contains('hidden')
      ) {
        shapeToolOptions.classList.add('hidden');
      }
      if (
        !snapToolGroup.contains(e.target as Node) &&
        !snapOptions.classList.contains('hidden')
      ) {
        snapOptions.classList.add('hidden');
      }
      if (
        !perspectiveToolGroup.contains(e.target as Node) &&
        !perspectiveToolOptions.classList.contains('hidden')
      ) {
        perspectiveToolOptions.classList.add('hidden');
      }
    });

    // Tool Option Controls
    brushSizeSlider.addEventListener('input', () => {
      const value = brushSizeSlider.value;
      brushSizeLabel.textContent = value;
      if (currentTool === 'eraser') {
        updateEraserCursor();
      }
      if (selectedShapeId !== null) {
        const shape = shapes.find((s) => s.id === selectedShapeId);
        if (shape) {
          shape.strokeWidth = parseFloat(value);
          saveHistoryState();
          redrawAll();
        }
      }
    });
    // Set initial color for picker label and update it on change
    colorPickerLabel.style.setProperty('--picker-color', colorPicker.value);
    colorPicker.addEventListener('input', () => {
      // Update the custom property on the label itself, not the whole document
      colorPickerLabel.style.setProperty('--picker-color', colorPicker.value);
      textColorLabel.style.setProperty('--picker-color', colorPicker.value);
      if (selectedShapeId !== null) {
        const shape = shapes.find((s) => s.id === selectedShapeId);
        if (shape) {
            shape.strokeColor = colorPicker.value;
            saveHistoryState();
            redrawAll();
        }
      }
    });

    // Fill controls
    const updateSelectedShapeFill = (props: Partial<Shape>) => {
      const selectedShape = shapes.find(s => s.id === selectedShapeId);
      if (selectedShape) {
          Object.assign(selectedShape, props);
          saveHistoryState();
          redrawAll();
      }
      updateToolOptions();
    };

    fillToggleBtn.addEventListener('click', () => {
      isFillEnabled = !isFillEnabled;
      updateSelectedShapeFill({ isFilled: isFillEnabled });
    });
    
    solidColorFillBtn.addEventListener('click', () => {
        fillType = 'solid';
        updateSelectedShapeFill({ fillType: 'solid' });
    });

    linearGradientBtn.addEventListener('click', () => {
        fillType = 'linear';
        updateSelectedShapeFill({ fillType: 'linear' });
    });

    radialGradientBtn.addEventListener('click', () => {
        fillType = 'radial';
        updateSelectedShapeFill({ fillType: 'radial' });
    });

    gradientColor1Picker.addEventListener('input', () => {
      gradientColor1 = gradientColor1Picker.value;
      gradientColor1Preview.style.setProperty('--gradient-color-1', gradientColor1);
      updateSelectedShapeFill({ gradientColor1: gradientColor1 });
    });
    gradientColor1Preview.style.setProperty('--gradient-color-1', gradientColor1Picker.value);

    gradientColor2Picker.addEventListener('input', () => {
        gradientColor2 = gradientColor2Picker.value;
        gradientColor2Preview.style.setProperty('--gradient-color-2', gradientColor2);
        updateSelectedShapeFill({ gradientColor2: gradientColor2 });
    });
    gradientColor2Preview.style.setProperty('--gradient-color-2', gradientColor2Picker.value);

    patternUploadBtn.addEventListener('click', () => patternUploadInput.click());
    patternUploadInput.addEventListener('change', (e) => {
      const target = e.target as HTMLInputElement;
      if (!target.files || target.files.length === 0) return;
      const file = target.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const dataURL = event.target?.result as string;
          const img = new Image();
          img.onload = () => {
            const patternKey = `user-pattern-${Date.now()}`;
            patternImages[patternKey] = img;
            userPatterns[patternKey] = dataURL;
            selectedPatternImage = img;
            fillType = 'pattern';
            isFillEnabled = true;
            updateSelectedShapeFill({
              isFilled: true,
              fillType: 'pattern',
              patternName: patternKey,
            });
          };
          img.src = dataURL;
        };
        reader.readAsDataURL(file);
      }
      target.value = ''; // Reset for same file upload
    });

    // Set initial color for fill picker and update it on change
    fillColorPreview.style.setProperty('--fill-color', fillColorPicker.value);
    fillColorPicker.addEventListener('input', () => {
        fillColorPreview.style.setProperty('--fill-color', fillColorPicker.value);
        fillType = 'solid';
        updateSelectedShapeFill({
          fillColor: fillColorPicker.value,
          fillType: 'solid'
        });
    });
    
    // Text controls
    const updateSelectedTextShape = (props: Partial<Shape>) => {
        if (selectedShapeId === null) return;
        const shape = shapes.find(s => s.id === selectedShapeId);
        if (shape && shape.type === 'text') {
            Object.assign(shape, props);
            saveHistoryState();
            redrawAll();
        }
    };
    textColorLabel.addEventListener('click', () => colorPicker.click());
    fontFamilySelect.addEventListener('change', () => updateSelectedTextShape({ fontFamily: fontFamilySelect.value }));
    fontSizeInput.addEventListener('input', () => updateSelectedTextShape({ fontSize: parseInt(fontSizeInput.value, 10) || 16 }));
    fontWeightBtn.addEventListener('click', () => {
        fontWeightBtn.classList.toggle('active');
        updateSelectedTextShape({ fontWeight: fontWeightBtn.classList.contains('active') ? 'bold' : 'normal' });
    });
    fontStyleBtn.addEventListener('click', () => {
        fontStyleBtn.classList.toggle('active');
        updateSelectedTextShape({ fontStyle: fontStyleBtn.classList.contains('active') ? 'italic' : 'normal' });
    });
    alignLeftBtn.addEventListener('click', () => {
        alignLeftBtn.classList.add('active');
        alignCenterBtn.classList.remove('active');
        alignRightBtn.classList.remove('active');
        updateSelectedTextShape({ textAlign: 'left' });
    });
    alignCenterBtn.addEventListener('click', () => {
        alignLeftBtn.classList.remove('active');
        alignCenterBtn.classList.add('active');
        alignRightBtn.classList.remove('active');
        updateSelectedTextShape({ textAlign: 'center' });
    });
    alignRightBtn.addEventListener('click', () => {
        alignLeftBtn.classList.remove('active');
        alignCenterBtn.classList.remove('active');
        alignRightBtn.classList.add('active');
        updateSelectedTextShape({ textAlign: 'right' });
    });


    solidLineBtn.addEventListener('click', () => {
      lineStyle = 'solid';
      solidLineBtn.classList.add('active');
      hiddenLineBtn.classList.remove('active');
    });
    hiddenLineBtn.addEventListener('click', () => {
      lineStyle = 'hidden';
      hiddenLineBtn.classList.add('active');
      solidLineBtn.classList.remove('active');
    });

    // Tabs
    sketchTabBtn.addEventListener('click', () => {
      sketchTabBtn.classList.add('active');
      generatedTabBtn.classList.remove('active');
      sketchContent.classList.add('active');
      generatedContent.classList.remove('active');
    });
    generatedTabBtn.addEventListener('click', () => {
      sketchTabBtn.classList.remove('active');
      generatedTabBtn.classList.add('active');
      sketchContent.classList.remove('active');
      generatedContent.classList.add('active');
    });

    // Zoom and Pan
    /**
     * Zooms the view to a specific scale, centered on a given point.
     * @param newScale The target scale level.
     * @param pointX The x-coordinate of the zoom center in view (screen) space.
     * @param pointY The y-coordinate of the zoom center in view (screen) space.
     */
    const zoomAtPoint = (newScale: number, pointX: number, pointY: number) => {
      const clampedScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
      if (clampedScale === scale) return;

      const worldXBefore = (pointX - offsetX) / scale;
      const worldYBefore = (pointY - offsetY) / scale;

      offsetX = pointX - worldXBefore * clampedScale;
      offsetY = pointY - worldYBefore * clampedScale;
      scale = clampedScale;
      
      if (currentTool === 'eraser') {
        updateEraserCursor();
      }
      redrawAll();
    };

    resetViewBtn.addEventListener('click', handleResetView);

    // Snap Controls
    snapToGridBtn.addEventListener('click', (e) => {
      snapToGrid = !snapToGrid;
      (e.currentTarget as HTMLButtonElement).classList.toggle('active', snapToGrid);
      redrawAll();
    });
    snapToObjectsBtn.addEventListener('click', (e) => {
      snapToObjects = !snapToObjects;
      (e.currentTarget as HTMLButtonElement).classList.toggle('active', snapToObjects);
    });

    beforeImageContainer.addEventListener('wheel', (e) => {
      e.preventDefault();
      const rect = beforeImageContainer.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const delta = e.deltaY > 0 ? -1 : 1;
      const zoomFactor = 1.1;
      const newScale = delta > 0 ? scale * zoomFactor : scale / zoomFactor;

      zoomAtPoint(newScale, mouseX, mouseY);
    }, { passive: false });
    
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Control') isCtrlDown = true;
      if (e.key === 'Shift') {
        isShiftDown = true;
      }

      const activeElement = document.activeElement;
      const isTyping =
        activeElement &&
        (activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          (activeElement as HTMLElement).isContentEditable) &&
          activeElement !== textEditor; // Exclude our on-canvas editor

      // Handle Spacebar for panning (should not work when typing)
      if (e.code === 'Space' && !isSpacebarDown && !isTyping && !textEditor) {
        isSpacebarDown = true;
        e.preventDefault();
        beforeCanvas.style.cursor = 'grab';
      }
      
      // --- Shortcuts with Ctrl/Cmd modifier ---
      if (e.metaKey || e.ctrlKey) {
        switch (e.key.toLowerCase()) {
          case 's':
            e.preventDefault();
            saveSession();
            return;
          case 'o':
            e.preventDefault();
            importBtn.click();
            return;
          case 'c':
            if (isTyping) return; // Allow native copy in text fields
            e.preventDefault();
            handleCopy();
            return;
          case 'v':
            if (isTyping) return; // Allow native paste in text fields
            e.preventDefault();
            handlePaste();
            return;
          case 'z':
            if (isTyping) return; // Allow native undo in text fields
            e.preventDefault();
            if (e.shiftKey) { // For Ctrl+Shift+Z redo
              handleRedo();
            } else {
              handleUndo();
            }
            return;
          case 'y': // Standard redo on Windows
            if (isTyping) return; // Allow native redo in text fields
            e.preventDefault();
            handleRedo();
            return;
          case '+':
          case '=':
            e.preventDefault();
             {
              const rect = beforeImageContainer.getBoundingClientRect();
              zoomAtPoint(scale * 1.2, rect.width / 2, rect.height / 2);
            }
            return;
          case '-':
            e.preventDefault();
            {
                const rect = beforeImageContainer.getBoundingClientRect();
                zoomAtPoint(scale / 1.2, rect.width / 2, rect.height / 2);
            }
            return;
          case '0':
            e.preventDefault();
            resetViewBtn.click();
            return;
        }
      }

      // --- Shortcuts that should NOT work when typing ---
      if (isTyping || textEditor) {
        return;
      }
      
      switch (e.key.toLowerCase()) {
        // Tool selection shortcuts
        case 's': selectTool('select'); break;
        case 'h': selectTool('pan'); break;
        case 'b': selectTool('sketch'); break;
        case 'l': selectTool('line'); break;
        case 'v': selectTool('french-curve'); break;
        case 'r': selectTool('rectangle'); break;
        case 'c': selectTool('circle'); break;
        case 'e': selectTool('eraser'); break;
        case 't': selectTool('text'); break;
        
        // Shape/Action shortcuts
        case 'delete':
        case 'backspace':
          if (selectedShapeId !== null) {
            e.preventDefault(); // Prevent browser back navigation
            handleDeleteSelectedShape();
          }
          break;
        case 'escape':
          if (perspectiveSetupState.isActive) {
            perspectiveSetupState.isActive = false;
            updatePerspectiveMessage();
            redrawAll();
          } else if (isDrawingShape) {
            cancelShapeDrawing();
          }
          break;
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'Control') isCtrlDown = false;
      if (e.key === 'Shift') {
        isShiftDown = false;
      }
      if (e.code === 'Space') {
        isSpacebarDown = false;
        if (!isPanning && currentTool !== 'pan') {
           beforeCanvas.style.cursor = 'default';
        }
      }
    });

    // Grammar check
    let grammarTimeout: number;
    promptInput.addEventListener('input', () => {
      clearTimeout(grammarTimeout);
      grammarSuggestionContainer.classList.add('hidden');
      grammarTimeout = window.setTimeout(checkGrammar, 1000);
    });
    acceptSuggestionBtn.addEventListener('click', () => {
      promptInput.value = suggestionText.textContent || '';
      lastSuccessfulPrompt = promptInput.value;
      grammarSuggestionContainer.classList.add('hidden');
      promptInput.focus();
    });
    rejectSuggestionBtn.addEventListener('click', () => {
      grammarSuggestionContainer.classList.add('hidden');
    });

    // Reuse prompt
    reusePromptBtn.addEventListener('click', () => {
      promptInput.value = promptDisplayText.textContent || '';
      promptInput.focus();
      promptInput.dispatchEvent(new Event('input')); // Trigger grammar check
    });

    // Saved Prompts Panel
    savePromptBtn.addEventListener('click', handleSaveCurrentPrompt);
    downloadPromptsBtn.addEventListener('click', handleDownloadPrompts);
    savedPromptsToggle.addEventListener('click', () => {
      savedPromptsPanel.classList.toggle('closed');
    });
    // Add event listener to the list for delegation
    savedPromptsList.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const useBtn = target.closest('.use-prompt-btn');
      const deleteBtn = target.closest('.delete-prompt-btn');
      const item = target.closest('.saved-prompt-item');
      if (!item) return;
      const promptText = (
        item.querySelector('.prompt-text') as HTMLParagraphElement
      )?.textContent;
      if (!promptText) return;
      if (useBtn) {
        promptInput.value = promptText;
        savedPromptsPanel.classList.add('closed');
      } else if (deleteBtn) {
        savedPrompts = savedPrompts.filter((p) => p !== promptText);
        savePromptsToStorage();
        renderSavedPrompts();
      }
    });

    // Prompt Ideation Panel
    togglePromptPanelBtn.addEventListener('click', () => {
      document.body.classList.toggle('prompt-panel-open');
      mainContainer.classList.toggle('prompt-panel-visible');
    });
    closePromptPanelBtn.addEventListener('click', () => {
      document.body.classList.remove('prompt-panel-open');
      mainContainer.classList.remove('prompt-panel-visible');
    });
    sidebarBackdrop.addEventListener('click', () => {
      document.body.classList.remove('prompt-panel-open');
      mainContainer.classList.remove('prompt-panel-visible');
    });

    generateVariationsBtn.addEventListener('click', generatePromptVariations);
    
    // Panel Toggles
    layersToggleBtn.addEventListener('click', () => {
      mainContentWrapper.classList.toggle('layers-panel-collapsed');
      layersToggleBtn.classList.toggle('active', !mainContentWrapper.classList.contains('layers-panel-collapsed'));
    });
    historyToggleBtn.addEventListener('click', () => {
      mainContentWrapper.classList.toggle('history-panel-collapsed');
      historyToggleBtn.classList.toggle('active', !mainContentWrapper.classList.contains('history-panel-collapsed'));
    });

    // Image History
    historyList.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const historyItem = target.closest<HTMLElement>('.history-item');
      if (!historyItem) return;

      const index = parseInt(historyItem.dataset.index || '-1', 10);
      if (index < 0 || index >= imageHistory.length) return;

      const entry = imageHistory[index];

      const reuseBtn = target.closest('.reuse-history-btn');

      if (reuseBtn) {
        // Reuse the prompt from the history item
        promptInput.value = entry.prompt;
        promptInput.focus();
        // Trigger grammar check on the reused prompt
        promptInput.dispatchEvent(new Event('input'));
      } else {
        // Display the selected history image in the main view
        // Set global state so toggle/download can work from history
        originalImageUrl = entry.originalUrl;
        imageUrlWithPrompt = entry.dataUrl;
        isPromptVisible = true; // Default to showing prompt
        lastSuccessfulPrompt = entry.prompt; // Keep for context
        lastCompositeImageUrl = null; // No sketch to download from history

        removeComparisonSlider();
        afterImage.src = entry.dataUrl; // Show with prompt first
        afterImage.classList.remove('hidden');

        generatedTabBtn.click();

        promptDisplayText.textContent = entry.prompt;
        promptDisplayContainer.classList.remove('hidden');

        // Update download buttons for history view
        downloadSketchBtn.classList.add('hidden'); // No sketch for history
        downloadImageBtn.classList.remove('hidden');
        togglePromptBtn.classList.remove('hidden'); // Show toggle button

        // Set initial state of toggle button
        togglePromptBtn.innerHTML = `<i class="fa-solid fa-eye-slash"></i>`;
        togglePromptBtn.title = 'Hide prompt on image';
      }
    });

    // Save History Modal
    saveAllBtn.addEventListener('click', async () => {
      await downloadHistory();
      saveHistoryModal.classList.add('hidden');
    });
    dismissModalBtn.addEventListener('click', () => {
      saveHistoryModal.classList.add('hidden');
    });
    
    // Layers Panel
    addLayerBtn.addEventListener('click', () => {
        addNewLayer(`Layer ${layers.length + 1}`);
        saveHistoryState();
    });
    deleteLayerBtn.addEventListener('click', deleteActiveLayer);

    // Camera Modal
    cameraBtn.addEventListener('click', startCamera);
    closeCameraBtn.addEventListener('click', closeCamera);
    captureBtn.addEventListener('click', captureImage);

    // Initial State Setup
    loadPromptsFromStorage();
    renderSavedPrompts();
    selectTool('sketch');
    updateUndoRedoButtons();
    
    // Set initial label values from sliders
    brushSizeLabel.textContent = brushSizeSlider.value;
    vanishingLineCountLabel.textContent = vanishingLineSlider.value;
    vanishingAngleLabel.textContent = parseFloat(vanishingAngleSlider.value).toFixed(1);

  } catch (err) {
    // Graceful error handling for initialization failures.
    console.error('Application initialization failed:', err);
    document.body.innerHTML = `
      <div style="padding: 20px; text-align: center; color: #333; font-family: sans-serif;">
        <h1>Oops! Something went wrong.</h1>
        <p>There was a critical error initializing the application. Please check the console for details and try refreshing the page.</p>
        <pre style="text-align: left; background: #f0f0f0; padding: 10px; border-radius: 4px; white-space: pre-wrap; word-wrap: break-word; color: #c7254e;">${err instanceof Error ? err.stack : String(err)}</pre>
      </div>
    `;
  }
}

// --- Text Editor Management ---

/** Hides and cleans up the on-canvas text editor. */
function hideTextEditor() {
  if (!textEditor) return;

  const shape = shapes.find(s => s.id === selectedShapeId);
  if (shape && shape.type === 'text') {
    const newText = textEditor.value;
    if (shape.text !== newText) {
        shape.text = newText;
        saveHistoryState();
    }
  }

  textEditor.remove();
  textEditor = null;
  redrawAll(); // Redraw to show the text rendered on the canvas
}

/** Creates and displays a textarea on the canvas to edit a text shape. */
function showTextEditor(shape: Shape) {
  if (shape.type !== 'text' || activeLayerId !== shape.layerId) return;
  hideTextEditor(); // Ensure no other editor is open

  const [topLeft] = shape.points;
  
  // Create the editor element
  textEditor = document.createElement('textarea');
  textEditor.className = 'on-canvas-text-editor';
  textEditor.value = shape.text || '';
  
  const applyStyle = () => {
    if (!textEditor || !shape || shape.type !== 'text') return;
    // Convert world coords to view coords for positioning
    const viewX = topLeft.x * scale + offsetX;
    const viewY = topLeft.y * scale + offsetY;
    
    textEditor.style.position = 'absolute';
    textEditor.style.left = `${viewX}px`;
    textEditor.style.top = `${viewY}px`;
    textEditor.style.border = '1px dashed #0078ff';
    textEditor.style.background = 'rgba(255, 255, 255, 0.9)';
    textEditor.style.padding = '0';
    textEditor.style.margin = '0';
    textEditor.style.outline = 'none';
    textEditor.style.resize = 'none';
    textEditor.style.overflow = 'hidden';
    textEditor.style.whiteSpace = 'pre'; // Respect newlines
    
    // Apply text styles, scaled
    textEditor.style.fontFamily = shape.fontFamily || 'Roboto';
    textEditor.style.fontSize = `${(shape.fontSize || 16) * scale}px`;
    textEditor.style.lineHeight = `${(shape.fontSize || 16) * 1.2 * scale}px`;
    textEditor.style.fontWeight = shape.fontWeight || 'normal';
    textEditor.style.fontStyle = shape.fontStyle || 'normal';
    textEditor.style.textAlign = shape.textAlign || 'left';
    textEditor.style.color = shape.strokeColor;
    
    // Auto-resize
    textEditor.style.height = 'auto';
    textEditor.style.width = 'auto'; // Let it grow initially
    if (tempCtx) {
        tempCtx.font = textEditor.style.font;
        const metrics = tempCtx.measureText(shape.text || '');
        textEditor.style.width = `${metrics.width * scale + 20}px`;
    }
    textEditor.style.height = `${textEditor.scrollHeight}px`;
  };

  applyStyle();

  textEditor.addEventListener('input', () => {
    if (!textEditor) return;
    // Auto-resize textarea
    textEditor.style.height = 'auto';
    textEditor.style.height = `${textEditor.scrollHeight}px`;
  });

  textEditor.addEventListener('blur', hideTextEditor);

  beforeImageContainer.appendChild(textEditor);
  textEditor.focus();
  textEditor.select();

  redrawAll(); // Redraw to hide the canvas text while editing
}

/** Handles double-click events, primarily for editing text shapes. */
function handleDoubleClick(e: MouseEvent) {
    const pos = getCoords(e);
    
    // Iterate in reverse to find the top-most shape
    for (let i = shapes.length - 1; i >= 0; i--) {
        const shape = shapes[i];
        const layer = layers.find(l => l.id === shape.layerId);
        if (layer && layer.isVisible && shape.layerId === activeLayerId && isPointInShape(pos, shape)) {
            selectTool('select');
            selectedShapeId = shape.id;
            updateToolOptions();
            redrawAll();
            if (shape.type === 'text') {
                showTextEditor(shape);
                return; // Stop after finding the first shape
            }
            break; // A non-text shape was selected, stop searching.
        }
    }
}

// --- Layer Management ---
/**
 * Creates a new layer object but does not add it to the state.
 * @param name The name of the new layer.
 * @param id The id for the new layer (optional).
 */
function createLayer(name: string, id?: number): Layer {
  const canvas = document.createElement('canvas');
  canvas.width = beforeCanvas.width;
  canvas.height = beforeCanvas.height;
  const ctx = canvas.getContext('2d')!;
  return { id: id ?? nextLayerId++, name, isVisible: true, canvas, ctx };
}

/**
 * Creates and adds a new layer to the top of the stack.
 * @param name The name of the new layer.
 */
function addNewLayer(name: string) {
  const newLayer = createLayer(name);
  layers.unshift(newLayer); // Add to the top
  selectLayer(newLayer.id);
}

/**
 * Deletes the currently active layer.
 */
function deleteActiveLayer() {
  if (activeLayerId === null || layers.length <= 1) return;

  const layerIndex = layers.findIndex(l => l.id === activeLayerId);
  if (layerIndex === -1) return;

  // Remove the layer
  layers.splice(layerIndex, 1);
  // Remove shapes on that layer
  shapes = shapes.filter(s => s.layerId !== activeLayerId);

  // Select the layer below, or the new top layer
  const newLayerToSelect = layers[layerIndex] || layers[layers.length - 1];
  selectLayer(newLayerToSelect.id);
  
  saveHistoryState();
  redrawAll();
}

/**
 * Sets a layer as the active one for drawing.
 * @param id The ID of the layer to activate.
 */
function selectLayer(id: number | null) {
  activeLayerId = id;
  renderLayersPanel();
  deleteLayerBtn.disabled = layers.length <= 1;
}

/**
 * Renders the entire layers panel UI based on the current state.
 */
function renderLayersPanel() {
  layersList.innerHTML = '';
  // Render from top to bottom, which is the current `layers` array order
  layers.forEach(layer => {
    const li = document.createElement('li');
    li.className = 'layer-item';
    li.dataset.layerId = String(layer.id);
    li.draggable = true;
    if (layer.id === activeLayerId) {
      li.classList.add('active');
    }
    if (!layer.isVisible) {
      li.classList.add('hidden-layer');
    }

    const thumbnail = document.createElement('canvas');
    thumbnail.className = 'layer-thumbnail';
    thumbnail.width = 40;
    thumbnail.height = 40;
    const thumbCtx = thumbnail.getContext('2d')!;
    thumbCtx.fillStyle = 'white';
    thumbCtx.fillRect(0,0,40,40);
    thumbCtx.drawImage(layer.canvas, 0, 0, 40, 40);

    const nameSpan = document.createElement('span');
    nameSpan.className = 'layer-name';
    nameSpan.textContent = layer.name;
    nameSpan.contentEditable = "false";
    
    nameSpan.addEventListener('dblclick', () => {
        nameSpan.contentEditable = "true";
        nameSpan.focus();
        document.execCommand('selectAll', false, undefined);
    });
    nameSpan.addEventListener('blur', () => {
        nameSpan.contentEditable = "false";
        layer.name = nameSpan.textContent || 'Untitled';
        saveHistoryState();
    });
    nameSpan.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            nameSpan.blur();
        }
    });

    const controlsDiv = document.createElement('div');
    controlsDiv.className = 'layer-controls';
    const visibilityBtn = document.createElement('button');
    visibilityBtn.className = 'visibility-toggle';
    visibilityBtn.title = "Toggle Visibility";
    visibilityBtn.innerHTML = `<i class="fa-solid ${layer.isVisible ? 'fa-eye' : 'fa-eye-slash'}"></i>`;
    
    controlsDiv.appendChild(visibilityBtn);
    
    li.appendChild(thumbnail);
    li.appendChild(nameSpan);
    li.appendChild(controlsDiv);
    layersList.appendChild(li);
  });
}

// --- Layer Event Handling ---
function setupLayerEventListeners() {
    let draggedItem: HTMLElement | null = null;

    layersList.addEventListener('click', e => {
        const target = e.target as HTMLElement;
        const layerItem = target.closest<HTMLLIElement>('.layer-item');
        if (!layerItem) return;
        
        const layerId = parseInt(layerItem.dataset.layerId!);

        if (target.closest('.visibility-toggle')) {
            const layer = layers.find(l => l.id === layerId);
            if (layer) {
                layer.isVisible = !layer.isVisible;
                redrawAll();
                renderLayersPanel();
                saveHistoryState();
            }
        } else {
            selectLayer(layerId);
        }
    });
    
    layersList.addEventListener('dragstart', e => {
        draggedItem = e.target as HTMLLIElement;
        setTimeout(() => {
            if (draggedItem) draggedItem.classList.add('dragging');
        }, 0);
    });

    layersList.addEventListener('dragend', () => {
        if (draggedItem) {
            draggedItem.classList.remove('dragging');
            draggedItem = null;
            saveHistoryState();
            redrawAll();
        }
    });

    layersList.addEventListener('dragover', e => {
        e.preventDefault();
        const afterElement = getDragAfterElement(layersList, e.clientY);
        const dragging = document.querySelector('.dragging');
        if (dragging) {
            if (afterElement == null) {
                layersList.appendChild(dragging);
            } else {
                layersList.insertBefore(dragging, afterElement);
            }
        }
    });

    layersList.addEventListener('drop', e => {
        e.preventDefault();
        if (!draggedItem) return;
        const draggedId = parseInt(draggedItem!.dataset.layerId!);
        
        const newLayerElements = [...layersList.querySelectorAll<HTMLLIElement>('.layer-item')];
        const newLayers: Layer[] = [];
        newLayerElements.forEach(el => {
            const id = parseInt(el.dataset.layerId!);
            const layer = layers.find(l => l.id === id);
            if (layer) {
                newLayers.push(layer);
            }
        });
        layers = newLayers;
    });

    function getDragAfterElement(container: HTMLElement, y: number): HTMLElement | null {
        const draggableElements = [...container.querySelectorAll<HTMLElement>('.layer-item:not(.dragging)')];

        return draggableElements.reduce((closest: { offset: number, element: HTMLElement | null }, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY, element: null }).element;
    }
}

// --- Text Tool ---

/** Creates a new text object on the canvas at the given position. */
function createTextObject(pos: Point) {
    const activeLayer = layers.find(l => l.id === activeLayerId);
    if (!activeLayer) return;

    const newText: Shape = {
        id: nextShapeId++,
        layerId: activeLayer.id,
        type: 'text',
        points: [pos],
        text: 'Your Text Here',
        strokeColor: colorPicker.value,
        strokeWidth: 1, // Not used for rendering, but required by type
        isFilled: false,
        fillType: 'solid',
        fillColor: '#000000',
        gradientColor1: '#ffffff',
        gradientColor2: '#000000',
        patternName: null,
        fontFamily: fontFamilySelect.value,
        fontSize: parseInt(fontSizeInput.value, 10),
        fontWeight: fontWeightBtn.classList.contains('active') ? 'bold' : 'normal',
        fontStyle: fontStyleBtn.classList.contains('active') ? 'italic' : 'normal',
        textAlign: alignLeftBtn.classList.contains('active') ? 'left' : 
                   (alignCenterBtn.classList.contains('active') ? 'center' : 'right'),
    };
    shapes.push(newText);
    selectTool('select');
    selectedShapeId = newText.id;
    updateToolOptions();
    saveHistoryState();
    showTextEditor(newText); // Show editor immediately
}

/**
 * Handles the main initialization of the application after the DOM is loaded.
 */
document.addEventListener('DOMContentLoaded', () => {
  init();
  setupLayerEventListeners();
});