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

    reset = () => {
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
      
          if( ((this.state.currIndex  === 0 || this.state.currIndex  === 3 || this.state.currIndex  === 6 ) && direction === 'left') ||  ((this.state.currIndex === 0 || this.state.currIndex === 1 || this.state.currIndex === 2) && direction === 'up') || ((this.state.currIndex === 2 || this.state.currIndex === 5 || this.state.currIndex === 8) && direction === 'right') || ((this.state.currIndex === 6 || this.state.currIndex === 7 || this.state.currIndex === 8) && direction === 'down')){
            this.setState((prevState)=>({
              message: `You can't go ${direction}`
              
            }));
        } else if (direction === 'up'){
          this.setState((prevState)=>({
            message: initialMessage,
            currIndex: prevState.currIndex - 3,
            xy: `Coordinates (${Xcoords[prevState.currIndex-3]}, ${Ycoords[prevState.currIndex-3]})`
          }));
        } else if (direction === 'down'){
          this.setState((prevState)=>({
            message: initialMessage,
            currIndex: prevState.currIndex + 3,
            xy: `Coordinates (${Xcoords[prevState.currIndex+3]}, ${Ycoords[prevState.currIndex+3]})`
          }));
        } else if (direction === 'left'){
          this.setState((prevState)=>({
            message: initialMessage,
            currIndex: prevState.currIndex - 1,
            xy: `Coordinates (${Xcoords[prevState.currIndex - 1]}, ${Ycoords[prevState.currIndex - 1]})`
          }));
        } else if (direction === 'right'){
          this.setState((prevState)=>({
            message: initialMessage,
            currIndex: prevState.currIndex + 1,
            xy: `Coordinates (${Xcoords[prevState.currIndex + 1]}, ${Ycoords[prevState.currIndex + 1]})`
          }));
        }
    }

    move = (evt) => {
      // This event handler can use the helper above to obtain a new index for the "B",
      // and change any states accordingly.
      this.getNextIndex(evt.target.id);
      
      if( ((this.state.currIndex  === 0 || this.state.currIndex  === 3 || this.state.currIndex  === 6 ) && evt.target.id === 'left') 
        ||  ((this.state.currIndex === 0 || this.state.currIndex === 1 || this.state.currIndex === 2) && evt.target.id === 'up') 
        || ((this.state.currIndex === 2 || this.state.currIndex === 5 || this.state.currIndex === 8) && evt.target.id === 'right') 
        || ((this.state.currIndex === 6 || this.state.currIndex === 7 || this.state.currIndex === 8) && evt.target.id === 'down')){
        this.setState((prevState)=>({
          steps: prevState.steps
        }));
      } else {
        this.setState((prevState)=>({
          steps: prevState.steps + 1
        }));
      }
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
      if(newMove.email === initialEmail){
        this.setState(prevState=>({
          message: 'Ouch: email is required'
        }));
      } else {
      try {
        const res = await axios.post('http://localhost:9000/api/result', newMove);
        console.log('received post data:', res.data);
        console.log(newMove);
        this.setState(prevState=>({
          message: res.data.message
        }));
      } catch (err){
        console.error('axios POST error:', err);
        if(err.response.statusText === 'Unprocessable Entity'){
          this.setState(prevState=>({
            message: 'Ouch: email must be a valid email'
          }));
        }  else if (err.response.statusText === 'Forbidden'){
          this.setState(prevState=>({
            message: err.response.data.message
          }));
        }
      } finally {
        this.setState(prevState=>({
          email: initialEmail
        }));
      }
    }
  }
  //}
  render() {
    const { className } = this.props
    const movesA = `You moved ${this.state.steps} times`
    const movesB = `You moved ${this.state.steps} time`
    return (
      <div id="wrapper" className={className}>
        <div className="info">
          <h3 id="coordinates" data-testid="coordinates">{this.state.xy}</h3>
          <h3 id="steps" data-testid="steps">{`${this.state.steps === 1 ? movesB : movesA}`}</h3>
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
          <button id="left" data-testid="left" onClick={this.move}>LEFT</button>
          <button id="up" data-testid="up" onClick={this.move}>UP</button>
          <button id="right" data-testid="right" onClick={this.move}>RIGHT</button>
          <button id="down" data-testid="down" onClick={this.move}>DOWN</button>
          <button id="reset" data-testid="reset" onClick={this.reset}>reset</button>
        </div>
        <form onSubmit={this.onSubmit}>
          <input id="email" type="email" placeholder="type email" onChange={this.onChange} value={this.state.email}></input>
          <input id="submit" type="submit" data-testid="submit"></input>
        </form>
      </div>
    )
  }
}
