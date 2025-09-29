export interface User {
  id: string;
  email: string;
}

export interface Empleado {
  id_empleado: string;
  nombre: string;
  puesto: 'gerente' | 'cajero';
  telefono?: string;
  fecha_contratacion: string;
  user_id?: string;
  created_at: string;
}

export interface Proveedor {
  id_proveedor: string;
  nombre_empresa: string;
  contacto?: string;
  telefono?: string;
  created_at: string;
}

export interface Platillo {
  id_platillo: string;
  nombre: string;
  descripcion?: string;
  precio: number;
  categoria: string;
  disponible: boolean;
  imagen_url?: string;
  created_at: string;
}

export interface Ingrediente {
  id_ingrediente: string;
  nombre: string;
  stock: number;
  stock_minimo: number;
  unidad_medida: string;
  id_proveedor?: string;
  created_at: string;
  proveedor?: Proveedor;
}

export interface Venta {
  id_venta: string;
  fecha_venta: string;
  total_venta: number;
  id_empleado: string;
  metodo_pago: string;
  created_at: string;
  empleado?: Empleado;
  detalles?: DetalleVenta[];
}

export interface DetalleVenta {
  id_detalle: string;
  id_venta: string;
  id_platillo: string;
  cantidad: number;
  precio_unitario: number;
  created_at: string;
  platillo?: Platillo;
}

export interface CartItem {
  platillo: Platillo;
  cantidad: number;
}