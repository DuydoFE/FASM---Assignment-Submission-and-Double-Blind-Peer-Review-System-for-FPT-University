// src/App.jsx

import { RouterProvider } from "react-router-dom";
import { router } from "./config/router";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import AOS from "aos";
import "aos/dist/aos.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";

AOS.init({
  duration: 1000,
});

// 👉 2. Tạo queryClient ở bên ngoài component
const queryClient = new QueryClient();

function App() {
  // Dòng `const queryClient = new QueryClient();` đã được di chuyển ra ngoài
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ToastContainer />
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <RouterProvider router={router} />
          </PersistGate>
        </Provider>
      </QueryClientProvider>
    </>
  );
}

export default App;