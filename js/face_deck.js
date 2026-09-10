/* 最初の一巡ですべての顔を表示し、二巡目から「どちらも違う」のタイプを除外する。 */
class FaceDeck {
  constructor(faces, questionCount = 20, random = Math.random) {
    if (faces.length !== 40 || new Set(faces.map(f => f.id)).size !== faces.length ||
        faces.some(f => !f.type) || new Set(faces.map(f => f.type)).size !== 8) {
      throw new Error('顔データは重複しない40枚・8タイプで指定してください');
    }
    const counts = faces.reduce((map, f) => map.set(f.type, (map.get(f.type) || 0) + 1), new Map());
    if ([...counts.values()].some(count => count !== 5)) throw new Error('各タイプ5枚で指定してください');
    this.faces = [...faces];
    this.questionCount = questionCount;
    this.random = random;
    this.unseen = new Set(faces.map(f => f.id));
    this.rejectedTypes = new Set();
    this.allTypes = false;
    this.current = null;
    this.shownPairs = 0;
    this.cycle = 1;
  }

  eligibleFaces() {
    if (this.shownPairs < this.faces.length / 2 || this.allTypes) return this.faces;
    return this.faces.filter(f => !this.rejectedTypes.has(f.type));
  }

  pick(pool) { return pool[Math.floor(this.random() * pool.length)]; }

  next() {
    const eligible = this.eligibleFaces();
    let pool = eligible.filter(f => this.unseen.has(f.id));
    if (!pool.length) {
      this.unseen = new Set(eligible.map(f => f.id));
      pool = eligible;
      this.cycle += 1;
    }
    const groups = new Map();
    for (const face of pool) {
      if (!groups.has(face.type)) groups.set(face.type, []);
      groups.get(face.type).push(face);
    }
    // 残数の多いタイプから組むと、一巡の終わりに同タイプだけが余らない。
    const largest = entries => {
      const max = Math.max(...entries.map(([, items]) => items.length));
      return this.pick(entries.filter(([, items]) => items.length === max));
    };
    const [firstType, firstGroup] = largest([...groups]);
    const first = this.pick(firstGroup);
    this.unseen.delete(first.id);
    let second;
    if (groups.size > 1) {
      second = this.pick(largest([...groups].filter(([type]) => type !== firstType))[1]);
    } else {
      // 対象が奇数枚、または途中のタイプ除外で一種類だけ余った場合。
      // 残った顔を優先し、相手だけを次の一巡から補充する。
      this.unseen = new Set(eligible.filter(f => f.id !== first.id).map(f => f.id));
      this.cycle += 1;
      second = this.pick(eligible.filter(f => f.type !== firstType));
    }
    this.unseen.delete(second.id);
    this.current = this.random() < 0.5 ? [first, second] : [second, first];
    this.shownPairs += 1;
    return this.current;
  }

  skip() {
    if (!this.current) throw new Error('表示中の二択がありません');
    for (const face of this.current) this.rejectedTypes.add(face.type);
    if (this.rejectedTypes.size >= 7 && !this.allTypes) {
      this.allTypes = true;
      if (this.shownPairs > this.faces.length / 2) {
        this.unseen = new Set(this.faces.map(f => f.id));
        this.cycle += 1;
      }
    }
    return this.next();
  }

  snapshot() {
    return {
      version: 2,
      faceKeys: this.faces.map(f => `${f.id}:${f.type}:${f.asset_version || ''}`),
      questionCount: this.questionCount,
      current: this.current?.map(f => f.id),
      unseen: [...this.unseen],
      rejectedTypes: [...this.rejectedTypes],
      allTypes: this.allTypes,
      shownPairs: this.shownPairs,
      cycle: this.cycle
    };
  }

  static restore(faces, saved, questionCount = 20, random = Math.random) {
    const invalid = () => { throw new Error('保存した出題データが無効です'); };
    const deck = new FaceDeck(faces, questionCount, random);
    const byId = new Map(faces.map(f => [f.id, f]));
    const types = new Set(faces.map(f => f.type));
    if (!saved || saved.version !== 2 || saved.questionCount !== questionCount ||
        JSON.stringify(saved.faceKeys) !== JSON.stringify(deck.snapshot().faceKeys) ||
        !Number.isInteger(saved.shownPairs) || saved.shownPairs < 1 ||
        !Number.isInteger(saved.cycle) || saved.cycle < 1 ||
        !Array.isArray(saved.current) || saved.current.length !== 2 || !saved.current.every(id => byId.has(id)) ||
        !Array.isArray(saved.unseen) || new Set(saved.unseen).size !== saved.unseen.length || !saved.unseen.every(id => byId.has(id)) ||
        !Array.isArray(saved.rejectedTypes) || new Set(saved.rejectedTypes).size !== saved.rejectedTypes.length || !saved.rejectedTypes.every(t => types.has(t)) ||
        saved.allTypes !== (saved.rejectedTypes.length >= 7)) invalid();
    const current = saved.current.map(id => byId.get(id));
    if (current[0].type === current[1].type || saved.current.some(id => saved.unseen.includes(id))) invalid();
    if (saved.shownPairs <= faces.length / 2 &&
        (saved.cycle !== 1 || saved.unseen.length !== faces.length - saved.shownPairs * 2)) invalid();
    Object.assign(deck, { current, unseen: new Set(saved.unseen), rejectedTypes: new Set(saved.rejectedTypes),
      allTypes: saved.allTypes, shownPairs: saved.shownPairs, cycle: saved.cycle });
    return deck;
  }
}

if (typeof module !== 'undefined' && module.exports) module.exports = { FaceDeck };
