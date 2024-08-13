import { cubicOut } from 'svelte/easing';

type FlyAndScaleParams = {
  y?: number;
  start?: number;
  duration?: number;
};

const defaultFlyAndScaleParams = {
  y: -8,
  start: 0.9,
  duration: 200,
};

const styleToString = (style: Record<string, number | string | undefined>): string => {
  return Object.keys(style).reduce((str, key) => {
    if (style[key] === undefined) return str;
    return `${str}${key}:${style[key]};`;
  }, '');
};

const convertScale = (
  valueA: number,
  scaleA: [number, number],
  scaleB: [number, number],
): number => {
  const [minA, maxA] = scaleA;
  const [minB, maxB] = scaleB;

  const percentage = (valueA - minA) / (maxA - minA);
  const valueB = percentage * (maxB - minB) + minB;

  return valueB;
};

export const flyAndScale = (node: Element, params?: FlyAndScaleParams) => {
  const style = getComputedStyle(node);
  const transform = style.transform === 'none' ? '' : style.transform;
  const withDefaults = { ...defaultFlyAndScaleParams, ...params };

  return {
    duration: withDefaults.duration,
    delay: 0,
    css: (t: number) => {
      const y = convertScale(t, [0, 1], [withDefaults.y, 0]);
      const scale = convertScale(t, [0, 1], [withDefaults.start, 1]);

      return styleToString({
        transform: `${transform} translate3d(0, ${y}px, 0) scale(${scale})`,
        opacity: t,
      });
    },
    easing: cubicOut,
  };
};
