import { Product } from "./Product";
import { UserDTO } from "./User";
import { UserManager } from "./UserManager";

describe("Gerenciamento de usuários", () => {
  let userManager: UserManager;
  beforeEach(() => {
    userManager = new UserManager();
  });

  it("cria um usuário", () => {
    const user: UserDTO = {
      name: "Usuário A",
    };
    const newUser = userManager.createUser(user);

    const items = userManager.getUsers();
    expect(items).toHaveLength(1);
    expect(items[0]).toHaveProperty("id");

    expect(items[0].name).toBe(newUser.name);
    expect(items[0].id).toBe(newUser.id);
  });

  it("deve buscar usuários pelo nome usando um objeto de filtro", () => {
    userManager.createUser({ name: "Renan Eduardo" });
    userManager.createUser({ name: "Felipe Alves" });

    const foundUsers = userManager.getUsers({ name: "Renan" });
    expect(foundUsers).toHaveLength(1);
    expect(foundUsers[0].name).toBe("Renan Eduardo");
  });

  it("deve deletar um usuário existente pelo id", () => {
    const userA = userManager.createUser({ name: "Usuário A" });
    const userB = userManager.createUser({ name: "Usuário B" });

    const result = userManager.deleteUser(userA.id);
    const usersAfterDelete = userManager.getUsers();

    expect(result).toBe(true);
    expect(usersAfterDelete).toHaveLength(1);
    expect(usersAfterDelete[0].id).toBe(userB.id);
  });
  it("deve tentar deletar um usuário inexistente", () => {
    const result = userManager.deleteUser("non-existent-id");
    expect(result).toBe(false);
  });
  it("definir produtos no usuário", () => {
    const productA = new Product({
      name: "Produto A",
      price: 100,
      quantity: 10,
    });
    const products = [productA];
    const user = userManager.createUser({ name: "Usuário A" });
    const result = userManager.setUserProducts(user.id, products); 
    expect(result).toBe(true);
  });
});
