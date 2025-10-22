import type { IUser, IProduct, UserDTO, ProductDTO } from './types';

const API_URL = 'http://localhost:3001/api';

// ============= USUÁRIOS =============

export async function fetchUsers(name?: string): Promise<IUser[]> {
  const url = name ? `${API_URL}/users?name=${encodeURIComponent(name)}` : `${API_URL}/users`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Erro ao buscar usuários');
  return response.json();
}

export async function fetchUserById(id: string): Promise<IUser> {
  const response = await fetch(`${API_URL}/users/${id}`);
  if (!response.ok) throw new Error('Usuário não encontrado');
  return response.json();
}

export async function createUser(user: UserDTO): Promise<IUser> {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!response.ok) throw new Error('Erro ao criar usuário');
  return response.json();
}

export async function deleteUser(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/users/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Erro ao deletar usuário');
}

export async function setUserProducts(userId: string, productIds: string[]): Promise<void> {
  const response = await fetch(`${API_URL}/users/${userId}/products`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ productIds }),
  });
  if (!response.ok) throw new Error('Erro ao definir produtos');
}

// ============= PRODUTOS =============

export async function fetchProducts(name?: string): Promise<IProduct[]> {
  const url = name ? `${API_URL}/products?name=${encodeURIComponent(name)}` : `${API_URL}/products`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Erro ao buscar produtos');
  return response.json();
}

export async function fetchProductById(id: string): Promise<IProduct> {
  const response = await fetch(`${API_URL}/products/${id}`);
  if (!response.ok) throw new Error('Produto não encontrado');
  return response.json();
}

export async function createProduct(product: ProductDTO): Promise<IProduct> {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!response.ok) throw new Error('Erro ao criar produto');
  return response.json();
}

export async function deleteProduct(id: string): Promise<void> {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Erro ao deletar produto');
}

export async function addProductQuantity(id: string, quantity: number): Promise<IProduct> {
  const response = await fetch(`${API_URL}/products/${id}/add`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
  if (!response.ok) throw new Error('Erro ao adicionar quantidade');
  return response.json();
}

export async function removeProductQuantity(id: string, quantity: number): Promise<IProduct> {
  const response = await fetch(`${API_URL}/products/${id}/remove`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ quantity }),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao remover quantidade');
  }
  return response.json();
}
