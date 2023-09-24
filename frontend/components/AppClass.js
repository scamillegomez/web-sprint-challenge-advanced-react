import React from 'react'
import axios from 'axios'

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at
const initialXY = 'Coordinates (2,2)';
const Xcoords = [
  1, 2, 3, 1, 2, 3, 1, 2, 3
];
const Ycoords = [
  1, 1, 1, 2, 2, 2, 3, 3, 3
];

// const initialState = {
//   message: initialMessage,
//   email: initialEmail,
//   index: initialIndex,
//   steps: initialSteps,
// }

export default class AppClass extends React.Component {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  constructor(props){
    super(props);
    this.state = {
      currIndex: initialIndex,
      steps: initialSteps,
      message: initialMessage,
      email: initialEmail,
      xy: initialXY
    }
  }


  // getXY = () => {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
  // }

  // getXYMessage = () => {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string.
  // }
  // componentDidUpdate(prevState){
    reset = () => {
      // Use this helper to reset all states to their initial values.
      this.setState({
        currIndex: initialIndex,
        steps: initialSteps,
        message: initialMessage,
        email: initialEmail,
        xy: initialXY
      });
    }

    getNextIndex = (direction) => {
      // This helper takes a direction ("left", "up", etc) and calculates what the next index
      // of the "B" would be. If the move is impossible because we are at the edge of the grid,
      // this helper should return the current index unchanged.
      this.setState((prevState)=>{
        if( ((prevState.currIndex  === 0 || prevState.currIndex  === 3 || prevState.currIndex  === 6 ) && direction === 'left') ||  ((prevState.currIndex === 0 || prevState.currIndex === 1 || prevState.currIndex === 2) && direction === 'up') || ((prevState.currIndex === 2 || prevState.currIndex === 5 || prevState.currIndex === 8) && direction === 'right') || ((prevState.currIndex === 6 || prevState.currIndex === 7 || prevState.currIndex === 8) && direction === 'down')){
          return prevState.currIndex;
        } else if (direction === 'up'){
          this.setState((prevState)=>({
            currIndex: prevState.currIndex - 3,
            xy: `Coordinates (${Xcoords[prevState.currIndex-3]}, ${Ycoords[prevState.currIndex-3]})`
          }));
        } else if (direction === 'down'){
          this.setState((prevState)=>({
            currIndex: prevState.currIndex + 3,
            xy: `Coordinates (${Xcoords[prevState.currIndex+3]}, ${Ycoords[prevState.currIndex+3]})`
          }));
        } else if (direction === 'left'){
          this.setState((prevState)=>({
            currIndex: prevState.currIndex - 1,
            xy: `Coordinates (${Xcoords[prevState.currIndex - 1]}, ${Ycoords[prevState.currIndex - 1]})`
          }));
        } else if (direction === 'right'){
          this.setState((prevState)=>({
            currIndex: prevState.currIndex + 1,
            xy: `Coordinates (${Xcoords[prevState.currIndex + 1]}, ${Ycoords[prevState.currIndex + 1]})`
          }));
        }
      })
    }

    move = (evt) => {
      // This event handler can use the helper above to obtain a new index for the "B",
      // and change any states accordingly.
      this.getNextIndex(evt.target.id);
      this.setState((prevState)=>({
        steps: prevState.steps + 1
      }));
    }

    onChange = (evt) => {
      // You will need this to update the value of the input.
      this.setState(prevState=>({
        email: evt.target.value
      }));
    }

    onSubmit = async (evt) => {
      // Use a POST request to send a payload to the server.
      evt.preventDefault();
      const newMove = {
        x: Xcoords[this.state.currIndex],
        y: Ycoords[this.state.currIndex],
        steps: this.state.steps,
        email: this.state.email
      }
      try {
        const res = await axios.post('http://localhost:9000/api/result', newMove);
        console.log('received post data:', res.data);
        console.log(newMove);
        this.setState(prevState=>({
          message: res.data.message
        }));
      } catch (err){
        console.error('axios POST error:', err);
      } finally {
        this.setState(prevState=>({
          email: initialEmail
        }));
      }
    }
  //}

  render() {
    const { className } = this.props
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates">{this.state.xy}</h3>
          <h3 id="steps">You moved {this.state.steps} times</h3>
        </div>
        <div id="grid">
          {
            [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
              <div key={idx} className={`square${idx === this.state.currIndex ? ' active' : ''}`}>
                {idx === this.state.currIndex ? 'B' : null}
              </div>
            ))
          }
        </div>
        <div className="info">
          <h3 id="message">{this.state.message}</h3>
        </div>
        <div id="keypad">
          <button id="left" onClick={this.move}>LEFT</button>
          <button id="up" onClick={this.move}>UP</button>
          <button id="right" onClick={this.move}>RIGHT</button>
          <button id="down" onClick={this.move}>DOWN</button>
          <button id="reset" onClick={this.reset}>reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input id="email" type="email" placeholder="type email" onChange={this.onChange} value={this.state.email}></input>
          <input id="submit" type="submit"></input>
        </form>
      </div>
    )
  }
}
