import SlitherlinkBoard from "./SlitherlinkBoard";

it('different row lengths', () => {
  const values = [
    ["", ""],
    ["", "", ""]
  ];
  expect(() => new SlitherlinkBoard(values)).toThrow();
});

it('invalid value', () => {
  const values = [
    ["", " "],
    ["", ""]
  ];
  expect(() => new SlitherlinkBoard(values)).toThrow();
});

it('1 in top left corner', () => {
  const values = [
    ["1", ""],
    ["", ""]
  ];
  const board = new SlitherlinkBoard(values);
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[0][0].leftEdge.value).toEqual("x");
  expect(board.cells[0][0].topEdge.value).toEqual("x");
});

it('1 in top right corner', () => {
  const values = [
    ["", "1"],
    ["", ""]
  ];
  const board = new SlitherlinkBoard(values);
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[0][1].rightEdge.value).toEqual("x");
  expect(board.cells[0][1].topEdge.value).toEqual("x");
});

it('1 in bottom left corner', () => {
  const values = [
    ["", ""],
    ["1", ""]
  ];
  const board = new SlitherlinkBoard(values);
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[1][0].leftEdge.value).toEqual("x");
  expect(board.cells[1][0].bottomEdge.value).toEqual("x");
});

it('1 in bottom right corner', () => {
  const values = [
    ["", ""],
    ["", "1"]
  ];
  const board = new SlitherlinkBoard(values);
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[1][1].rightEdge.value).toEqual("x");
  expect(board.cells[1][1].bottomEdge.value).toEqual("x");
});

it('2 in top left corner', () => {
  const values = [
    ["2", ""],
    ["", ""]
  ];
  const board = new SlitherlinkBoard(values);
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[0][1].topEdge.value).toEqual("-");
  expect(board.cells[1][0].leftEdge.value).toEqual("-");
});

it('2 in top right corner', () => {
  const values = [
    ["", "2"],
    ["", ""]
  ];
  const board = new SlitherlinkBoard(values);
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[0][0].topEdge.value).toEqual("-");
  expect(board.cells[1][1].rightEdge.value).toEqual("-");
});

it('2 in bottom left corner', () => {
  const values = [
    ["", ""],
    ["2", ""]
  ];
  const board = new SlitherlinkBoard(values);
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[0][0].leftEdge.value).toEqual("-");
  expect(board.cells[1][1].bottomEdge.value).toEqual("-");
});

it('2 in bottom right corner', () => {
  const values = [
    ["", ""],
    ["", "2"]
  ];
  const board = new SlitherlinkBoard(values);
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[0][1].rightEdge.value).toEqual("-");
  expect(board.cells[1][0].bottomEdge.value).toEqual("-");
});

it('3 in top left corner', () => {
  const values = [
    ["3", ""],
    ["", ""]
  ];
  const board = new SlitherlinkBoard(values);
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[0][0].leftEdge.value).toEqual("-");
  expect(board.cells[0][0].topEdge.value).toEqual("-");
});

it('3 in top right corner', () => {
  const values = [
    ["", "3"],
    ["", ""]
  ];
  const board = new SlitherlinkBoard(values);
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[0][1].topEdge.value).toEqual("-");
  expect(board.cells[0][1].rightEdge.value).toEqual("-");
});

it('3 in bottom left corner', () => {
  const values = [
    ["", ""],
    ["3", ""]
  ];
  const board = new SlitherlinkBoard(values);
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[1][0].leftEdge.value).toEqual("-");
  expect(board.cells[1][0].bottomEdge.value).toEqual("-");
});

it('3 in bottom right corner', () => {
  const values = [
    ["", ""],
    ["", "3"]
  ];
  const board = new SlitherlinkBoard(values);
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[1][1].rightEdge.value).toEqual("-");
  expect(board.cells[1][1].bottomEdge.value).toEqual("-");
});

it('1 with incoming line and deleted line away', () => {
  const values = [
    ["", "", ""],
    ["", "1", ""],
    ["", "", ""]
  ];
  const board = new SlitherlinkBoard(values);
  board.markEdge(board.cells[0][0].bottomEdge, "-");
  board.markEdge(board.cells[0][0].rightEdge, "x");
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[1][1].rightEdge.value).toEqual("x");
  expect(board.cells[1][1].bottomEdge.value).toEqual("x");
});

it('1 with incoming line on outside edge', () => {
  const values = [
    ["", "1", ""],
    ["", "", ""]
  ];
  const board = new SlitherlinkBoard(values);
  board.markEdge(board.cells[0][0].topEdge, "-");
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[0][1].rightEdge.value).toEqual("x");
  expect(board.cells[0][1].bottomEdge.value).toEqual("x");
});

it('1 with incoming line and opposite edges deleted', () => {
  const values = [
    ["", "", ""],
    ["", "1", ""],
    ["", "", ""]
  ];
  const board = new SlitherlinkBoard(values);
  board.markEdge(board.cells[0][0].bottomEdge, "-");
  board.markEdge(board.cells[1][1].rightEdge, "x");
  board.markEdge(board.cells[1][1].bottomEdge, "x");
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[0][0].rightEdge.value).toEqual("x");
});

it(`diagonally adjacent 1's with inner edges deleted`, () => {
  const values = [
    ["", "", "", ""],
    ["", "1", "", ""],
    ["", "", "1", ""],
    ["", "", "", ""],
  ];
  const board = new SlitherlinkBoard(values);
  board.markEdge(board.cells[1][1].rightEdge, "x");
  board.markEdge(board.cells[1][1].bottomEdge, "x");
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[2][2].leftEdge.value).toEqual("x");
  expect(board.cells[2][2].topEdge.value).toEqual("x");
});

it(`diagonally adjacent 1's with outer edges deleted`, () => {
  const values = [
    ["", "", "", ""],
    ["", "1", "", ""],
    ["", "", "1", ""],
    ["", "", "", ""],
  ];
  const board = new SlitherlinkBoard(values);
  board.markEdge(board.cells[1][1].leftEdge, "x");
  board.markEdge(board.cells[1][1].topEdge, "x");
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[2][2].rightEdge.value).toEqual("x");
  expect(board.cells[2][2].bottomEdge.value).toEqual("x");
});

it(`horizontally adjacent 1's on outer edge`, () => {
  const values = [
    ["", "1", "1", ""],
    ["", "", "", ""]
  ];
  const board = new SlitherlinkBoard(values);
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[0][1].rightEdge.value).toEqual("x");
});

it(`vertically adjacent 1's on outer edge`, () => {
  const values = [
    ["", ""],
    ["1", ""],
    ["1", ""],
    ["", ""]
  ];
  const board = new SlitherlinkBoard(values);
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[1][0].bottomEdge.value).toEqual("x");
});

it("2 with incoming line with opposite delete edge", () => {
  const values = [
    ["", "", ""],
    ["", "2", ""],
    ["", "", ""]
  ];
  const board = new SlitherlinkBoard(values);
  board.markEdge(board.cells[1][0].bottomEdge, "-");
  board.markEdge(board.cells[1][1].topEdge, "x");
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[1][1].rightEdge.value).toEqual("-");
  expect(board.cells[2][0].rightEdge.value).toEqual("x");
});

it("2 with included edge, deleted adjacent edge, and deleted opposite corner edge", () => {
  const values = [
    ["", "", ""],
    ["", "2", ""],
    ["", "", ""]
  ];
  const board = new SlitherlinkBoard(values);
  board.markEdge(board.cells[1][1].topEdge, "x");
  board.markEdge(board.cells[1][1].rightEdge, "-");
  board.markEdge(board.cells[2][0].rightEdge, "x");
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[2][0].topEdge.value).toEqual("-");
});

it("horizontally adjacent 3 and 0", () => {
  const values = [
    ["", "", "", ""],
    ["", "3", "0", ""],
    ["", "", "", ""]
  ];
  const board = new SlitherlinkBoard(values);
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[1][1].leftEdge.value).toEqual("-");
  expect(board.cells[1][1].topEdge.value).toEqual("-");
  expect(board.cells[1][1].bottomEdge.value).toEqual("-");
  expect(board.cells[0][1].rightEdge.value).toEqual("-");
  expect(board.cells[2][1].rightEdge.value).toEqual("-");
});

it("vertically adjacent 3 and 0", () => {
  const values = [
    ["", "", ""],
    ["", "3", ""],
    ["", "0", ""],
    ["", "", ""]
  ];
  const board = new SlitherlinkBoard(values);
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[1][1].leftEdge.value).toEqual("-");
  expect(board.cells[1][1].topEdge.value).toEqual("-");
  expect(board.cells[1][1].rightEdge.value).toEqual("-");
  expect(board.cells[1][0].bottomEdge.value).toEqual("-");
  expect(board.cells[1][2].bottomEdge.value).toEqual("-");
});

it(`horizontally adjacent 3's`, () => {
  const values = [
    ["", "", "", ""],
    ["", "3", "3", ""],
    ["", "", "", ""]
  ];
  const board = new SlitherlinkBoard(values);
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[1][1].leftEdge.value).toEqual("-");
  expect(board.cells[1][1].rightEdge.value).toEqual("-");
  expect(board.cells[1][2].rightEdge.value).toEqual("-");
  expect(board.cells[0][1].rightEdge.value).toEqual("x");
  expect(board.cells[2][1].rightEdge.value).toEqual("x");
});

it(`vertically adjacent 3's`, () => {
  const values = [
    ["", "", ""],
    ["", "3", ""],
    ["", "3", ""],
    ["", "", ""]
  ];
  const board = new SlitherlinkBoard(values);
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[1][1].topEdge.value).toEqual("-");
  expect(board.cells[1][1].bottomEdge.value).toEqual("-");
  expect(board.cells[2][1].bottomEdge.value).toEqual("-");
  expect(board.cells[1][0].bottomEdge.value).toEqual("x");
  expect(board.cells[1][2].bottomEdge.value).toEqual("x");
});

it("diagonally adjacent 3 and 0", () => {
  const values = [
    ["", "", "", ""],
    ["", "", "3", ""],
    ["", "0", "", ""],
    ["", "", "", ""]
  ];
  const board = new SlitherlinkBoard(values);
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[1][2].leftEdge.value).toEqual("-");
  expect(board.cells[1][2].bottomEdge.value).toEqual("-");
  expect(board.cells[2][1].topEdge.value).toEqual("x");
  expect(board.cells[2][1].rightEdge.value).toEqual("x");
});

it("3 with both opposite edges deleted at a corner", () => {
  const values = [
    ["", "", ""],
    ["", "3", ""],
    ["", "", ""]
  ];
  const board = new SlitherlinkBoard(values);
  board.markEdge(board.cells[2][0].topEdge, "x");
  board.markEdge(board.cells[2][0].rightEdge, "x");
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[1][1].leftEdge.value).toEqual("-");
  expect(board.cells[1][1].bottomEdge.value).toEqual("-");
});

it("3 with incoming line", () => {
  const values = [
    ["", "", ""],
    ["", "3", ""],
    ["", "", ""]
  ];
  const board = new SlitherlinkBoard(values);
  board.markEdge(board.cells[1][0].bottomEdge, "-");
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[1][1].topEdge.value).toEqual("-");
  expect(board.cells[1][1].rightEdge.value).toEqual("-");
  expect(board.cells[2][0].rightEdge.value).toEqual("x");
});

it(`diagonally adjacent 3's`, () => {
  const values = [
    ["", "", "", ""],
    ["", "3", "", ""],
    ["", "", "3", ""],
    ["", "", "", ""]
  ];
  const board = new SlitherlinkBoard(values);
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[1][1].leftEdge.value).toEqual("-");
  expect(board.cells[1][1].topEdge.value).toEqual("-");
  expect(board.cells[2][2].bottomEdge.value).toEqual("-");
  expect(board.cells[2][2].rightEdge.value).toEqual("-");
});

it(`diagonally adjacent 3's separated by 2's`, () => {
  const values = [
    ["", "", "", "", "", ""],
    ["", "3", "", "", "", ""],
    ["", "", "2", "", "", ""],
    ["", "", "", "2", "", ""],
    ["", "", "", "", "3", ""],
    ["", "", "", "", "", ""]
  ];
  const board = new SlitherlinkBoard(values);
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[1][1].leftEdge.value).toEqual("-");
  expect(board.cells[1][1].topEdge.value).toEqual("-");
  expect(board.cells[4][4].bottomEdge.value).toEqual("-");
  expect(board.cells[4][4].rightEdge.value).toEqual("-");
});

it(`diagonally adjacent 2's with angled line at end of series`, () => {
  const values = [
    ["", "", "", ""],
    ["", "2", "", ""],
    ["", "", "2", ""],
    ["", "", "", ""]
  ];
  const board = new SlitherlinkBoard(values);
  board.markEdge(board.cells[3][3].leftEdge, "-");
  board.markEdge(board.cells[3][3].topEdge, "-");
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[2][2].leftEdge.value).toEqual("-");
  expect(board.cells[2][2].topEdge.value).toEqual("-");
  expect(board.cells[1][1].leftEdge.value).toEqual("-");
  expect(board.cells[1][1].topEdge.value).toEqual("-");
});

it(`diagonally adjacent 2's ending with a 3 with incoming line at first 2`, () => {
  const values = [
    ["", "", "", "", ""],
    ["", "2", "", "", ""],
    ["", "", "2", "", ""],
    ["", "", "", "3", ""],
    ["", "", "", "", ""]
  ];
  const board = new SlitherlinkBoard(values);
  board.markEdge(board.cells[0][0].rightEdge, "-");
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[3][3].bottomEdge.value).toEqual("-");
  expect(board.cells[3][3].rightEdge.value).toEqual("-");
});

it("diagonally adjacent 3 and 1 with outer edges of 1 deleted", () => {
  const values = [
    ["", "", "", ""],
    ["", "3", "", ""],
    ["", "", "1", ""],
    ["", "", "", ""]
  ];
  const board = new SlitherlinkBoard(values);
  board.markEdge(board.cells[2][2].rightEdge, "x");
  board.markEdge(board.cells[2][2].bottomEdge, "x");
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[1][1].leftEdge.value).toEqual("-");
  expect(board.cells[1][1].topEdge.value).toEqual("-");
});

it("diagonally adjacent 3 and 1 with outer edges of 3 included", () => {
  const values = [
    ["", "", "", ""],
    ["", "3", "", ""],
    ["", "", "1", ""],
    ["", "", "", ""]
  ];
  const board = new SlitherlinkBoard(values);
  board.markEdge(board.cells[1][1].leftEdge, "-");
  board.markEdge(board.cells[1][1].topEdge, "-");
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[2][2].rightEdge.value).toEqual("x");
  expect(board.cells[2][2].bottomEdge.value).toEqual("x");
});

it("diagonally adjacent 2 and 1 with line approaching 2", () => {
  const values = [
    ["", "", "", ""],
    ["", "1", "", ""],
    ["", "", "2", ""],
    ["", "", "", ""]
  ];
  const board = new SlitherlinkBoard(values);
  board.markEdge(board.cells[3][3].leftEdge, "-");
  board.markEdge(board.cells[3][3].topEdge, "x");
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[1][1].leftEdge.value).toEqual("x");
  expect(board.cells[1][1].topEdge.value).toEqual("x");
});

it(`diagonally adjacent 2's with line approaching 2`, () => {
  const values = [
    ["", "", "", ""],
    ["", "2", "", ""],
    ["", "", "2", ""],
    ["", "", "", ""]
  ];
  const board = new SlitherlinkBoard(values);
  board.markEdge(board.cells[3][3].leftEdge, "x");
  board.markEdge(board.cells[3][3].topEdge, "-");
  board.markEdge(board.cells[0][0].bottomEdge, "x");
  board.applyOneTimeSolvePass();
  board.runSolveLoop();
  expect(board.cells[0][0].rightEdge.value).toEqual("-");
});

it('no solution', () => {
  const values = [
    ["1", "1"],
    ["1", "1"]
  ];
  const board = new SlitherlinkBoard(values);
  expect(board.solve()).toEqual(0);
});

it('one solution', () => {
  const values = [
    ["2", "2"],
    ["2", "2"]
  ];
  const board = new SlitherlinkBoard(values);
  expect(board.solve()).toEqual(1);
});

it('two solutions', () => {
  const values = [
    ["3", "2"],
    ["2", "3"]
  ];
  const board = new SlitherlinkBoard(values);
  expect(board.solve()).toEqual(2);
});

it('6 x 6', () => {
  const values = [
    ["", "", "", "", "0", ""],
    ["3", "3", "", "", "1", ""],
    ["", "", "1", "2", "", ""],
    ["", "", "2", "0", "", ""],
    ["", "1", "", "", "1", "1"],
    ["", "2", "", "", "", ""]
  ];
  const board = new SlitherlinkBoard(values);
  expect(board.solve()).toEqual(1);
});

it('7 x 7', () => {
  const values = [
    ["2", "2", "2", "3", "3", "1", ""],
    ["", "", "0", "2", "", "3", ""],
    ["", "", "", "", "", "", ""],
    ["3", "3", "", "", "3", "3", ""],
    ["", "", "2", "", "2", "", ""],
    ["3", "", "2", "", "2", "2", ""],
    ["3", "", "2", "", "", "3", ""]
  ];
  const board = new SlitherlinkBoard(values);
  expect(board.solve()).toEqual(1);
});

it('20 x 20 hard', () => {
  const values = [
    ["2", "", "", "", "", "2", "", "2", "", "1", "", "2", "", "2", "2", "", "3", "3", "", ""],
    ["", "", "2", "", "3", "", "", "", "3", "", "3", "2", "", "", "", "", "1", "", "1", "2"],
    ["1", "2", "", "", "2", "2", "3", "", "", "2", "", "", "", "2", "2", "", "3", "2", "", ""],
    ["1", "", "2", "", "", "2", "", "", "2", "2", "", "", "", "", "", "", "", "2", "2", ""],
    ["2", "", "", "1", "", "", "", "3", "3", "", "", "", "", "2", "1", "3", "", "1", "", ""],
    ["1", "", "", "2", "2", "", "", "", "1", "3", "", "", "", "", "3", "1", "", "3", "", ""],
    ["", "3", "2", "", "", "", "", "", "2", "", "", "3", "2", "", "", "1", "0", "", "", "3"],
    ["3", "", "3", "", "", "2", "1", "", "", "3", "", "", "", "3", "", "2", "3", "", "2", ""],
    ["2", "", "", "2", "", "2", "", "1", "", "", "1", "", "", "", "", "2", "", "1", "", ""],
    ["", "", "2", "", "", "2", "2", "3", "3", "1", "", "", "3", "3", "", "", "2", "", "", ""],
    ["2", "1", "3", "", "", "2", "", "", "", "2", "", "", "", "", "", "3", "", "", "3", "2"],
    ["", "", "", "", "3", "", "", "", "1", "1", "", "2", "", "", "0", "", "1", "", "", "3"],
    ["", "", "3", "", "2", "3", "2", "", "", "3", "2", "", "", "", "2", "", "2", "", "2", ""],
    ["", "3", "", "2", "", "2", "", "2", "3", "2", "", "3", "", "", "", "", "", "2", "", "3"],
    ["", "3", "", "", "", "1", "2", "", "", "2", "", "", "", "", "", "1", "2", "3", "", ""],
    ["2", "", "2", "", "", "2", "1", "", "", "", "", "3", "3", "", "2", "", "3", "", "0", "2"],
    ["", "", "3", "", "", "", "3", "", "2", "", "2", "", "", "2", "", "2", "", "", "2", ""],
    ["", "1", "", "", "", "", "", "2", "", "", "0", "", "2", "1", "", "2", "", "", "", ""],
    ["", "", "1", "", "3", "1", "2", "1", "", "", "2", "3", "2", "", "3", "", "", "2", "", ""],
    ["3", "", "2", "1", "", "", "", "", "2", "2", "", "", "", "2", "2", "", "", "3", "2", ""]
  ];
  const board = new SlitherlinkBoard(values, 1);
  expect(board.solve()).toEqual(1);
});
