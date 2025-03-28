import { Button, Image } from "antd";
import {
  DeleteFilled,
  HeartFilled,
  HeartOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";

const Card = ({
  productName,
  img,
  price,
  productInfo,
  productID,
  onFavoriteClicked,
  onAddCartClicked,
  isFavorite,
  inShoppingCart,
}) => {
  return (
    <div className="flex flex-col relative items-center h-[250px] border border-gray-200 rounded-xl shadow-lg p-2 bg-white">
      <Image src={img} height={80} loading="lazy" />
      <h3 className="text-sm font-semibold h-1/5 line-clamp-3 text-center mt-2 text-gray-900">
        {productName}
      </h3>
      <p className="text-[10px] text-gray-600 h-1/5 line-clamp-5 text-center">
        {productInfo}
      </p>
      <div className="flex items-center justify-evenly  w-full mt-5">
        <p className="text-sm font-bold text-gray-800">{price}₺</p>
        <Button
          onClick={() => onFavoriteClicked(productID)}
          className="bg-gray-100 text-gray-600 hover:!bg-gray-300 "
          type="primary"
          size="small"
          shape="circle"
          icon={isFavorite ? <HeartFilled  /> : <HeartOutlined />}
        />
        <Button
          onClick={() => onAddCartClicked(productID)}
          size="small"
          shape="circle"
          className="bg-black hover:!bg-gray-600"
          type="primary"
          icon={!inShoppingCart ? <ShoppingCartOutlined /> : <DeleteFilled />}
        />
      </div>
    </div>
  );
};

export default Card;
