import { useState, useEffect, useRef } from 'react';
import { IQuote } from "../components/IQuote";
import { ISlitherlinkState } from './ISlitherlinkState';
import { SlitherlinkGenerator } from '../model/SlitherlinkGenerator';
import { SlitherlinkBoard } from '../model/SlitherlinkBoard';
import { Move } from '../model/Move';
import { HEdge } from '../model/HEdge';
import { VEdge } from '../model/VEdge';

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
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [undoStack, setUndoStack] = useState(new Array<Move>());
  const [redoStack, setRedoStack] = useState(new Array<Move>());
  const [startTime] = useState(Date.now());

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
    setTimeout(() => {
      setBoard(new SlitherlinkGenerator().generateBoard(rows, columns));
      setStatus('playing');
    }, 100);
  }, []);

  useEffect(() => {
    if (status === 'autoSolving') {
      setTimeout(() => {
        board.solve();
        setStatus('solved');
        setBoard(Object.create(board));
      }, 100);
    }
  }, [status, board]);

  useEffect(() => {
    setCanUndo(undoStack.length > 0);
  }, [undoStack]);

  useEffect(() => {
    setCanRedo(redoStack.length > 0);
  }, [redoStack]);

  const usePreviousValue = <T>(value: T) => {
    const ref = useRef<T>();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const previousStatus = usePreviousValue(status);

  const doMove = (item: HEdge | VEdge, prevValue: string, newValue: string) => {
    item.value = newValue;
    setBoard(Object.create(board));
    const enableUndo = undoStack.length === 0;
    undoStack.push(new Move(item, prevValue, newValue));
    setRedoStack([]);

    if (enableUndo) {
      setCanUndo(true);
    }
  }

  const handleVEdgeClick = (row: number, col: number) => {
    doMove(board.vEdges[row][col], board.vEdges[row][col].value, board.vEdges[row][col].value === '-' ? '' : '-');
    checkIfSolved();
  };

  const handleVEdgeContextMenu = (row: number, col: number) => {
    doMove(board.vEdges[row][col], board.vEdges[row][col].value, board.vEdges[row][col].value === 'x' ? '' : 'x');
  }

  const handleHEdgeClick = (row: number, col: number) => {
    doMove(board.hEdges[row][col], board.hEdges[row][col].value, board.hEdges[row][col].value === '-' ? '' : '-');
    checkIfSolved();
  };

  const handleHEdgeContextMenu = (row: number, col: number) => {
    doMove(board.hEdges[row][col], board.hEdges[row][col].value, board.hEdges[row][col].value === 'x' ? '' : 'x');
  }

  const handleResetRequest = () => {
    setStatus('resetRequest');
  };

  const handleResetConfirm = (button: string) => {
    if (button === 'OK') {
      board.resetBoard();
      setBoard(Object.create(board));
      setUndoStack([]);
      setRedoStack([]);
      setStatus('playing');
    } else {
      setStatus(previousStatus ?? 'playing');
    }
  }

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const move = undoStack.pop()!;
      move.item.value = move.prevValue;
      setBoard(Object.create(board));
      const enableRedo = redoStack.length === 0;
      redoStack.push(move);

      if (undoStack.length === 0) {
        setCanUndo(false);
      }
      if (enableRedo) {
        setCanRedo(true);
      }
    }
  }

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const move = redoStack.pop()!;
      move.item.value = move.newValue;
      setBoard(Object.create(board));
      const enableUndo = undoStack.length === 0;
      undoStack.push(move);

      if (redoStack.length === 0) {
        setCanRedo(false);
      }

      if (enableUndo) {
        setCanUndo(true);
      }
    }
  }

  const handleSolveRequest = () => {
    setStatus('solveRequest');
  };

  const handleSolveConfirm = (button: string) => {
    if (button === 'OK') {
      setStatus('autoSolving');
      setUndoStack([]);
      setRedoStack([]);
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
    canUndo,
    canRedo,
    startTime,
    handleHEdgeClick,
    handleHEdgeContextMenu,
    handleVEdgeClick,
    handleVEdgeContextMenu,
    handleResetRequest,
    handleResetConfirm,
    handleUndo,
    handleRedo,
    handleSolveRequest,
    handleSolveConfirm,
    handleUserSolvedConfirm
  };
}