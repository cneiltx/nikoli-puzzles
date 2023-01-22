import { HEdge } from "./HEdge";
import { VEdge } from "./VEdge";

export class Move {
  item: HEdge | VEdge;
  prevValue: string;
  newValue: string;

  constructor(item: HEdge | VEdge, prevValue: string, newValue: string) {
    this.item = item;
    this.prevValue = prevValue;
    this.newValue = newValue;
  }
}