export class Cola<T> {
  #items: T[] = [];
  #inicio: number = 0;

  encolar(elemento: T): void {
    this.#items.push(elemento);
  }

  enqueue(elemento: T): void {
    this.encolar(elemento);
  }

  desencolar(): T | undefined {
    if (this.estaVacia()) {
      return undefined;
    }
    const elemento = this.#items[this.#inicio];
    this.#inicio++;

    // Evita acumulacion de memoria manteniendo complejidad O(1) amortizada
    if (this.#inicio > 30 && this.#inicio * 2 >= this.#items.length) {
      this.#items = this.#items.slice(this.#inicio);
      this.#inicio = 0;
    }

    return elemento;
  }

  dequeue(): T | undefined {
    return this.desencolar();
  }

  frente(): T | undefined {
    if (this.estaVacia()) {
      return undefined;
    }
    return this.#items[this.#inicio];
  }

  peek(): T | undefined {
    return this.frente();
  }

  get tamanio(): number {
    return this.#items.length - this.#inicio;
  }

  estaVacia(): boolean {
    return this.tamanio === 0;
  }

  aArray(): T[] {
    return this.#items.slice(this.#inicio);
  }
}
