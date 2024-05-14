import React from "react";
import Schedule from "./ScheduleUI";
import { StyleSheetManager } from "styled-components";
// import SearchClass from "./components/SearchClass";
function App() {
  return (
    <StyleSheetManager
      shouldForwardProp={(prop) =>
        prop !== "howlong" && prop !== "date" && prop !== "fron"
      }
    >
      {/* Your component hierarchy */}
      <Schedule />
    </StyleSheetManager>
  );
}

export default App;
