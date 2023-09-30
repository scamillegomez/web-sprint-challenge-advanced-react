import React from 'react';
import { useState } from 'react';
import axios from 'axios';

// Suggested initial states
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4 ;// the currIndex the "B" is at
const initialXY = '(2.2)';
const initialMessage = '';
const Xcoords = [
  1, 2, 3, 1, 2, 3, 1, 2, 3
];
const Ycoords = [
  1, 1, 1, 2, 2, 2, 3, 3, 3
];

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.
  const [currIndex, setCurrIndex ] = useState(initialIndex);
  const [steps, setSteps ] = useState(initialSteps);
  const [message,setMessage ] = useState(initialMessage);
  const [email, setEmail ] = useState(initialEmail);
  const [xy, setXY] = useState(initialXY);
  

  // function getXYMessage(currIndex) {
  // }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setCurrIndex(initialIndex);
    setMessage(initialMessage);
    setSteps(initialSteps);
    setEmail(initialEmail);
    setXY(initialXY);
  }

  function getNextIndex(direction) {
        if( ((currIndex  === 0 || currIndex  === 3 || currIndex  === 6 ) && direction === 'left') ||  ((currIndex === 0 || currIndex === 1 || currIndex === 2) && direction === 'up') || ((currIndex === 2 || currIndex === 5 || currIndex === 8) && direction === 'right') || ((currIndex === 6 || currIndex === 7 || currIndex === 8) && direction === 'down')){
          setMessage(`You can't go ${direction}`)
          return currIndex; 
        } else if (direction === 'up'){
          setMessage(initialMessage);
          setCurrIndex(currIndex-3);
          setXY(`(${Xcoords[currIndex-3]}.${Ycoords[currIndex-3]})`);
    } else if (direction === 'down'){
          setMessage(initialMessage);
          setCurrIndex(currIndex+3);
          setXY(`(${Xcoords[currIndex+3]}.${Ycoords[currIndex+3]})`);
    } else if (direction === 'left'){
          setMessage(initialMessage);
          setCurrIndex(currIndex-1);
          setXY(`(${Xcoords[currIndex-1]}.${Ycoords[currIndex-1]})`);
    } else if (direction === 'right'){
          setMessage(initialMessage);
          setCurrIndex(currIndex+1);
          setXY(`(${Xcoords[currIndex+1]}.${Ycoords[currIndex+1]})`);
  
    }
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new currIndex for the "B",
    // and change any states accordingly.
    getNextIndex(evt.target.id);
    // setSteps(steps+1);
    if( ((currIndex  === 0 || currIndex  === 3 || currIndex  === 6 ) && evt.target.id === 'left') 
      ||  ((currIndex === 0 || currIndex === 1 || currIndex === 2) && evt.target.id === 'up') 
      || ((currIndex === 2 || currIndex === 5 || currIndex === 8) && evt.target.id === 'right') 
      || ((currIndex === 6 || currIndex === 7 || currIndex === 8) && evt.target.id === 'down')){
      setSteps(steps)
      return steps; 
    } else {
      setSteps(steps+1);
      return steps;
    }
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    setEmail(evt.target.value);
  }

  const onSubmit = async (evt) => {
    // Use a POST request to send a payload to the server.
    evt.preventDefault();
    const newMove = {
      x: Xcoords[currIndex],
      y: Ycoords[currIndex],
      steps: steps,
      email: email
    }

    if(newMove.email === initialEmail){
      setMessage('Ouch: email is required');
    } else{
    try {
      const res = await axios.post('http://localhost:9000/api/result', newMove);
      console.log('received post data:', res.data);
      console.log(newMove);
      setMessage(res.data.message);

    } catch(err){
      console.error('axios POST error:',err);
      console.log(err.response.statusText);
      if(err.response.statusText === 'Unprocessable Entity'){
        setMessage('Ouch: email must be a valid email');
      } else if (err.response.statusText === 'Forbidden'){
        setMessage(err.response.data.message);
      }
    } 
    finally{
      setEmail(initialEmail);
    }
  }
}
const movesA = `You moved ${steps} times`
const movesB = `You moved ${steps} time`
  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates" data-testid="coordinates">{`Coordinates ${xy}`}</h3>
        <h3 id="steps">{`${steps === 1 ? movesB : movesA}`}</h3>
        <h3 id="coordinates">{`Current Index: ${currIndex}`}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
            <div key={idx} className={`square${idx === currIndex ? ' active' : ''}`}>
              {idx === currIndex ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button 
          id="left"
          onClick={move}
          data-testid="left"
        >
          LEFT
        </button>

        <button 
          id="up"
          onClick={move}
          data-testid="up"
        >
          UP
        </button>

        <button 
          id="right"
          onClick={move}
          data-testid="right"
        >
          RIGHT
        </button>

        <button 
          id="down"
          onClick={move}
          data-testid="down"
        >
          DOWN
        </button>

        <button
          id="reset"
          onClick={reset}
          data-testid="reset"
        >
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" onChange={onChange} value={email}></input>
        <input id="submit" type="submit" data-testid="submit"></input>
      </form>
    </div>
  )
}
