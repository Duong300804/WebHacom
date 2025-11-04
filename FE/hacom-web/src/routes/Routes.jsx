import { Route, Routes } from "react-router-dom"
import Login from "../pages/auth/SignIn/Login"
import Register from "../pages/auth/SignUp/Register";
import ForgotPassword from "../pages/auth/ForgotPassword/ForgotPassword";
import User from "../pages/admin/UserPage/User";
import Customer from "../pages/admin/CustomerPage/Customer";
import Brand from "../pages/admin/BrandPage/Brand";
import Tag from "../pages/admin/TagPage/Tag";
import Category from "../pages/admin/CategoryPage/Category";
import ProductList from "../pages/admin/ProductPage/ProductList";
import ProductFilter from "../pages/admin/ProductPage/ProductFilter";
import ProductCreate from "../pages/admin/ProductPage/ProductCreate";
import ProductEdit from "../pages/admin/ProductPage/ProductEdit";
import ProductDetail from "../pages/admin/ProductPage/ProductDetail";
import OrderList from "../pages/admin/OrderPage/OrderList";
import OrderFilter from "../pages/admin/OrderPage/OrderFilter";
import OrderDetail from "../pages/admin/OrderPage/OrderDetail";
import Dashboard from "../pages/admin/DashboardPage/Dashboard";
import HomePage from "../pages/user/HomePage/HomePage";
import Banner from "../pages/admin/BannerPage/Banner";
import NewsList from "../pages/admin/NewsPage/NewsList";
import NewsDetail from "../pages/admin/NewsPage/NewsDetail";
import NewsCreate from "../pages/admin/NewsPage/NewsCreate";
import NewsEdit from "../pages/admin/NewsPage/NewsEdit";
import Staff from "../pages/admin/StaffPage/Staff";
import CategoryPage from "../pages/user/CategoryPage/CategoryPage";
import SearchPage from "../pages/user/SearchPage/SearchPage";
import ProductDetailPage from "../pages/user/ProductDetailPage/ProductDetailPage";
import AccountPage from "../pages/user/AccountPage/AccountPage";
import CartPage from "../pages/user/CartPage/CartPage";
import PaymentPage from "../pages/user/PaymentPage/PaymentPage";
import TrackOrderPage from "../pages/user/TrackOrderPage/TrackOrderPage";


const AppRoutes = () => {
    return(
        <Routes>
            <Route path="/" element={<HomePage/>}/>
            <Route path="/account" element={<AccountPage/>}/>
            <Route path="/category/:categoryId" element={<CategoryPage/>} />
            <Route path="/search" element={<SearchPage/>} />
            <Route path="/product/:id" element={<ProductDetailPage/>} />
            <Route path="/cart" element={<CartPage/>}/>
            <Route path="/payment" element={<PaymentPage/>}/>
            <Route path="/track-order" element={<TrackOrderPage/>}/>
            
            <Route path="/login" element={<Login/>}/>
            <Route path="/register" element={<Register/>}/>
            <Route path="/forgot-password" element={<ForgotPassword/>}/>

            <Route path="/admin/user" element={<User/>}/>
            <Route path="/admin/customer" element={<Customer/>}/>
            <Route path="/admin/staff" element={<Staff/>}/>
            <Route path="/admin/brand" element={<Brand/>}/>
            <Route path="/admin/tag" element={<Tag/>}/>
            <Route path="/admin/category" element={<Category/>}/>
            <Route path="/admin/banner" element={<Banner/>}/>
            <Route path="/admin/dashboard" element={<Dashboard/>}/>
            
            <Route path="/admin/product" element={<ProductList/>}/>
            <Route path="/admin/product/filter" element={<ProductFilter/>}/>
            <Route path="admin/product/create" element={<ProductCreate/>}/>
            <Route path="/admin/product/edit/:id" element={<ProductEdit/>}/>
            <Route path="/admin/product/detail/:id" element={<ProductDetail/>}/>

            <Route path="/admin/order" element={<OrderList/>}/>
            <Route path="/admin/order/filter" element={<OrderFilter/>}/>
            <Route path="/admin/order/detail/:id" element={<OrderDetail/>}/>

            <Route path="/admin/news" element={<NewsList/>}/>
            <Route path="/admin/news/detail/:id" element={<NewsDetail/>}/>
            <Route path="/admin/news/create" element={<NewsCreate/>}/>
            <Route path="/admin/news/edit/:id" element={<NewsEdit/>}/>
        </Routes>
    )
}

export default AppRoutes;