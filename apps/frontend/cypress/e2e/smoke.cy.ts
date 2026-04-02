describe('Smoke test', () => {
  it('loads the homepage', () => {
    cy.visit('/')
    cy.get('body').should('exist')
  })
})
