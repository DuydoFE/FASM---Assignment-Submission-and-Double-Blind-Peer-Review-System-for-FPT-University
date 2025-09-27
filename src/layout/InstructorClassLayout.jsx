import { Outlet } from "react-router-dom";
import InstructorHeader from "../component/Header/IntructorHeader"; 
import InstructorSideBar from "../component/SideBar/InstructorSideBar";

function InstructorLayout() { 
  return (
    <div>
      <InstructorHeader />
      <InstructorSideBar />
      <div
        className="main-content"
        style={{
          marginLeft: "256px", 
          width: "calc(100% - 256px)",
          minHeight: "100vh",
          padding: "20px"
        }}
      >
        <Outlet />
      </div>
    </div>
  );
}
export default InstructorLayout;