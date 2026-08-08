import assert from "node:assert/strict";
import test from "node:test";

import { MARKER, renderStatus, summarize } from "./pr-status-comment.mjs";

const ISSUES = [
  { number: 215, title: "[EPIC] Combat", state: "OPEN", labels: [] },
  { number: 214, title: "[EPIC] Boucle de run", state: "CLOSED", labels: [] },
  { number: 240, title: "feat(backend): catalogue", state: "OPEN", labels: [] },
  {
    number: 241,
    title: "feat(frontend): contrat",
    state: "OPEN",
    labels: [{ name: "status: blocked" }],
  },
  { number: 226, title: "feat(shared): contrats", state: "CLOSED", labels: [] },
];

test("sépare les EPICs des tickets", () => {
  const { epics, tickets, closed, open } = summarize(ISSUES);

  assert.equal(epics.length, 2);
  assert.equal(tickets.length, 3);
  assert.equal(closed.length, 1);
  assert.equal(open.length, 2);
});

test("les EPICs ne comptent pas dans la progression", () => {
  const output = renderStatus(ISSUES);

  assert.match(output, /\*\*1\/3\*\* tickets fermés \(33 %\)/);
});

test("porte le marqueur idempotent", () => {
  assert.ok(renderStatus(ISSUES).startsWith(MARKER));
});

test("ordonne les EPICs par dépendance, pas par état", () => {
  const output = renderStatus(ISSUES);

  assert.ok(output.indexOf("#214") < output.indexOf("#215"));
  assert.match(output, /✅ \*\*#214\*\*/);
  assert.match(output, /⬜ \*\*#215\*\*/);
});

test("signale un ticket bloqué", () => {
  const output = renderStatus(ISSUES);

  assert.match(output, /🚧 #241 .* _\(bloqué\)_/);
});

test("trie les tickets ouverts par numéro croissant", () => {
  const output = renderStatus(ISSUES);

  assert.ok(output.indexOf("#240") < output.indexOf("#241"));
});

test("replie les tickets fermés", () => {
  const output = renderStatus(ISSUES);

  assert.match(output, /<details><summary>1 ticket\(s\) fermé\(s\)<\/summary>/);
  assert.match(output, /✅ #226/);
});

test("ne divise pas par zéro sur un milestone sans ticket", () => {
  const output = renderStatus([
    { number: 214, title: "[EPIC] Boucle", state: "OPEN", labels: [] },
  ]);

  assert.match(output, /\*\*0\/0\*\* tickets fermés \(0 %\)/);
});

test("accepte un milestone explicite", () => {
  assert.match(renderStatus(ISSUES, { milestone: "v9.9.9 - Test" }), /v9\.9\.9 - Test/);
});
