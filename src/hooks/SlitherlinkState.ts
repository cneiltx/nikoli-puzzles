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
  handleHEdgeContextMenu: (row: number, col: number) => void;
  handleVEdgeClick: (row: number, col: number) => void;
  handleVEdgeContextMenu: (row: number, col: number) => void;
  handleReset: () => void;
  handleResetConfirm: (button: string) => void;
  handleSolve: () => void;
  handleSolveConfirm: (button: string) => void;
  handleSolvedConfirm: (button: string) => void;
}

const SlitherlinkState = (rows: number, columns: number): ISlitherlinkState => {
  const sixBySixHard = [
    ['', '', '', '', '0', ''],
    ['3', '3', '', '', '1', ''],
    ['', '', '1', '2', '', ''],
    ['', '', '2', '0', '', ''],
    ['', '1', '', '', '1', '1'],
    ['', '2', '', '', '', '']
  ];

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

  const twentyFourByTwelveHard = [
    ['2', '2', '', '', '3', '', '', '', '3', '', '', '', '1', '3', '2', '2', '', '', '3', '', '', '2', '3', ''],
    ['3', '', '2', '1', '', '', '3', '1', '', '1', '2', '3', '', '3', '', '2', '', '2', '', '3', '2', '', '2', ''],
    ['2', '', '', '', '', '', '3', '', '2', '', '', '1', '', '', '2', '0', '', '1', '', '', '', '1', '2', '2'],
    ['2', '', '0', '', '', '3', '1', '', '', '1', '', '2', '', '', '', '', '', '2', '3', '2', '3', '', '', '2'],
    ['2', '', '2', '', '', '', '2', '', '', '', '', '0', '', '3', '', '', '', '', '2', '', '', '', '2', ''],
    ['', '', '', '0', '3', '', '', '', '', '1', '3', '', '3', '', '', '2', '1', '3', '', '3', '2', '3', '', '3'],
    ['', '3', '', '', '3', '', '', '1', '', '1', '2', '', '', '', '', '2', '2', '', '', '', '', '', '', ''],
    ['2', '', '', '', '', '', '2', '2', '', '', '', '', '2', '2', '2', '', '2', '', '2', '2', '3', '', '', '3'],
    ['2', '', '', '2', '', '2', '', '3', '3', '', '2', '', '', '1', '2', '', '2', '2', '', '2', '3', '', '', ''],
    ['3', '1', '2', '1', '2', '', '2', '', '2', '', '', '1', '', '', '', '', '', '', '2', '', '2', '', '', '3'],
    ['', '', '3', '', '', '1', '', '', '', '', '', '3', '', '3', '2', '', '', '3', '', '', '', '', '3', '2'],
    ['3', '1', '', '', '', '', '', '3', '', '', '1', '', '', '2', '', '', '1', '', '', '2', '', '2', '', ''],
  ];

  const twentyByTwentyHard = [
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

  const debugLevel = 0;
  const [board, setBoard] = useState(new SlitherlinkBoard(twentyFourByTwelveHard, debugLevel));
  const [status, setStatus] = useState('playing');
  const [dialog, setDialog] = useState('');
  const [quote, setQuote] = useState<IQuote>({ quote: '', author: '' });

  useEffect(() => {
    let ignore = false;
    fetch('https://api.quotable.io/random')
      .then(response => response.json())
      .then(json => {
        if (!ignore) {
          setQuote({
            quote: json.content,
            author: json.author
          });
        }
      })
      .catch(e => console.error(e));
    return () => {
      ignore = true;
    }
  }, []);

  useEffect(() => {
    if (dialog === 'solving') {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            board.solve().then(() => {
              setStatus('solved');
              setBoard(Object.create(board));
              setDialog('');
            });
          }, 0);
        });
      });
    }
  }, [dialog]);

  const handleVEdgeClick = (row: number, col: number) => {
    board.vEdges[row][col].value = (board.vEdges[row][col].value === '-' ? '' : '-');
    setBoard(Object.create(board));
    checkIfSolved();
  };

  const handleVEdgeContextMenu = (row: number, col: number) => {
    board.vEdges[row][col].value = (board.vEdges[row][col].value === 'x' ? '' : 'x');
    setBoard(Object.create(board));
  }

  const handleHEdgeClick = (row: number, col: number) => {
    board.hEdges[row][col].value = (board.hEdges[row][col].value === '-' ? '' : '-');
    setBoard(Object.create(board));
    checkIfSolved();
  };

  const handleHEdgeContextMenu = (row: number, col: number) => {
    board.hEdges[row][col].value = (board.hEdges[row][col].value === 'x' ? '' : 'x');
    setBoard(Object.create(board));
  }

  const handleReset = () => {
    setDialog('reset');
  };

  const handleResetConfirm = (button: string) => {
    if (button === 'OK') {
      board.resetBoard();
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
      setDialog('solving');
    } else {
      setDialog('');
    }
  }

  const checkIfSolved = () => {
    if (board.runSolvedCheck()) {
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
    handleHEdgeContextMenu,
    handleVEdgeClick,
    handleVEdgeContextMenu,
    handleReset,
    handleResetConfirm,
    handleSolve,
    handleSolveConfirm,
    handleSolvedConfirm
  };
}

export default SlitherlinkState;