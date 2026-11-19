import { items } from "@/site/lib/catalog";

/** O preço e a divisão Free/Pro do catálogo. Pro são os itens escritos para o ryan-ui. */
export const PRICE = "$49";
export const proItems = items.filter(item => item.isNew);
export const freeItems = items.filter(item => !item.isNew);
