import { FC, Context } from 'react';
import { createContext, useContextSelector } from 'use-context-selector';

type CreateContextSelectorTuple<Props, Value> = [
  FC<Props>,
  <Selected>(selector: (value: Value) => Selected) => Selected
];

export function createContextSelector<Props, Value>(
  useValue: (props: Props) => Value
): CreateContextSelectorTuple<Props, Value> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const context = createContext(null) as Context<any>;

  // @ts-ignore
  const Provider: FC<Props> = ({ children, ...props }) => {
    return (
      // @ts-ignore
      <context.Provider value={useValue(props as Props)}>
        {children}
      </context.Provider>
    );
  };

  function useContextSelectorHook<Selected>(
    selector: (value: Value) => Selected
  ): Selected {
    try {
      return useContextSelector(context, selector);
    } catch (e) {
      throw new Error('Missing Provider');
    }
  }

  return [Provider, useContextSelectorHook];
}
