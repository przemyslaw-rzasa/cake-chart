interface Point {
  x: number;
  y: number;
}

interface Item {
  id: string;
  name: string;
  percentage: number;
  color: string;
  hasError?: boolean;
}

interface DragPoint {
  x: number;
  y: number;
  id: string;
  percentageShift: number;
  index?: number;
}

interface Measure {
  width: number;
  height: number;
}

interface Dimensions {
  width: number;
  height: number;
  radius: number;
}

interface LabelPart {
  type: string;
  fontSize: number;
  fontFamily?: string;
  offset?: number;
}

interface VirtualLabelPart {
  point: Point;
  text: string | null;
  fontFamily?: string;
  fontSize: number;
}

interface VirtualLabelInfo {
  isInner: boolean;
  color: string;
}

interface VirtualLabel {
  parts: VirtualLabelPart[];
  info: VirtualLabelInfo;
}

interface DraggingStatus {
  enabled: boolean;
  id: string | null;
}
