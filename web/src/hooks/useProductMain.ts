import type { ProductMainProps } from "../App";
import type { IProduct } from "../interfaces/Product";
import { userProductService } from "../services/userProductService";

export const useProductMain = ({
  selectedUser,
  changeProducts,
  closeCreatingProduct,
}: ProductMainProps & { closeCreatingProduct: () => void }) => {
  if (!selectedUser)
    return {
      removeProduct: () => {},
      addProductQuantity: () => {},
      removeProductQuantity: () => {},
      handleCreateProduct: () => {},
    };

  const removeProduct = async (product: IProduct) => {
    try {
      const products = await userProductService.deleteProduct(
        selectedUser.id,
        product.id
      );
      changeProducts(products);
    } catch {}
  };

  const addProductQuantity = async (product: IProduct) => {
    const products = await userProductService.addProductQuantity(
      selectedUser.id,
      product.id
    );
    changeProducts(products);
  };

  const removeProductQuantity = async (product: IProduct) => {
    const products = await userProductService.removeProductQuantity(
      selectedUser.id,
      product.id
    );
    changeProducts(products);
  };

  const handleCreateProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUser) return;

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const price = parseFloat(formData.get("price") as string);
    const quantity = parseInt(formData.get("quantity") as string, 10);

    const products = await userProductService.createProduct(selectedUser.id, {
      name,
      price,
      quantity,
    });
    changeProducts(products);
    closeCreatingProduct();
  };
  return {
    removeProduct,
    addProductQuantity,
    removeProductQuantity,
    handleCreateProduct,
  };
};
