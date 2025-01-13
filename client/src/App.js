import { BrowserRouter, Route, Routes } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import Home from './pages/Home.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import Solution from './pages/Solution.jsx';
import { ModalProvider } from "./context/modalContext/modalContext.js";
import { ProblemProvider } from "./context/problemContext/problemContext.js";
import { useAuthContext } from "./context/authContext/authContext.js";
import { setupProblemApiInterceptor } from "./api/problemApi.js";
import { setupSolutionApiInterceptor } from "./api/solutionApi.js";
import { refreshAccessToken } from "./api/authApi.js";
import { QueryClient, QueryClientProvider } from 'react-query';
import { ReactQueryDevtools } from 'react-query/devtools';
import Auth from './pages/Auth.jsx';

const queryClient = new QueryClient();

function App() {
    const { authUser, dispatch, token } = useAuthContext();
    const [isTokenExists, setIsTokenExists] = useState(false);

    useEffect(() => {
        const initializeAuth = async () => {
            if (token) {
                setupSolutionApiInterceptor(token, dispatch);
                setupProblemApiInterceptor(token, dispatch);
                setIsTokenExists(true);
            } else {
                try {
                    const isLoggedin = localStorage.getItem('isLoggedIn');
                    if (isLoggedin) {
                        const { accessToken, user } = await refreshAccessToken();
                        dispatch({ type: "SET_TOKEN", payload: accessToken });
                        dispatch({ type: "SET_AUTH_USER", payload: user });
                        localStorage.setItem('isLoggedIn', 'true');
                    }
                }
                catch (error) {
                    if (error.response && error.response.status === 401) {
                        console.warn("No valid refresh token found. User needs to log in.");

                    } else { console.error("Error during token refresh:", error); }
                }
            }
        };
        initializeAuth();
    }, [token, dispatch]);

    if (!isTokenExists && authUser) {
        return <div>Loading...</div>;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <div className="bg-customDark w-full h-screen">
                <ModalProvider>
                    <ProblemProvider>
                        {authUser && <Header />}
                        <BrowserRouter>
                            <Routes>
                                <Route path="/" element={authUser ? <Home /> : <Auth />} />
                                <Route path="/auth" element={authUser ? <Home /> : <Auth />} />
                                <Route path="/solution/:problemName" element={authUser ? <Solution /> : <Auth />} />
                            </Routes>
                        </BrowserRouter>
                        {authUser && <Footer />}
                    </ProblemProvider>
                </ModalProvider>
            </div>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}

export default App;
