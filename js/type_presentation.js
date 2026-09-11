// 結果タイプに対応するキャラクターと、同じタイプの顔5枚を取得する。
// 採点・選択履歴には関与しない。
(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  else root.TypePresentation = api;
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  function resolve(gender, typeId, faces, characters) {
    const matchingCharacters = characters.filter(item => item.gender === gender && item.type === typeId);
    if (matchingCharacters.length !== 1) throw new Error("結果タイプのキャラクターが一意に決まりません。");
    const examples = faces.filter(face => face.gender === gender && face.type === typeId)
      .sort((a, b) => a.id.localeCompare(b.id));
    if (examples.length !== 5 || new Set(examples.map(face => face.id)).size !== 5) {
      throw new Error("結果タイプの顔の例は、異なる5枚である必要があります。");
    }
    return { character: matchingCharacters[0], examples };
  }
  return { resolve };
});
