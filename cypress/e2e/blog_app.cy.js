describe('Blog app', function() {
  beforeEach(function() {
    // resets the database
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)

    const user = {
      name: 'testaaja',
      username: 'testaaja',
      password: 'secret'
    }

    const secondUser = {
      name: 'mario',
      username: 'supermario',
      password: 'salainen'
    }

    // creates the two users to the database
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, user)
    cy.request('POST', `${Cypress.env('BACKEND')}/users/`, secondUser)

    // visits the front page
    cy.visit('')
  })

  it('front page & login button is shown', function() {
    cy.contains('blogs') // title
    cy.contains('login') // login button
  })

  describe('login', function() {
    it('succeeds with correct credentials', function() {
      cy.contains('login').click() // login form opens
      cy.get('#username').type('testaaja')
      cy.get('#password').type('secret')
      cy.get('#login-button').click()

      cy.contains('testaaja logged in')
    })

    it('fails with wrong credentials', function() {
      cy.contains('login').click() // login form opens
      cy.get('#username').type('testaaja')
      cy.get('#password').type('wrongpassword')
      cy.get('#login-button').click()

      cy.get('.error')
        .should('contain', 'wrong credentials')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')

      cy.get('html').should('not.contain', 'testaaja logged in')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'testaaja', password: 'secret' })
    })

    it('a blog can be created', function() {
      cy.contains('create new blog').click()

      cy.get('#title').type('tester strikes again')
      cy.get('#author').type('tester')
      cy.get('#url').type('testurl')

      cy.get('#create-button').click()

      cy.contains('tester strikes again by tester')
    })

    describe('and two blogs exist', function() {
      beforeEach(function () {
        cy.createBlog({
          title: 'first test',
          author: 'tester',
          url: 'first test url'
        })

        cy.createBlog({
          title: 'second test',
          author: 'tester',
          url: 'second test url'
        })
      })

      it('a blog can be liked', function() {
        cy.contains('first test by tester')
          .contains('view')
          .click()

        cy.contains('first test url')
          .contains('likes: 0')
          .contains('like')
          .click()

        cy.contains('first test url')
          .contains('likes: 1')
      })

      it('a blog can be removed', function() {
        cy.contains('second test by tester')
          .contains('view')
          .click()

        cy.contains('second test url')
          .contains('remove')
          .click()

        cy.get('.notif')
          .should('contain', 'Removed blog second test by tester')
          .and('have.css', 'color', 'rgb(0, 128, 0)')
          .and('have.css', 'border-style', 'solid')
      })

      it('the remove button exists only for the creator', function() {
        cy.contains('logout').click()
        cy.login({ username: 'supermario', password: 'salainen' })

        cy.contains('first test by tester')
          .contains('view')
          .click()

        cy.contains('first test url')
          .should('contain', 'likes: 0')
          .should('contain', 'testaaja')
          .should('not.contain', 'remove')
      })

      it('blogs are sorted by likes', function() {
        cy.get('.default').eq(0).should('contain', 'first test by tester')
        cy.get('.default').eq(1).should('contain', 'second test by tester')

        cy.contains('second test by tester')
          .contains('view')
          .click()

        cy.contains('second test url')
          .contains('likes: 0')
          .contains('like')
          .click()

        cy.get('.default').eq(0).should('contain', 'second test by tester')
        cy.get('.default').eq(1).should('contain', 'first test by tester')

        cy.contains('first test by tester')
          .contains('view')
          .click()

        cy.contains('first test url')
          .contains('likes: 0')
          .contains('like')
          .click()

        cy.contains('first test url')
          .contains('likes: 1')
          .contains('like')
          .click()

        cy.get('.default').eq(0).should('contain', 'first test by tester')
        cy.get('.default').eq(1).should('contain', 'second test by tester')
      })
    })
  })
})