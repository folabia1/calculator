import React from "react";

export function ClearButton(props) {
  function handleClick(event) {
    props.onClick(event.target.value)
  }

  return <button className="ClearButton" value={"CLEAR"} onClick={handleClick}>CLEAR</button>
}