import {
  CircularProgressbar,
  buildStyles,
} from "react-circular-progressbar";

import "react-circular-progressbar/dist/styles.css";

function ProgressRing({
  value = 96,
  title = "Overall Attendance",
}) {
  return (
    <div className="flex flex-col items-center">

      <div className="w-52 h-52">

        <CircularProgressbar
          value={value}
          text={`${value}%`}
          strokeWidth={10}
          styles={buildStyles({
            pathColor: "#22c55e",
            trailColor: "#1e293b",
            textColor: "#ffffff",
            textSize: "18px",
            pathTransitionDuration: 1.5,
          })}
        />

      </div>

      <p className="mt-6 text-xl font-bold text-white">
        {title}
      </p>

      <p className="text-slate-400 mt-2 text-center max-w-xs">
        Attendance performance for the current semester.
      </p>

    </div>
  );
}

export default ProgressRing;