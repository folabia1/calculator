import React from "react";

export function EqualsButton(props) {
  function handleClick(event) {
    props.onClick(event.target.value)
  }

  return <button className="EqualsButton" value="=" onClick={handleClick}>=</button>
}