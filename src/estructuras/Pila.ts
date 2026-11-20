export class Pila<T> {
  #items: T[] = [];

  apilar(elemento: T): void {
    this.#items.push(elemento);
  }

  push(elemento: T): void {
    this.apilar(elemento);
  }

  desapilar(): T | undefined {
    return this.#items.pop();
  }

  pop(): T | undefined {
    return this.desapilar();
  }

  tope(): T | undefined {
    if (this.estaVacia()) {
      return undefined;
    }
    return this.#items[this.#items.length - 1];
  }

  peek(): T | undefined {
    return this.tope();
  }

  get tamanio(): number {
    return this.#items.length;
  }

  estaVacia(): boolean {
    return this.#items.length === 0;
  }

  aArray(): T[] {
    return [...this.#items];
  }
}
