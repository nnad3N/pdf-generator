// Taken from solidjs repo https://github.com/solidjs/solid/blob/b5a379f889e8f7a208bc223b908a0fdcf353d944/packages/solid/src/render/component.ts#L270

type SplitProps<T, K extends (readonly (keyof T)[])[]> = [
  ...{
    [P in keyof K]: P extends string
      ? Pick<T, Extract<K[P], readonly (keyof T)[]>[number]>
      : never;
  },
  { [P in keyof T as Exclude<P, K[number][number]>]: T[P] },
];

export function splitProps<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  T extends Record<string, any>,
  K extends (readonly (keyof T)[])[],
>(props: T, ...keys: K): SplitProps<T, K> {
  const usedKeys: (keyof T)[] = [];
  const splitProps = keys.map((keyArray) => {
    const partialProps: Partial<T> = {};

    keyArray.forEach((key) => {
      partialProps[key] = props[key];
      usedKeys.push(key);
    });

    return partialProps;
  });

  const rest: Partial<T> = {};

  for (const key in props) {
    // == prevents numeric keys from getting duplicated
    if (!usedKeys.some((usedKey) => usedKey == key)) {
      rest[key] = props[key];
    }
  }

  splitProps.push(rest);

  return splitProps as SplitProps<T, K>;
}
