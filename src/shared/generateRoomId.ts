import fs from 'fs';
import uniqueRandomArray from 'unique-random-array';
import wordsListPath from 'word-list';

const randomWord = uniqueRandomArray(
  fs.readFileSync(wordsListPath, 'utf-8').split('\n')
);

export const generateRoomId = () =>
  `${randomWord()}-${randomWord()}-${randomWord()}`;

export const generateRoomIdNotContainedInList = (roomIds: string[]) => {
  // TODO
};
