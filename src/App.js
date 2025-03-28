import { useEffect, useState } from "react";
import axios from "axios";
import {  Skeleton, Result, Badge, Avatar, notification } from "antd";
import {
  HomeOutlined,
  ShopFilled,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";

import Card from "./components/Card";
import Filter from "./components/Filter";

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState({});
  const [shoppingCart, setShoppingCart] = useState({});
  const [cartCount, setCartCount] = useState(0);
  const [error, setError] = useState(null);
  const [showProducts, setShowProducts] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);

  useEffect(() => {
    
    const savedFavorites = JSON.parse(localStorage.getItem("favorites")) || {};
    const savedShoppingCart = JSON.parse(
      localStorage.getItem("shoppingCart")) || {};
    const lengthOfShoppingCart = Object.keys(savedShoppingCart).length;
    setFavorites(savedFavorites);
    setShoppingCart(savedShoppingCart);
    setCartCount(lengthOfShoppingCart);
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
    const count = Object.values(shoppingCart).filter(
      (value) => value === true
    ).length;
    setCartCount(count);
  }, [shoppingCart]);

 

  const fetchProducts = async (categoryID) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://api.hyperteknoloji.com.tr/Products/List",
        {},
        {
          params: { page: 0, pageSize: 50, productCategoryID: categoryID },
        }
      );

      if (response.data.success) {
        setProducts(response.data.data);
        applyPriceFilter(response.data.data, minPrice, maxPrice);
      } else {
        setProducts([]);
        setFilteredProducts([]);
        setError(response.data.message);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Veri alınırken bir hata oluştu.");
    }
    setLoading(false);
  };

  const handleFavoriteClicked = (productID) => {
    setFavorites((prevFavorites) => {
      const isFavorited = !prevFavorites[productID]; 
      const updatedFavorites = {
        ...prevFavorites,
        [productID]: isFavorited,
      };
  
      notification.success({
        message: "Favoriler Güncellendi",
        description: isFavorited
          ? "Ürün favorilere eklendi."
          : "Ürün favorilerden çıkarıldı.",
        duration: 2,
      });
      return updatedFavorites;
    });
  };
  
  const handleProductToAddCart = (productID) => {
    setShoppingCart((prev) => {
      const isAdded = !prev[productID];
      const updatedCart = {
        ...prev,
        [productID]: isAdded,
      };

      notification.success({
        message: "Sepet Güncellendi",
        placement:"topRight",
        description: isAdded
          ? "Ürün sepete eklendi."
          : "Ürün sepetten çıkarıldı.",
        duration: 2,
      }); 
      return updatedCart;
    });
  };
  const applyPriceFilter = (productList, min, max) => {
    const filtered = productList.filter(
      (product) => product.salePrice >= min && product.salePrice <= max
    );
    setFilteredProducts(filtered);
  };

  const handlePriceFilter = (min, max) => {
    setMinPrice(min);
    setMaxPrice(max);
    applyPriceFilter(products, min, max);
  };
  return (
    <div className="flex flex-col min-h-screen pb-20 bg-[#F9F7F7]">
      <nav className="flex justify-around items-center bg-[#DBE2EF] shadow-md  px-4 pt-1">
        <div className="flex items-center">
          <img
            src="https://cdnhyper.s3.eu-central-1.amazonaws.com/hyper%20teknoloji%20logo%201_1685708957.webp"
            alt="Hyper Teknoloji Logo"
            className="h-14 w-auto p-1"
          />
        </div>

        <ul className="hidden md:flex space-x-6 font-semibold text-[#112D4E]">
          <li className="cursor-pointer hover:text-gray-600">Anasayfa</li>
          <li className="cursor-pointer border-b-2 border-[#3d7dc8] hover:text-gray-600">Ürünler</li>
          <li className="cursor-pointer hover:text-gray-600">İletişim</li>
          <li className="cursor-pointer hover:text-gray-600">Hakkımızda</li>
        </ul>

        <ul className="hidden md:flex space-x-4 items-center">
          <li className="cursor-pointer">
            <Badge count={cartCount} size="small" color="red">
              <Avatar
                shape="circle"
                size={30}
                className="bg-[#3d7dc8]"
                icon={<ShoppingCartOutlined className="" />}
              />
            </Badge>
          </li>
          <li className="cursor-pointer hidden md:flex hover:text-gray-900">
            <Avatar className="bg-[#112D4E]" size={30}>
              DH
            </Avatar>
          </li>
        </ul>
      </nav>

      <div className="flex flex-col md:flex-row  flex-grow">
      <Filter
          onCategorySelect={fetchProducts}
          setShowProducts={setShowProducts}
          setPriceFilter={handlePriceFilter}
        />

        {showProducts && filteredProducts.length > 0 && (
          <div className="w-full md:w-3/4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-5 gap-6 p-5">
              {loading
                ? Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton key={index} active />
                  ))
                : filteredProducts.map((product) => (
                    <Card
                      key={product.productID}
                      productID={product.productID}
                      productName={product.productName}
                      price={product.salePrice}
                      img={product.productData.productMainImage}
                      productInfo={product.productData.productInfo}
                      isFavorite={favorites[product.productID]}
                      inShoppingCart={shoppingCart[product.productID]}
                      onFavoriteClicked={handleFavoriteClicked}
                      onAddCartClicked={handleProductToAddCart}
                    />
                  ))}
            </div>
          </div>
        )}

        {!loading && filteredProducts.length === 0 && (
          <div className="flex items-center md:w-3/4 justify-center h-full">
            <Result
              status="404"
              title="Ürün Bulunamadı"
              subTitle="Seçtiğiniz kategoriye ait ürün bulunmamaktadır."
            />
          </div>
        )}
      </div>
      <div>
        
      </div>
      <nav className="md:hidden fixed bottom-0 left-0 w-full h-20 items-end border-2 border-gray-200 rounded-t-3xl  bg-white p-5">
        <ul className="flex justify-evenly">
          <li>
            <Avatar
              className="bg-[#112D4E]"
              size="large"
              icon={<HomeOutlined />}
            ></Avatar>
          </li>
          <li>
            <Avatar
              className="bg-[#3d7dc8]"
              size="large"
              icon={<ShopFilled />}
            ></Avatar>
          </li>
          <li>
            <Badge count={cartCount}>
              <Avatar
                className="bg-[#112D4E]"
                size="large"
                icon={<ShoppingCartOutlined />}
              ></Avatar>
            </Badge>
          </li>
          <li>
            <Avatar
              className="bg-[#112D4E]"
              size="large"
              icon={<UserOutlined />}
            ></Avatar>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default App;
