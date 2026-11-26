# Deferred work

- source_spec: `_bmad-output/implementation-artifacts/spec-ai-assistant-robustness.md`
  summary: Tighten unique-name generic tokens (village/company/auditorium) to clarify instead of auto-resolve
  evidence: Blind Hunter found Go to village → Presidential; AD-AI-8 focused on hall false-positives; unique-name escape remains intentional for stadium/coliseum.

- source_spec: `_bmad-output/implementation-artifacts/spec-ai-assistant-robustness.md`
  summary: Extend EXAMPLE chips for hall trap / ETA refuse / spelling clarify demos
  evidence: CAP-2 still uses pre-audit examples; cosmetic demo gap, not a parser defect.

- source_spec: `_bmad-output/implementation-artifacts/spec-map-poi-interaction.md`
  summary: Mobile revealSheet(keepView) / revealPoi sheet-transition framing lacks automated coverage
  evidence: No browser/e2e harness in repo; AC-8 remains manual. What would settle: a viewport test that asserts setSheet(1,true) does not call centerOnPlaces and that revealPoi uses target half-sheet height.

- source_spec: `_bmad-output/implementation-artifacts/spec-map-poi-interaction.md`
  summary: revealPoi may frame using mid-transition sheet height when opening from collapsed
  evidence: Uses live getBoundingClientRect during CSS height transition; low user harm. What would settle: visual check that markers stay above sheet after expand, or use fixed 52% target height.
