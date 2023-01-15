import { useState, useEffect, useRef } from 'react';
import { SlitherlinkBoard } from '../model/SlitherlinkBoard';
import { IQuote } from "../components/IQuote";
import { ISlitherlinkState } from './ISlitherlinkState';

export const SlitherlinkState = (rows: number, columns: number): ISlitherlinkState => {
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
  const [board, setBoard] = useState(new SlitherlinkBoard(twentyByTwentyHard, debugLevel));

  // status values
  //   playing - user is working on the puzzle
  //   resetRequest - user requested to reset the board
  //   solveRequest - user requested to auto solve the board
  //   autoSolving - board is being auto solved
  //   userSolved - user just solved the puzzle (and needs to be informed)
  //   solved - board has been solved (either by user or auto solved)
  const [status, setStatus] = useState('playing');

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
    if (status === 'autoSolving') {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            board.solve().then(() => {
              setStatus('solved');
              setBoard(Object.create(board));
            });
          }, 0);
        });
      });
    }
  }, [status]);

  const usePreviousValue = <T>(value: T) => {
    const ref = useRef<T>();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const previousStatus = usePreviousValue(status);

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

  const handleResetRequest = () => {
    setStatus('resetRequest');
  };

  const handleResetConfirm = (button: string) => {
    if (button === 'OK') {
      board.resetBoard();
      setBoard(Object.create(board));
      setStatus('playing');
    } else {
      setStatus(previousStatus ?? 'playing');
    }
  }

  const handleSolveRequest = () => {
    setStatus('solveRequest');
  };

  const handleSolveConfirm = (button: string) => {
    if (button === 'OK') {
      setStatus('autoSolving');
    } else {
      setStatus(previousStatus ?? 'playing');
    }
  }

  const checkIfSolved = () => {
    if (board.runSolvedCheck().isSolved) {
      setStatus('userSolved');
    }
  };

  const handleUserSolvedConfirm = (button: string) => {
    setStatus('solved');
  }

  return {
    board,
    status,
    quote,
    debugLevel,
    handleHEdgeClick,
    handleHEdgeContextMenu,
    handleVEdgeClick,
    handleVEdgeContextMenu,
    handleResetRequest,
    handleResetConfirm,
    handleSolveRequest,
    handleSolveConfirm,
    handleUserSolvedConfirm
  };
}