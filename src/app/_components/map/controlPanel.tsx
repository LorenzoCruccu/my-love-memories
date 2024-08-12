import * as React from 'react';

function ControlPanel() {
  return (
    <div className="control-panel">
      <h3>Basic Map</h3>
      <p>
        The simplest example possible, just rendering a google map with some
        settings adjusted.
      </p>
      <div className="links">
        <a
          href="https://codesandbox.io/s/github/visgl/react-google-maps/tree/main/examples/basic-map"
          target="_new">
          Add spot
        </a>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
