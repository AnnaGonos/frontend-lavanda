import React, {useState} from 'react';
import {Routes, Route, BrowserRouter} from 'react-router-dom';
import Home from './pages/Home/Home';
import Contacts from './pages/Contacts/Contacts';
import './assets/fonts/fonts.css';
import './App.css';
import Delivery from './pages/Delivery/Delivery';
import Care from './pages/Care/Care';
import Payment from './pages/Payment/Payment';
import Faq from './pages/Faq/Faq';
import {Dashboard} from './components/UserDashboard/Dashboard';
import {ProtectedRoute} from "./routing/ProtectedRoute";
import {PageWrapper} from "./components/Layout/PageWrapper";
import {AuthProvider} from "./context/AuthContext";
import {NotificationProvider} from "./context/NotificationContext";
import {AdminRoute} from "./routing/AdminRoute";
import {Portal} from "./components/Portal/Portal";
import {AdminPanelButton} from "./components/AdminPanel/AdminPanelButton";
import {ProductsTab} from "./components/AdminPanel/Products/ProductsTab";
import {OrdersTab} from "./components/AdminPanel/Orders/OrdersTab";
import {ReviewsTab} from "./components/AdminPanel/ReviewsTab";
import ProductDetailPage from "./components/Catalog/ProductDetailPage";
import {CatalogPage} from "./components/Catalog/Catalog";
import {FavoriteProvider} from "./context/FavoriteContext";
import {FavoritesPage} from "./pages/Favorite/FavoritePage";
import {CartPage} from "./pages/Cart/CartPage";
import {CartProvider} from "./context/CartContext";
import {CheckoutPage} from "./pages/Cart/CheckoutPage";
import {OrderSuccessPage} from "./pages/Cart/OrderSuccessPage";
import {OrderDetails} from "./components/AdminPanel/Orders/OrderDetails";
import {StaffsTab} from "./components/AdminPanel/Staffs/Staffs";

const MainApp = () => {


    return (
        <>
            <Routes>
                <Route path="/" element={<PageWrapper><Home/></PageWrapper>}/>
                <Route path="/contacts" element={<PageWrapper><Contacts/></PageWrapper>}/>
                <Route path="/delivery" element={<PageWrapper><Delivery/></PageWrapper>}/>
                <Route path="/care" element={<PageWrapper><Care/></PageWrapper>}/>
                <Route path="/payment" element={<PageWrapper><Payment/></PageWrapper>}/>
                <Route path="/faq" element={<PageWrapper><Faq/></PageWrapper>}/>

                <Route path="/catalog" element={<PageWrapper><CatalogPage/></PageWrapper>}/>
                <Route path="/product/:id" element={<PageWrapper><ProductDetailPage/></PageWrapper>}/>

                <Route path="/lk"
                       element={
                           <ProtectedRoute>
                               <PageWrapper>
                                   <Dashboard/>
                               </PageWrapper>
                           </ProtectedRoute>
                       }
                />
                <Route path="/lk/orders"
                       element={
                           <ProtectedRoute>
                               <PageWrapper>
                                   <Dashboard/>
                               </PageWrapper>
                           </ProtectedRoute>
                       }
                />
                <Route path="/lk/edit"
                       element={
                           <ProtectedRoute>
                               <PageWrapper>
                                   <Dashboard/>
                               </PageWrapper>
                           </ProtectedRoute>
                       }
                />

                <Route path="/lk/checkout"
                       element={
                           <PageWrapper>
                               <CheckoutPage/>
                           </PageWrapper>
                       }
                />

                <Route
                    path="/lk/order/success/:orderNumber"
                    element={
                        <PageWrapper>
                            <OrderSuccessPage/>
                        </PageWrapper>
                    }
                />


                <Route path="/lk/favorites" element={<PageWrapper><FavoritesPage/></PageWrapper>}/>
                <Route path="/lk/cart" element={<PageWrapper><CartPage/></PageWrapper>}/>

                <Route path="/lk" element={<Dashboard/>}/>
                <Route path="/lk/orders" element={<Dashboard/>}/>

                <Route path="/admin/products"
                       element={<AdminRoute><PageWrapper><ProductsTab/></PageWrapper></AdminRoute>}/>

                <Route
                    path="/admin/orders"
                    element={
                        <AdminRoute>
                            <PageWrapper>
                                <OrdersTab/>
                            </PageWrapper>
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/orders/:id"
                    element={
                        <AdminRoute>
                            <PageWrapper>
                                <OrderDetails />
                            </PageWrapper>
                        </AdminRoute>
                    }
                />

                <Route
                    path="/admin/reviews"
                    element={
                        <AdminRoute>
                            <PageWrapper>
                                <ReviewsTab/>
                            </PageWrapper>
                        </AdminRoute>
                    }
                />
                <Route
                    path="/admin/staffs"
                    element={
                        <AdminRoute>
                            <PageWrapper>
                                <StaffsTab/>
                            </PageWrapper>
                        </AdminRoute>
                    }
                />

            </Routes>

            <Portal>
                <AdminPanelButton/>
            </Portal>
        </>
    );
};

export default function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <CartProvider>
                    <FavoriteProvider>
                        <NotificationProvider>
                            <MainApp/>
                        </NotificationProvider>
                    </FavoriteProvider>
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

