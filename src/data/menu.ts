import type { MenuItem } from '@/types';

export const menuItems: MenuItem[] = [
  // Café e Lanches
  {
    id: 'pao-na-chapa',
    name: 'Pão na Chapa',
    description: 'Pão francês na manteiga com queijo derretido',
    price: 6.0,
    category: 'Café e Lanches',
  },
  {
    id: 'misto-quente',
    name: 'Misto Quente',
    description: 'Pão de forma com presunto e queijo na chapa',
    price: 8.0,
    category: 'Café e Lanches',
  },
  {
    id: 'tapioca-queijo',
    name: 'Tapioca de Queijo',
    description: 'Tapioca recheada com queijo derretido',
    price: 9.0,
    category: 'Café e Lanches',
  },
  {
    id: 'cafe-especial',
    name: 'Café Especial',
    description: 'Café artesanal coado na hora',
    price: 5.0,
    category: 'Café e Lanches',
  },
  {
    id: 'pao-de-queijo',
    name: 'Pão de Queijo',
    description: 'Pão de queijo mineiro fresquinho (3un)',
    price: 7.0,
    category: 'Café e Lanches',
  },

  // Sabores que Encantam
  {
    id: 'roller-2litros',
    name: 'Roller 2 Litros',
    description: 'Lanche gigante Roller com 2 litros de recheio especial',
    price: 35.0,
    category: 'Sabores que Encantam',
    isNew: true,
  },
  {
    id: 'roller-600ml',
    name: 'Roller 600ml',
    description: 'Lanche Roller tamanho médio com recheio cremoso',
    price: 18.0,
    category: 'Sabores que Encantam',
    isNew: true,
  },
  {
    id: 'x-tudo',
    name: 'X-Tudo Especial',
    description: 'Hambúrguer, bacon, ovo, queijo, salada e molho da casa',
    price: 22.0,
    category: 'Sabores que Encantam',
  },
  {
    id: 'misto-da-casa',
    name: 'Misto da Casa',
    description: 'Sanduíche artesanal com ingredientes selecionados',
    price: 15.0,
    category: 'Sabores que Encantam',
  },
  {
    id: 'porcao-fritas',
    name: 'Porção de Fritas',
    description: 'Batatas fritas crocantes com cheddar e bacon',
    price: 20.0,
    category: 'Sabores que Encantam',
  },

  // Bebidas
  {
    id: 'coca-lata',
    name: 'Coca-Cola Lata',
    description: 'Refrigerante Coca-Cola 350ml gelado',
    price: 6.0,
    category: 'Bebidas',
  },
  {
    id: 'suco-natural',
    name: 'Suco Natural',
    description: 'Suco natural de frutas da estação (300ml)',
    price: 8.0,
    category: 'Bebidas',
  },
  {
    id: 'agua-mineral',
    name: 'Água Mineral',
    description: 'Água mineral 500ml com ou sem gás',
    price: 4.0,
    category: 'Bebidas',
  },
  {
    id: 'milkshake',
    name: 'Milkshake',
    description: 'Milkshake cremoso de chocolate, morango ou baunilha',
    price: 12.0,
    category: 'Bebidas',
  },
  {
    id: 'cha-gelado',
    name: 'Chá Gelado',
    description: 'Chá gelado artesanal de frutas vermelhas',
    price: 7.0,
    category: 'Bebidas',
  },
];

export const categories: MenuItem['category'][] = [
  'Café e Lanches',
  'Sabores que Encantam',
  'Bebidas',
];
