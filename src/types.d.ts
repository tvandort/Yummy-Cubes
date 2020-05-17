declare module 'random-words' {
  const randomWord: () => string;
  const randomWords: (count: number) => string[];
  const randomWordOrWords: f | fn;
  export default randomWordOrWords;
}
