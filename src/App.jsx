import { useCallback, useState } from "react";
import { BrowserRouter, Routes, Route, Link, useLocation } from "react-router-dom";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { CartProvider, useCart } from "./context/CartContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import Toast from "./components/Toast";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";

function NotFound() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6">
      <h1 className="font-display text-3xl font-bold tracking-tight">Halaman tidak ditemukan</h1>
      <p className="mt-3 text-ink/60">Alamat yang kamu buka tidak ada.</p>
      <Link
        to="/"
        className="mt-6 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-paper transition hover:bg-accent"
      >
        Kembali ke beranda
      </Link>
    </section>
  );
}

function Shell() {
  const { add, count } = useCart();
  const location = useLocation();
  const [cartOpen, setCartOpen] = useState(false);
  const openCart = useCallback(() => setCartOpen(true), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

  return (
    <>
      <Navbar cartCount={count} onCartClick={openCart} />

      <main className="min-h-[70vh] pt-20 sm:pt-24">
        {/* Halaman lama memudar dulu, lalu halaman baru naik pelan.
            Scroll kembali ke atas setelah halaman lama hilang. */}
        <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <Routes location={location}>
              <Route path="/" element={<Home onAddToCart={add} />} />
              <Route path="/products" element={<Products onAddToCart={add} />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />
      <CartDrawer open={cartOpen} onClose={closeCart} />
      <Toast onOpenCart={openCart} />
    </>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <CartProvider>
        <BrowserRouter>
          <Shell />
        </BrowserRouter>
      </CartProvider>
    </MotionConfig>
  );
}