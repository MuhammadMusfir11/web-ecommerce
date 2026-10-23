import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { products } from "../data/products";

const CartContext = createContext(null);

const STORAGE_KEY = "walicell-cart";
const MAX_QTY = 10;

// Keranjang disimpan hanya berupa { id, qty }.
// Nama dan harga selalu diambil dari products.js, jadi kalau harga diubah, keranjang ikut berubah.
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const data = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(data)) return [];
    return data.filter(
      (l) => l && typeof l.id === "string" && Number.isInteger(l.qty) && l.qty > 0
    );
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [lines, setLines] = useState(load);
  const [lastAdded, setLastAdded] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      // storage penuh atau diblokir, abaikan saja
    }
  }, [lines]);

  const add = useCallback((product, qty = 1) => {
    setLines((prev) => {
      const found = prev.find((l) => l.id === product.id);
      if (found) {
        return prev.map((l) =>
          l.id === product.id ? { ...l, qty: Math.min(l.qty + qty, MAX_QTY) } : l
        );
      }
      return [...prev, { id: product.id, qty: Math.min(qty, MAX_QTY) }];
    });
    setLastAdded({ product, key: Date.now() });
  }, []);

  const setQty = useCallback((id, qty) => {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => l.id !== id)
        : prev.map((l) => (l.id === id ? { ...l, qty: Math.min(qty, MAX_QTY) } : l))
    );
  }, []);

  const remove = useCallback((id) => {
    setLines((prev) => prev.filter((l) => l.id !== id));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const items = useMemo(
    () =>
      lines
        .map((l) => ({ product: products.find((p) => p.id === l.id), qty: l.qty }))
        .filter((i) => i.product),
    [lines]
  );

  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const total = items.reduce((sum, i) => sum + i.qty * i.product.price, 0);

  const value = { items, count, total, add, setQty, remove, clear, lastAdded, maxQty: MAX_QTY };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart harus dipakai di dalam CartProvider");
  return ctx;
}