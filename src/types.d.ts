declare module 'random-words' {
  const f: () => string;
  const fn: (count: number) => string[];
  const exp: f | fn;
  export default exp;
}
