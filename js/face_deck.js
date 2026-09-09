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
}

if (typeof module !== 'undefined' && module.exports) module.exports = { FaceDeck };
