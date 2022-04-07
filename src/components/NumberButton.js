import React from "react";

export function NumberButton(props) {
  function handleClick(event) {
    props.onClick(event.target.value)
  }

  return <button className="NumberButton" id={"num"+props.value} key={props.value} value={props.value} onClick={handleClick}>{props.value}</button>
}