describe('Character creation at 390 px', () => {
  it('keeps the first step and its primary action inside the viewport', () => {
    cy.viewport(390, 844)
    cy.visit('/velkhar/character-create')

    cy.get('.character-create').should('be.visible')
    cy.contains('button', /Suivant|Next/).should('be.visible')
    cy.document().then((document) => {
      expect(document.documentElement.scrollWidth).to.be.at.most(
        document.documentElement.clientWidth
      )
    })
    cy.screenshot('character-create-390', { capture: 'viewport' })
  })
})
