/** @jsx React.createElement */

const root = document.getElementById('root')
const App = React.createElement(
  'h1',
  {
    className: 'header'
  },
  'React Lite Library'
)

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

const Heart = (props) => <span style={props.style}>&hearts;</span>
React.render(<Heart style="color:red" />, root)
