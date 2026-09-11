/* 選んだ顔のタイプに1票。最多タイプを集計し、表示する1タイプを選ぶ。 */
const FaceScoring = {
  validate(types, axes) {
    if (!Array.isArray(axes) || axes.length !== 3 || axes.some(axis => !Array.isArray(axis.options) || axis.options.length !== 2)) throw new Error('3軸・各2文字が必要です');
    const letters = axes.flatMap(axis => axis.options.map(option => option.letter));
    if (new Set(letters).size !== 6 || letters.some(letter => !/^[A-Z]$/.test(letter))) throw new Error('軸の文字が不正です');
    const codes = axes.reduce((prefixes, axis) => prefixes.flatMap(prefix => axis.options.map(option => prefix + option.letter)), ['']);
    if (!Array.isArray(types) || types.length !== 8 || new Set(types.map(type => type.id)).size !== 8 || new Set(types.map(type => type.code)).size !== 8 || types.some(type => !codes.includes(type.code))) throw new Error('8タイプと3文字の対応が不正です');
  },
  rank(faces, chosenIds, types, axes) {
    this.validate(types, axes);
    if (!Array.isArray(chosenIds) || !chosenIds.length) throw new Error('選択した顔がありません');
    const byId = new Map(faces.map(face => [face.id, face]));
    const counts = Object.fromEntries(types.map(type => [type.id, 0]));
    for (const id of chosenIds) {
      const face = byId.get(id);
      if (!face || !Object.hasOwn(counts, face.type)) throw new Error('選択した顔のタイプが不明です');
      counts[face.type] += 1;
    }
    const highest = Math.max(...Object.values(counts));
    const codeOrder = axes.reduce((prefixes, axis) => prefixes.flatMap(prefix => axis.options.map(option => prefix + option.letter)), ['']);
    const winners = types.filter(type => counts[type.id] === highest).sort((a, b) => codeOrder.indexOf(a.code) - codeOrder.indexOf(b.code));
    return { total: chosenIds.length, counts, codes: winners.map(type => type.code), winners };
  },
  select(result, savedCode, random = Math.random) {
    const winner = result.winners.find(type => type.code === savedCode)
      || result.winners[Math.floor(random() * result.winners.length)];
    return { ...result, winners: [winner], codes: [winner.code] };
  },
  sharePath(gender, result) {
    if (!['female','male'].includes(gender)) throw new Error('診断対象が不正です');
    return `share/letters/${gender}/${result.codes.join('-')}/`;
  }
};
if (typeof module !== 'undefined' && module.exports) module.exports = { FaceScoring };
