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

// Testing functional components, props, nested components

const Heart = props => <span style={props.style}>&hearts;</span>

const Button = props => <button onClick={props.onClick}>{props.children}</button>

const App = props => (
  <div className="container">
    <h2>Lite React App</h2>
    <h6>{props.message}</h6>

    <Button onClick={() => alert('This is Lite React')}>
      I <Heart style="color:red" /> React
    </Button>
  </div>
)

React.render(<App message="create own React" />, root)

