/* eslint-disable @typescript-eslint/no-explicit-any */
/*
 * Copyright (c) 2025 Bytedance, Inc. and its affiliates.
 * SPDX-License-Identifier: Apache-2.0
 */

import { AgentTARSOptions } from '../types';

/**
 * Creates default configuration options for AgentTARS
 */
export const AGENT_TARS_DEFAULT_OPTIONS: AgentTARSOptions = {
  workspace: {},
  search: {
    provider: 'browser_search',
    count: 10,
    browserSearch: {
      engine: 'google',
      needVisitedUrls: false,
    },
  },
  browser: {
    type: 'local',
    headless: false,
    control: 'hybrid',
  },
  mcpImpl: 'in-memory',
  mcpServers: {},
  maxIterations: 100,
  maxTokens: 8192,
  enableStreamingToolCallEvents: true,
};

/**
 * Utility type for deep partial objects
 * Allows creating partial mocks of complex objects
 */
export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;

/**
 * Deep merge function - merges source object properties into target object, supporting nested structures
 *
 * @param target The target object
 * @param source The source object
 * @param options Merge options
 * @returns The merged object
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  source?: DeepPartial<T> | null,
  options: {
    nonDestructive?: boolean; // Whether to create a new object instead of modifying the original
  } = { nonDestructive: true },
): T {
  // If source doesn't exist, return the target object (possibly a copy)
  if (!source) {
    return options.nonDestructive ? { ...target } : target;
  }

  // If non-destructive operation is required, create a shallow copy of the target object
  const result = options.nonDestructive ? { ...target } : target;

  // Iterate through the properties of the source object
  for (const key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      const sourceValue = source[key];
      const targetValue = target[key];

      // If both are objects (not arrays or null), perform deep merge
      if (isPlainObject(sourceValue) && isPlainObject(targetValue)) {
        result[key] = deepMerge(targetValue, sourceValue, options);
      }
      // For undefined values, keep the target value
      else if (sourceValue !== undefined) {
        result[key] = sourceValue;
      }
    }
  }

  return result as T;
}

/**
 * Checks if a value is a plain object (not null, not an array)
 */
function isPlainObject(value: any): boolean {
  return value && typeof value === 'object' && !Array.isArray(value);
}

/**
 * Applies default options and merges with user options
 *
 * @param options User-provided options
 * @returns Complete merged options
 */
export function applyDefaultOptions<T extends AgentTARSOptions>(options: DeepPartial<T>): T {
  return deepMerge(AGENT_TARS_DEFAULT_OPTIONS, options) as T;
}
