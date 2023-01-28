import { SlitherlinkGenerator } from "./SlitherlinkGenerator";

describe('solve times', () => {
  it('5 x 5 easy', () => {
    console.log(expect.getState().currentTestName);
    console.time('generate');
    const board = new SlitherlinkGenerator().generateBoard(5, 5, 'easy');
    console.timeLog('generate');
    console.time('solve');
    const result = board.solve();
    console.timeLog('solve');
    console.log(`max depth: ${result.maxDepth}, max iterations: ${result.maxIterations}`);
  });

  it('5 x 5 medium', () => {
    console.log(expect.getState().currentTestName);
    console.time('generate');
    const board = new SlitherlinkGenerator().generateBoard(5, 5, 'medium');
    console.timeLog('generate');
    console.time('solve');
    const result = board.solve();
    console.timeLog('solve');
    console.log(`max depth: ${result.maxDepth}, max iterations: ${result.maxIterations}`);
  });

  it('5 x 5 hard', () => {
    console.log(expect.getState().currentTestName);
    console.time('generate');
    const board = new SlitherlinkGenerator().generateBoard(5, 5, 'hard');
    console.timeLog('generate');
    console.time('solve');
    const result = board.solve();
    console.timeLog('solve');
    console.log(`max depth: ${result.maxDepth}, max iterations: ${result.maxIterations}`);
  });

  it('7 x 7 easy', () => {
    console.log(expect.getState().currentTestName);
    console.time('generate');
    const board = new SlitherlinkGenerator().generateBoard(7, 7, 'easy');
    console.timeLog('generate');
    console.time('solve');
    const result = board.solve();
    console.timeLog('solve');
    console.log(`max depth: ${result.maxDepth}, max iterations: ${result.maxIterations}`);
  });

  it('7 x 7 medium', () => {
    console.log(expect.getState().currentTestName);
    console.time('generate');
    const board = new SlitherlinkGenerator().generateBoard(7, 7, 'medium');
    console.timeLog('generate');
    console.time('solve');
    const result = board.solve();
    console.timeLog('solve');
    console.log(`max depth: ${result.maxDepth}, max iterations: ${result.maxIterations}`);
  });

  it('7 x 7 hard', () => {
    console.log(expect.getState().currentTestName);
    console.time('generate');
    const board = new SlitherlinkGenerator().generateBoard(7, 7, 'hard');
    console.timeLog('generate');
    console.time('solve');
    const result = board.solve();
    console.timeLog('solve');
    console.log(`max depth: ${result.maxDepth}, max iterations: ${result.maxIterations}`);
  });

  it('10 x 10 easy', () => {
    console.log(expect.getState().currentTestName);
    console.time('generate');
    const board = new SlitherlinkGenerator().generateBoard(10, 10, 'easy');
    console.timeLog('generate');
    console.time('solve');
    const result = board.solve();
    console.timeLog('solve');
    console.log(`max depth: ${result.maxDepth}, max iterations: ${result.maxIterations}`);
  });

  it('10 x 10 medium', () => {
    console.log(expect.getState().currentTestName);
    console.time('generate');
    const board = new SlitherlinkGenerator().generateBoard(10, 10, 'medium');
    console.timeLog('generate');
    console.time('solve');
    const result = board.solve();
    console.timeLog('solve');
    console.log(`max depth: ${result.maxDepth}, max iterations: ${result.maxIterations}`);
  });

  it('10 x 10 hard', () => {
    console.log(expect.getState().currentTestName);
    console.time('generate');
    const board = new SlitherlinkGenerator().generateBoard(10, 10, 'hard');
    console.timeLog('generate');
    console.time('solve');
    const result = board.solve();
    console.timeLog('solve');
    console.log(`max depth: ${result.maxDepth}, max iterations: ${result.maxIterations}`);
  });

  it('15 x 15 easy', () => {
    console.log(expect.getState().currentTestName);
    console.time('generate');
    const board = new SlitherlinkGenerator().generateBoard(15, 15, 'easy');
    console.timeLog('generate');
    console.time('solve');
    const result = board.solve();
    console.timeLog('solve');
    console.log(`max depth: ${result.maxDepth}, max iterations: ${result.maxIterations}`);
  });

  it('15 x 15 medium', () => {
    console.log(expect.getState().currentTestName);
    console.time('generate');
    const board = new SlitherlinkGenerator().generateBoard(15, 15, 'medium');
    console.timeLog('generate');
    console.time('solve');
    const result = board.solve();
    console.timeLog('solve');
    console.log(`max depth: ${result.maxDepth}, max iterations: ${result.maxIterations}`);
  });

  it('15 x 15 hard', () => {
    console.log(expect.getState().currentTestName);
    console.time('generate');
    const board = new SlitherlinkGenerator().generateBoard(15, 15, 'hard');
    console.timeLog('generate');
    console.time('solve');
    const result = board.solve();
    console.timeLog('solve');
    console.log(`max depth: ${result.maxDepth}, max iterations: ${result.maxIterations}`);
  });

  it('12 x 24 easy', () => {
    console.log(expect.getState().currentTestName);
    console.time('generate');
    const board = new SlitherlinkGenerator().generateBoard(12, 24, 'easy');
    console.timeLog('generate');
    console.time('solve');
    const result = board.solve();
    console.timeLog('solve');
    console.log(`max depth: ${result.maxDepth}, max iterations: ${result.maxIterations}`);
  });

  it('12 x 24 medium', () => {
    console.log(expect.getState().currentTestName);
    console.time('generate');
    const board = new SlitherlinkGenerator().generateBoard(12, 24, 'medium');
    console.timeLog('generate');
    console.time('solve');
    const result = board.solve();
    console.timeLog('solve');
    console.log(`max depth: ${result.maxDepth}, max iterations: ${result.maxIterations}`);
  });

  it('12 x 24 hard', () => {
    console.log(expect.getState().currentTestName);
    console.time('generate');
    const board = new SlitherlinkGenerator().generateBoard(12, 24, 'hard');
    console.timeLog('generate');
    console.time('solve');
    const result = board.solve();
    console.timeLog('solve');
    console.log(`max depth: ${result.maxDepth}, max iterations: ${result.maxIterations}`);
  });

  it('20 x 20 easy', () => {
    console.log(expect.getState().currentTestName);
    console.time('generate');
    const board = new SlitherlinkGenerator().generateBoard(20, 20, 'easy');
    console.timeLog('generate');
    console.time('solve');
    const result = board.solve();
    console.timeLog('solve');
    console.log(`max depth: ${result.maxDepth}, max iterations: ${result.maxIterations}`);
  });

  it('20 x 20 medium', () => {
    console.log(expect.getState().currentTestName);
    console.time('generate');
    const board = new SlitherlinkGenerator().generateBoard(20, 20, 'medium');
    console.timeLog('generate');
    console.time('solve');
    const result = board.solve();
    console.timeLog('solve');
    console.log(`max depth: ${result.maxDepth}, max iterations: ${result.maxIterations}`);
  });

  it('20 x 20 hard', () => {
    console.log(expect.getState().currentTestName);
    console.time('generate');
    const board = new SlitherlinkGenerator().generateBoard(20, 20, 'hard');
    console.timeLog('generate');
    console.time('solve');
    const result = board.solve();
    console.timeLog('solve');
    console.log(`max depth: ${result.maxDepth}, max iterations: ${result.maxIterations}`);
  });
});
