import * as React from 'react';

function ControlPanel() {
  return (
    <div className="control-panel">
      <h3>Info</h3>
      <p>

paxxerell infos
      </p>
      <div className="links">
        <a
          href="https://codesandbox.io/s/github/visgl/react-google-maps/tree/main/examples/basic-map"
          target="_new">
          Flag this place
        </a>
      </div>
    </div>
  );
}

export default React.memo(ControlPanel);
