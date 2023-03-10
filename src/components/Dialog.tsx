import { IDialogProps } from "./IDialogProps";

export const Dialog = (props: IDialogProps) => {
  const { message, quote, imagePath, buttons, handleButtonClick } = props;

  const content: JSX.Element[] = [];
  if (buttons && handleButtonClick) {
    buttons.forEach((button) => {
      content.push(<button key={button} onClick={() => handleButtonClick(button)} >{button}</button>);
    });
  }

  return (
    <div className='dialogBackground'>
      <div className='dialog'>
        {imagePath && <div className='dialogImage'>
          <img src={imagePath} alt='wait...' />
        </div>}
        <div className='dialogContent'>
          <pre>
            {message}
          </pre>
          {quote && <div className='quoteBlock'>
            <div className='quote'>
              {quote.quote}
            </div>
            <div className='quoteAuthor'>
              {`\u2013 ${quote.author}`}
            </div>
          </div>}
          {buttons && <div className='buttonRow'>
            {content}
          </div>}
        </div>
      </div>
    </div>
  );
}