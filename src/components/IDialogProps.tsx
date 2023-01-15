import { IQuote } from "./IQuote";

export interface IDialogProps {
  message: string;
  quote?: IQuote;
  imagePath?: string;
  buttons?: string[];
  handleButtonClick?(button: string): void;
}
