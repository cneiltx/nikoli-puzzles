import { useState, useEffect, useRef } from 'react';
import { IQuote } from "../components/IQuote";
import { ISlitherlinkState } from './ISlitherlinkState';
import { SlitherlinkGenerator } from '../model/SlitherlinkGenerator';
import { SlitherlinkBoard } from '../model/SlitherlinkBoard';

export const SlitherlinkState = (rows: number, columns: number): ISlitherlinkState => {
  // status values
  //   playing - user is working on the puzzle
  //   resetRequest - user requested to reset the board
  //   solveRequest - user requested to auto solve the board
  //   autoSolving - board is being auto solved
  //   userSolved - user just solved the puzzle (and needs to be informed)
  //   solved - board has been solved (either by user or auto solved)
  const [status, setStatus] = useState('generating');

  const [board, setBoard] = useState(new SlitherlinkBoard([[]]));
  const [quote, setQuote] = useState<IQuote>({ quote: '', author: '' });
  const [progress, setProgress] = useState(0);

  // TODO: Implement generating status and wait dialog
  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTimeout(() => {
          setBoard(new SlitherlinkGenerator().generateBoard(rows, columns));
          setStatus('playing');
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
        }, 1);
      });
    });
  }, []);

  useEffect(() => {
    if (status === 'autoSolving') {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTimeout(() => {
            board.solve();
            setStatus('solved');
            setBoard(Object.create(board));
          }, 1);
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