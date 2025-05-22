
import { StoreApi } from 'zustand';

/**
 * Type for creating optimized selectors for Zustand stores
 * This helps avoid unnecessary re-renders by using proper memoization
 */
export type StoreSelector<T, U> = (state: T) => U;

/**
 * Helper function for creating optimized selectors
 * @param store The Zustand store
 * @param selector The selector function
 * @returns A memoized selector that only updates when the selected value changes
 */
export function createSelector<T, U>(
  store: StoreApi<T>,
  selector: StoreSelector<T, U>
) {
  let lastState: U;
  let lastResult: U;
  
  return (state: T) => {
    const nextState = selector(state);
    if (nextState !== lastState) {
      lastState = nextState;
      lastResult = nextState;
    }
    return lastResult;
  };
}

/**
 * Type for creating TypeScript actions with proper typing
 */
export type StoreAction<T, Args extends any[] = [], R = void> = 
  (this: StoreApi<T>, ...args: Args) => R;

/**
 * Type for defining a Zustand store with state and actions
 */
export interface StoreDefinition<
  State extends object,
  Actions extends Record<string, StoreAction<State, any, any>>
> {
  state: State;
  actions: Actions;
}

/**
 * Type for the combined store with state and actions
 */
export type Store<
  State extends object,
  Actions extends Record<string, StoreAction<State, any, any>>
> = State & {
  [K in keyof Actions]: Actions[K] extends StoreAction<State, infer Args, infer R>
    ? (...args: Args) => R
    : never;
};
