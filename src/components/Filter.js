import { useState, useEffect } from "react";
import { Menu, Slider, InputNumber, Drawer, Button } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "../redux/categorySlice";
import { FilterOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { setAuthToken } from "../setAuthToken";

const Filter = ({ onCategorySelect, setShowProducts, setPriceFilter }) => {
  const dispatch = useDispatch();
  const { categories, status } = useSelector((state) => state.categories);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [openKeys, setOpenKeys] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);
  const [isPriceDrawerOpen, setIsPriceDrawerOpen] = useState(false);

  useEffect(() => {
    setAuthToken();
  }, []);
  
  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);
  
  useEffect(() => {
    if (categories.length > 0 && !selectedCategory) {
      sortCategories();
    }
  }, [categories]);
  
  const sortCategories = () => {
    try {
      const firstParent = categories.find((cat) => cat.parentID === 0);
      if (firstParent) {
        setSelectedCategory(firstParent.productCategoryID);
        setOpenKeys([firstParent.productCategoryID.toString()]);

        const firstChild = categories.find(
          (child) => child.parentID === firstParent.productCategoryID
        );
        if (firstChild) {
          setSelectedCategory(firstChild.productCategoryID);
        }
        onCategorySelect(firstChild?.productCategoryID || firstParent.productCategoryID);
      }
    } catch (error) {
      console.error("Kategori çekme hatası:", error);
    }
  };

  const handleCategoryClick = (categoryID) => {
    setSelectedCategory(categoryID);
    onCategorySelect(categoryID);
    setShowProducts(true);
  };

  const handlePriceChange = (values) => {
    setMinPrice(values[0]);
    setMaxPrice(values[1]);
    setPriceFilter(values[0], values[1]);
  };

  const categoryItems = categories
  .filter((cat) => cat.parentID === 0)
  .map((parent) => {
    const childCategories = categories.filter(
      (child) => child.parentID === parent.productCategoryID
    );

    return childCategories.length > 0
      ? {
          key: parent.productCategoryID.toString(),
          label: parent.categoryName,
          children: childCategories.map((child) => ({
            key: child.productCategoryID.toString(),
            label: child.categoryName,
            onClick: () => handleCategoryClick(child.productCategoryID),
          })),
        }
      : {
          key: parent.productCategoryID.toString(),
          label: parent.categoryName,
          onClick: () => handleCategoryClick(parent.productCategoryID),
        };
  });


  return (
    <>
      <div className="md:hidden w-full bg-white shadow-lg p-2 flex justify-around">
        <Button icon={<UnorderedListOutlined />} onClick={() => setIsCategoryDrawerOpen(true)}>
          Kategoriler
        </Button>
        <Button icon={<FilterOutlined />} onClick={() => setIsPriceDrawerOpen(true)}>
          Fiyat Filtresi
        </Button>
      </div>

      <Drawer
        title="Kategoriler"
        placement="left"
        closable
        onClose={() => setIsCategoryDrawerOpen(false)}
        open={isCategoryDrawerOpen}
      >
        <Menu
          mode="inline"
          selectedKeys={[selectedCategory?.toString()]}
          openKeys={openKeys}
          onOpenChange={(keys) => setOpenKeys(keys)}
          inlineIndent={20}
          items={categoryItems}
        />
      </Drawer>

      <Drawer
        title="Fiyat Filtresi"
        placement="right"
        closable
        onClose={() => setIsPriceDrawerOpen(false)}
        open={isPriceDrawerOpen}
      >
        <div className="p-4">
          <h3 className="text-sm font-semibold">Fiyat Aralığı</h3>
          <Slider
            range
            min={0}
            max={50000}
            step={10}
            defaultValue={[minPrice, maxPrice]}
            onChange={handlePriceChange}
          />
          <div className="flex justify-between py-5">
            <InputNumber min={0} max={50000} value={minPrice} onChange={(value) => handlePriceChange([value, maxPrice])} />
            <InputNumber min={0} max={50000} value={maxPrice} onChange={(value) => handlePriceChange([minPrice, value])} />
          </div>
        </div>
      </Drawer>

      <div className="hidden h-screen md:block w-1/5 md:sticky md:top-0 left-0 rounded-lg pb-5 px-2 bg-white shadow-md md:m-5">
        <h3 className="pt-4 pb-2 text-sm font-semibold text-center">Kategoriler</h3>
        <Menu
          mode="inline"
          selectedKeys={[selectedCategory?.toString()]}
          openKeys={openKeys}
          onOpenChange={(keys) => setOpenKeys(keys)}
          inlineIndent={5}
          className="h-2/3 md:overflow-y-auto border-2 bg-gray-50 rounded-md text-[10px]"
          items={categoryItems}
        />

        <div className="p-4 mt-5 border-2 bg-gray-50 rounded-md">
          <h3 className="text-sm font-semibold">Fiyat Aralığı</h3>
          <Slider
            range
            min={0}
            max={10000}
            step={10}
            defaultValue={[minPrice, maxPrice]}
            onChange={handlePriceChange}
          />
          <div className="flex justify-around">
            <InputNumber min={0} max={50000} value={minPrice} onChange={(value) => handlePriceChange([value, maxPrice])} />
            <InputNumber min={0} max={50000} value={maxPrice} onChange={(value) => handlePriceChange([minPrice, value])} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Filter;
