import SlitherlinkBoard from "./SlitherlinkBoard";

it('no solution', () => {
  const noSolution = [
    ["1", "1"],
    ["1", "1"]
  ];
  // freezes
});

it('one solution', () => {
  const oneSolution = [
    ["2", "2"],
    ["2", "2"]
  ];
  const board = new SlitherlinkBoard(oneSolution);
  expect(board.solve()).toEqual(1);
});

it('two solutions', () => {
  const twoSolutions = [
    ["3", "2"],
    ["2", "3"]
  ];
  const board = new SlitherlinkBoard(twoSolutions);
  expect(board.solve()).toEqual(2);
  // finds only 1 solution
});