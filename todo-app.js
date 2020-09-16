/** @jsx React.createElement */

const root = document.getElementById('root')

var Step1 = (
  <div>
    <h1 className="header">Hello Lite React!</h1>
    <h2>(coding nirvana)</h2>
    <div>nested 1<div>nested 1.1</div></div>
    <h3>(OBSERVE: This will change)</h3>
    {2 == 1 && <div>Render this if 2==1</div>}
    {2 == 2 && <div>{2}</div>}
    <span>This is a text</span>
    <button onClick={() => alert("Hi!")}>Click me!</button>
    <h3>This will be deleted</h3>
    2,3
  </div>
);

var Step2 = (
  <div>
    <h1 className="header">Hello Lite React!</h1>
    <h2>(coding nirvana)</h2>
    <div>nested 1<div>nested 1.1</div></div>
    <h3>(OBSERVE: It changed)</h3>
    {2 == 1 && <div>Render this if 2==1</div>}
    {2 == 2 && <div>{2}</div>}
    <span>This is a text</span>
    <button onClick={() => alert("Hi!")}>Click me!</button>
    2,3
  </div>
);

class Alert extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      title: 'Test Title'
    }
  }

  render() {
    return (
      <div className="container">
        <h2>Lite React Class</h2>
        <div>
          <h4>{this.state.title}</h4>
          <button onClick={() => this.setState({ title: 'New changed title'})}>Change title</button>
        </div>
      </div>
    )
  }
}

React.render(<Alert />, root)

