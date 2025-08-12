import React from "react"; 
import { Navigate, Route, Routes } from "react-router-dom";
import FloatingShape from "./components/FloatingShape";
import Header from "./components/Header";
import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import LoadingSpinner from "./components/LoadingSpinner";
import ProductList from "./pages/ProductList"; 
import ProductDetail from "./pages/ProductDetail";
import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import AddProduct from "./pages/AddProduct"; // to be created
import AddMoney from "./pages/AddMoney";     // to be created
const ProtectedRoute = ({ children }) => {
    const { user, isAuthenticated, isVerified } = useAuthStore();
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    if (!isVerified) {
        return <Navigate to="/verify-email" replace />;
    }
    return React.cloneElement(children, { user });
};
const RedirectAuthenticatedUser = ({ children }) => {
    const { isAuthenticated, isVerified } = useAuthStore();
    if (isAuthenticated && isVerified) {
        return <Navigate to='/' replace />;
    }
    return children;
};
function App() {
    const { isCheckingAuth, checkAuth } = useAuthStore();
    useEffect(() => {
        checkAuth();
    }, [checkAuth]);
    if (isCheckingAuth) return <LoadingSpinner />;
    return (
        <div className='min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 relative overflow-hidden'>
            <FloatingShape color='bg-green-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
            <FloatingShape color='bg-emerald-500' size='w-48 h-48' top='70%' left='80%' delay={5} />
            <FloatingShape color='bg-lime-500' size='w-32 h-32' top='40%' left='-10%' delay={2} />
            <Header/>
            <div className="flex items-center justify-center mt-20">
                <Routes>
                    <Route
                        path='/'
                        element={
                            <ProtectedRoute>
                                <DashboardPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/product" element={<ProtectedRoute><ProductList /></ProtectedRoute>} />
                    <Route path="/product/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
                    <Route
                        path='/signup'
                        element={
                            <RedirectAuthenticatedUser>
                                <SignUpPage />
                            </RedirectAuthenticatedUser>
                        }
                    />
                    <Route
                        path='/login'
                        element={
                            <RedirectAuthenticatedUser>
                                <LoginPage />
                            </RedirectAuthenticatedUser>
                        }
                    />
                    <Route path='/verify-email' element={<EmailVerificationPage />} />
                    <Route
                        path='/forgot-password'
                        element={
                            <RedirectAuthenticatedUser>
                                <ForgotPasswordPage />
                            </RedirectAuthenticatedUser>
                        }
                    />
                    <Route
                        path='/reset-password/:token'
                        element={
                            <RedirectAuthenticatedUser>
                                <ResetPasswordPage />
                            </RedirectAuthenticatedUser>
                        }
                    />
                    
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/product/add" element={<AddProduct />} />
                    <Route path="/wallet/add" element={<AddMoney />} />
                    
                    <Route path='*' element={<Navigate to='/' replace />} />
                </Routes>
            </div>
            <Toaster />
        </div>
    );
}

export default App;
