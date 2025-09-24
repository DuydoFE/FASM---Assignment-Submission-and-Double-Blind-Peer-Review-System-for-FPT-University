import { Outlet } from "react-router-dom";
import InstructorHeader from "../component/Header/IntructorHeader";
function InstructorLayout() {
  return (
    <div>
      <InstructorHeader />
      <div
        className="main-content"
        style={{
        
          width: "100%",
          minHeight: "100vh",
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}
export default InstructorLayout;