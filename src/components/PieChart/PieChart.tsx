import * as React from 'react';

// Services
import { Draw, Mathematic, Virtual } from '../../services';

// Constants
import { DRAG_POINT_RADIUS } from '../../fixtures/dragPoint';

// Helpers
import { sumItemsPercentage } from '../../helpers';

import './PieChart.css';

interface Props {
  dimensions: Dimensions;
  labelParts: LabelPart[];
  percentageShift?: number;
  items: Item[];
  onChange: (items: Item[]) => void;
}

export class PieChart extends React.Component<Props> {
  // Canvas ref
  private canvas?: HTMLCanvasElement;

  // Context does not exists before the canvas render
  private ctx?: CanvasRenderingContext2D | null = null;

  /**
   * All services instances are created after render, as they need context for proper usage
   */
  private draw?: Draw;
  private math?: Mathematic;
  private virtual?: Virtual;

  // Create servicees
  private onRef = (canvas: HTMLCanvasElement) => {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    const { radius } = this.props.dimensions;
    const { x, y } = this.center;

    // Responsibility: drawing an elements
    this.draw = new Draw({
      cx: x,
      cy: y,
      radius,
      ctx: this.ctx as CanvasRenderingContext2D
    }) as Draw;

    // Responsibility: difficult mathematical calculations
    this.math = new Mathematic({
      cx: x,
      cy: y,
      radius
    }) as Mathematic;

    // Responsibility: analyzing labels before the draw
    this.virtual = new Virtual({
      cx: x,
      cy: y,
      radius,
      ctx: this.ctx,
      math: this.math,
      labelsConfig: this.props.labelParts
    }) as Virtual;

    this.drawEverything();
  };

  // Center of a chart
  private get center() {
    const { width, height } = this.props.dimensions;

    return {
      x: width / 2,
      y: height / 2
    };
  }

  // Shift of a next sectors
  private percentageShift = this.props.percentageShift || 0;

  /**
   * DragPoints related data
   */
  /**
   * List of dragPoints is required, as based on them we are able to:
   * - change mouse cursot based on fact, if mouse is over current dragpoint
   * - find dragPoint, which will be immobile during the resizing
   *   (position of all dragpoints is calculated based on immobile dragpoint
   *    & percentageShift, which was on the drag start)
   *
   */
  private dragPoints: DragPoint[] = [];

  // Setting (mostly updating) dragpoint data
  private setDragPoint = (dragpoint: DragPoint, i: number) =>
    (this.dragPoints[i] = dragpoint);

  // Based on new data, update current DragPoint coordinates
  private getNewDragPointCoordinates = (
    item: Item,
    percentageShift: number
  ) => {
    const { radius } = this.props.dimensions;

    const x =
      this.center.x +
      radius * Math.cos((360 * percentageShift * Math.PI) / 180);

    const y =
      this.center.y +
      radius * Math.sin((360 * percentageShift * Math.PI) / 180);

    return { id: item.id, percentage: item.percentage, x, y };
  };

  /**
   * Here coomes the magic
   */
  private drawEverything = () => {
    const draw = this.draw as Draw;

    // Clear whole canvas
    draw.clear();

    // draw.pieChartBackground(this.props.items[0].color);

    // Draw all sectors (required for label calculations in a next step)
    this.props.items.forEach((item, i) => {
      draw.sector(item, this.percentageShift);

      // New iteration needs updaated shift for the correct calculations
      this.setNewPercentageShift(item, i);
    });

    /**
     * If developer would like to show labels, part of code below:
     * 1. Creating virtual labels
     *    Virtual labels are creating the final form of labels.
     *    They are not drawing it, but based on the fontSize, fontFamily,
     *    offsets and type of a label, they are counting & validating
     *    labels position, and returning updated data
     * 2. Drawing labels in a final, previously ^ validated form
     */
    if (this.props.labelParts) {
      const virtualLabels = this.props.items.map((item, i) => {
        // Calculate labels
        const virtualLabel = (this.virtual as Virtual).getVirtualLabels({
          items: this.props.items,
          percentageShift: this.percentageShift,
          draggingStatus: this.draggingStatus,
          immobileDragPoint: this.immobileDragPoint,
          item: item,
          itemIndex: i
        });

        this.setNewPercentageShift(item, i);

        return virtualLabel;
      });

      virtualLabels.forEach((virtualLabel: VirtualLabel) =>
        draw.label(virtualLabel)
      );
    }

    // Draw labels & dragpoints
    this.props.items.forEach((item, i) => {
      // Based on current percentage shift, update it's position
      const dragPoint = this.getNewDragPointCoordinates(
        item,
        this.percentageShift
      );

      draw.dragPoint(dragPoint);

      /**
       * We need to save percentageShift into a dragpoint, as setting
       * all the items positions during the dragging, are related to the
       * immobile dragPoint position.
       */
      this.setDragPoint(
        { ...dragPoint, percentageShift: this.percentageShift },
        i
      );

      this.setNewPercentageShift(item, i);
    });

    /**
     * Once drawEverything has been executed, it needs to be executed constantly,
     * as this is a guarantee of smooth PieChart workflow.
     */
    if (this.draggingStatus.enabled) {
      requestAnimationFrame(this.drawEverything);
    }
  };

  /**
   * Every new percentage of one element, means that other items will have also
   * different percentage - what also is linked to the new shift
   *
   * Method below, is calculating difference in shifts based on the immobile
   * dragPoint data
   */
  private setNewPercentageShift = (item: Item, itemIndex: number) =>
    (this.percentageShift = (this.math as Mathematic).getNewPercentageShift({
      items: this.props.items,
      item,
      itemIndex: itemIndex,
      draggingStatus: this.draggingStatus,
      immobileDragPoint: this.immobileDragPoint,
      percentageShift: this.percentageShift
    }));

  public render() {
    const { width, height } = this.props.dimensions;

    return (
      <canvas
        ref={this.onRef}
        width={width}
        height={height}
        onMouseMove={this.onMouseMove}
        onMouseDown={this.onMouseDown}
        onMouseUp={this.onMouseUp}
      />
    );
  }

  // Current dragging status store
  private draggingStatus: DraggingStatus = {
    enabled: false,
    id: null
  };

  private setDraggingStatus = ({ enabled, id }: DraggingStatus) =>
    (this.draggingStatus = { enabled, id });

  /**
   * Based on current dragPoints & current mouse position,
   * find the dragPoint user is reffering to
   */
  private findFocusedDragPoint = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const boundingClientRect = e.currentTarget.getBoundingClientRect();

    return this.dragPoints.find(dragPoint =>
      (this.math as Mathematic).isPointWithinCircle({
        centerX: dragPoint.x,
        centerY: dragPoint.y,
        r: DRAG_POINT_RADIUS,
        x: e.clientX - boundingClientRect.left,
        y: e.clientY - boundingClientRect.top
      })
    );
  };

  // DragPoint stable during the PieChart changes
  private immobileDragPoint: DragPoint = this.dragPoints[0];

  private setImmobileDragPoint = () => {
    // Currently activeDragPoint
    const activeDragPointIndex = this.dragPoints.findIndex(
      dragPoint => dragPoint.id === this.draggingStatus.id
    );

    // Immobile dragPoint is always right after the active one
    const immobileIndex =
      activeDragPointIndex === this.dragPoints.length - 1
        ? 0
        : activeDragPointIndex + 1;

    this.immobileDragPoint = {
      ...this.dragPoints[immobileIndex],
      index: immobileIndex
    };
  };

  // Respoonsible for update with every mouse change
  private drag = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    const boundingClientRect = e.currentTarget.getBoundingClientRect();

    const canvasCursorX = e.clientX - boundingClientRect.left;
    const canvasCursorY = e.clientY - boundingClientRect.top;

    const activeDragPointPosition = (this
      .math as Mathematic).getClosestPointOnCircumference(
      canvasCursorX,
      canvasCursorY
    );

    /**
     * 1. Calculate angle between active & immobile dragPoint
     * 2. Convert angles to percentage, F.E. 36 degrees = 36 / 360 = 10%
     */
    const activeSectorNewPercentage =
      (this.math as Mathematic).getAngleBetweenPoints([
        activeDragPointPosition,
        this.immobileDragPoint
      ]) / 360;

    // Rest of percentages to share between the passive items
    const availablePercentages = 1 - activeSectorNewPercentage;

    // Passive profiles
    const restProfilesPercentageSum = sumItemsPercentage(
      this.itemsBeforeDraggingSnapshot.filter(
        item => item.id !== this.draggingStatus.id
      )
    );

    const newData = this.itemsBeforeDraggingSnapshot.map(item => {
      const parcitipanceInRest = item.percentage / restProfilesPercentageSum;

      const percentage =
        item.id === this.draggingStatus.id
          ? activeSectorNewPercentage
          : parcitipanceInRest * availablePercentages;

      return {
        ...item,
        percentage
      };
    });

    this.props.onChange(newData);
  };

  /**
   * Based on current mouse placement & status there need to be shown
   * different types of scroll
   */
  private setCursorStyle = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const focusedDragPoint = this.findFocusedDragPoint(e);

    // Dragging
    if (this.draggingStatus.enabled) {
      e.currentTarget.style.cursor = 'move';
      // Just hover
    } else if (focusedDragPoint) {
      e.currentTarget.style.cursor = 'pointer';
    } else {
      e.currentTarget.style.cursor = 'default';
    }
  };

  private onMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (this.draggingStatus.enabled) {
      this.drag(e);
    }

    /**
     * No need to setting cursor, if dragging is in progress
     */
    if (!this.draggingStatus.enabled) {
      this.setCursorStyle(e);
    }
  };

  /**
   * Percentage share for rest of the items is based on the divisions
   * before the drag
   */
  private itemsBeforeDraggingSnapshot: Item[] = [];

  private setItemsBeforeDraggingSnapshot = (
    itemsBeforeDraggingSnapshot: Item[]
  ) =>
    (this.itemsBeforeDraggingSnapshot = [
      ...itemsBeforeDraggingSnapshot.map(item => ({
        ...item
      }))
    ]);

  private onMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    const currentDragPoint = this.findFocusedDragPoint(e);

    /**
     * Before drawing, set data required for the stable calculations
     */
    if (currentDragPoint) {
      this.setItemsBeforeDraggingSnapshot(this.props.items);
      this.setDraggingStatus({ enabled: true, id: currentDragPoint.id });
      this.setImmobileDragPoint();
      this.drawEverything();
    }

    this.setCursorStyle(e);
  };

  private onMouseUp = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    this.setDraggingStatus({ enabled: false, id: null });

    this.setCursorStyle(e);
  };
}
