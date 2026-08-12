import * as React from 'react';
import { DEFAULT_TRIANGLIFY_CONFIG, type TrianglifyConfig } from '@inithium/models';
import { cn } from '../../utils/cn.js';
import { generateTrianglifyMesh, type TrianglifyMesh } from './trianglify-mesh.js';

export interface TrianglifyPatternProps {
  readonly config: TrianglifyConfig;
  readonly width?: number;
  readonly height?: number;
  readonly className?: string;
}

const buildMeshSafely = (config: TrianglifyConfig, width: number, height: number): TrianglifyMesh => {
  try {
    return generateTrianglifyMesh(config, width, height);
  } catch {
    try {
      return generateTrianglifyMesh(DEFAULT_TRIANGLIFY_CONFIG, width, height);
    } catch {
      return { width, height, triangles: [] };
    }
  }
};

export const TrianglifyPattern: React.FC<TrianglifyPatternProps> = ({
  config,
  width = 800,
  height = 200,
  className
}) => {
  const mesh = React.useMemo(
    () => buildMeshSafely(config, width, height),
    [JSON.stringify(config), width, height]
  );

  return (
    <svg
      viewBox={`0 0 ${mesh.width} ${mesh.height}`}
      preserveAspectRatio="xMidYMid slice"
      className={cn('block', className)}
      role="img"
      aria-label="Generated triangle pattern"
    >
      {mesh.triangles.map((triangle, index) => (
        <polygon key={index} points={triangle.points.map(([x, y]) => `${x},${y}`).join(' ')} fill={triangle.fill} />
      ))}
    </svg>
  );
};
