import { useMediaQuery } from 'usehooks-ts';

export function useMediaHook({ screenWidth }) {
  return useMediaQuery(`(min-width: ${screenWidth}px)`);
}
