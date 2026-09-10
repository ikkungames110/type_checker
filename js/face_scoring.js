/* 選んだ画像の所属タイプに1票。特徴量や見た目の数値は使わない。 */
const FaceScoring = {
  rank(faces, chosenIds, types, { winnerId = null, random = Math.random } = {}) {
    const byId = new Map(faces.map(face => [face.id, face]));
    const scores = new Map(types.map(type => [type.id, { ...type, value: 0 }]));
    const votes = new Map();
    chosenIds.forEach((id, index) => {
      const face = byId.get(id);
      const score = face && scores.get(face.type);
      if (!score) throw new Error('選択した顔のタイプが不明です');
      score.value += 1;
      votes.set(id, { face, value: (votes.get(id)?.value || 0) + 1, lastChosen: index });
    });
    const ranked = [...scores.values()].sort((a, b) => b.value - a.value);
    const leaders = ranked.filter(type => type.value === ranked[0].value);
    // 同率1位から等確率で抽選。保存済みの結果は再抽選しない。
    const winner = leaders.find(type => type.id === winnerId)
      || leaders[leaders.length === 1 ? 0 : Math.floor(random() * leaders.length)];
    // 写真は当選タイプ内で実際に選んだもの。最多・同数なら直近の選択を使う。
    const portrait = [...votes.values()].filter(v => v.face.type === winner.id)
      .sort((a, b) => b.value - a.value || b.lastChosen - a.lastChosen)[0]?.face;
    return { scores: ranked, winner, portrait };
  }
};
if (typeof module !== 'undefined' && module.exports) module.exports = { FaceScoring };
