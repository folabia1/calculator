import React from "react";

export function NegativeSignButton(props) {
  function handleClick(event) {
    props.onClick(event.target.value)
  }

  return <button className="NegativeSignButton" value="_" onClick={handleClick}>(-)</button>
}