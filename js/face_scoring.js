/* 選んだ画像の所属タイプに1票。特徴量や見た目の数値は使わない。 */
const FaceScoring = {
  rank(faces, chosenIds, types) {
    const byId = new Map(faces.map(face => [face.id, face]));
    const scores = new Map(types.map(type => [type.id, { ...type, value: 0, lastChosen: -1 }]));
    const votes = new Map();
    chosenIds.forEach((id, index) => {
      const face = byId.get(id);
      const score = face && scores.get(face.type);
      if (!score) throw new Error('選択した顔のタイプが不明です');
      score.value += 1;
      score.lastChosen = index;
      votes.set(id, { face, value: (votes.get(id)?.value || 0) + 1, lastChosen: index });
    });
    // 同票なら最後に選ばれたタイプ。写真も、そのタイプ内で選んだものから選ぶ。
    const order = (a, b) => b.value - a.value || b.lastChosen - a.lastChosen;
    const ranked = [...scores.values()].sort(order);
    const portrait = [...votes.values()].filter(v => v.face.type === ranked[0].id).sort(order)[0]?.face;
    return { scores: ranked, portrait };
  }
};
if (typeof module !== 'undefined' && module.exports) module.exports = { FaceScoring };
