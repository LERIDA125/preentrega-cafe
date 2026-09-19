import { createContext, useState } from 'react'

export const CartContext = createContext()

export const CartProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([])

  const addToCart = (item, cantidad) => {
    setCarrito((prev) => {
      const existente = prev.find((prod) => prod.id === item.id)
      if (existente) {
        return prev.map((prod) =>
          prod.id === item.id
            ? { ...prod, cantidad: prod.cantidad + cantidad }
            : prod
        )
      }
      return [
        ...prev,
        {
          id: item.id,
          nombre: item.nombre,
          precio: item.precio,
          imagen: item.imagen,
          cantidad,
        },
      ]
    })
  }

  const cartQuantity = () => {
    return carrito.reduce((total, item) => total + item.cantidad, 0)
  }

  return (
    <CartContext.Provider value={{ carrito, addToCart, cartQuantity }}>
      {children}
    </CartContext.Provider>
  )
}