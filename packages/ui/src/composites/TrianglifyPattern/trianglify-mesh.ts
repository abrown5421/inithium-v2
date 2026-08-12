import Delaunator from 'delaunator';
import chroma from 'chroma-js';
import type { TrianglifyConfig } from '@inithium/models';

export interface TrianglifyTriangle {
  readonly points: readonly [readonly [number, number], readonly [number, number], readonly [number, number]];
  readonly fill: string;
}

export interface TrianglifyMesh {
  readonly width: number;
  readonly height: number;
  readonly triangles: readonly TrianglifyTriangle[];
}

const clamp = (value: number, min: number, max: number): number => Math.min(max, Math.max(min, value));

const hashStringToSeed = (value: string): number => {
  let hash = 0x811c9dc5;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
};

const createSeededRandom = (seed: number): (() => number) => {
  let state = seed;
  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const buildGridPoints = (
  width: number,
  height: number,
  cellSize: number,
  variance: number,
  random: () => number
): readonly (readonly [number, number])[] => {
  const points: (readonly [number, number])[] = [];
  const jitterRadius = cellSize * variance * 0.5;

  for (let y = 0; y <= height; y += cellSize) {
    for (let x = 0; x <= width; x += cellSize) {
      const dx = (random() - 0.5) * jitterRadius * 2;
      const dy = (random() - 0.5) * jitterRadius * 2;
      points.push([clamp(x + dx, 0, width), clamp(y + dy, 0, height)]);
    }
  }

  points.push([0, 0], [width, 0], [0, height], [width, height]);
  return points;
};

const buildCentroid = (
  points: readonly [readonly [number, number], readonly [number, number], readonly [number, number]]
): readonly [number, number] => [
  (points[0][0] + points[1][0] + points[2][0]) / 3,
  (points[0][1] + points[1][1] + points[2][1]) / 3
];

export const generateTrianglifyMesh = (config: TrianglifyConfig, width: number, height: number): TrianglifyMesh => {
  if (width <= 0 || height <= 0 || config.x_colors.length === 0 || config.y_colors.length === 0) {
    return { width, height, triangles: [] };
  }

  const seed = hashStringToSeed(JSON.stringify(config));
  const random = createSeededRandom(seed);
  const cellSize = Math.max(1, config.cell_size);
  const points = buildGridPoints(width, height, cellSize, config.variance, random);

  const delaunay = Delaunator.from(points as [number, number][]);
  const xScale = chroma.scale([...config.x_colors]).mode('lab');
  const yScale = chroma.scale([...config.y_colors]).mode('lab');

  const triangles: TrianglifyTriangle[] = [];
  for (let i = 0; i < delaunay.triangles.length; i += 3) {
    const trianglePoints: readonly [readonly [number, number], readonly [number, number], readonly [number, number]] = [
      points[delaunay.triangles[i]],
      points[delaunay.triangles[i + 1]],
      points[delaunay.triangles[i + 2]]
    ];
    const [centroidX, centroidY] = buildCentroid(trianglePoints);
    const colorX = xScale(clamp(centroidX / width, 0, 1));
    const colorY = yScale(clamp(centroidY / height, 0, 1));
    triangles.push({ points: trianglePoints, fill: chroma.mix(colorX, colorY, 0.5, 'lab').hex() });
  }

  return { width, height, triangles };
};

export const trianglifyMeshToSvgString = (mesh: TrianglifyMesh): string => {
  const polygons = mesh.triangles
    .map((triangle) => {
      const pointsAttr = triangle.points.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(' ');
      return `<polygon points="${pointsAttr}" fill="${triangle.fill}" />`;
    })
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${mesh.width}" height="${mesh.height}" viewBox="0 0 ${mesh.width} ${mesh.height}">${polygons}</svg>`;
};
