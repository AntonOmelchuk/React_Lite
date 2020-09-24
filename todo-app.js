/** @jsx React.createElement */

const root = document.getElementById('root')

class WishtList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      wishTitle: 'I want to be a programmer'
    }
  }

  update() {
    console.log('update: ', this.input)
    this.setState({
      wishTitle: this.input.value
    })
  }

  render() {
    return (
      <div className="container">
        <h2>Your Wish List</h2>
        <input type="text" ref={input => this.input = input} placeholder="What's your wish?"></input>
        <button onClick={() => this.update()}>Update</button>

      <div>
        <h3>{this.state.wishTitle}</h3>
      </div>
    </div>
    )
  }
}

React.render(<WishtList />, root)
