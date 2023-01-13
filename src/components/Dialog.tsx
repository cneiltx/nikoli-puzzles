export interface IQuote {
  quote: string;
  author: string;
}

interface IProps {
  message: string;
  quote?: IQuote;
  imagePath?: string;
  buttons?: string[];
  handleButtonClick?(button: string): void;
}

const Dialog = (props: IProps) => {
  const { message, quote, imagePath, buttons, handleButtonClick } = props;

  const content: JSX.Element[] = [];
  if (buttons && handleButtonClick) {
    buttons.forEach((button, index) => {
      content.push(<button key={button} onClick={() => handleButtonClick(button)} autoFocus={index === 0}>{button}</button>);
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

export default Dialog;