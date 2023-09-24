import React from 'react';
import { useState } from 'react';
import axios from 'axios';

// Suggested initial states
const initialEmail = '';
const initialSteps = 0;
const initialIndex = 4 ;// the currIndex the "B" is at
const initialXY = 'Coordinates (2,2)';
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
  


 // function getXY(currIndex) {

    // if( currIndex === 0){
    //   setXY('1,1');
    // } else if( currIndex === 1){
    //   setXY('2,1');
    // } else if( currIndex === 2){
    //   setXY('3,1');
    // } else if (currIndex === 3){
    //   setXY('1,2');
    // } else if (currIndex === 4){
    //   setXY('2,2');
    // } else if (currIndex === 5){
    //   setXY('3,2');
    // } else if (currIndex === 6){
    //   setXY('1,3');
    // } else if (currIndex === 7){
    //   setXY('2,3');
    // } else if (currIndex === 8){
    //   setXY('3,3');
    // }
    //const coords = [
      //(1,1), (2,1), (3, 1), (1, 2), (2, 2), (3, 2), (1, 3), (2, 3), (3, 3)
    //];

    //return coords[currIndex];
 // }

  function getXYMessage(currIndex) {
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setCurrIndex(initialIndex);
    setMessage(initialMessage);
    setSteps(initialSteps);
  }

  function getNextIndex(direction) {
        if( ((currIndex  === 0 || currIndex  === 3 || currIndex  === 6 ) && direction === 'left') ||  ((currIndex === 0 || currIndex === 1 || currIndex === 2) && direction === 'up') || ((currIndex === 2 || currIndex === 5 || currIndex === 8) && direction === 'right') || ((currIndex === 6 || currIndex === 7 || currIndex === 8) && direction === 'down')){
      return currIndex; 
        } else if (direction === 'up'){
          setCurrIndex(currIndex-3);
          setXY(`Coordinates (${Xcoords[currIndex-3]}, ${Ycoords[currIndex-3]})`);
    } else if (direction === 'down'){
          setCurrIndex(currIndex+3);
          setXY(`Coordinates (${Xcoords[currIndex+3]}, ${Ycoords[currIndex+3]})`);
    } else if (direction === 'left'){
          setCurrIndex(currIndex-1);
          setXY(`Coordinates (${Xcoords[currIndex-1]}, ${Ycoords[currIndex-1]})`);
    } else if (direction === 'right'){
          setCurrIndex(currIndex+1);
          setXY(`Coordinates (${Xcoords[currIndex+1]}, ${Ycoords[currIndex+1]})`);
  
    }
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new currIndex for the "B",
    // and change any states accordingly.
    getNextIndex(evt.target.id);
    setSteps(steps+1);    
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
    try {
      const res = await axios.post('http://localhost:9000/api/result', newMove);
      console.log('received post data:', res.data);
      console.log(newMove);
      setMessage(res.data.message);

    } catch(err){
      console.error('axios POST error:',err);
    } 
    finally{
      setEmail(initialEmail);
    }
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{`${xy}`}</h3>
        <h3 id="steps">{`You moved ${steps} times`}</h3>
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
        >
          LEFT
        </button>

        <button 
          id="up"
          onClick={move}
        >
          UP
        </button>

        <button 
          id="right"
          onClick={move}
        >
          RIGHT
        </button>

        <button 
          id="down"
          onClick={move}
        >
          DOWN
        </button>

        <button
          id="reset"
          onClick={reset}
        >
          reset
        </button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" onChange={onChange} value={email}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
