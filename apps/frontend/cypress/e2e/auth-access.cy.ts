const routes = [
  { heading: /Resume your Chronicle|Reprendre votre Chronique/, path: '/login' },
  { heading: /Keep your Chronicle|Conserver votre Chronique/, path: '/signup' },
  { heading: /Recover your access|Retrouver votre accès/, path: '/forgot-password' },
] as const

const viewports = [
  { height: 844, name: 'mobile', width: 390 },
  { height: 1024, name: 'tablet', width: 768 },
  { height: 650, name: 'small laptop', width: 1280 },
  { height: 900, name: 'desktop', width: 1440 },
] as const

describe('Auth access routes', () => {
  for (const viewport of viewports) {
    context(viewport.name, () => {
      beforeEach(() => {
        cy.viewport(viewport.width, viewport.height)
      })

      for (const route of routes) {
        it(`renders ${route.path} without horizontal overflow`, () => {
          cy.visit(route.path)

          cy.get('h1').contains(route.heading).should('be.visible')
          cy.get('input[type="email"]').should('be.visible').and('be.enabled')
          cy.get('button[type="submit"]').should('be.visible').and('be.enabled')
          cy.document().then((document) => {
            expect(document.documentElement.scrollWidth).to.be.at.most(viewport.width)
          })
        })
      }
    })
  }
})
