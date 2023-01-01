import SlitherlinkBoard from './SlitherlinkBoard';

describe('invalid board initialization', () => {
  it('different row lengths', () => {
    const values = [
      ['', ''],
      ['', '', '']
    ];
    expect(() => new SlitherlinkBoard(values)).toThrow();
  });

  it('invalid value', () => {
    const values = [
      ['', ' '],
      ['', '']
    ];
    expect(() => new SlitherlinkBoard(values)).toThrow();
  });
});

describe('corners have 0 or 2 connecting edges', () => {

});

describe('0 cell and corner values', () => {
  it('0 cell', () => {
    const values = [
      ['', '', ''],
      ['', '0', ''],
      ['', '', '']
    ];
    const board = new SlitherlinkBoard(values);
    board.applyOneTimeSolvePassNoCornerCounts();
    expect(board.cells[1][1].topEdge.value).toEqual('x');
    expect(board.cells[1][1].bottomEdge.value).toEqual('x');
    expect(board.cells[1][1].leftEdge.value).toEqual('x');
    expect(board.cells[1][1].rightEdge.value).toEqual('x');
  });

  describe(`corner 1's`, () => {
    it('1 in top left corner', () => {
      const values = [
        ['1', ''],
        ['', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.applyOneTimeSolvePassNoCornerCounts();
      expect(board.cells[0][0].topEdge.value).toEqual('x');
      expect(board.cells[0][0].leftEdge.value).toEqual('x');
    });

    it('1 in top right corner', () => {
      const values = [
        ['', '1'],
        ['', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.applyOneTimeSolvePassNoCornerCounts();
      expect(board.cells[0][1].topEdge.value).toEqual('x');
      expect(board.cells[0][1].rightEdge.value).toEqual('x');
    });

    it('1 in bottom left corner', () => {
      const values = [
        ['', ''],
        ['1', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.applyOneTimeSolvePassNoCornerCounts();
      expect(board.cells[1][0].bottomEdge.value).toEqual('x');
      expect(board.cells[1][0].leftEdge.value).toEqual('x');
    });

    it('1 in bottom right corner', () => {
      const values = [
        ['', ''],
        ['', '1']
      ];
      const board = new SlitherlinkBoard(values);
      board.applyOneTimeSolvePassNoCornerCounts();
      expect(board.cells[1][1].bottomEdge.value).toEqual('x');
      expect(board.cells[1][1].rightEdge.value).toEqual('x');
    });
  });

  describe(`corner 2's`, () => {
    it('2 in top left corner', () => {
      const values = [
        ['2', ''],
        ['', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.applyOneTimeSolvePassNoCornerCounts();
      expect(board.cells[0][1].topEdge.value).toEqual('-');
      expect(board.cells[1][0].leftEdge.value).toEqual('-');
    });

    it('2 in top right corner', () => {
      const values = [
        ['', '2'],
        ['', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.applyOneTimeSolvePassNoCornerCounts();
      expect(board.cells[0][0].topEdge.value).toEqual('-');
      expect(board.cells[1][1].rightEdge.value).toEqual('-');
    });

    it('2 in bottom left corner', () => {
      const values = [
        ['', ''],
        ['2', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.applyOneTimeSolvePassNoCornerCounts();
      expect(board.cells[0][0].leftEdge.value).toEqual('-');
      expect(board.cells[1][1].bottomEdge.value).toEqual('-');
    });

    it('2 in bottom right corner', () => {
      const values = [
        ['', ''],
        ['', '2']
      ];
      const board = new SlitherlinkBoard(values);
      board.applyOneTimeSolvePassNoCornerCounts();
      expect(board.cells[0][1].rightEdge.value).toEqual('-');
      expect(board.cells[1][0].bottomEdge.value).toEqual('-');
    });
  });

  describe(`corner 3's`, () => {
    it('3 in top left corner', () => {
      const values = [
        ['3', ''],
        ['', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.applyOneTimeSolvePassNoCornerCounts();
      expect(board.cells[0][0].topEdge.value).toEqual('-');
      expect(board.cells[0][0].leftEdge.value).toEqual('-');
    });

    it('3 in top right corner', () => {
      const values = [
        ['', '3'],
        ['', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.applyOneTimeSolvePassNoCornerCounts();
      expect(board.cells[0][1].topEdge.value).toEqual('-');
      expect(board.cells[0][1].rightEdge.value).toEqual('-');
    });

    it('3 in bottom left corner', () => {
      const values = [
        ['', ''],
        ['3', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.applyOneTimeSolvePassNoCornerCounts();
      expect(board.cells[1][0].bottomEdge.value).toEqual('-');
      expect(board.cells[1][0].leftEdge.value).toEqual('-');
    });

    it('3 in bottom right corner', () => {
      const values = [
        ['', ''],
        ['', '3']
      ];
      const board = new SlitherlinkBoard(values);
      board.applyOneTimeSolvePassNoCornerCounts();
      expect(board.cells[1][1].bottomEdge.value).toEqual('-');
      expect(board.cells[1][1].rightEdge.value).toEqual('-');
    });
  });
});

describe('1 cell cases', () => {
  describe('1 with incoming line and deleted line away', () => {
    it('1 with incoming top left horizontal line and deleted line away', () => {
      const values = [
        ['', '', ''],
        ['', '1', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][0].bottomEdge.value = '-';
      board.cells[0][0].rightEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].bottomEdge.value).toEqual('x');
      expect(board.cells[1][1].rightEdge.value).toEqual('x');
    });

    it('1 with incoming top left vertical line and deleted line away', () => {
      const values = [
        ['', '', ''],
        ['', '1', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][0].bottomEdge.value = 'x';
      board.cells[0][0].rightEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].bottomEdge.value).toEqual('x');
      expect(board.cells[1][1].rightEdge.value).toEqual('x');
    });

    it('1 with incoming top right horizontal line and deleted line away', () => {
      const values = [
        ['', '', ''],
        ['', '1', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][2].bottomEdge.value = '-';
      board.cells[0][2].leftEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].bottomEdge.value).toEqual('x');
      expect(board.cells[1][1].leftEdge.value).toEqual('x');
    });

    it('1 with incoming top right vertical line and deleted line away', () => {
      const values = [
        ['', '', ''],
        ['', '1', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][2].bottomEdge.value = 'x';
      board.cells[0][2].leftEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].bottomEdge.value).toEqual('x');
      expect(board.cells[1][1].leftEdge.value).toEqual('x');
    });

    it('1 with incoming bottom left horizontal line and deleted line away', () => {
      const values = [
        ['', '', ''],
        ['', '1', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[2][0].topEdge.value = '-';
      board.cells[2][0].rightEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].topEdge.value).toEqual('x');
      expect(board.cells[1][1].rightEdge.value).toEqual('x');
    });

    it('1 with incoming bottom left vertical line and deleted line away', () => {
      const values = [
        ['', '', ''],
        ['', '1', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[2][0].topEdge.value = 'x';
      board.cells[2][0].rightEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].topEdge.value).toEqual('x');
      expect(board.cells[1][1].rightEdge.value).toEqual('x');
    });

    it('1 with incoming bottom right horizontal line and deleted line away', () => {
      const values = [
        ['', '', ''],
        ['', '1', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[2][2].topEdge.value = '-';
      board.cells[2][2].leftEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].topEdge.value).toEqual('x');
      expect(board.cells[1][1].leftEdge.value).toEqual('x');
    });

    it('1 with incoming bottom right vertical line and deleted line away', () => {
      const values = [
        ['', '', ''],
        ['', '1', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[2][2].topEdge.value = 'x';
      board.cells[2][2].leftEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].topEdge.value).toEqual('x');
      expect(board.cells[1][1].leftEdge.value).toEqual('x');
    });
  });

  describe('1 with incoming line on outer edge', () => {
    it('1 with incoming top left horizontal line on outer edge', () => {
      const values = [
        ['', '1', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][0].topEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[0][1].bottomEdge.value).toEqual('x');
      expect(board.cells[0][1].rightEdge.value).toEqual('x');
    });

    it('1 with incoming top right horizontal line on outer edge', () => {
      const values = [
        ['', '1', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][2].topEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[0][1].bottomEdge.value).toEqual('x');
      expect(board.cells[0][1].leftEdge.value).toEqual('x');
    });

    it('1 with incoming bottom left horizontal line on outer edge', () => {
      const values = [
        ['', '', ''],
        ['', '1', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][0].bottomEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].topEdge.value).toEqual('x');
      expect(board.cells[1][1].rightEdge.value).toEqual('x');
    });

    it('1 with incoming bottom right horizontal line on outer edge', () => {
      const values = [
        ['', '', ''],
        ['', '1', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][2].bottomEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].topEdge.value).toEqual('x');
      expect(board.cells[1][1].leftEdge.value).toEqual('x');
    });

    it('1 with incoming top left vertical line on outer edge', () => {
      const values = [
        ['', ''],
        ['1', ''],
        ['', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][0].leftEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][0].bottomEdge.value).toEqual('x');
      expect(board.cells[1][0].rightEdge.value).toEqual('x');
    });

    it('1 with incoming bottom left vertical line on outer edge', () => {
      const values = [
        ['', ''],
        ['1', ''],
        ['', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[2][0].leftEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][0].topEdge.value).toEqual('x');
      expect(board.cells[1][0].rightEdge.value).toEqual('x');
    });

    it('1 with incoming top right vertical line on outer edge', () => {
      const values = [
        ['', ''],
        ['', '1'],
        ['', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][1].rightEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].bottomEdge.value).toEqual('x');
      expect(board.cells[1][1].leftEdge.value).toEqual('x');
    });

    it('1 with incoming bottom right vertical line on outer edge', () => {
      const values = [
        ['', ''],
        ['', '1'],
        ['', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[2][1].rightEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].topEdge.value).toEqual('x');
      expect(board.cells[1][1].leftEdge.value).toEqual('x');
    });
  });

  describe('1 with incoming line and opposite edges deleted', () => {
    it('1 with top left horizontal incoming line and opposite edges deleted', () => {
      const values = [
        ['', '', ''],
        ['', '1', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][0].bottomEdge.value = '-';
      board.cells[1][1].bottomEdge.value = 'x';
      board.cells[1][1].rightEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[0][0].rightEdge.value).toEqual('x');
    });

    it('1 with top left vertical incoming line and opposite edges deleted', () => {
      const values = [
        ['', '', ''],
        ['', '1', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][0].rightEdge.value = '-';
      board.cells[1][1].bottomEdge.value = 'x';
      board.cells[1][1].rightEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[0][0].bottomEdge.value).toEqual('x');
    });

    it('1 with top right horizontal incoming line and opposite edges deleted', () => {
      const values = [
        ['', '', ''],
        ['', '1', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][2].bottomEdge.value = '-';
      board.cells[1][1].bottomEdge.value = 'x';
      board.cells[1][1].leftEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[0][2].leftEdge.value).toEqual('x');
    });

    it('1 with top right vertical incoming line and opposite edges deleted', () => {
      const values = [
        ['', '', ''],
        ['', '1', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][2].leftEdge.value = '-';
      board.cells[1][1].bottomEdge.value = 'x';
      board.cells[1][1].leftEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[0][2].bottomEdge.value).toEqual('x');
    });

    it('1 with bottom left horizontal incoming line and opposite edges deleted', () => {
      const values = [
        ['', '', ''],
        ['', '1', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][1].topEdge.value = 'x';
      board.cells[1][1].rightEdge.value = 'x';
      board.cells[2][0].topEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[2][0].rightEdge.value).toEqual('x');
    });

    it('1 with bottom left vertical incoming line and opposite edges deleted', () => {
      const values = [
        ['', '', ''],
        ['', '1', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][1].topEdge.value = 'x';
      board.cells[1][1].rightEdge.value = 'x';
      board.cells[2][0].rightEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[2][0].topEdge.value).toEqual('x');
    });

    it('1 with bottom right horizontal incoming line and opposite edges deleted', () => {
      const values = [
        ['', '', ''],
        ['', '1', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][1].topEdge.value = 'x';
      board.cells[1][1].leftEdge.value = 'x';
      board.cells[2][2].topEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[2][2].leftEdge.value).toEqual('x');
    });

    it('1 with bottom right vertical incoming line and opposite edges deleted', () => {
      const values = [
        ['', '', ''],
        ['', '1', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][1].topEdge.value = 'x';
      board.cells[1][1].leftEdge.value = 'x';
      board.cells[2][2].leftEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[2][2].topEdge.value).toEqual('x');
    });
  });

  describe(`diagonally adjacent 1's with deleted inner edges`, () => {
    it('1 to bottom left of 1 with top inner edges deleted', () => {
      const values = [
        ['', '', '', ''],
        ['', '', '1', ''],
        ['', '1', '', ''],
        ['', '', '', ''],
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][2].bottomEdge.value = 'x';
      board.cells[1][2].leftEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[2][1].topEdge.value).toEqual('x');
      expect(board.cells[2][1].rightEdge.value).toEqual('x');
    });

    it('1 to bottom left of 1 with bottom inner edges deleted', () => {
      const values = [
        ['', '', '', ''],
        ['', '', '1', ''],
        ['', '1', '', ''],
        ['', '', '', ''],
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[2][1].topEdge.value = 'x';
      board.cells[2][1].rightEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][2].bottomEdge.value).toEqual('x');
      expect(board.cells[1][2].leftEdge.value).toEqual('x');
    });

    it('1 to bottom right of 1 with top inner edges deleted', () => {
      const values = [
        ['', '', '', ''],
        ['', '1', '', ''],
        ['', '', '1', ''],
        ['', '', '', ''],
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][1].bottomEdge.value = 'x';
      board.cells[1][1].rightEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[2][2].topEdge.value).toEqual('x');
      expect(board.cells[2][2].leftEdge.value).toEqual('x');
    });

    it('1 to bottom right of 1 with bottom inner edges deleted', () => {
      const values = [
        ['', '', '', ''],
        ['', '1', '', ''],
        ['', '', '1', ''],
        ['', '', '', ''],
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[2][2].topEdge.value = 'x';
      board.cells[2][2].leftEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].bottomEdge.value).toEqual('x');
      expect(board.cells[1][1].rightEdge.value).toEqual('x');
    });
  });

  describe(`diagonally adjacent 1's with outer edges deleted`, () => {
    it('1 to bottom left of 1 with top outer edges deleted', () => {
      const values = [
        ['', '', '', ''],
        ['', '', '1', ''],
        ['', '1', '', ''],
        ['', '', '', ''],
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][2].topEdge.value = 'x';
      board.cells[1][2].rightEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[2][1].bottomEdge.value).toEqual('x');
      expect(board.cells[2][1].leftEdge.value).toEqual('x');
    });

    it('1 to bottom left of 1 with bottom outer edges deleted', () => {
      const values = [
        ['', '', '', ''],
        ['', '', '1', ''],
        ['', '1', '', ''],
        ['', '', '', ''],
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[2][1].bottomEdge.value = 'x';
      board.cells[2][1].leftEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][2].topEdge.value).toEqual('x');
      expect(board.cells[1][2].rightEdge.value).toEqual('x');
    });

    it('1 to bottom right of 1 with top outer edges deleted', () => {
      const values = [
        ['', '', '', ''],
        ['', '1', '', ''],
        ['', '', '1', ''],
        ['', '', '', ''],
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][1].topEdge.value = 'x';
      board.cells[1][1].leftEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[2][2].bottomEdge.value).toEqual('x');
      expect(board.cells[2][2].rightEdge.value).toEqual('x');
    });

    it('1 to bottom right of 1 with bottom outer edges deleted', () => {
      const values = [
        ['', '', '', ''],
        ['', '1', '', ''],
        ['', '', '1', ''],
        ['', '', '', ''],
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[2][2].bottomEdge.value = 'x';
      board.cells[2][2].rightEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].topEdge.value).toEqual('x');
      expect(board.cells[1][1].leftEdge.value).toEqual('x');
    });
  });

  describe(`adjacent 1's on outer edge`, () => {
    it(`horizontally adjacent 1's on top edge`, () => {
      const values = [
        ['', '1', '1', ''],
        ['', '', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.applyOneTimeSolvePassNoCornerCounts();
      expect(board.cells[0][1].rightEdge.value).toEqual('x');
    });

    it(`horizontally adjacent 1's on bottom edge`, () => {
      const values = [
        ['', '', '', ''],
        ['', '1', '1', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.applyOneTimeSolvePassNoCornerCounts();
      expect(board.cells[1][1].rightEdge.value).toEqual('x');
    });

    it(`vertically adjacent 1's on left edge`, () => {
      const values = [
        ['', ''],
        ['1', ''],
        ['1', ''],
        ['', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.applyOneTimeSolvePassNoCornerCounts();
      expect(board.cells[1][0].bottomEdge.value).toEqual('x');
    });

    it(`vertically adjacent 1's on right edge`, () => {
      const values = [
        ['', ''],
        ['', '1'],
        ['', '1'],
        ['', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.applyOneTimeSolvePassNoCornerCounts();
      expect(board.cells[1][1].bottomEdge.value).toEqual('x');
    });
  });
});

describe('2 cell cases', () => {
  describe('2 with incoming line and non-adjacent deleted edge', () => {
    it('2 with top left horizontal line with bottom deleted edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][0].bottomEdge.value = '-';
      board.cells[1][1].bottomEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[0][0].rightEdge.value).toEqual('x');
      expect(board.cells[1][1].rightEdge.value).toEqual('-');
    });

    it('2 with top left vertical line with bottom deleted edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][0].rightEdge.value = '-';
      board.cells[1][1].bottomEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[0][0].bottomEdge.value).toEqual('x');
      expect(board.cells[1][1].rightEdge.value).toEqual('-');
    });

    it('2 with top left horizontal line with right deleted edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][0].bottomEdge.value = '-';
      board.cells[1][1].rightEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[0][0].rightEdge.value).toEqual('x');
      expect(board.cells[1][1].bottomEdge.value).toEqual('-');
    });

    it('2 with top left vertical line with right deleted edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][0].rightEdge.value = '-';
      board.cells[1][1].rightEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[0][0].bottomEdge.value).toEqual('x');
      expect(board.cells[1][1].bottomEdge.value).toEqual('-');
    });

    it('2 with top right horizontal line with bottom deleted edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][2].bottomEdge.value = '-';
      board.cells[1][1].bottomEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[0][2].leftEdge.value).toEqual('x');
      expect(board.cells[1][1].leftEdge.value).toEqual('-');
    });

    it('2 with top right vertical line with bottom deleted edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][2].leftEdge.value = '-';
      board.cells[1][1].bottomEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[0][2].bottomEdge.value).toEqual('x');
      expect(board.cells[1][1].leftEdge.value).toEqual('-');
    });

    it('2 with top right horizontal line with left deleted edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][2].bottomEdge.value = '-';
      board.cells[1][1].leftEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[0][2].leftEdge.value).toEqual('x');
      expect(board.cells[1][1].bottomEdge.value).toEqual('-');
    });

    it('2 with top right vertical line with left deleted edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][2].leftEdge.value = '-';
      board.cells[1][1].leftEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[0][2].bottomEdge.value).toEqual('x');
      expect(board.cells[1][1].bottomEdge.value).toEqual('-');
    });

    it('2 with bottom left horizontal line with top deleted edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][1].topEdge.value = 'x';
      board.cells[2][0].topEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].rightEdge.value).toEqual('-');
      expect(board.cells[2][0].rightEdge.value).toEqual('x');
    });

    it('2 with bottom left vertical line with top deleted edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][1].topEdge.value = 'x';
      board.cells[2][0].rightEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].rightEdge.value).toEqual('-');
      expect(board.cells[2][0].topEdge.value).toEqual('x');
    });

    it('2 with bottom left horizontal line with right deleted edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][1].rightEdge.value = 'x';
      board.cells[2][0].topEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].topEdge.value).toEqual('-');
      expect(board.cells[2][0].rightEdge.value).toEqual('x');
    });

    it('2 with bottom left vertical line with right deleted edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][1].rightEdge.value = 'x';
      board.cells[2][0].rightEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].topEdge.value).toEqual('-');
      expect(board.cells[2][0].topEdge.value).toEqual('x');
    });

    it('2 with bottom right horizontal line with top deleted edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][1].topEdge.value = 'x';
      board.cells[2][2].topEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].leftEdge.value).toEqual('-');
      expect(board.cells[2][2].leftEdge.value).toEqual('x');
    });

    it('2 with bottom right vertical line with top deleted edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][1].topEdge.value = 'x';
      board.cells[2][2].leftEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].leftEdge.value).toEqual('-');
      expect(board.cells[2][2].topEdge.value).toEqual('x');
    });

    it('2 with bottom right horizontal line with left deleted edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][1].leftEdge.value = 'x';
      board.cells[2][2].topEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].topEdge.value).toEqual('-');
      expect(board.cells[2][2].leftEdge.value).toEqual('x');
    });

    it('2 with bottom right vertical line with left deleted edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][1].leftEdge.value = 'x';
      board.cells[2][2].leftEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].topEdge.value).toEqual('-');
      expect(board.cells[2][2].topEdge.value).toEqual('x');
    });
  });

  describe('2 with one included edge, deleted adjacent edge, and deleted opposite corner edge', () => {
    it('2 with included top edge, deleted left edge, and deleted bottom right horizontal edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][1].topEdge.value = '-';
      board.cells[1][1].leftEdge.value = 'x';
      board.cells[2][2].topEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[2][2].leftEdge.value).toEqual('-');
    });

    it('2 with included top edge, deleted left edge, and deleted bottom right vertical edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][1].topEdge.value = '-';
      board.cells[1][1].leftEdge.value = 'x';
      board.cells[2][2].leftEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[2][2].topEdge.value).toEqual('-');
    });

    it('2 with included top edge, deleted right edge, and deleted bottom left horizontal edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][1].topEdge.value = '-';
      board.cells[1][1].rightEdge.value = 'x';
      board.cells[2][0].topEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[2][0].rightEdge.value).toEqual('-');
    });

    it('2 with included top edge, deleted right edge, and deleted bottom left vertical edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][1].topEdge.value = '-';
      board.cells[1][1].rightEdge.value = 'x';
      board.cells[2][0].rightEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[2][0].topEdge.value).toEqual('-');
    });

    it('2 with included bottom edge, deleted left edge, and deleted top right horizontal edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][2].bottomEdge.value = 'x';
      board.cells[1][1].bottomEdge.value = '-';
      board.cells[1][1].leftEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[0][2].leftEdge.value).toEqual('-');
    });

    it('2 with included bottom edge, deleted left edge, and deleted top right vertical edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][2].leftEdge.value = 'x';
      board.cells[1][1].bottomEdge.value = '-';
      board.cells[1][1].leftEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[0][2].bottomEdge.value).toEqual('-');
    });

    it('2 with included bottom edge, deleted right edge, and deleted top left horizontal edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][0].bottomEdge.value = 'x';
      board.cells[1][1].bottomEdge.value = '-';
      board.cells[1][1].rightEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[0][0].rightEdge.value).toEqual('-');
    });

    it('2 with included bottom edge, deleted right edge, and deleted top left vertical edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][0].rightEdge.value = 'x';
      board.cells[1][1].bottomEdge.value = '-';
      board.cells[1][1].rightEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[0][0].bottomEdge.value).toEqual('-');
    });

    it('2 with included left edge, deleted top edge, and deleted bottom right horizontal edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][1].topEdge.value = 'x';
      board.cells[1][1].leftEdge.value = '-';
      board.cells[2][2].topEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[2][2].leftEdge.value).toEqual('-');
    });

    it('2 with included left edge, deleted top edge, and deleted bottom right vertical edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][1].topEdge.value = 'x';
      board.cells[1][1].leftEdge.value = '-';
      board.cells[2][2].leftEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[2][2].topEdge.value).toEqual('-');
    });

    it('2 with included left edge, deleted bottom edge, and deleted top right horizontal edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][2].bottomEdge.value = 'x';
      board.cells[1][1].bottomEdge.value = 'x';
      board.cells[1][1].leftEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[0][2].leftEdge.value).toEqual('-');
    });

    it('2 with included left edge, deleted bottom edge, and deleted top right vertical edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][2].leftEdge.value = 'x';
      board.cells[1][1].bottomEdge.value = 'x';
      board.cells[1][1].leftEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[0][2].bottomEdge.value).toEqual('-');
    });

    it('2 with included right edge, deleted top edge, and deleted bottom left horizontal edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][1].topEdge.value = 'x';
      board.cells[1][1].rightEdge.value = '-';
      board.cells[2][0].topEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[2][0].rightEdge.value).toEqual('-');
    });

    it('2 with included right edge, deleted top edge, and deleted bottom left vertical edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][1].topEdge.value = 'x';
      board.cells[1][1].rightEdge.value = '-';
      board.cells[2][0].rightEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[2][0].topEdge.value).toEqual('-');
    });

    it('2 with included right edge, deleted bottom edge, and deleted top left horizontal edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][0].bottomEdge.value = 'x';
      board.cells[1][1].bottomEdge.value = 'x';
      board.cells[1][1].rightEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[0][0].rightEdge.value).toEqual('-');
    });

    it('2 with included right edge, deleted bottom edge, and deleted top left vertical edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][0].rightEdge.value = 'x';
      board.cells[1][1].bottomEdge.value = 'x';
      board.cells[1][1].rightEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[0][0].bottomEdge.value).toEqual('-');
    });
  });

  describe('2 on outer edge with one included edge and deleted adjacent edge', () => {
    it('2 with included top edge and deleted left edge on right edge', () => {
      const values = [
        ['', ''],
        ['', '2'],
        ['', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][1].topEdge.value = '-';
      board.cells[1][1].leftEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[2][1].rightEdge.value).toEqual('-');
    });

    it('2 with included top edge and deleted left edge on bottom edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][1].topEdge.value = '-';
      board.cells[1][1].leftEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][2].bottomEdge.value).toEqual('-');
    });

    it('2 with included top edge and deleted right edge on left edge', () => {
      const values = [
        ['', ''],
        ['2', ''],
        ['', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][0].topEdge.value = '-';
      board.cells[1][0].rightEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[2][0].leftEdge.value).toEqual('-');
    });

    it('2 with included top edge and deleted right edge on bottom edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][1].topEdge.value = '-';
      board.cells[1][1].rightEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][0].bottomEdge.value).toEqual('-');
    });

    it('2 with included bottom edge and deleted left edge on right edge', () => {
      const values = [
        ['', ''],
        ['', '2'],
        ['', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][1].bottomEdge.value = '-';
      board.cells[1][1].leftEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[0][1].rightEdge.value).toEqual('-');
    });

    it('2 with included bottom edge and deleted left edge on top edge', () => {
      const values = [
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][1].bottomEdge.value = '-';
      board.cells[0][1].leftEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[0][2].topEdge.value).toEqual('-');
    });

    it('2 with included bottom edge and deleted right edge on left edge', () => {
      const values = [
        ['', ''],
        ['2', ''],
        ['', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][0].bottomEdge.value = '-';
      board.cells[1][0].rightEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[0][0].leftEdge.value).toEqual('-');
    });

    it('2 with included bottom edge and deleted right edge on top edge', () => {
      const values = [
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][1].bottomEdge.value = '-';
      board.cells[0][1].rightEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[0][0].topEdge.value).toEqual('-');
    });

    it('2 with included left edge and deleted top edge on right edge', () => {
      const values = [
        ['', ''],
        ['', '2'],
        ['', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][1].topEdge.value = 'x';
      board.cells[1][1].leftEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[2][1].rightEdge.value).toEqual('-');
    });

    it('2 with included left edge and deleted top edge on bottom edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][1].topEdge.value = 'x';
      board.cells[1][1].leftEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][2].bottomEdge.value).toEqual('-');
    });

    it('2 with included left edge and deleted bottom edge on right edge', () => {
      const values = [
        ['', ''],
        ['', '2'],
        ['', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][1].bottomEdge.value = 'x';
      board.cells[1][1].leftEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[0][1].rightEdge.value).toEqual('-');
    });

    it('2 with included left edge and deleted bottom edge on top edge', () => {
      const values = [
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][1].bottomEdge.value = 'x';
      board.cells[0][1].leftEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[0][2].topEdge.value).toEqual('-');
    });

    it('2 with included right edge and deleted top edge on left edge', () => {
      const values = [
        ['', ''],
        ['2', ''],
        ['', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][0].topEdge.value = 'x';
      board.cells[1][0].rightEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[2][0].leftEdge.value).toEqual('-');
    });

    it('2 with included right edge and deleted top edge on bottom edge', () => {
      const values = [
        ['', '', ''],
        ['', '2', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][1].topEdge.value = 'x';
      board.cells[1][1].rightEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][0].bottomEdge.value).toEqual('-');
    });

    it('2 with included right edge and deleted bottom edge on left edge', () => {
      const values = [
        ['', ''],
        ['2', ''],
        ['', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[1][0].bottomEdge.value = 'x';
      board.cells[1][0].rightEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[0][0].leftEdge.value).toEqual('-');
    });

    it('2 with included right edge and deleted bottom edge on top edge', () => {
      const values = [
        ['', '2', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][1].bottomEdge.value = 'x';
      board.cells[0][1].rightEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[0][0].topEdge.value).toEqual('-');
    });
  });
});

describe('3 cell cases', () => {
  describe('adjacent 3 and 0', () => {
    it('0 above 3', () => {
      const values = [
        ['', '', ''],
        ['', '0', ''],
        ['', '3', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.applyOneTimeSolvePassNoCornerCounts();
      expect(board.cells[2][0].topEdge.value).toEqual('-');
      expect(board.cells[2][1].bottomEdge.value).toEqual('-');
      expect(board.cells[2][1].leftEdge.value).toEqual('-');
      expect(board.cells[2][1].rightEdge.value).toEqual('-');
      expect(board.cells[2][2].topEdge.value).toEqual('-');
    });

    it('0 below 3', () => {
      const values = [
        ['', '', ''],
        ['', '3', ''],
        ['', '0', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.applyOneTimeSolvePassNoCornerCounts();
      expect(board.cells[1][0].bottomEdge.value).toEqual('-');
      expect(board.cells[1][1].topEdge.value).toEqual('-');
      expect(board.cells[1][1].leftEdge.value).toEqual('-');
      expect(board.cells[1][1].rightEdge.value).toEqual('-');
      expect(board.cells[1][2].bottomEdge.value).toEqual('-');
    });

    it('0 to left of 3', () => {
      const values = [
        ['', '', '', ''],
        ['', '0', '3', ''],
        ['', '', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.applyOneTimeSolvePassNoCornerCounts();
      expect(board.cells[0][2].leftEdge.value).toEqual('-');
      expect(board.cells[1][2].topEdge.value).toEqual('-');
      expect(board.cells[1][2].bottomEdge.value).toEqual('-');
      expect(board.cells[1][2].rightEdge.value).toEqual('-');
      expect(board.cells[2][2].leftEdge.value).toEqual('-');
    });

    it('0 to right of 3', () => {
      const values = [
        ['', '', '', ''],
        ['', '3', '0', ''],
        ['', '', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.applyOneTimeSolvePassNoCornerCounts();
      expect(board.cells[0][1].rightEdge.value).toEqual('-');
      expect(board.cells[1][1].topEdge.value).toEqual('-');
      expect(board.cells[1][1].bottomEdge.value).toEqual('-');
      expect(board.cells[1][1].leftEdge.value).toEqual('-');
      expect(board.cells[2][1].rightEdge.value).toEqual('-');
    });
  });

  describe(`adjacent 3's`, () => {
    it(`horizontally adjacent 3's`, () => {
      const values = [
        ['', '', '', ''],
        ['', '3', '3', ''],
        ['', '', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.applyOneTimeSolvePassNoCornerCounts();
      expect(board.cells[0][1].rightEdge.value).toEqual('x');
      expect(board.cells[1][1].leftEdge.value).toEqual('-');
      expect(board.cells[1][1].rightEdge.value).toEqual('-');
      expect(board.cells[1][2].rightEdge.value).toEqual('-');
      expect(board.cells[2][1].rightEdge.value).toEqual('x');
    });

    it(`vertically adjacent 3's`, () => {
      const values = [
        ['', '', ''],
        ['', '3', ''],
        ['', '3', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.applyOneTimeSolvePassNoCornerCounts();
      expect(board.cells[1][0].bottomEdge.value).toEqual('x');
      expect(board.cells[1][1].topEdge.value).toEqual('-');
      expect(board.cells[1][1].bottomEdge.value).toEqual('-');
      expect(board.cells[1][2].bottomEdge.value).toEqual('x');
      expect(board.cells[2][1].bottomEdge.value).toEqual('-');
    });
  });

  describe('diagonally adjacent 3 and 0', () => {
    it('3 with 0 to top left', () => {
      const values = [
        ['', '', '', ''],
        ['', '0', '', ''],
        ['', '', '3', ''],
        ['', '', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].bottomEdge.value).toEqual('x');
      expect(board.cells[1][1].rightEdge.value).toEqual('x');
      expect(board.cells[2][2].topEdge.value).toEqual('-');
      expect(board.cells[2][2].leftEdge.value).toEqual('-');
    });

    it('3 with 0 to top right', () => {
      const values = [
        ['', '', '', ''],
        ['', '', '0', ''],
        ['', '3', '', ''],
        ['', '', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][2].bottomEdge.value).toEqual('x');
      expect(board.cells[1][2].leftEdge.value).toEqual('x');
      expect(board.cells[2][1].topEdge.value).toEqual('-');
      expect(board.cells[2][1].rightEdge.value).toEqual('-');
    });

    it('3 with 0 to bottom left', () => {
      const values = [
        ['', '', '', ''],
        ['', '', '3', ''],
        ['', '0', '', ''],
        ['', '', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][2].bottomEdge.value).toEqual('-');
      expect(board.cells[1][2].leftEdge.value).toEqual('-');
      expect(board.cells[2][1].topEdge.value).toEqual('x');
      expect(board.cells[2][1].rightEdge.value).toEqual('x');
    });

    it('3 with 0 to bottom right', () => {
      const values = [
        ['', '', '', ''],
        ['', '3', '', ''],
        ['', '', '0', ''],
        ['', '', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].bottomEdge.value).toEqual('-');
      expect(board.cells[1][1].rightEdge.value).toEqual('-');
      expect(board.cells[2][2].topEdge.value).toEqual('x');
      expect(board.cells[2][2].leftEdge.value).toEqual('x');
    });
  });

  describe('3 with two deleted edges exiting a corner', () => {
    it('3 with top left corner edges deleted', () => {
      const values = [
        ['', '', ''],
        ['', '3', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][0].bottomEdge.value = 'x';
      board.cells[0][0].rightEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].topEdge.value).toEqual('-');
      expect(board.cells[1][1].leftEdge.value).toEqual('-');
    });

    it('3 with top right corner edges deleted', () => {
      const values = [
        ['', '', ''],
        ['', '3', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][2].bottomEdge.value = 'x';
      board.cells[0][2].leftEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].topEdge.value).toEqual('-');
      expect(board.cells[1][1].rightEdge.value).toEqual('-');
    });

    it('3 with bottom left corner edges deleted', () => {
      const values = [
        ['', '', ''],
        ['', '3', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[2][0].topEdge.value = 'x';
      board.cells[2][0].rightEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].bottomEdge.value).toEqual('-');
      expect(board.cells[1][1].leftEdge.value).toEqual('-');
    });

    it('3 with bottom right corner edges deleted', () => {
      const values = [
        ['', '', ''],
        ['', '3', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[2][2].topEdge.value = 'x';
      board.cells[2][2].leftEdge.value = 'x';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].bottomEdge.value).toEqual('-');
      expect(board.cells[1][1].rightEdge.value).toEqual('-');
    });
  });

  describe('3 on outer edge with opposite edge deleted', () => {
    // TODO
  });

  describe('3 with incoming line', () => {
    it('3 with incoming top left horizontal line', () => {
      const values = [
        ['', '', ''],
        ['', '3', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][0].bottomEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[0][0].rightEdge.value).toEqual('x');
      expect(board.cells[1][1].bottomEdge.value).toEqual('-');
      expect(board.cells[1][1].rightEdge.value).toEqual('-');
    });

    it('3 with incoming top left vertical line', () => {
      const values = [
        ['', '', ''],
        ['', '3', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][0].rightEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[0][0].bottomEdge.value).toEqual('x');
      expect(board.cells[1][1].bottomEdge.value).toEqual('-');
      expect(board.cells[1][1].rightEdge.value).toEqual('-');
    });

    it('3 with incoming top right horizontal line', () => {
      const values = [
        ['', '', ''],
        ['', '3', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][2].bottomEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[0][2].leftEdge.value).toEqual('x');
      expect(board.cells[1][1].bottomEdge.value).toEqual('-');
      expect(board.cells[1][1].leftEdge.value).toEqual('-');
    });

    it('3 with incoming top right vertical line', () => {
      const values = [
        ['', '', ''],
        ['', '3', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][2].leftEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[0][2].bottomEdge.value).toEqual('x');
      expect(board.cells[1][1].bottomEdge.value).toEqual('-');
      expect(board.cells[1][1].leftEdge.value).toEqual('-');
    });

    it('3 with incoming bottom left horizontal line', () => {
      const values = [
        ['', '', ''],
        ['', '3', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[2][0].topEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].topEdge.value).toEqual('-');
      expect(board.cells[1][1].rightEdge.value).toEqual('-');
      expect(board.cells[2][0].rightEdge.value).toEqual('x');
    });

    it('3 with incoming bottom left vertical line', () => {
      const values = [
        ['', '', ''],
        ['', '3', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[2][0].rightEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].topEdge.value).toEqual('-');
      expect(board.cells[1][1].rightEdge.value).toEqual('-');
      expect(board.cells[2][0].topEdge.value).toEqual('x');
    });

    it('3 with incoming bottom right horizontal line', () => {
      const values = [
        ['', '', ''],
        ['', '3', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[2][2].topEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].topEdge.value).toEqual('-');
      expect(board.cells[1][1].leftEdge.value).toEqual('-');
      expect(board.cells[2][2].leftEdge.value).toEqual('x');
    });

    it('3 with incoming bottom right vertical line', () => {
      const values = [
        ['', '', ''],
        ['', '3', ''],
        ['', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[2][2].leftEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].topEdge.value).toEqual('-');
      expect(board.cells[1][1].leftEdge.value).toEqual('-');
      expect(board.cells[2][2].topEdge.value).toEqual('x');
    });
  });
});

describe('diagonals of 3 and 2', () => {
  describe(`diagonally adjacent 3's`, () => {
    it('3 with 3 to bottom left', () => {
      const values = [
        ['', '', '', ''],
        ['', '', '3', ''],
        ['', '3', '', ''],
        ['', '', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.applyOneTimeSolvePassNoCornerCounts();
      expect(board.cells[1][2].topEdge.value).toEqual('-');
      expect(board.cells[1][2].rightEdge.value).toEqual('-');
      expect(board.cells[2][1].bottomEdge.value).toEqual('-');
      expect(board.cells[2][1].leftEdge.value).toEqual('-');
    });

    it('3 with 3 to bottom right', () => {
      const values = [
        ['', '', '', ''],
        ['', '3', '', ''],
        ['', '', '3', ''],
        ['', '', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.applyOneTimeSolvePassNoCornerCounts();
      expect(board.cells[1][1].topEdge.value).toEqual('-');
      expect(board.cells[1][1].leftEdge.value).toEqual('-');
      expect(board.cells[2][2].bottomEdge.value).toEqual('-');
      expect(board.cells[2][2].rightEdge.value).toEqual('-');
    });
  });

  describe(`diagonally adjacent 3's separated by 2's`, () => {
    it(`3 with bottom left adjacent 3 separated by 2's`, () => {
      const values = [
        ['', '', '', '', '', ''],
        ['', '', '', '', '3', ''],
        ['', '', '', '2', '', ''],
        ['', '', '2', '', '', ''],
        ['', '3', '', '', '', ''],
        ['', '', '', '', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.applyOneTimeSolvePassNoCornerCounts();
      expect(board.cells[1][4].topEdge.value).toEqual('-');
      expect(board.cells[1][4].rightEdge.value).toEqual('-');
      expect(board.cells[4][1].bottomEdge.value).toEqual('-');
      expect(board.cells[4][1].leftEdge.value).toEqual('-');
    });

    it(`3 with bottom right adjacent 3 separated by 2's`, () => {
      const values = [
        ['', '', '', '', '', ''],
        ['', '3', '', '', '', ''],
        ['', '', '2', '', '', ''],
        ['', '', '', '2', '', ''],
        ['', '', '', '', '3', ''],
        ['', '', '', '', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.applyOneTimeSolvePassNoCornerCounts();
      expect(board.cells[1][1].topEdge.value).toEqual('-');
      expect(board.cells[1][1].leftEdge.value).toEqual('-');
      expect(board.cells[4][4].bottomEdge.value).toEqual('-');
      expect(board.cells[4][4].rightEdge.value).toEqual('-');
    });
  });

  describe(`diagonally adjacent 2's with angled line at end of series`, () => {
    it('2 with 2 to bottom left starting with angled line', () => {
      const values = [
        ['', '', '', ''],
        ['', '', '2', ''],
        ['', '2', '', ''],
        ['', '', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][3].bottomEdge.value = '-';
      board.cells[0][3].leftEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][2].bottomEdge.value).toEqual('-');
      expect(board.cells[1][2].leftEdge.value).toEqual('-');
      expect(board.cells[2][1].bottomEdge.value).toEqual('-');
      expect(board.cells[2][1].leftEdge.value).toEqual('-');
    });

    it('2 with 2 to bottom right starting with angled line', () => {
      const values = [
        ['', '', '', ''],
        ['', '2', '', ''],
        ['', '', '2', ''],
        ['', '', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][0].bottomEdge.value = '-';
      board.cells[0][0].rightEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].bottomEdge.value).toEqual('-');
      expect(board.cells[1][1].rightEdge.value).toEqual('-');
      expect(board.cells[2][2].bottomEdge.value).toEqual('-');
      expect(board.cells[2][2].rightEdge.value).toEqual('-');
    });

    it('2 with 2 to bottom left terminating with angled line', () => {
      const values = [
        ['', '', '', ''],
        ['', '', '2', ''],
        ['', '2', '', ''],
        ['', '', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[3][0].topEdge.value = '-';
      board.cells[3][0].rightEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][2].topEdge.value).toEqual('-');
      expect(board.cells[1][2].rightEdge.value).toEqual('-');
      expect(board.cells[2][1].topEdge.value).toEqual('-');
      expect(board.cells[2][1].rightEdge.value).toEqual('-');
    });

    it('2 with 2 to bottom right terminating with angled line', () => {
      const values = [
        ['', '', '', ''],
        ['', '2', '', ''],
        ['', '', '2', ''],
        ['', '', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[3][3].topEdge.value = '-';
      board.cells[3][3].leftEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].topEdge.value).toEqual('-');
      expect(board.cells[1][1].leftEdge.value).toEqual('-');
      expect(board.cells[2][2].topEdge.value).toEqual('-');
      expect(board.cells[2][2].leftEdge.value).toEqual('-');
    });
  });

  describe(`diagonally adjacent 2's ending with a 3 with incoming line at first 2`, () => {
    it(`diagonally adjacent 2's ending with a 3 to bottom right with horizontal incoming line`, () => {
      const values = [
        ['', '', '', '', ''],
        ['', '2', '', '', ''],
        ['', '', '2', '', ''],
        ['', '', '', '3', ''],
        ['', '', '', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][0].bottomEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[3][3].bottomEdge.value).toEqual('-');
      expect(board.cells[3][3].rightEdge.value).toEqual('-');
    });

    it(`diagonally adjacent 2's ending with a 3 to bottom right with vertical incoming line`, () => {
      const values = [
        ['', '', '', '', ''],
        ['', '2', '', '', ''],
        ['', '', '2', '', ''],
        ['', '', '', '3', ''],
        ['', '', '', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][0].rightEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[3][3].bottomEdge.value).toEqual('-');
      expect(board.cells[3][3].rightEdge.value).toEqual('-');
    });

    it(`diagonally adjacent 2's ending with a 3 to bottom left with horizontal incoming line`, () => {
      const values = [
        ['', '', '', '', ''],
        ['', '', '', '2', ''],
        ['', '', '2', '', ''],
        ['', '3', '', '', ''],
        ['', '', '', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][4].bottomEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[3][1].bottomEdge.value).toEqual('-');
      expect(board.cells[3][1].leftEdge.value).toEqual('-');
    });

    it(`diagonally adjacent 2's ending with a 3 to bottom left with vertical incoming line`, () => {
      const values = [
        ['', '', '', '', ''],
        ['', '', '', '2', ''],
        ['', '', '2', '', ''],
        ['', '3', '', '', ''],
        ['', '', '', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[0][4].leftEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[3][1].bottomEdge.value).toEqual('-');
      expect(board.cells[3][1].leftEdge.value).toEqual('-');
    });

    it(`diagonally adjacent 2's ending with a 3 to top left with horizontal incoming line`, () => {
      const values = [
        ['', '', '', '', ''],
        ['', '3', '', '', ''],
        ['', '', '2', '', ''],
        ['', '', '', '2', ''],
        ['', '', '', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[4][4].topEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].topEdge.value).toEqual('-');
      expect(board.cells[1][1].leftEdge.value).toEqual('-');
    });

    it(`diagonally adjacent 2's ending with a 3 to top left with vertical incoming line`, () => {
      const values = [
        ['', '', '', '', ''],
        ['', '3', '', '', ''],
        ['', '', '2', '', ''],
        ['', '', '', '2', ''],
        ['', '', '', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[4][4].leftEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][1].topEdge.value).toEqual('-');
      expect(board.cells[1][1].leftEdge.value).toEqual('-');
    });

    it(`diagonally adjacent 2's ending with a 3 to top right with horizontal incoming line`, () => {
      const values = [
        ['', '', '', '', ''],
        ['', '', '', '3', ''],
        ['', '', '2', '', ''],
        ['', '2', '', '', ''],
        ['', '', '', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[4][0].topEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][3].topEdge.value).toEqual('-');
      expect(board.cells[1][3].rightEdge.value).toEqual('-');
    });

    it(`diagonally adjacent 2's ending with a 3 to top right with vertical incoming line`, () => {
      const values = [
        ['', '', '', '', ''],
        ['', '', '', '3', ''],
        ['', '', '2', '', ''],
        ['', '2', '', '', ''],
        ['', '', '', '', '']
      ];
      const board = new SlitherlinkBoard(values);
      board.cells[4][0].rightEdge.value = '-';
      board.applyOneTimeSolvePassNoCornerCounts();
      board.runSolveLoopNoCornerCounts();
      expect(board.cells[1][3].topEdge.value).toEqual('-');
      expect(board.cells[1][3].rightEdge.value).toEqual('-');
    });
  });
});

describe('diagonals of 3 and 1', () => {
  it('diagonally adjacent 3 and 1 with outer edges of 1 deleted', () => {
    const values = [
      ['', '', '', ''],
      ['', '3', '', ''],
      ['', '', '1', ''],
      ['', '', '', '']
    ];
    const board = new SlitherlinkBoard(values);
    board.markEdge(board.cells[2][2].bottomEdge, 'x');
    board.markEdge(board.cells[2][2].rightEdge, 'x');
    board.applyOneTimeSolvePass();
    board.runSolveLoop();
    expect(board.cells[1][1].topEdge.value).toEqual('-');
    expect(board.cells[1][1].leftEdge.value).toEqual('-');
  });

  it('diagonally adjacent 3 and 1 with outer edges of 3 included', () => {
    const values = [
      ['', '', '', ''],
      ['', '3', '', ''],
      ['', '', '1', ''],
      ['', '', '', '']
    ];
    const board = new SlitherlinkBoard(values);
    board.markEdge(board.cells[1][1].topEdge, '-');
    board.markEdge(board.cells[1][1].leftEdge, '-');
    board.applyOneTimeSolvePass();
    board.runSolveLoop();
    expect(board.cells[2][2].bottomEdge.value).toEqual('x');
    expect(board.cells[2][2].rightEdge.value).toEqual('x');
  });
});

describe('diagonals starting with 2', () => {
  it('diagonally adjacent 2 and 1 with line approaching 2', () => {
    const values = [
      ['', '', '', ''],
      ['', '1', '', ''],
      ['', '', '2', ''],
      ['', '', '', '']
    ];
    const board = new SlitherlinkBoard(values);
    board.markEdge(board.cells[3][3].topEdge, 'x');
    board.markEdge(board.cells[3][3].leftEdge, '-');
    board.applyOneTimeSolvePass();
    board.runSolveLoop();
    expect(board.cells[1][1].topEdge.value).toEqual('x');
    expect(board.cells[1][1].leftEdge.value).toEqual('x');
  });

  it(`diagonally adjacent 2's with line approaching 2`, () => {
    const values = [
      ['', '', '', ''],
      ['', '2', '', ''],
      ['', '', '2', ''],
      ['', '', '', '']
    ];
    const board = new SlitherlinkBoard(values);
    board.markEdge(board.cells[0][0].bottomEdge, 'x');
    board.markEdge(board.cells[3][3].topEdge, '-');
    board.markEdge(board.cells[3][3].leftEdge, 'x');
    board.applyOneTimeSolvePass();
    board.runSolveLoop();
    expect(board.cells[0][0].rightEdge.value).toEqual('-');
  });
});

describe('every corner must have exactly 0 or 2 connected edges', () => {
  // TODO
});

describe('solution counts', () => {
  it('no solution', () => {
    const values = [
      ['1', '1'],
      ['1', '1']
    ];
    const board = new SlitherlinkBoard(values);
    expect(board.solve()).toEqual(0);
  });

  it('one solution', () => {
    const values = [
      ['2', '2'],
      ['2', '2']
    ];
    const board = new SlitherlinkBoard(values);
    expect(board.solve()).toEqual(1);
  });

  it('two solutions', () => {
    const values = [
      ['3', '2'],
      ['2', '3']
    ];
    const board = new SlitherlinkBoard(values);
    expect(board.solve()).toEqual(2);
  });
});

describe('solvable boards', () => {
  it('6 x 6', () => {
    const values = [
      ['', '', '', '', '0', ''],
      ['3', '3', '', '', '1', ''],
      ['', '', '1', '2', '', ''],
      ['', '', '2', '0', '', ''],
      ['', '1', '', '', '1', '1'],
      ['', '2', '', '', '', '']
    ];
    const board = new SlitherlinkBoard(values);
    expect(board.solve()).toEqual(1);
  });

  it('7 x 7', () => {
    const values = [
      ['2', '2', '2', '3', '3', '1', ''],
      ['', '', '0', '2', '', '3', ''],
      ['', '', '', '', '', '', ''],
      ['3', '3', '', '', '3', '3', ''],
      ['', '', '2', '', '2', '', ''],
      ['3', '', '2', '', '2', '2', ''],
      ['3', '', '2', '', '', '3', '']
    ];
    const board = new SlitherlinkBoard(values);
    expect(board.solve()).toEqual(1);
  });

  it.skip('20 x 20 hard', () => {
    const values = [
      ['2', '', '', '', '', '2', '', '2', '', '1', '', '2', '', '2', '2', '', '3', '3', '', ''],
      ['', '', '2', '', '3', '', '', '', '3', '', '3', '2', '', '', '', '', '1', '', '1', '2'],
      ['1', '2', '', '', '2', '2', '3', '', '', '2', '', '', '', '2', '2', '', '3', '2', '', ''],
      ['1', '', '2', '', '', '2', '', '', '2', '2', '', '', '', '', '', '', '', '2', '2', ''],
      ['2', '', '', '1', '', '', '', '3', '3', '', '', '', '', '2', '1', '3', '', '1', '', ''],
      ['1', '', '', '2', '2', '', '', '', '1', '3', '', '', '', '', '3', '1', '', '3', '', ''],
      ['', '3', '2', '', '', '', '', '', '2', '', '', '3', '2', '', '', '1', '0', '', '', '3'],
      ['3', '', '3', '', '', '2', '1', '', '', '3', '', '', '', '3', '', '2', '3', '', '2', ''],
      ['2', '', '', '2', '', '2', '', '1', '', '', '1', '', '', '', '', '2', '', '1', '', ''],
      ['', '', '2', '', '', '2', '2', '3', '3', '1', '', '', '3', '3', '', '', '2', '', '', ''],
      ['2', '1', '3', '', '', '2', '', '', '', '2', '', '', '', '', '', '3', '', '', '3', '2'],
      ['', '', '', '', '3', '', '', '', '1', '1', '', '2', '', '', '0', '', '1', '', '', '3'],
      ['', '', '3', '', '2', '3', '2', '', '', '3', '2', '', '', '', '2', '', '2', '', '2', ''],
      ['', '3', '', '2', '', '2', '', '2', '3', '2', '', '3', '', '', '', '', '', '2', '', '3'],
      ['', '3', '', '', '', '1', '2', '', '', '2', '', '', '', '', '', '1', '2', '3', '', ''],
      ['2', '', '2', '', '', '2', '1', '', '', '', '', '3', '3', '', '2', '', '3', '', '0', '2'],
      ['', '', '3', '', '', '', '3', '', '2', '', '2', '', '', '2', '', '2', '', '', '2', ''],
      ['', '1', '', '', '', '', '', '2', '', '', '0', '', '2', '1', '', '2', '', '', '', ''],
      ['', '', '1', '', '3', '1', '2', '1', '', '', '2', '3', '2', '', '3', '', '', '2', '', ''],
      ['3', '', '2', '1', '', '', '', '', '2', '2', '', '', '', '2', '2', '', '', '3', '2', '']
    ];
    const board = new SlitherlinkBoard(values, 1);
    expect(board.solve()).toEqual(1);
  });
});
