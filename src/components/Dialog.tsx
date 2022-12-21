interface IProps {
  message: string;
  buttons: string[];
  handleButtonClick(button: string): void;
}

const Dialog = (props: IProps) => {
  const { message, buttons, handleButtonClick } = props;

  const content: JSX.Element[] = [];
  buttons.forEach((button, index) => {
    content.push(<button onClick={() => handleButtonClick(button)} autoFocus={index === 0}>{button}</button>);
  });

  return (
    <div className="dialogBackground">
      <div className="dialog">
        <pre>
          {message}
        </pre>
        <div className="buttonRow">
          {content}
        </div>
      </div>
    </div>
  );
}

export default Dialog;