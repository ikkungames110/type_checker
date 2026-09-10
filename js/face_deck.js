/* 20問の通常枠と差し替え枠を持ち、実際に表示した顔を一巡するまで重複させない。 */
class FaceDeck {
  constructor(faces, questionCount = 20, random = Math.random) {
    if (faces.length < 2 || faces.length % 2 || new Set(faces.map(face => face.id)).size !== faces.length) {
      throw new Error('顔データは重複しないIDを持つ偶数件で指定してください');
    }
    this.faces = [...faces];
    this.questionCount = questionCount;
    this.random = random;
    this.unseen = new Set(faces.map(face => face.id));
    this.normal = [];
    this.reserve = [];
    this.current = null;
    this.cycle = 1;
    this.refill(false);
  }

  refill(forSkip) {
    let pool = this.faces.filter(face => this.unseen.has(face.id));
    if (!pool.length) {
      this.unseen = new Set(this.faces.map(face => face.id));
      pool = [...this.faces];
      this.cycle += 1;
    }
    // Fisher–Yates。元の顔データの並びは変更しない。
    for (let i = pool.length - 1; i > 0; i -= 1) {
      const j = Math.floor(this.random() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const pairs = [];
    for (let i = 0; i < pool.length; i += 2) pairs.push([pool[i], pool[i + 1]]);
    // 差し替え枠が尽きたら、未表示の通常枠を含めて並べ直す。
    // 通常枠を「表示済み」と見なさず、全員を見せてから次の一巡に移る。
    this.normal = forSkip ? [] : pairs.slice(0, this.questionCount);
    this.reserve = forSkip ? pairs : pairs.slice(this.questionCount);
  }

  take(forSkip) {
    let queue = forSkip ? this.reserve : this.normal.length ? this.normal : this.reserve;
    if (!queue.length) {
      this.refill(forSkip);
      queue = forSkip ? this.reserve : this.normal;
    }
    this.current = queue.shift();
    for (const face of this.current) this.unseen.delete(face.id);
    return this.current;
  }

  next() { return this.take(false); }
  skip() { return this.take(true); }

  snapshot() {
    const pairs = queue => queue.map(pair => pair.map(face => face.id));
    return {
      version: 1,
      faceIds: this.faces.map(face => face.id),
      questionCount: this.questionCount,
      normal: pairs(this.normal),
      reserve: pairs(this.reserve),
      current: this.current?.map(face => face.id),
      unseen: [...this.unseen],
      cycle: this.cycle
    };
  }

  static restore(faces, saved, questionCount = 20, random = Math.random) {
    const invalid = () => { throw new Error('保存した出題データが無効です'); };
    const byId = new Map(faces.map(face => [face.id, face]));
    if (!saved || saved.version !== 1 || saved.questionCount !== questionCount ||
        JSON.stringify(saved.faceIds) !== JSON.stringify(faces.map(face => face.id)) ||
        !Number.isInteger(saved.cycle) || saved.cycle < 1) invalid();
    const pair = ids => {
      if (!Array.isArray(ids) || ids.length !== 2 || ids[0] === ids[1] || !ids.every(id => byId.has(id))) invalid();
      return ids.map(id => byId.get(id));
    };
    const queue = pairs => {
      if (!Array.isArray(pairs)) invalid();
      return pairs.map(pair);
    };
    const normal = queue(saved.normal), reserve = queue(saved.reserve), current = pair(saved.current);
    if (!Array.isArray(saved.unseen) || !saved.unseen.every(id => byId.has(id))) invalid();
    const unseen = new Set(saved.unseen);
    const queuedIds = [...normal, ...reserve].flat().map(face => face.id);
    if (unseen.size !== saved.unseen.length || new Set(queuedIds).size !== queuedIds.length ||
        queuedIds.length !== unseen.size || !queuedIds.every(id => unseen.has(id)) ||
        current.some(face => unseen.has(face.id))) invalid();
    const deck = new FaceDeck(faces, questionCount, random);
    Object.assign(deck, { normal, reserve, current, unseen, cycle: saved.cycle });
    return deck;
  }
}

if (typeof module !== 'undefined' && module.exports) module.exports = { FaceDeck };
