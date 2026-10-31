import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterChoice from "./pages/RegisterChoice.jsx";
import StudentRegister from "./pages/studentregister.jsx";
import TeacherRegister from "./pages/Teacherregister.jsx";
import MainPage from "./pages/MainPage.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/qeydiyyat" element={<RegisterChoice />} />
        <Route path="/qeydiyyat/sagird" element={<StudentRegister />} />
        <Route path="/qeydiyyat/muellim" element={<TeacherRegister />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/forgot" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}
