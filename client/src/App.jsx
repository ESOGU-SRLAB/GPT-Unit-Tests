import { Routes, Route } from 'react-router-dom';

/* Authentication */
import LoginPage from './components/authentication/LoginPage';
import RegisterPage from './components/authentication/RegisterPage';
import NotFoundPage from './components/notFound/NotFoundPage';
import AuthRedirectRoute from './components/authentication/AuthRedirectRoute';
import AuthenticatedLayout from './components/authentication/AuthenticatedLayout';
import ProtectedRoute from './components/authentication/ProtectedRoute';

/* Functionality Components */
import DashboardPage from './components/dashboard/DashboardPage';
import UnitTestGenerationPage from './components/unitTestGeneration/UnitTestGenerationPage';
import EditorSettingsPage from './components/editorSettings/EditorSettingsPage';
import UnitTestGenerationHistoryPage from './components/unitTestGenerationHistory/UnitTestGenerationHistoryPage';
import AccountPage from './components/account/AccountPage';
import TerminalSettingsPage from './components/terminalSettings/TerminalSettingsPage';

function App() {
    return (
        <>
            <Routes>
                <Route
                    path="/login"
                    element={
                        <AuthRedirectRoute>
                            <LoginPage />
                        </AuthRedirectRoute>
                    }
                />
                <Route
                    path="/register"
                    element={
                        <AuthRedirectRoute>
                            <RegisterPage />
                        </AuthRedirectRoute>
                    }
                />
                <Route
                    path="/"
                    element={
                        <ProtectedRoute>
                            <AuthenticatedLayout>
                                <DashboardPage />
                            </AuthenticatedLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/generation"
                    element={
                        <ProtectedRoute>
                            <AuthenticatedLayout>
                                <UnitTestGenerationPage />
                            </AuthenticatedLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/editor-settings"
                    element={
                        <ProtectedRoute>
                            <AuthenticatedLayout>
                                <EditorSettingsPage />
                            </AuthenticatedLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/terminal-settings"
                    element={
                        <ProtectedRoute>
                            <AuthenticatedLayout>
                                <TerminalSettingsPage />
                            </AuthenticatedLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/generation-history"
                    element={
                        <ProtectedRoute>
                            <AuthenticatedLayout>
                                <UnitTestGenerationHistoryPage />
                            </AuthenticatedLayout>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/account"
                    element={
                        <ProtectedRoute>
                            <AuthenticatedLayout>
                                <AccountPage />
                            </AuthenticatedLayout>
                        </ProtectedRoute>
                    }
                />

                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </>
    );
}

export default App;
