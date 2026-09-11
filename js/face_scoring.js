/* タイプの3文字に各1票。同点の軸は両方を残し、全組み合わせを表示する。 */
const FaceScoring = {
  validate(types, axes) {
    if (!Array.isArray(axes) || axes.length !== 3 || axes.some(axis => !Array.isArray(axis.options) || axis.options.length !== 2)) throw new Error('3軸・各2文字が必要です');
    const letters = axes.flatMap(axis => axis.options.map(option => option.letter));
    if (new Set(letters).size !== 6 || letters.some(letter => !/^[A-Z]$/.test(letter))) throw new Error('軸の文字が不正です');
    const codes = axes.reduce((prefixes, axis) => prefixes.flatMap(prefix => axis.options.map(option => prefix + option.letter)), ['']);
    if (!Array.isArray(types) || types.length !== 8 || new Set(types.map(type => type.id)).size !== 8 || new Set(types.map(type => type.code)).size !== 8 || types.some(type => !codes.includes(type.code))) throw new Error('8タイプと3文字の対応が不正です');
  },
  fromCounts(counts, types, axes) {
    this.validate(types, axes);
    const letters = axes.flatMap(axis => axis.options.map(option => option.letter));
    if (!counts || letters.some(letter => !Number.isInteger(counts[letter]) || counts[letter] < 0)) throw new Error('文字の得点が不正です');
    const total = axes[0].options.reduce((sum, option) => sum + counts[option.letter], 0);
    if (!Number.isSafeInteger(total) || total < 1 || axes.some(axis => axis.options.reduce((sum, option) => sum + counts[option.letter], 0) !== total)) throw new Error('軸の得点合計が一致しません');
    const results = axes.map(axis => {
      const options = axis.options.map(option => ({ ...option, count: counts[option.letter], percentage: counts[option.letter] * 100 / total }));
      const highest = Math.max(...options.map(option => option.count));
      return { ...axis, options, leaders: options.filter(option => option.count === highest).map(option => option.letter) };
    });
    const codes = results.reduce((prefixes, axis) => prefixes.flatMap(prefix => axis.leaders.map(letter => prefix + letter)), ['']);
    return { total, axes: results, codes, winners: codes.map(code => types.find(type => type.code === code)) };
  },
  rank(faces, chosenIds, types, axes) {
    this.validate(types, axes);
    if (!Array.isArray(chosenIds) || !chosenIds.length) throw new Error('選択した顔がありません');
    const byId = new Map(faces.map(face => [face.id, face]));
    const byType = new Map(types.map(type => [type.id, type]));
    const counts = Object.fromEntries(axes.flatMap(axis => axis.options.map(option => [option.letter, 0])));
    for (const id of chosenIds) {
      const face = byId.get(id);
      const type = face && byType.get(face.type);
      if (!type) throw new Error('選択した顔のタイプが不明です');
      for (const letter of type.code) counts[letter] += 1;
    }
    return this.fromCounts(counts, types, axes);
  },
  sharePath(gender, result) {
    if (!['female','male'].includes(gender)) throw new Error('診断対象が不正です');
    return `share/letters/${gender}/${result.codes.join('-')}/`;
  },
  shareQuery(result) {
    const query = new URLSearchParams();
    result.axes.forEach(axis => query.set(axis.options[0].letter.toLowerCase(), String(axis.options[0].count)));
    return query.toString();
  },
  readSharedCounts(search, types, axes, expectedCodes) {
    const query = new URLSearchParams(search);
    const counts = {};
    // 完了した診断は20回答。URLには各軸の先頭文字の票だけを保存する。
    for (const axis of axes) {
      const key = axis.options[0].letter.toLowerCase();
      if (query.getAll(key).length !== 1 || !/^(?:[0-9]|1[0-9]|20)$/.test(query.get(key))) return null;
      const value = Number(query.get(key));
      counts[axis.options[0].letter] = value;
      counts[axis.options[1].letter] = 20 - value;
    }
    const result = this.fromCounts(counts, types, axes);
    return result.codes.join('-') === expectedCodes.join('-') ? result : null;
  }
};
if (typeof module !== 'undefined' && module.exports) module.exports = { FaceScoring };
