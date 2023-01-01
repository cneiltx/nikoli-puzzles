import { useState, useEffect } from 'react';
import SlitherlinkBoard from '../model/SlitherlinkBoard';
import { IQuote } from '../components/Dialog';

interface ISlitherlinkState {
  board: SlitherlinkBoard;
  status: string;
  dialog: string;
  quote: IQuote;
  debugLevel: number;
  handleHEdgeClick: (row: number, col: number) => void;
  handleHEdgeRightClick: (row: number, col: number) => void;
  handleVEdgeClick: (row: number, col: number) => void;
  handleVEdgeRightClick: (row: number, col: number) => void;
  handleReset: () => void;
  handleResetConfirm: (button: string) => void;
  handleSolve: () => void;
  handleSolveConfirm: (button: string) => void;
  handleSolvedConfirm: (button: string) => void;
}

const SlitherlinkState = (rows: number, columns: number): ISlitherlinkState => {
  const sevenBySeven = [
    ['2', '2', '2', '3', '3', '1', ''],
    ['', '', '0', '2', '', '3', ''],
    ['', '', '', '', '', '', ''],
    ['3', '3', '', '', '3', '3', ''],
    ['', '', '2', '', '2', '', ''],
    ['3', '', '2', '', '2', '2', ''],
    ['3', '', '2', '', '', '3', '']
  ];
  const noSolution = [
    ['1', '1'],
    ['1', '1']
  ];
  const oneSolution = [
    ['2', '2'],
    ['2', '2']
  ];
  const twoSolutions = [
    ['3', '2'],
    ['2', '3']
  ];

  const debugLevel = 0;
  const [board, setBoard] = useState(new SlitherlinkBoard(sevenBySeven, debugLevel));
  const [status, setStatus] = useState('playing');
  const [dialog, setDialog] = useState('');
  const [quote, setQuote] = useState<IQuote>({ quote: '', author: '' });

  useEffect(() => {
    if (quote.quote === '') {
      getQuote();
    }
  }, [quote]);

  const getQuote = async () => {
    try {
      const response = await fetch('https://api.quotable.io/random');
      const data = await response.json();
      setQuote({
        quote: data.content,
        author: data.author
      });
    } catch (e) {
      console.error(e);
    }
  }

  const handleHEdgeClick = (row: number, col: number) => {
    board.vEdges[row][col].value = (board.vEdges[row][col].value === '-' ? '' : '-');
    setBoard(Object.create(board));
    checkIfSolved();
  };

  const handleHEdgeRightClick = (row: number, col: number) => {
    board.vEdges[row][col].value = (board.vEdges[row][col].value === 'x' ? '' : 'x');
    setBoard(Object.create(board));
  }

  const handleVEdgeClick = (row: number, col: number) => {
    board.hEdges[row][col].value = (board.hEdges[row][col].value === '-' ? '' : '-');
    setBoard(Object.create(board));
    checkIfSolved();
  };

  const handleVEdgeRightClick = (row: number, col: number) => {
    board.hEdges[row][col].value = (board.hEdges[row][col].value === 'x' ? '' : 'x');
    setBoard(Object.create(board));
  }

  const handleReset = () => {
    setDialog('reset');
  };

  const handleResetConfirm = (button: string) => {
    if (button === 'OK') {
      board.reset();
      setBoard(Object.create(board));
      setStatus('playing');
    }
    setDialog('');
  }

  const handleSolve = () => {
    setDialog('solve');
  };

  const handleSolveConfirm = (button: string) => {
    if (button === 'OK') {
      const solutions = board.solve();

      if (solutions === 0) {
        window.alert('No solution found');
      } else if (solutions > 1) {
        window.alert('Multiple solutions found');
      } else {
        //result.board.removeXEdges();
        setStatus('solved');
      }

      setBoard(Object.create(board));
    }
    setDialog('');
  }

  const checkIfSolved = () => {
    if (board.isSolved()) {
      setDialog('solved');
      setStatus('solved');
    }
  };

  const handleSolvedConfirm = (button: string) => {
    setDialog('');
  }

  return {
    board,
    status,
    dialog,
    quote,
    debugLevel,
    handleHEdgeClick,
    handleHEdgeRightClick,
    handleVEdgeClick,
    handleVEdgeRightClick,
    handleReset,
    handleResetConfirm,
    handleSolve,
    handleSolveConfirm,
    handleSolvedConfirm
  };
}

export default SlitherlinkState;